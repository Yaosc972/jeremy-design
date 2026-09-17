// audit-runner.mjs — 单档位细节检查运行器（Node ≥ 21，零依赖，CDP 直连）
//
// 用 Chrome DevTools Protocol 打开目标页面（本地文件或真实 URL），精确模拟
// reduced-transparency / 视口，注入 detail-audit.js，等页面稳定后取 AUDIT() 结果，
// 同时收集页面级错误（JS 异常 / console.error / 资源加载失败）与空白检测。
//
// 用法（一般由 audit-matrix.sh 调用）：
//   node audit-runner.mjs --target <url|file> --audit <detail-audit.js> \
//     [--viewport 1440x900] [--rm reduce|no-preference] [--state <state.js>]... \
//     [--timeout 30000] [--shot <out.png>]
//
// 输出：stdout 一行 JSON —
//   { ok, blank, errors[], result{overflowX,clip,tight,overlap,wrapped,counts}, target, viewport, rm }
//   ok=false 表示页面级失败（导航失败/超时/AUDIT 未定义）；result 为 null 时检查不成立。
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : dflt; };
const optAll = (name) => { const out = []; args.forEach((a, i) => { if (a === '--' + name) out.push(args[i + 1]); }); return out; };

const target = opt('target');
const auditPath = opt('audit');
if (!target || !auditPath) { console.error('缺少 --target 或 --audit'); process.exit(2); }
const viewport = opt('viewport', '1440x900').split('x').map(Number);
const rm = opt('rm', null);                 // null=不覆盖（浏览器默认）；reduce / no-preference
const states = optAll('state').map(f => readFileSync(f, 'utf8'));
const timeoutMs = Number(opt('timeout', 30000));
const chromePath = opt('chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const auditSrc = readFileSync(auditPath, 'utf8');

const url = /^https?:\/\//.test(target) ? target : pathToFileURL(resolve(target)).href;
const profileDir = mkdtempSync(tmpdir() + '/jd-cdp-');

const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profileDir}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

let wsUrl = null;
const wsReady = new Promise((res, rej) => {
  const t = setTimeout(() => rej(new Error('Chrome 启动超时')), 10000);
  chrome.stderr.on('data', d => {
    const m = String(d).match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) { clearTimeout(t); wsUrl = m[1]; res(); }
  });
});

const finish = (code, payload) => {
  try { chrome.kill(); } catch {}
  try { rmSync(profileDir, { recursive: true, force: true }); } catch {}
  console.log(JSON.stringify(payload));
  process.exit(code);
};

async function main() {
  await wsReady;
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let msgId = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else if (m.method) events.push(m);
  };
  const send = (method, params = {}, sessionId) => new Promise(res => {
    const id = ++msgId;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const waitEvent = (method, sessionId) => new Promise(res => {
    const t = setInterval(() => {
      const i = events.findIndex(e => e.method === method && (!sessionId || e.sessionId === sessionId));
      if (i >= 0) { const e = events.splice(i, 1)[0]; clearInterval(t); res(e); }
    }, 50);
  });

  const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
  const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Log.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride',
    { width: viewport[0], height: viewport[1], deviceScaleFactor: 1, mobile: false }, sessionId);
  if (rm) await send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-transparency', value: rm }] }, sessionId);

  await send('Page.navigate', { url }, sessionId);
  await Promise.race([waitEvent('Page.loadEventFired', sessionId), new Promise(r => setTimeout(r, timeoutMs))]);

  // 状态 JS（切字号/主题等），合并执行
  for (const s of states) {
    await send('Runtime.evaluate', { expression: s, awaitPromise: false }, sessionId);
  }

  // 等页面稳定：字体就绪 → 双 rAF → 有限时长动画收尾（无限动画跳过），总超时兜底
  const stable = await send('Runtime.evaluate', {
    expression: `(async()=>{
      try{await document.fonts.ready;}catch(e){}
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const anims=(document.getAnimations?document.getAnimations():[]).filter(a=>{
        try{const t=a.effect&&a.effect.getTiming();return t&&t.iterations!==Infinity;}catch(e){return false;}
      });
      await Promise.race([Promise.all(anims.map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
      return true;})()`,
    awaitPromise: true, returnByValue: true,
  }, sessionId);

  const errors = [];
  for (const e of events) {
    if (e.method === 'Runtime.exceptionThrown') {
      const d = e.params.exceptionDetails;
      errors.push('JS异常: ' + (d.exception?.description || d.text || '').split('\n')[0].slice(0, 160));
    } else if (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') {
      errors.push('console.error: ' + e.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 160));
    } else if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      errors.push('页面错误: ' + (e.params.entry.text || '').slice(0, 160));
    }
  }

  // 截图（目视复核用）：当前视口；--shot-at <y> 先滚动到指定位置
  const shotPath = opt('shot', null);
  if (shotPath) {
    const atY = opt('shot-at', null);
    if (atY !== null) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0,${Number(atY)})` }, sessionId);
      await send('Runtime.evaluate', { expression: 'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))', awaitPromise: true }, sessionId);
    }
    const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    if (shot.result?.data) writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
  }

  // 注入检测器并取结果
  const injected = await send('Runtime.evaluate', {
    expression: auditSrc + '\n;' + `(()=>{try{const r=AUDIT();return {ok:true,blank:document.body.innerText.trim().length===0&&document.querySelectorAll('img,canvas,video,svg').length===0,r};}catch(e){return {ok:false,err:String(e)};}})()`,
    returnByValue: true,
  }, sessionId);

  const v = injected.result?.result?.value;
  if (!v || v.ok !== true) {
    return finish(2, { ok: false, blank: null, errors, result: null, target: url, viewport: opt('viewport', '1440x900'), rm, fail: 'AUDIT 执行失败: ' + (v?.err || injected.result?.exceptionDetails?.text || '未知') });
  }
  finish(0, { ok: true, blank: v.blank, errors, result: v.r, target: url, viewport: opt('viewport', '1440x900'), rm });
}

main().catch(e => finish(2, { ok: false, blank: null, errors: [String(e.message || e)], result: null, target: url, viewport: opt('viewport', '1440x900'), rm, fail: '运行器错误' }));
