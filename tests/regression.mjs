#!/usr/bin/env node
// 检测器 + 运行器自动回归：对 fixtures/detector-cases.html 跑 audit-runner，按用例期望断言产出；
// 并验证运行器失败路径（异步断言为假/抛异常/超时）「必须 exit 2，绝不误判通过」。
// 修改 detail-audit.js / audit-runner.mjs 后运行本脚本——误报/漏报/误通过回归在这里失败，
// 而不是等人工复核或线上漏检发现。
//
// 用法: node tests/regression.mjs
// 退出码: 0=全部符合期望；1=有期望未满足（误报/漏报/误通过回归）；2=执行失败（页面打不开/运行器错误）
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const run = extra => spawnSync(process.execPath, [
  join(root, 'scripts/audit-runner.mjs'),
  '--target', join(here, 'fixtures/detector-cases.html'),
  '--audit', join(root, 'scripts/detail-audit.js'),
  '--viewport', '1440x900', ...extra,
], { encoding: 'utf8' });

let bad = 0;
const check = (name, ok) => { console.log(`  ${ok ? '✓' : '✗'} ${name}`); if (!ok) bad++; };

// ── 一、检测器正反例 ──────────────────────────────────────────────
const r = run([]);
let d;
try { d = JSON.parse(r.stdout); }
catch { console.error(`运行器输出无法解析（退出码 ${r.status}）:`); console.error((r.stdout || '').slice(0, 400)); if (r.stderr) console.error(r.stderr.slice(0, 400)); process.exit(2); }
// 前置检查：检测断言建立在「检查成立」之上——正常路径必须 exit 0、页面非空白且无运行错误
if (r.status !== 0) { console.error(`前置失败：运行器退出码 ${r.status}（应为 0）`); console.error(d.fail || ''); process.exit(2); }
if (!d.ok) { console.error('前置失败：', d.fail || '?'); if (d.errors?.length) console.error(d.errors.join('\n')); process.exit(2); }
if (d.blank) { console.error('前置失败：fixture 页面被判为空白'); process.exit(2); }
if (d.errors?.length) { console.error('前置失败：fixture 页面有运行错误:', d.errors.join('; ')); process.exit(2); }

const res = d.result;
const clipOf = t => res.clip.find(x => x.t.includes(t));
const skipOf = (t, reason) => res.skipped.find(x => x.t.includes(t) && x.reason === reason);
const hasOverlap = t => res.overlap.some(x => x.a.includes(t) || x.b.includes(t));

const cases = [
  ['c1   英文换行不误报 wrapped', !res.wrapped.some(x => x.t.includes('Hello'))],
  ['c2   祖先 opacity:0 不参与检测', !clipOf('中文测试') && !res.wrapped.some(x => x.t.includes('中文测试'))],
  ['c3   弹层遮挡不误报 overlap', !hasOverlap('背景说明')],
  ['c4   5px 裁切报 blocked', clipOf('重要提示')?.sev === 'blocked'],
  ['c5   真实重叠报 overlap', hasOverlap('真实重叠')],
  ['c6   CJK 孤字报 wrapped', res.wrapped.some(x => x.t.includes('设置页面'))],
  ['c7   有入口收起态不报裁切 + skipped collapsed', !clipOf('不该被当作内容裁切') && !!skipOf('不该被当作内容裁切', 'collapsed')],
  ['c8   运行中动效不报裁切 + skipped transform-transient(running)', !clipOf('球') && !!res.skipped.find(x => x.t.includes('球') && /running/.test(x.evidence || ''))],
  ['c9   静态 transform 位移报 blocked 且注明无运行中动画证据', clipOf('被静态位移')?.sev === 'blocked' && /无运行中动画证据/.test(clipOf('被静态位移')?.note || '')],
  ['c10  无入口矮容器报 blocked', clipOf('没有任何展开入口')?.sev === 'blocked'],
  ['c11  兄弟结构（有 aria-controls 关联）收起态 collapsed 豁免', !clipOf('兄弟结构收起面板') && !!skipOf('兄弟结构收起面板', 'collapsed')],
  ['c12  finished 动画停在裁切位报 blocked', clipOf('已结束动画')?.sev === 'blocked'],
  ['c13  paused 动画停在裁切位报 blocked', clipOf('已暂停动画')?.sev === 'blocked'],
  ['c14  滚动区内层裁切报 blocked 并注明', clipOf('滚动区内部的矮容器')?.sev === 'blocked' && /内层裁切/.test(clipOf('滚动区内部的矮容器')?.note || '')],
  ['c14b 滚动区正常可滚动内容不报裁切', !clipOf('可以正常滚动查看')],
  ['c15  邻接按钮无 controls 关联 → warn 待复核', clipOf('与本按钮无关')?.sev === 'warn' && /待复核/.test(clipOf('与本按钮无关')?.note || '')],
  ['c15b 被 controls 指向的收起面板仍 collapsed 豁免', !!skipOf('被按钮控制的面板', 'collapsed')],
  ['c16  pre-wrap 代码树零面积 rect 不误报 clip', !clipOf('src/ ├──')],
];

for (const [name, ok] of cases) check(name, ok);
if (bad) {
  console.log(`\n检测器回归失败：${bad}/${cases.length} 项不符期望。实际产出：`);
  console.log('  clip    :', JSON.stringify(res.clip, null, 1));
  console.log('  skipped :', JSON.stringify(res.skipped));
  console.log('  wrapped :', JSON.stringify(res.wrapped));
  console.log('  overlap :', JSON.stringify(res.overlap));
}

// ── 二、运行器失败路径（失败必须 exit 2，绝不误判通过）───────────
const failCase = (name, extra, expectExit) => {
  const rr = run(extra);
  let dd = null; try { dd = JSON.parse(rr.stdout); } catch {}
  const ok = rr.status === expectExit && (expectExit !== 2 || dd?.ok === false);
  check(name, ok);
};
console.log('\n  ── 运行器失败路径 ──');
failCase('同步假断言 → exit 2', ['--assert', 'false'], 2);
failCase('异步断言 Promise.resolve(false) → exit 2（旧版会误通过）', ['--assert', 'Promise.resolve(false)'], 2);
failCase('异步断言抛异常 → exit 2', ['--assert', "(async()=>{throw new Error('b')})()"], 2);
failCase('--ready 不满足 → exit 2', ['--ready', 'document.querySelector("#nope")'], 2);
failCase('--deadline 立即超时（覆盖启动阶段）→ exit 2', ['--deadline', '100'], 2);
failCase('真断言不误杀 → exit 0', ['--assert', 'document.title.length>0'], 0);
const freezeFile = join(tmpdir(), `jd-freeze-${process.pid}.js`);
writeFileSync(freezeFile, 'window.requestAnimationFrame=()=>0;');
failCase('rAF 被冻结时稳定等待靠兜底完成（不永久挂起）→ exit 0', ['--state', freezeFile], 0);
rmSync(freezeFile, { force: true });

console.log(`\n${bad ? `回归失败：共 ${bad} 项不符期望` : `回归通过：检测器 ${cases.length} 项 + 运行器失败路径 7 项全部符合期望`}`);
process.exit(bad ? 1 : 0);
