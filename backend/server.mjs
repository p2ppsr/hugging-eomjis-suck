import http from 'node:http';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { Resvg } from '@resvg/resvg-js';
import { createHugSvg, TONES } from '../frontend/src/illustration.js';
import { hugDescription, hugQuery, parseHug } from '../frontend/src/hug-state.js';

const origin = 'https://hugging-eomjis-suck.metanet.app';
const upstream = process.env.UPSTREAM_URL || 'https://frontend.d0d1613a7a9ba4de0bd28ef488f6f79a.projects.babbage.systems/';
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
let shell = '';
let shellFetchedAt = 0;
const imageCache = new Map();

async function getShell() {
  if (shell && Date.now() - shellFetchedAt < 2_000) return shell;
  try {
    const response = await fetch(upstream, { signal: AbortSignal.timeout(4000), headers: { accept: 'text/html' } });
    if (!response.ok) throw new Error(`upstream ${response.status}`);
    const html = await response.text();
    if (!html.includes('<div id="app"></div>') || !html.includes('</head>')) throw new Error('unexpected upstream HTML');
    shell = html;
    shellFetchedAt = Date.now();
    return html;
  } catch (error) {
    if (shell) return shell;
    throw error;
  }
}

function responseHeaders(extra = {}) {
  return {
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'content-security-policy': `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'sha256-${createHash('sha256').update(schemaScript).digest('base64')}'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`,
    ...extra,
  };
}

const schemaScript = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Hugging Emojis Suck', url: origin + '/', description: 'Build a self hug or a hug with up to four people, each with their own presentation and skin tone.', applicationCategory: 'EntertainmentApplication', operatingSystem: 'Any', isAccessibleForFree: true });

function metadata(people) {
  const count = people.length;
  const title = count === 1 ? 'A self hug, made just right' : `A ${count}-person hug, made just right`;
  const description = hugDescription(people);
  const canonical = `${origin}/`;
  const shareUrl = `${origin}/?${hugQuery(people)}`;
  const imageUrl = `${origin}/og.png?${hugQuery(people)}&v=1`;
  const participants = people.map((person, index) => `person ${index + 1}: ${TONES[person.tone].name.toLowerCase()} ${person.gender.toLowerCase()}`).join('; ');
  const alt = count === 1 ? `Illustration of one person hugging themself (${participants})` : `Illustration of ${count} people hugging (${participants})`;
  return { title, description, canonical, shareUrl, imageUrl, alt };
}

function renderHtml(source, people, isVariant) {
  const m = metadata(people);
  const tags = `<title>${escapeHtml(m.title)} | Hugging Emojis Suck</title>
  <meta name="description" content="${escapeHtml(m.description)}" />
  <link rel="canonical" href="${m.canonical}" />
  <meta name="robots" content="${isVariant ? 'noindex,follow,max-image-preview:large' : 'index,follow,max-image-preview:large'}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="Hugging Emojis Suck" />
  <meta property="og:title" content="${escapeHtml(m.title)} | Hugging Emojis Suck" />
  <meta property="og:description" content="${escapeHtml(m.description)}" />
  <meta property="og:url" content="${escapeHtml(m.shareUrl)}" />
  <meta property="og:image" content="${escapeHtml(m.imageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(m.imageUrl)}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(m.alt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(m.title)} | Hugging Emojis Suck" />
  <meta name="twitter:description" content="${escapeHtml(m.description)}" />
  <meta name="twitter:image" content="${escapeHtml(m.imageUrl)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(m.alt)}" />
  <script type="application/ld+json">${schemaScript}</script>`;
  const body = `<div id="app"><main class="site-shell"><header class="topbar"><a class="brand" href="/">HUGGING EMOJIS SUCK</a></header><section class="intro"><div class="eyebrow">FINALLY, A HUG FOR EVERYBODY</div><h1>Hugs are better<br><em>your way.</em></h1><p>${escapeHtml(m.description)}</p></section><section class="preview-panel" aria-label="Generated hug"><div class="preview-art">${createHugSvg(people)}</div></section><p>Choose one to four people. Give each their own presentation and skin tone. Share your hug with a link, or save it as PNG or SVG.</p></main></div>`;
  return source.replace(/<title>[^<]*<\/title>/i, '').replace(/<meta name="description"[^>]*>/i, '').replace(/<meta name="robots"[^>]*>/i, '').replace('</head>', `${tags}\n</head>`).replace('<div id="app"></div>', body);
}

