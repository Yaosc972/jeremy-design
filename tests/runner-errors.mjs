// Browser-backed failure-path coverage for the audit runner.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tmp = mkdtempSync(join(tmpdir(), 'jd-runner-errors-'));
try {
 const blank = join(tmp, 'blank.html');
 const error = join(tmp, 'error.html');
 writeFileSync(blank, '<html><body></body></html>');
 writeFileSync(error, '<html><body>Loaded<script>console.error("expected fixture error")</script></body></html>');
 for (const [name, target, extra, reason] of [
  ['missing Chrome', error, ['--chrome', join(tmp, 'missing-chrome')], /运行器错误/],
  ['invalid CDP viewport', error, ['--viewport', '-1x900'], /运行器错误/],
  ['blank page', blank, [], /页面空白/],
  ['page error', error, [], /运行错误/],
 ]) {
  const result = spawnSync(process.execPath, [join(root,'scripts/audit-runner.mjs'), '--target', target,
   '--audit', join(root,'scripts/detail-audit.js'), ...extra], { encoding:'utf8', timeout:20000 });
  assert.equal(result.status, 2, name + ': ' + result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.ok, false, name);
  assert.match(data.fail, reason, name);
  console.log('PASS', name);
 }
} finally { rmSync(tmp, { recursive:true, force:true }); }
