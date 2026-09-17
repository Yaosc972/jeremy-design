// audit-runner.mjs — 单档位细节检查运行器（Node ≥ 21，零依赖，CDP 直连）
//
// 用 Chrome DevTools Protocol 打开目标页面（本地文件或真实 URL），精确模拟
// reduced-transparency / 视口，注入 detail-audit.js，等页面稳定后取 AUDIT() 结果，
// 同时收集页面级错误（JS 异常 / console.error / 资源加载失败）与空白检测。
//
// 用法（一般由 audit-matrix.sh 调用）：
//   node audit-runner.mjs --target <url|file> --audit <detail-audit.js> \
//     [--viewport 1440x900] [--rm reduce|no-preference] [--state <state.js>]... \
//     [--ready <js-expr>] [--assert <js-expr>] \
//     [--timeout 30000] [--deadline 120000] [--shot <out.png>]
//
// 前置条件链（任一不满足即执行失败，绝不继续得出"通过"）：
//   导航无 errorText → load 在 --timeout 内触发 → 实际页面非浏览器错误页 →
//   --ready 就绪表达式为真 → 状态脚本无异常/异步失败 → --assert 档位断言为真 →
//   稳定等待成功 → 几何检测。
//   --ready / --assert 同步/异步统一求值：Promise 一律等待完成，抛异常或值不严格为 true 即失败。
//
// --timeout  ms   导航 load 等待上限，超时=执行失败（默认 30000；不是"等到就继续"）。
// --deadline ms   单档总时限，从进程启动起算（覆盖 Chrome 启动/连接/全前置链），超时=失败。
//                 默认 max(4×timeout, 60000)。
// --ready  <expr> 应用就绪条件，如 "!!document.querySelector('#app .toolbar')"。
// --assert <expr> 状态生效断言，如 200% 档 "parseFloat(getComputedStyle(document.body).fontSize)>=32"。
//                 状态文件必须断言目标字号/主题确实生效，执行过 ≠ 覆盖了该档位。
//
// 输出：stdout 一行 JSON —
//   { ok, blank, errors[], result{overflowX,clip,tight,overlap,wrapped,skipped,counts},
//     target, viewport, rm, stage?, fail? }
//   ok=false 附 fail=失败阶段与原因；result 为 null 时检查不成立。
//   浏览器错误页（chrome-error:// 或 neterror 结构）带文字也会被身份检查拦下。
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
const readyExpr = opt('ready', null);       // 导航后的应用就绪条件（可选）
const assertExpr = opt('assert', null);     // 状态生效断言（可选）
const states = optAll('state').map(f => readFileSync(f, 'utf8'));
const timeoutMs = Number(opt('timeout', 30000));
const chromePath = opt('chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const auditSrc = readFileSync(auditPath, 'utf8');

let stage = 'init';                         // 失败时报告的阶段

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

// 页面事件缓冲与失败载荷——提升到模块级，让 deadline 定时器在 Chrome 尚未启动时
// 也能带上已收集的页面错误输出失败 JSON。
const events = [];
const collectErrors = () => {
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
  return errors;
};
const failPayload = (msg) => ({ ok: false, blank: null, errors: collectErrors(), result: null, target: url, viewport: opt('viewport', '1440x900'), rm, stage, fail: msg });

const finish = (code, payload) => {
  try { chrome.kill(); } catch {}
  try { rmSync(profileDir, { recursive: true, force: true }); } catch {}
  console.log(JSON.stringify(payload));
  process.exit(code);
};

// 总超时从进程启动起算——覆盖 Chrome 启动、WS 连接、前置链、稳定等待、检测全生命周期。
// 旧版在 main() 内、WS 就绪之后才建立，浏览器启动卡死/连接挂起时永不触发。
const deadlineMs = Number(opt('deadline', 0)) || Math.max(timeoutMs * 4, 60000);
setTimeout(() => finish(2, failPayload(`总超时 ${deadlineMs}ms（阶段: ${stage}）`)), deadlineMs);

async function main() {
  await wsReady;
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let msgId = 0;
  const pending = new Map();
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

  // 统一求值：同步表达式与 Promise 一律 awaitPromise 等待，异常与「值不严格为 true」都判失败。
  // 旧版 `!!(expr)` 包装下，返回 Promise 的断言在等待前先变 true——异步失败被当成通过。
  const evalCheck = async (expr) => {
    const r = await send('Runtime.evaluate', {
      expression: `(()=>{try{return (${expr});}catch(e){return {__evalError:String((e&&e.message)||e)};}})()`,
      awaitPromise: true, returnByValue: true,
    }, sessionId);
    const ex = r.result?.exceptionDetails;
    if (ex) return { ok: false, reason: '表达式抛异常: ' + (ex.exception?.description || ex.text || '').split('\n')[0].slice(0, 160) };
    const v = r.result?.result?.value;
    if (v && typeof v === 'object' && '__evalError' in v) return { ok: false, reason: '表达式抛异常: ' + String(v.__evalError).slice(0, 160) };
    if (v !== true) return { ok: false, reason: `表达式值 ${JSON.stringify(v)} 不严格为 true` };
    return { ok: true };
  };

  // 前置链 1：导航。errorText 非空即失败——绝不把错误页当应用验收。
  stage = 'navigate';
  events.length = 0;                                       // 丢弃 about:blank 残留事件
  let nav;
  try { nav = await send('Page.navigate', { url }, sessionId); }
  catch (e) { return finish(2, failPayload('导航命令发送失败: ' + String(e.message || e))); }
  if (nav?.result?.errorText) return finish(2, failPayload('导航失败: ' + nav.result.errorText));

  // 前置链 2：load 必须触发；等到超时=失败，不继续往下走
  stage = 'load';
  const loaded = await Promise.race([
    waitEvent('Page.loadEventFired', sessionId).then(() => true),
    new Promise(r => setTimeout(() => r(false), timeoutMs)),
  ]);
  if (!loaded) return finish(2, failPayload(`页面加载超时（${timeoutMs}ms 内未触发 load）`));

  // 前置链 3：实际身份核验——浏览器错误页（chrome-error:// / neterror 结构）有文字也会被拦下
  stage = 'identity';
  const ident = await send('Runtime.evaluate', {
    expression: `(()=>{try{return {href:location.href,err:location.href.indexOf('chrome-error:')===0||!!document.getElementById('main-frame-error')};}catch(e){return {href:'',err:true};}})()`,
    returnByValue: true,
  }, sessionId);
  const idv = ident.result?.result?.value || {};
  if (idv.err) return finish(2, failPayload('实际加载的是浏览器错误页: ' + (idv.href || '?')));

  // 前置链 4：应用就绪条件（可配置）。"非空白"只是最低检查，证明不了加载的是用户的应用。
  if (readyExpr) {
    stage = 'ready';
    const rc = await evalCheck(readyExpr);
    if (!rc.ok) return finish(2, failPayload(`应用就绪条件未满足: ${readyExpr} — ${rc.reason}`));
  }

  // 前置链 5：状态 JS（切字号/主题等）。检查返回值异常 + awaitPromise 等异步完成——
  // Runtime.exceptionThrown 事件可能为空，返回值里的 exceptionDetails 才是可靠信号。
  stage = 'state';
  for (const s of states) {
    const r = await send('Runtime.evaluate', { expression: s, awaitPromise: true, returnByValue: true }, sessionId);
    const ex = r.result?.exceptionDetails;
    if (ex) return finish(2, failPayload('状态脚本执行失败: ' + (ex.exception?.description || ex.text || '').split('\n')[0].slice(0, 160)));
  }

  // 等页面稳定：字体就绪 → 双 rAF（2s 兜底，页面隐藏时 rAF 可能永不触发）→ 有限时长动画
  // 收尾（无限动画跳过，3s 上限）→ 总超时兜底。结果必须检查：稳定阶段失败/超时不能继续验收。
  stage = 'stable';
  const st = await evalCheck(`(async()=>{
      try{await document.fonts.ready;}catch(e){}
      await Promise.race([new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))),new Promise(r=>setTimeout(r,2000))]);
      const anims=(document.getAnimations?document.getAnimations():[]).filter(a=>{
        try{const t=a.effect&&a.effect.getTiming();return t&&t.iterations!==Infinity;}catch(e){return false;}
      });
      await Promise.race([Promise.all(anims.map(a=>a.finished.catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);
      return true;})()`);
  if (!st.ok) return finish(2, failPayload('稳定等待阶段失败: ' + st.reason));

  // 前置链 6：档位断言——状态确实生效才算覆盖了这个档位
  if (assertExpr) {
    stage = 'assert';
    const ac = await evalCheck(assertExpr);
    if (!ac.ok) return finish(2, failPayload(`状态断言未满足: ${assertExpr} — ${ac.reason}`));
  }

  const errors = collectErrors();

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

main().catch(e => finish(2, { ok: false, blank: null, errors: [String(e.message || e)], result: null, target: url, viewport: opt('viewport', '1440x900'), rm, stage, fail: `运行器错误（阶段: ${stage}）` }));
