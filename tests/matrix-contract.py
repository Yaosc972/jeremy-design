"""Exercise the matrix CLI with a fake runner; no browser required."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]
clean = dict(ok=True, blank=False, errors=[], result=dict(
    counts=dict(blocked=0, warn=0), overflowX=0,
    clip=[], overlap=[], wrapped=[], tight=[], skipped=[]))
with tempfile.TemporaryDirectory(prefix='jd-matrix-test-') as directory:
    # 假运行器经 JD_RUNNER_NODE 注入（生产默认为 node）；argv 落盘供参数透传断言。
    # 结果解析固定用真实 node（matrix 脚本已无 python3 依赖），故不再需要 PATH 遮蔽。
    fake = Path(directory) / 'fake-runner'
    fake.write_text('#!/usr/bin/env python3\nimport json,os,sys\ncalls=os.environ.get("JD_CALLS")\nif calls:\n    with open(calls,"a") as f: f.write(json.dumps(sys.argv[1:])+"\\n")\nprint(os.environ["JD_OUTPUT"])\nsys.exit(int(os.environ.get("JD_EXIT","0")))\n')
    fake.chmod(0o755)
    env = dict(os.environ, JD_RUNNER_NODE=str(fake))
    def check(name, output, expected, extra=(), runner_exit=0):
        result = subprocess.run(['bash', str(root/'scripts/audit-matrix.sh'), 'fixture.html', '--rm', 'off', *extra],
            env=dict(env, JD_OUTPUT=output, JD_EXIT=str(runner_exit)), capture_output=True, text=True, errors="replace", timeout=5)
        assert result.returncode == expected, (name, result.returncode, result.stdout, result.stderr)
        print('PASS',name)
    check('valid result',json.dumps(clean),0)
    blocked=json.loads(json.dumps(clean)); blocked['result']['counts']['blocked']=1
    check('geometry blocked',json.dumps(blocked),1)
    check('invalid JSON is execution failure','invalid-json',2)
    check('missing result is execution failure','{"ok":true}',2)
    check('crashed runner cannot pass',json.dumps(clean),2,runner_exit=1)
    check('unexpected exit cannot pass',json.dumps(clean),2,runner_exit=7)
    check('empty dimension rejected',json.dumps(clean),2,('--dim',''))
    check('empty dimension member rejected',json.dumps(clean),2,('--dim','a.js,,b.js'))
    check('invalid media rejected',json.dumps(clean),2,('--rm','bogus'))
    check('missing argument rejected',json.dumps(clean),2,('--viewport',))
    # --chrome 必须透传给运行器（跨平台 Chrome 探测的手动覆盖入口）
    calls = Path(directory) / 'calls.jsonl'
    forwarded = subprocess.run(['bash', str(root/'scripts/audit-matrix.sh'), 'fixture.html', '--rm', 'off', '--chrome', '/tmp/nonexistent-chrome'],
        env=dict(env, JD_OUTPUT=json.dumps(clean), JD_EXIT='0', JD_CALLS=str(calls)), capture_output=True, text=True, errors="replace", timeout=5)
    assert forwarded.returncode == 0, (forwarded.returncode, forwarded.stdout, forwarded.stderr)
    argv = [json.loads(line) for line in calls.read_text().splitlines() if line.strip()]
    assert any('--chrome' in a and a[a.index('--chrome') + 1] == '/tmp/nonexistent-chrome' for a in argv), argv
    print('PASS chrome flag forwarded to runner')