function cardSvg(people) {
  const hug = Buffer.from(createHugSvg(people)).toString('base64');
  const label = people.length === 1 ? 'A hug for yourself.' : `${people.length} people. One excellent hug.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#fff9ef"/><rect x="28" y="28" width="1144" height="574" rx="31" fill="#ffe7c7" stroke="#e8cda9" stroke-width="3"/>
    <image href="data:image/svg+xml;base64,${hug}" x="151" y="34" width="898" height="500" preserveAspectRatio="xMidYMid meet"/>
    <rect x="70" y="58" width="268" height="49" rx="14" fill="#ffd66b"/>
    <text x="88" y="89" font-family="DejaVu Sans" font-weight="bold" font-size="19" fill="#33291f">HUGGING EMOJIS SUCK</text>
    <text x="75" y="577" font-family="DejaVu Sans" font-weight="bold" font-size="29" fill="#33291f">${label}</text>
    <text x="1117" y="574" text-anchor="end" font-family="DejaVu Sans" font-size="19" fill="#704c37">Make yours ↗</text>
  </svg>`;
}

export function renderCard(people) {
  return new Resvg(cardSvg(people), { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: true } }).render().asPng();
}

export function createServer() {
  let draining = false;
  return http.createServer(async (request, response) => {
    try {
      if (request.url.length > 512) {
        response.writeHead(414, responseHeaders({ 'cache-control': 'no-store' })).end(); return;
      }
      const url = new URL(request.url, origin);
      if (url.pathname === '/drain' && request.socket.remoteAddress?.includes('127.0.0.1')) {
        draining = true;
        response.writeHead(200, responseHeaders({ 'content-type': 'text/plain', 'cache-control': 'no-store' })).end('draining'); return;
      }
      if (draining) {
        response.writeHead(503, responseHeaders({ 'cache-control': 'no-store' })).end('draining'); return;
      }
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, responseHeaders({ allow: 'GET, HEAD' })).end(); return;
      }
      if (url.pathname === '/healthz') {
        await getShell();
        response.writeHead(200, responseHeaders({ 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })).end('ok'); return;
      }
      if (url.pathname !== '/' && url.pathname !== '/og.png') {
        response.writeHead(404, responseHeaders({ 'content-type': 'text/plain; charset=utf-8' })).end('Not found'); return;
      }
      const people = parseHug(url.search);
      if (url.pathname === '/og.png') {
        const key = hugQuery(people);
        const etag = `"${createHash('sha256').update('preview-v1:' + key).digest('hex')}"`;
        if (request.headers['if-none-match'] === etag) {
          response.writeHead(304, responseHeaders({ etag, 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' })).end(); return;
        }
        let png = imageCache.get(key);
        if (!png) {
          png = renderCard(people);
          imageCache.set(key, png);
          if (imageCache.size > 64) imageCache.delete(imageCache.keys().next().value);
        }
        const headers = responseHeaders({ 'content-type': 'image/png', 'content-length': png.length, 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800', etag });
        response.writeHead(200, headers).end(request.method === 'HEAD' ? undefined : png); return;
      }
      const html = renderHtml(await getShell(), people, url.search !== '');
      const bytes = Buffer.from(html);
      const compressed = (request.headers['accept-encoding'] || '').split(',').some(entry => {
        const [coding, ...parameters] = entry.trim().split(';');
        if (coding.toLowerCase() !== 'gzip') return false;
        const quality = parameters.map(value => value.trim()).find(value => value.startsWith('q='));
        return !quality || Number(quality.slice(2)) > 0;
      });
      const payload = compressed ? gzipSync(bytes, { level: 6 }) : bytes;
      response.writeHead(200, responseHeaders({
        'content-type': 'text/html; charset=utf-8',
        'content-language': 'en',
        'content-length': payload.length,
        'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
        vary: 'Accept-Encoding',
        ...(compressed ? { 'content-encoding': 'gzip' } : {}),
      })).end(request.method === 'HEAD' ? undefined : payload);
    } catch (error) {
      console.error('Preview response failed:', error);
      response.writeHead(503, responseHeaders({ 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })).end('Temporarily unavailable');
    }
  });
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  createServer().listen(Number(process.env.PORT || 8080), '0.0.0.0');
}
