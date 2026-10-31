// Runs tests.html in headless Chromium and fails the build if any test fails.
// Usage: node ci.mjs   (run from this app's folder, or pass the folder as an argument)
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(root, p === '/' ? 'index.html' : p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', e => console.error('page error:', e.message));
let code = 1;
try {
  await page.goto(`http://127.0.0.1:${port}/tests.html`);
  await page.waitForFunction(() => window.TEST_DONE === true, null, { timeout: 120000 });
  const results = await page.evaluate(() => window.TEST_RESULTS);
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  · ' + r.detail : ''}`);
  // Real-click check: tap the brightness display, type, tap the distance display, type, press ▶ on the counter.
  // Each control's position is read fresh before every tap.
  const app = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await app.goto(`http://127.0.0.1:${port}/index.html?test=1`);
  await app.waitForFunction(() => window.EP_READY === true);
  const tap = async id => {
    const p = await app.evaluate(id => { draw(); const h = HITS.find(x => x.id === id); const r = cv.getBoundingClientRect(), s = r.width / W;
      return { x: r.left + (h.x + h.w / 2) * s, y: r.top + (h.y + h.h / 2) * s }; }, id);
    await app.mouse.click(p.x, p.y);
  };
  await tap('bright'); await app.keyboard.type('73');
  await tap('dist'); await app.keyboard.type('22');
  await tap('autoGo'); await app.waitForTimeout(200);
  const st = await app.evaluate(() => ({ bright: S.bright, dist: S.dist, open: getComputedStyle(document.getElementById('typeBox')).display, running: S.auto.running, cb: S.auto.cond && S.auto.cond[0].bright, cd: S.auto.cond && S.auto.cond[0].dist }));
  const clickOk = st.bright === 73 && st.dist === 22 && st.open === 'none' && st.running && st.cb === 73 && st.cd === 22;
  results.push({ ok: clickOk, name: 'real clicks: typed values stick and are used by the count', detail: JSON.stringify(st) });
  console.log(`${clickOk ? 'PASS' : 'FAIL'}  real clicks: typed values stick and are used by the count  · ${JSON.stringify(st)}`);
  const errs = await app.evaluate(() => window.__errors);
  results.push({ ok: errs.length === 0, name: 'no script errors in the app', detail: errs.join(' | ') });
  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  code = failed ? 1 : 0;
} catch (e) {
  console.error('Test run did not complete:', e.message);
} finally {
  await browser.close();
  server.close();
}
process.exit(code);
