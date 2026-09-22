export const TONES = [
  { name: 'Classic yellow', base: '#f9cc49', light: '#ffe583', shade: '#c88e22' },
  { name: 'Light', base: '#f4d6ba', light: '#ffead8', shade: '#be8e72' },
  { name: 'Medium-light', base: '#dbac82', light: '#f3cfaa', shade: '#9f684c' },
  { name: 'Medium', base: '#b87852', light: '#d99c73', shade: '#78462f' },
  { name: 'Medium-dark', base: '#855139', light: '#ad7658', shade: '#4d2a20' },
  { name: 'Dark', base: '#54372b', light: '#795441', shade: '#2c1b17' },
];
export const GENDERS = ['Woman', 'Man', 'Person'];
const OUTFITS = [
  { base: '#618bc8', light: '#9dbbe4', shade: '#385f9f', lower: '#2e649d' },
  { base: '#d96f6d', light: '#f5a09d', shade: '#a74748', lower: '#8e6763' },
  { base: '#e1ab4d', light: '#f9cf77', shade: '#ae752a', lower: '#7e8c9c' },
  { base: '#9b80b8', light: '#c5a8db', shade: '#71518e', lower: '#658077' },
];
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function defs(people) {
  return `<defs>
    <radialGradient id="backdrop"><stop stop-color="#fffaf0"/><stop offset="1" stop-color="#ffe7cb"/></radialGradient>
    <filter id="shadow" x="-40%" y="-50%" width="180%" height="200%"><feGaussianBlur stdDeviation="13"/></filter>
    ${people.map((person, i) => {
      const t = TONES[person.tone], o = OUTFITS[i];
      return `<radialGradient id="skin${i}" cx="30%" cy="19%" r="85%"><stop stop-color="${t.light}"/><stop offset=".58" stop-color="${t.base}"/><stop offset="1" stop-color="${t.shade}"/></radialGradient>
      <linearGradient id="shirt${i}" x1=".12" y1="0" x2=".91" y2="1"><stop stop-color="${o.light}"/><stop offset=".43" stop-color="${o.base}"/><stop offset="1" stop-color="${o.shade}"/></linearGradient>
      <linearGradient id="hair${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${person.gender === 'Woman' ? '#76502d' : person.gender === 'Man' ? '#4c392b' : '#73533b'}"/><stop offset=".55" stop-color="${person.gender === 'Woman' ? '#56341d' : person.gender === 'Man' ? '#30251e' : '#513c2c'}"/><stop offset="1" stop-color="#261b17"/></linearGradient>`;
    }).join('')}
  </defs>`;
}
function hairBack(p, i) {
  if (p.gender === 'Woman') return `<path d="M-49-81 Q-51-132 0-133 Q53-132 48-82 L52 12 Q39 20 29 10 L22-84 Z" fill="url(#hair${i})" stroke="#39281f" stroke-width="2"/>`;
  if (p.gender === 'Person') return `<path d="M-49-77 Q-56-126-5-133 Q44-135 50-84 L44-30 Q26-13 15-36 L19-88Z" fill="url(#hair${i})" stroke="#39281f" stroke-width="2"/>`;
  return '';
}
function hairFront(p, i) {
  if (p.gender === 'Woman') return `<path d="M-45-89 Q-50-132 0-134 Q42-133 45-94 Q20-91 8-108 Q-7-85-46-78Z" fill="url(#hair${i})" stroke="#40291d" stroke-width="2"/><path d="M-35-100 Q-17-125 13-121" fill="none" stroke="#a2774d" stroke-width="5" stroke-linecap="round" opacity=".45"/>`;
  if (p.gender === 'Man') return `<path d="M-44-84 Q-55-117-21-129 Q-2-143 16-129 Q51-128 45-91 Q19-92 12-105 Q-4-89-25-96 Q-34-91-44-84Z" fill="url(#hair${i})" stroke="#32251e" stroke-width="2"/><path d="M-34-111 Q-13-129 12-122" fill="none" stroke="#967559" stroke-width="4" opacity=".35"/>`;
  return `<path d="M-46-85 Q-49-127 0-132 Q46-128 44-87 Q28-94 16-110 Q2-93-15-96 Q-26-88-46-85Z" fill="url(#hair${i})" stroke="#3f3027" stroke-width="2"/><path d="M-31-113 Q-7-129 15-117" fill="none" stroke="#a17e5f" stroke-width="4" opacity=".34"/>`;
}
function head(p, i) {
  return `<g>${hairBack(p, i)}
    <ellipse cx="-42" cy="-74" rx="9" ry="14" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.5"/>
    <ellipse cx="42" cy="-74" rx="9" ry="14" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.5"/>
    <path d="M-42-88 C-42-117-24-126 0-126 C29-126 42-109 42-83 L39-55 Q30-25 0-22 Q-31-25-40-54Z" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.6"/>
    <path d="M-25-76 Q-19-81-11-76 M11-76 Q19-81 25-76" fill="none" stroke="#503729" stroke-width="2.7" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="-17" cy="-68" rx="3.7" ry="4.9" fill="#362b26"/><ellipse cx="17" cy="-68" rx="3.7" ry="4.9" fill="#362b26"/>
    <circle cx="-18" cy="-70" r="1.2" fill="#fff"/><circle cx="16" cy="-70" r="1.2" fill="#fff"/>
    <path d="M0-61 Q-4-53 1-52" fill="none" stroke="${TONES[p.tone].shade}" stroke-width="2" stroke-linecap="round" opacity=".6"/>
    <path d="M-10-42 Q0-34 10-42" fill="none" stroke="#793c3b" stroke-width="2.8" stroke-linecap="round"/>
    <ellipse cx="-29" cy="-50" rx="8" ry="4" fill="#e47872" opacity=".16"/><ellipse cx="29" cy="-50" rx="8" ry="4" fill="#e47872" opacity=".16"/>
    ${hairFront(p, i)}</g>`;
}
function body(p, i) {
  const o = OUTFITS[i];
  const lower = p.gender === 'Woman'
    ? `<path d="M-34 80 L-46 154 Q0 165 46 154 L34 80Z" fill="${o.lower}" stroke="#3a4d65" stroke-width="1.5"/>`
    : `<path d="M-32 80 L-35 156 L-4 156 L0 105 L4 156 L35 156 L32 80Z" fill="${o.lower}" stroke="#59616b" stroke-width="1.5"/>`;
  return `<g>${lower}
    <path d="M-34 151 L-32 214 Q-31 225-24 225 L-10 225 Q-6 219-10 211 L-12 153 M12 153 L10 211 Q6 220 11 225 L26 225 Q32 224 33 214 L34 151" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="2"/>
    <ellipse cx="-20" cy="224" rx="19" ry="8" fill="#513e38"/><ellipse cx="20" cy="224" rx="19" ry="8" fill="#513e38"/>
    <path d="M-18-16 Q0-8 18-16 L36-15 Q48 12 39 81 Q0 90-39 81 Q-48 12-36-15Z" fill="url(#shirt${i})" stroke="${o.shade}" stroke-width="2.2"/>
    <path d="M-19-15 Q0 4 19-15" fill="none" stroke="${o.shade}" stroke-width="3"/>
    <path d="M-30 17 Q-29 51-34 77" fill="none" stroke="#fff" stroke-width="4" opacity=".16" stroke-linecap="round"/>
    <path d="M-35 80 Q0 87 35 80" fill="none" stroke="${o.shade}" stroke-width="3" opacity=".55"/></g>`;
}
function backArms(i, count) {
  if (count === 1) return '';
  const target = count === 2 ? 72 : count === 3 ? 62 : 52;
  const t = TONES[currentPeople[i].tone];
  return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-37 0 Q-64 14-70 42 Q-72 65-45 74 L${target} 79" stroke="${t.shade}" stroke-width="18" opacity=".28"/>
    <path d="M-37 0 Q-64 14-70 42 Q-72 65-45 74 L${target} 79" stroke="url(#skin${i})" stroke-width="15"/>
    <path d="M38 0 Q63 13 67 44 Q69 66 43 76 L-${target} 78" stroke="${t.shade}" stroke-width="18" opacity=".28"/>
    <path d="M38 0 Q63 13 67 44 Q69 66 43 76 L-${target} 78" stroke="url(#skin${i})" stroke-width="15"/>
  </g>`;
}
let currentPeople = [];
function frontArms(i, count) {
  const t = TONES[currentPeople[i].tone];
  if (count === 1) return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-38 5 Q-63 24-53 50 Q-39 70 18 45" stroke="${t.shade}" stroke-width="22" opacity=".35"/>
    <path d="M-38 5 Q-63 24-53 50 Q-39 70 18 45" stroke="url(#skin${i})" stroke-width="19"/>
    <path d="M38 5 Q61 22 54 50 Q40 71-22 45" stroke="${t.shade}" stroke-width="22" opacity=".35"/>
    <path d="M38 5 Q61 22 54 50 Q40 71-22 45" stroke="url(#skin${i})" stroke-width="19"/>
    <ellipse cx="19" cy="45" rx="10" ry="8" fill="url(#skin${i})"/><ellipse cx="-23" cy="45" rx="10" ry="8" fill="url(#skin${i})"/>
  </g>`;
  const left = i > 0, right = i < count - 1;
  const reach = count === 2 ? 77 : count === 3 ? 65 : 54;
  return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
  ${right ? `<path d="M36 3 Q58 8 64 34 Q75 58 ${reach} 63 L${reach + 31} 57" stroke="${t.shade}" stroke-width="22" opacity=".35"/><path d="M36 3 Q58 8 64 34 Q75 58 ${reach} 63 L${reach + 31} 57" stroke="url(#skin${i})" stroke-width="18"/><ellipse cx="${reach + 31}" cy="57" rx="12" ry="8" fill="url(#skin${i})"/>` : ''}
  ${left ? `<path d="M-36 3 Q-58 8-64 34 Q-75 58-${reach} 63 L-${reach + 31} 57" stroke="${t.shade}" stroke-width="22" opacity=".35"/><path d="M-36 3 Q-58 8-64 34 Q-75 58-${reach} 63 L-${reach + 31} 57" stroke="url(#skin${i})" stroke-width="18"/><ellipse cx="-${reach + 31}" cy="57" rx="12" ry="8" fill="url(#skin${i})"/>` : ''}
  </g>`;
}
export function createHugSvg(people, { transparent = false } = {}) {
  currentPeople = people;
  const count = people.length;
  const gap = count === 1 ? 0 : count === 2 ? 92 : count === 3 ? 88 : 82;
  const scale = count === 4 ? .88 : count === 3 ? .96 : 1.1;
  const start = 450 - gap * (count - 1) / 2;
  const transforms = people.map((_, i) => `translate(${start + gap * i} 248) scale(${scale})`);
  const label = count === 1 ? 'One person giving themselves a hug' : `${count} people hugging`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="560" viewBox="0 0 900 560" role="img" aria-label="${esc(label)}">
    <title>${esc(label)}</title>${defs(people)}
    ${transparent ? '' : '<rect width="900" height="560" rx="30" fill="url(#backdrop)"/>'}
    <ellipse cx="450" cy="510" rx="${count === 1 ? 100 : count === 2 ? 165 : count === 3 ? 205 : 235}" ry="17" fill="#896647" opacity=".16" filter="url(#shadow)"/>
    ${people.map((_, i) => `<g transform="${transforms[i]}">${backArms(i, count)}</g>`).join('')}
    ${people.map((p, i) => `<g transform="${transforms[i]}">${body(p, i)}</g>`).join('')}
    ${people.map((p, i) => `<g transform="${transforms[i]}">${head(p, i)}</g>`).join('')}
    ${people.map((_, i) => `<g transform="${transforms[i]}">${frontArms(i, count)}</g>`).join('')}
  </svg>`;
}
