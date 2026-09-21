#!/usr/bin/env node
// 无浏览器契约测试：复制生成器到隔离目录，用 stub runner 验证参数和产物所有权。
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = mkdtempSync(join(tmpdir(), 'jd-vr-contract-'));
try {
  copyFileSync(join(dirname(fileURLToPath(import.meta.url)), '../scripts/visual-review.mjs'), join(root, 'visual-review.mjs'));
  writeFileSync(join(root, 'audit-runner.mjs'), `
import { appendFileSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
appendFileSync(process.env.CALLS, JSON.stringify(args)+'\\n');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6GQAAAABJRU5ErkJggg==', 'base64');
if (process.env.MODE !== 'missing') writeFileSync(args[args.indexOf('--shot')+1], png);
console.log(JSON.stringify({ok:true, blank:process.env.MODE === 'blank', errors:process.env.MODE === 'error' ? ['page failed'] : [], result:{counts:{blocked:0,warn:0}},shot:{w:1,h:1,full:true}}));
`);
  const calls = join(root, 'calls.jsonl');
  const run = (name, extra = [], mode = '') => spawnSync(process.execPath, [join(root, 'visual-review.mjs'),
    '--base', '/same/long/path/to/base.html', '--test', '/same/long/path/to/test.html', '--out', join(root, name), ...extra],
  { encoding: 'utf8', env: { ...process.env, CALLS: calls, MODE: mode } });
  const assets = name => {
    const html = readFileSync(join(root, name), 'utf8');
    return [...html.matchAll(/<img src="([^"]+)"/g)].map(m => join(root, decodeURIComponent(m[1])));
  };
  const key = name => readFileSync(join(root, name), 'utf8').match(/const KEY=("[^"]+")/)[1];
  assert.equal(run('one.html', ['--ready', 'false', '--assert', 'Promise.resolve(false)']).status, 0);
  for (const args of readFileSync(calls, 'utf8').trim().split('\n').map(JSON.parse)) {
    assert.equal(args[args.indexOf('--ready') + 1], 'false');
    assert.equal(args[args.indexOf('--assert') + 1], 'Promise.resolve(false)');
  }
  const firstPaths = assets('one.html');
  const firstBytes = firstPaths.map(p => readFileSync(p));
  const firstKey = key('one.html');
  assert.equal(run('two.html').status, 0);
  assert.notEqual(key('two.html'), firstKey);
  assert.notEqual(dirname(assets('two.html')[0]), dirname(firstPaths[0]));
  firstPaths.forEach((p, i) => assert.deepEqual(readFileSync(p), firstBytes[i]));
  assert.equal(run('one.html').status, 0);
  assert.notEqual(key('one.html'), firstKey);
  firstPaths.forEach((p, i) => assert.deepEqual(readFileSync(p), firstBytes[i]));
  for (const mode of ['missing', 'blank', 'error']) {
    assert.equal(run(`fail-${mode}.html`, [], mode).status, 2);
    assert.equal(readdirSync(root).some(p => p.startsWith(`fail-${mode}.html.assets-`)), false);
  }
  assert.equal(run('no-expression.html', ['--ready']).status, 2);
  // 执行真实产物内的脚本，模拟一次填写和刷新，不启动浏览器。
  const reviewScript = readFileSync(join(root, 'one.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  const storage = new Map();
  const loadReview = () => {
    const input = props => ({ ...props, listeners: {}, addEventListener(type, listener) { this.listeners[type] = listener; } });
    const radios = Array.from({ length: 5 }, (_, i) => ['pass', 'regress', 'waive'].map(value => input({ name: `r0-check${i}`, value, checked: false }))).flat();
    const note = input({ value: '', style: {}, attrs: {}, setAttribute(name, value) { this.attrs[name] = value; } });
    const row = { dataset: { row: '0' }, classList: { toggle() {} },
      querySelector: selector => selector === '.note' ? note : null,
      querySelectorAll: selector => selector === 'input:checked' ? radios.filter(e => e.checked) : [] };
    const counters = Object.fromEntries(['done', 'reg', 'wa'].map(k => [k, { textContent: '' }]));
    runInNewContext(reviewScript, {
      document: { querySelectorAll: selector => selector === 'input[type=radio]' ? radios : selector === 'tr[data-row]' ? [row] : [],
        getElementById: id => counters[id] },
      localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    });
    return { radios, note, counters };
  };
  let review = loadReview();
  review.radios.forEach(e => { e.checked = e.value === 'waive'; });
  review.radios[0].listeners.change();
  assert.equal(review.counters.done.textContent, 0, '空理由备案不得完成');
  assert.equal(review.note.attrs['aria-invalid'], 'true');
  review.note.value = '   ';
  review.note.listeners.input();
  assert.equal(review.counters.done.textContent, 0, '纯空白不是备案理由');
  review.note.value = '保留较高密度以便比较工资明细';
  review.note.listeners.input();
  assert.equal(review.counters.done.textContent, 5);
  review = loadReview();
  assert.equal(review.note.value, '保留较高密度以便比较工资明细');
  assert.equal(review.counters.done.textContent, 5);
  assert.equal(review.radios.filter(e => e.checked && e.value === 'waive').length, 5);
  review.note.value = '';
  review.note.listeners.input();
  assert.equal(review.counters.done.textContent, 0, '删除理由后撤销完成计数');
  review.radios.forEach(e => { e.checked = e.value === 'regress'; });
  review.radios[0].listeners.change();
  assert.equal(review.counters.done.textContent, 0, '空理由退化不得完成');
  assert.equal(review.counters.reg.textContent, 5);
  review.radios.forEach(e => { e.checked = e.value === 'pass'; });
  review.radios[0].listeners.change();
  assert.equal(review.counters.done.textContent, 5, '通过判定无需备注');
  console.log('通过：断言透传、资源隔离、评审隔离、截图/页面失败检查、失败清理、备注刷新恢复及必填理由计数。');
} finally {
  rmSync(root, { recursive: true, force: true });
}
