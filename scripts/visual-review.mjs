#!/usr/bin/env node
// visual-review.mjs — 视觉重构 before/after 对照片生成器（零依赖，调用 audit-runner 截图）
//
// 解决的盲区：几何检测（clip/overlap/溢出）测不出"坏的设计"——层次抹平、语义权重
// 削弱、布局密度突变、强调色信息丢失，只有把两个版本并排看才暴露。本脚本把
// "目视对比"从一句纪律变成机械产物：没生成对照片并逐行勾选，视觉重构不算完成。
//
// 用法：
//   node scripts/visual-review.mjs --base <file|url 基线版> --test <file|url 改版> \
//     [--viewport 1440x900] [--states "s1.js,s2.js"] [--out /tmp/visual-review.html]
//
//   --states  状态清单（逗号分隔的注入 JS 文件，复用 audit-runner --state 语义）。
//             每个状态一次对比；不传则只对比默认加载态。登录后的界面用状态脚本
//             进入（如 echo 'document.querySelector(".login-role").click()' > login.js）。
//   --out     产物 HTML 路径（截图与其同目录）。默认 /tmp/visual-review.html
//
// 产物：单个 HTML 对照片。每行 = 一个状态的 基线/改版 全页截图并排 + 两侧 AUDIT
// 计数 + 5 个固定检查点（层次保留/语义权重/布局密度/色彩信息/整体观感）勾选与备注，
// 勾选实时汇总到结论区并存 localStorage（刷新不丢）。
//
// 退出码: 0=对照片已生成；2=执行失败（任一截图失败）
// 注意：对照片只是把事实摆出来，"退化还是设计意图"由人判定——判定结果必须
// 逐行落到勾选/备注里，备案与修复口径同 detail-audit.md 分级验收。
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, basename } from 'node:path';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const RUNNER = join(here, 'audit-runner.mjs');
const AUDIT = join(here, 'detail-audit.js');

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : dflt; };
const base = opt('base');
const test = opt('test');
if (!base || !test) { console.error('缺少 --base 或 --test'); process.exit(2); }
const viewport = opt('viewport', '1440x900');
const outHtml = resolve(opt('out', join(tmpdir(), 'visual-review.html')));
const states = (opt('states', '') || '').split(',').map(s => s.trim()).filter(Boolean);
const runnerExtra = [];
for (const flag of ['--ready', '--assert']) {
  if (!args.includes(flag)) continue;
  const value = opt(flag.slice(2));
  if (value === undefined) { console.error(`缺少 ${flag} 的表达式`); process.exit(2); }
  runnerExtra.push(flag, value);
}

const stateNames = ['默认状态', ...states.map(s => basename(s).replace(/\.js$/, ''))];
const stateFiles = [null, ...states];

// 每次生成独立资源目录，避免覆盖同目录的其他报告或上次生成的截图。
const outDir = dirname(outHtml);
mkdirSync(outDir, { recursive: true });
const assetsDir = mkdtempSync(join(outDir, `${basename(outHtml)}.assets-`));
const assetsName = basename(assetsDir);
let completed = false;
process.on('exit', () => { if (!completed) rmSync(assetsDir, { force: true, recursive: true }); });

