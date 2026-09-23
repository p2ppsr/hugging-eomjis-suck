import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const upstream = http.createServer((_request, response) => response.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><html><head><title>Generic</title><meta name="description" content="Generic" /></head><body><div id="app"></div><script type="module" src="/assets/app.js"></script></body></html>'));
await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
process.env.UPSTREAM_URL = `http://127.0.0.1:${upstream.address().port}/`;
const { createServer } = await import('./server.mjs');
const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
test.after(async () => {
  await new Promise(resolve => server.close(resolve));
  await new Promise(resolve => upstream.close(resolve));
});

test('server renders distinct crawlable content and exact share metadata', async () => {
  const a = await (await fetch(`${base}/?n=1&p1=25`)).text();
  const b = await (await fetch(`${base}/?n=4&p1=00&p2=15&p3=24&p4=03`)).text();
  assert.match(a, /A self hug, made just right/);
  assert.match(a, /og:image.*n=1&amp;p1=25&amp;v=4/);
  assert.match(a, /One person giving themselves a hug/);
  assert.match(a, /noindex,follow/);
  assert.match(b, /A 4-person hug, made just right/);
  assert.match(b, /og:image.*n=4&amp;p1=00&amp;p2=15&amp;p3=24&amp;p4=03&amp;v=4/);
  assert.match(b, /4 people hugging/);
  assert.ok(!b.includes('Generic'));
  assert.match(b, /<link rel="canonical" href="https:\/\/hugging-eomjis-suck.metanet.app\/"/);
});

test('preview image is a 1200 by 630 PNG that changes with hug state', async () => {
  const one = await fetch(`${base}/og.png?n=1&p1=25`);
  const two = await fetch(`${base}/og.png?n=2&p1=00&p2=15`);
  const a = Buffer.from(await one.arrayBuffer());
  const b = Buffer.from(await two.arrayBuffer());
  assert.equal(one.headers.get('content-type'), 'image/png');
  assert.equal(a.readUInt32BE(16), 1200);
  assert.equal(a.readUInt32BE(20), 630);
  assert.notDeepEqual(a, b);
  const cached = await fetch(`${base}/og.png?n=1&p1=25`, { headers: { 'if-none-match': one.headers.get('etag') } });
  assert.equal(cached.status, 304);
  const oldEtag = `"${createHash('sha256').update('preview-v3:n=1&p1=25').digest('hex')}"`;
  const refreshed = await fetch(`${base}/og.png?n=1&p1=25`, { headers: { 'if-none-match': oldEtag } });
  assert.equal(refreshed.status, 200, 'old artwork caches must receive the new image');
  assert.notEqual(refreshed.headers.get('etag'), oldEtag);
});

test('normalizes malformed parameters and limits methods and paths', async () => {
  const page = await (await fetch(`${base}/?n=99&p1=%3Cscript%3E`)).text();
  assert.match(page, /A 2-person hug, made just right/);
  assert.ok(!page.includes('<script>'));
  assert.equal((await fetch(`${base}/other`)).status, 404);
  assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${base}/healthz`)).status, 200);
});

test('compresses HTML when accepted and respects gzip opt out', async () => {
  async function raw(encoding) {
    return await new Promise((resolve, reject) => {
      http.get(`${base}/?n=1&p1=25`, { headers: { 'accept-encoding': encoding } }, response => {
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => resolve({ headers: response.headers, body: Buffer.concat(chunks) }));
        response.on('error', reject);
      }).on('error', reject);
    });
  }
  const zipped = await raw('br, gzip');
  const plain = await raw('gzip;q=0');
  assert.equal(zipped.headers['content-encoding'], 'gzip');
  assert.match(zipped.headers.vary, /Accept-Encoding/);
  assert.match(gunzipSync(zipped.body).toString(), /A self hug, made just right/);
  assert.equal(plain.headers['content-encoding'], undefined);
  assert.match(plain.body.toString(), /A self hug, made just right/);
  assert.ok(zipped.body.length < plain.body.length / 2);
});

test('withdraws readiness while still serving routed page and image requests', async () => {
  const drainingServer = createServer();
  await new Promise(resolve => drainingServer.listen(0, '127.0.0.1', resolve));
  const drainingBase = `http://127.0.0.1:${drainingServer.address().port}`;
  try {
    assert.equal((await fetch(`${drainingBase}/drain`)).status, 200);
    assert.equal((await fetch(`${drainingBase}/healthz`)).status, 503);
    assert.equal((await fetch(`${drainingBase}/?n=1&p1=25`)).status, 200);
    assert.equal((await fetch(`${drainingBase}/og.png?n=1&p1=25`)).status, 200);
  } finally {
    await new Promise(resolve => drainingServer.close(resolve));
  }
});
