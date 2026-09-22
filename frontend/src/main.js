import './style.css';
import { createHugSvg, GENDERS, TONES } from './illustration.js';
import { defaults, parseHug, hugQuery } from './hug-state.js';

let people = parseHug(location.search);

const app = document.querySelector('#app');
app.innerHTML = `<div class="site-shell">
  <header class="topbar"><a class="brand" href="/" aria-label="Hugging Emojis Suck home"><span class="brand-mark">H!</span><span>HUGGING EMOJIS<br>SUCK</span></a><span class="top-note">A tiny, very serious hug studio <span aria-hidden="true">✳</span></span></header>
  <main>
    <section class="intro"><div class="eyebrow"><span class="eyebrow-dot"></span> FINALLY, A HUG FOR EVERYBODY</div><h1>Hugs are better<br><em>your way.</em></h1><p>The hug emoji is doing its best. We can do better. Pick your people, make a cuddle pile, and take your masterpiece with you.</p></section>
    <div class="workspace">
      <section class="preview-panel" aria-label="Generated hug"><div class="preview-header"><span>YOUR HUG, LIVE</span><span class="live-pill"><span class="live-dot"></span> MADE IN YOUR BROWSER</span></div><div class="preview-art" id="previewArt" aria-live="polite"></div><div class="preview-bottom"><div><span class="mini-label">CURRENT CONFIGURATION</span><strong id="summary"></strong></div><span class="scribble" aria-hidden="true">♡</span></div></section>
      <section class="builder-panel" aria-label="Build your hug"><div class="builder-head"><div><span class="mini-label">THE HUG BUILDER</span><h2>Who’s in?</h2></div><span class="step-pill">01—04</span></div><div class="count-block"><label for="count">People in the hug</label><div class="count-control"><button type="button" id="decrease" aria-label="Remove one person">−</button><output id="countValue" for="count"></output><button type="button" id="increase" aria-label="Add one person">+</button></div></div><div id="personControls" class="person-list"></div><div class="builder-actions"><button type="button" class="surprise-btn" id="surprise"><span aria-hidden="true">✦</span> Surprise me</button><button type="button" class="reset-btn" id="reset">Reset</button></div></section>
    </div>
    <section class="export-strip"><div><span class="mini-label">LOOKS GOOD? TAKE IT.</span><h2>Send some love.</h2><p>No account or upload. The link remembers your choices.</p></div><div class="export-actions"><button type="button" class="action dark" id="shareHug">↗ Share this hug</button><button type="button" class="action pale" id="downloadPng">↓ Download PNG</button><button type="button" class="action pale" id="downloadSvg">↓ Download SVG</button><button type="button" class="action pale" id="copyLink">↗ Copy link</button></div></section>
    <footer><span>MADE FOR ALL THE PEOPLE IN THE HUG.</span><span>NO ACCOUNTS. NO UPLOADS. JUST ARMS.</span></footer>
  </main><div class="toast" id="toast" role="status" aria-live="polite"></div>
</div>`;
const preview = document.querySelector('#previewArt');
const list = document.querySelector('#personControls');
const toast = document.querySelector('#toast');
let toastTimer;
function say(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function writeUrl() {
  history.replaceState(null, '', `${location.pathname}?${hugQuery(people)}`);
}
function render() {
  document.querySelector('#countValue').textContent = people.length;
  document.querySelector('#decrease').disabled = people.length === 1;
  document.querySelector('#increase').disabled = people.length === 4;
  preview.innerHTML = createHugSvg(people);
  document.querySelector('#summary').textContent = people.length === 1 ? 'A hug for yourself' : `${people.length} people · 1 excellent hug`;
  list.innerHTML = people.map((person, index) => `<article class="person-card" aria-label="Person ${index + 1}"><div class="person-heading"><span class="person-badge">${String(index + 1).padStart(2, '0')}</span><strong>Person ${index + 1}</strong><span class="person-heart" aria-hidden="true">♥</span></div><div class="setting"><span class="setting-label">Presentation</span><div class="segmented" role="group" aria-label="Person ${index + 1} presentation">${GENDERS.map(g => `<button type="button" data-index="${index}" data-gender="${g}" aria-pressed="${person.gender === g}">${g}</button>`).join('')}</div></div><div class="setting"><span class="setting-label">Skin tone</span><div class="tones" role="group" aria-label="Person ${index + 1} skin tone">${TONES.map((tone, toneIndex) => `<button type="button" class="tone ${person.tone === toneIndex ? 'selected' : ''}" data-index="${index}" data-tone="${toneIndex}" aria-label="${tone.name}" aria-pressed="${person.tone === toneIndex}" title="${tone.name}" style="--tone:${tone.base}"></button>`).join('')}</div></div></article>`).join('');
  writeUrl();
}
list.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const index = Number(button.dataset.index);
  if (button.dataset.gender) people[index].gender = button.dataset.gender;
  if (button.dataset.tone !== undefined) people[index].tone = Number(button.dataset.tone);
  render();
});
document.querySelector('#decrease').addEventListener('click', () => { if (people.length > 1) { people.pop(); render(); } });
document.querySelector('#increase').addEventListener('click', () => { if (people.length < 4) { people.push({ ...defaults[people.length] }); render(); } });
document.querySelector('#surprise').addEventListener('click', () => {
  people = people.map(() => ({ gender: GENDERS[Math.floor(Math.random() * GENDERS.length)], tone: Math.floor(Math.random() * TONES.length) }));
  render(); say('A fresh hug, coming right up.');
});
document.querySelector('#reset').addEventListener('click', () => { people = defaults.slice(0, 2).map(p => ({ ...p })); render(); say('Back to the original hug.'); });
function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector('#downloadSvg').addEventListener('click', () => {
  download(new Blob([createHugSvg(people)], { type: 'image/svg+xml;charset=utf-8' }), `my-hug-${people.length}-people.svg`);
  say('SVG downloaded. Go spread some love.');
});
document.querySelector('#downloadPng').addEventListener('click', async () => {
  const svg = createHugSvg(people);
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = 1800; canvas.height = 1120;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('PNG rendering failed');
    download(blob, `my-hug-${people.length}-people.png`);
    say('PNG downloaded. Hug delivered.');
  } catch { say('Could not render the PNG. Please try SVG.'); }
  finally { URL.revokeObjectURL(url); }
});
document.querySelector('#copyLink').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); say('Link copied. Share the hug!'); }
  catch { say('Clipboard unavailable. Copy the URL from your address bar.'); }
});
document.querySelector('#shareHug').addEventListener('click', async () => {
  const title = people.length === 1 ? 'I made myself a hug' : `I made a ${people.length}-person hug`;
  const data = { title, text: 'This hug has your name on it. Make your own:', url: location.href };
  if (navigator.share) {
    try { await navigator.share(data); say('Hug sent into the world.'); }
    catch (error) { if (error.name !== 'AbortError') say('Could not share. Try copying the link.'); }
  } else {
    try { await navigator.clipboard.writeText(location.href); say('Link copied. Send someone a hug!'); }
    catch { say('Copy the URL from your address bar to share.'); }
  }
});
render();
