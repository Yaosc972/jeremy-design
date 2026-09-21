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
    fake = Path(directory) / 'node'
    fake.write_text('#!/usr/bin/env python3\nimport os,sys\nprint(os.environ["JD_OUTPUT"])\nsys.exit(int(os.environ.get("JD_EXIT","0")))\n')
    fake.chmod(0o755)
    env = dict(os.environ, PATH=directory + os.pathsep + os.environ['PATH'])
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
