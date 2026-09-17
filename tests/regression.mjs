#!/usr/bin/env node
// 检测器自动回归：对 fixtures/detector-cases.html 跑 audit-runner，按用例期望断言产出。
// 修改 detail-audit.js 后运行本脚本——误报/漏报回归会在这里失败，而不是等人工复核发现。
//
// 用法: node tests/regression.mjs
// 退出码: 0=全部符合期望；1=有期望未满足（误报/漏报回归）；2=执行失败（页面打不开/运行器错误）
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const r = spawnSync(process.execPath, [
  join(root, 'scripts/audit-runner.mjs'),
  '--target', join(here, 'fixtures/detector-cases.html'),
  '--audit', join(root, 'scripts/detail-audit.js'),
  '--viewport', '1440x900',
], { encoding: 'utf8' });

let d;
try { d = JSON.parse(r.stdout); }
catch { console.error(`运行器输出无法解析（退出码 ${r.status}）:`); console.error((r.stdout || '').slice(0, 400)); if (r.stderr) console.error(r.stderr.slice(0, 400)); process.exit(2); }
if (!d.ok) { console.error('执行失败:', d.fail || '?'); if (d.errors?.length) console.error(d.errors.join('\n')); process.exit(2); }

const res = d.result;
const clipOf = t => res.clip.find(x => x.t.includes(t));
const skipOf = (t, reason) => res.skipped.find(x => x.t.includes(t) && x.reason === reason);
const hasOverlap = t => res.overlap.some(x => x.a.includes(t) || x.b.includes(t));

const cases = [
  ['c1  英文换行不误报 wrapped', !res.wrapped.some(x => x.t.includes('Hello'))],
  ['c2  祖先 opacity:0 不参与检测', !clipOf('中文测试') && !res.wrapped.some(x => x.t.includes('中文测试'))],
  ['c3  弹层遮挡不误报 overlap', !hasOverlap('背景说明')],
  ['c4  5px 裁切报 blocked', clipOf('重要提示')?.sev === 'blocked'],
  ['c5  真实重叠报 overlap', hasOverlap('真实重叠')],
  ['c6  CJK 孤字报 wrapped', res.wrapped.some(x => x.t.includes('设置页面'))],
  ['c7  有入口收起态不报裁切 + skipped collapsed', !clipOf('收起面板') && !!skipOf('收起面板', 'collapsed')],
  ['c8  运行中动效不报裁切 + skipped transform-transient', !clipOf('球') && !!skipOf('球', 'transform-transient')],
  ['c9  静态 transform 位移报 blocked 且注明无动画证据', clipOf('被静态位移')?.sev === 'blocked' && /无动画证据/.test(clipOf('被静态位移')?.note || '')],
  ['c10 无入口矮容器报 blocked', clipOf('没有任何展开入口')?.sev === 'blocked'],
  ['c11 兄弟结构收起态不报裁切 + skipped collapsed', !clipOf('兄弟结构') && !!skipOf('兄弟结构', 'collapsed')],
];

let bad = 0;
for (const [name, ok] of cases) { console.log(`  ${ok ? '✓' : '✗'} ${name}`); if (!ok) bad++; }
if (bad) {
  console.log(`\n回归失败：${bad}/${cases.length} 项不符期望（误报/漏报回归）。实际产出：`);
  console.log('  clip    :', JSON.stringify(res.clip, null, 1));
  console.log('  skipped :', JSON.stringify(res.skipped));
  console.log('  wrapped :', JSON.stringify(res.wrapped));
  console.log('  overlap :', JSON.stringify(res.overlap));
} else {
  console.log(`\n回归通过：${cases.length}/${cases.length}`);
}
process.exit(bad ? 1 : 0);