const shots = [];
for (let i = 0; i < stateFiles.length; i++) {
  const row = { name: stateNames[i], base: null, test: null };
  for (const side of ['base', 'test']) {
    const target = side === 'base' ? base : test;
    const png = join(assetsDir, `${String(i).padStart(2, '0')}-${side}.png`);
    const extra = stateFiles[i] ? ['--state', resolve(stateFiles[i])] : [];
    const r = spawnSync(process.execPath, [RUNNER, '--target', target, '--audit', AUDIT,
      '--viewport', viewport, '--shot', png, '--shot-full', ...extra, ...runnerExtra], { encoding: 'utf8' });
    let d = null; try { d = JSON.parse(r.stdout); } catch {}
    let pngValid = false;
    try {
      const bytes = readFileSync(png);
      pngValid = bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
        && bytes.readUInt32BE(16) > 0 && bytes.readUInt32BE(20) > 0;
    } catch {}
    if (r.status !== 0 || !d?.ok || d.blank || d.errors?.length || !pngValid) {
      console.error(`截图失败（${side} / ${row.name}，exit ${r.status}）：`, d?.fail || (d?.blank ? '页面空白' : d?.errors?.join('; ')) || (!pngValid ? '截图缺失或 PNG 无效' : (r.stderr || '').slice(0, 300)));
      process.exit(2);
    }
    row[side] = { png: basename(png), counts: d.result?.counts || {}, shot: d.shot || {} };
  }
  shots.push(row);
  console.log(`✓ ${row.name}（基线 ${row.base.shot.w || '?'}×${row.base.shot.h || '?'} / 改版 ${row.test.shot.w || '?'}×${row.test.shot.h || '?'}）`);
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const countsHtml = c => `blocked <b class="${c.blocked ? 'bad' : 'ok'}">${c.blocked ?? 0}</b> · warn <b class="${c.warn ? 'warn' : 'ok'}">${c.warn ?? 0}</b>`;

const CHECKS = ['层次保留', '语义权重', '布局密度', '色彩信息', '整体观感'];
const rowsHtml2 = shots.map((row, i) => {
  const cells = ['base', 'test'].map(side => `
    <td class="shot-cell"><a href="${esc(encodeURIComponent(assetsName))}/${encodeURIComponent(row[side].png)}" target="_blank" title="点击在新窗口看原始尺寸">
      <img src="${esc(encodeURIComponent(assetsName))}/${encodeURIComponent(row[side].png)}" loading="lazy" alt="${esc(row.name)} ${side}"></a>
      <div class="counts">${side === 'base' ? '基线' : '改版'}：${countsHtml(row[side].counts)}${row[side].shot.full ? ` · 全页 ${row[side].shot.w}×${row[side].shot.h}` : ''}</div>
    </td>`).join('');
  const ckptHtml = CHECKS.map(c => `<div class="ckpt" data-ckpt="${c}"><span class="ckpt-name">${c}</span>
      <label><input type="radio" name="r${i}-${esc(c)}" value="pass">通过</label>
      <label><input type="radio" name="r${i}-${esc(c)}" value="regress">退化</label>
      <label><input type="radio" name="r${i}-${esc(c)}" value="waive">备案</label>
    </div>`).join('');
  return `<tr data-row="${i}">
    <th>${esc(row.name)}</th>${cells}
    <td class="judge">${ckptHtml}<input class="note" type="text" placeholder="备注：退化点 / 备案理由（必填于退化与备案）"></td>
  </tr>`;
}).join('\n');

// 评审只属于本次生成；重新截图后必须重新判定。
const key = 'vr-' + createHash('sha256').update(JSON.stringify({ base, test, viewport, states, assetsDir })).digest('hex');
const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8"><title>视觉对比 · ${esc(basename(String(base)))} vs ${esc(basename(String(test)))}</title>
<style>
 body{margin:0;font:14px/1.6 -apple-system,"PingFang SC",sans-serif;background:#f5f5f7;color:#1d1d1f}
 header{padding:18px 24px;background:#fff;border-bottom:1px solid #e5e5ea;position:sticky;top:0;z-index:5}
 header h1{margin:0 0 6px;font-size:17px}
 header .meta{color:#6e6e73;font-size:12.5px}
 header .use{margin-top:6px;font-size:12.5px;color:#6e6e73}
 table{border-collapse:collapse;width:100%}
 th,td{border-bottom:1px solid #e5e5ea;padding:10px;vertical-align:top}
 tr th{position:sticky;left:0;background:#f5f5f7;min-width:86px;font-size:13px;text-align:left}
 .shot-cell{width:calc(50% - 190px)}
 .shot-cell img{width:100%;border:1px solid #d2d2d7;border-radius:6px;display:block;background:#fff}
 .counts{font-size:12px;color:#6e6e73;margin-top:4px}
 .bad{color:#d70015}.warn{color:#b25000}.ok{color:#1f7a34;font-weight:400}
 .judge{width:340px;min-width:300px;font-size:12.5px}
 .ckpt{display:flex;gap:2px;align-items:center;margin:2px 0}
 .ckpt-name{display:inline-block;width:64px;color:#3a3a3c;font-weight:600}
 .ckpt label{margin-right:8px;cursor:pointer;white-space:nowrap}
 .ckpt input{accent-color:#0a84ff;margin:0 3px 0 0}
 .note{width:100%;margin-top:6px;box-sizing:border-box;padding:5px 8px;border:1px solid #d2d2d7;border-radius:6px;font:inherit}
 tr.has-regress th{color:#d70015}
 #concl{position:fixed;right:16px;bottom:16px;background:#1d1d1f;color:#fff;border-radius:10px;padding:10px 16px;font-size:13px;box-shadow:0 8px 24px rgba(0,0,0,.25)}
 #concl b{font-size:15px}
</style></head><body>
<header>
 <h1>视觉重构对比 · 基线 vs 改版</h1>
 <div class="meta">基线 <code>${esc(base)}</code>　改版 <code>${esc(test)}</code>　视口 ${esc(viewport)}　生成 ${new Date().toLocaleString('zh-CN')}</div>
 <div class="use">用法：逐行展开对比截图（点图开原始尺寸），每行 5 个检查点逐一判定 <b>通过 / 退化 / 备案</b>，退化与备案必须在备注写明具体位置与理由。勾选与备注自动保存（localStorage），退化或备案缺少理由时不计入已判。<b>全部行勾完且无未处置退化，视觉重构才算完成</b>——机械检测全过不能替代本页（几何检测测不出"坏的设计"）。检查点含义见 references/detail-audit.md「视觉重构验收」。</div>
</header>
<table><tbody>
${rowsHtml2}
</tbody></table>
<div id="concl">已判 <b id="done">0</b>/${shots.length * CHECKS.length} · 退化 <b id="reg" class="bad" style="color:#ff6961">0</b> · 备案 <b id="wa">0</b></div>
<script>
const KEY=${JSON.stringify(key)};
const els=[...document.querySelectorAll('input[type=radio]')];
const rows=[...document.querySelectorAll('tr[data-row]')];
let saved={};
try { saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}; } catch {}
els.forEach(e=>{const k=e.name+'='+e.value;if(saved.choices?.[k])e.checked=true;});
rows.forEach(tr=>{const note=tr.querySelector('.note');note.value=saved.notes?.[tr.dataset.row]||'';});
function upd(){
  const st={choices:{},notes:{}};let done=0,reg=0,wa=0;
  rows.forEach(tr=>{
    const selected=[...tr.querySelectorAll('input:checked')];
    const note=tr.querySelector('.note');
    const hasReason=note.value.trim().length>0;
    const needsReason=selected.some(e=>e.value==='regress'||e.value==='waive');
    st.notes[tr.dataset.row]=note.value;
    selected.forEach(e=>{
      st.choices[e.name+'='+e.value]=1;
      if(e.value==='pass'||hasReason)done++;
      if(e.value==='regress')reg++;
      if(e.value==='waive')wa++;
    });
    tr.classList.toggle('has-regress',selected.some(e=>e.value==='regress'));
    note.required=needsReason;
    note.setAttribute('aria-invalid',String(needsReason&&!hasReason));
    note.style.borderColor=needsReason&&!hasReason?'#d70015':'#d2d2d7';
  });
  localStorage.setItem(KEY,JSON.stringify(st));
  document.getElementById('done').textContent=done;
  document.getElementById('reg').textContent=reg;
  document.getElementById('wa').textContent=wa;
}
els.forEach(e=>e.addEventListener('change',upd));
rows.forEach(tr=>tr.querySelector('.note').addEventListener('input',upd));
upd();
</script>
</body></html>`;

writeFileSync(outHtml, html);
completed = true;
console.log(`\n对照片已生成：${outHtml}`);
console.log('下一步：浏览器打开，逐行勾选判定（层次/权重/密度/色彩/整体），处置全部退化与备案后视觉验收完成。');
