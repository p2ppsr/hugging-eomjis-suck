export const TONES = [
  { name: 'Classic yellow', base: '#f9cc49', light: '#ffe583', shade: '#c88e22' },
  { name: 'Light', base: '#f4d6ba', light: '#ffead8', shade: '#be8e72' },
  { name: 'Medium-light', base: '#dbac82', light: '#f3cfaa', shade: '#9f684c' },
  { name: 'Medium', base: '#b87852', light: '#d99c73', shade: '#78462f' },
  { name: 'Medium-dark', base: '#855139', light: '#ad7658', shade: '#4d2a20' },
  { name: 'Dark', base: '#54372b', light: '#795441', shade: '#2c1b17' },
];
export const GENDERS = ['Woman', 'Man', 'Person'];
export const ILLUSTRATION_VERSION = 2;
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
  const features = p.tone >= 4 ? '#211510' : '#362b26';
  return `<g>
    <ellipse cx="-42" cy="-74" rx="9" ry="14" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.5"/>
    <ellipse cx="42" cy="-74" rx="9" ry="14" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.5"/>
    <path d="M-42-88 C-42-117-24-126 0-126 C29-126 42-109 42-83 L39-55 Q30-25 0-22 Q-31-25-40-54Z" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.6"/>
    <path d="M-25-76 Q-19-81-11-76 M11-76 Q19-81 25-76" fill="none" stroke="#503729" stroke-width="2.7" stroke-linecap="round" opacity=".7"/>
    <path d="M-24-65 Q-18-73-11-66 M11-66 Q18-73 24-65" fill="none" stroke="${features}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M0-61 Q-4-53 1-52" fill="none" stroke="${TONES[p.tone].shade}" stroke-width="2" stroke-linecap="round" opacity=".6"/>
    <path d="M-10-42 Q0-34 10-42" fill="none" stroke="${p.tone >= 4 ? features : '#793c3b'}" stroke-width="2.8" stroke-linecap="round"/>
    <ellipse cx="-29" cy="-50" rx="8" ry="4" fill="#e47872" opacity=".16"/><ellipse cx="29" cy="-50" rx="8" ry="4" fill="#e47872" opacity=".16"/>
    ${hairFront(p, i)}</g>`;
}
function lowerBody(p, i) {
  const o = OUTFITS[i];
  const lower = p.gender === 'Woman'
    ? `<path d="M-34 80 L-46 154 Q0 165 46 154 L34 80Z" fill="${o.lower}" stroke="#3a4d65" stroke-width="1.5"/>`
    : `<path d="M-32 80 L-35 156 L-4 156 L0 105 L4 156 L35 156 L32 80Z" fill="${o.lower}" stroke="#59616b" stroke-width="1.5"/>`;
  return `<g>${lower}
    <path d="M-34 151 L-32 214 Q-31 225-24 225 L-10 225 Q-6 219-10 211 L-12 153 M12 153 L10 211 Q6 220 11 225 L26 225 Q32 224 33 214 L34 151" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="2"/>
    <ellipse cx="-20" cy="224" rx="19" ry="8" fill="#513e38"/><ellipse cx="20" cy="224" rx="19" ry="8" fill="#513e38"/></g>`;
}
function torso(p, i) {
  const o = OUTFITS[i];
  return `<g>
    <path d="M-13-32 L-13-12 Q0 0 13-12 L13-32Z" fill="url(#skin${i})"/>
    <path d="M-18-16 Q0-8 18-16 L36-15 Q48 12 39 81 Q0 90-39 81 Q-48 12-36-15Z" fill="url(#shirt${i})" stroke="${o.shade}" stroke-width="2.2"/>
    <path d="M-19-15 Q0 4 19-15" fill="none" stroke="${o.shade}" stroke-width="3"/>
    <path d="M-30 17 Q-29 51-34 77" fill="none" stroke="#fff" stroke-width="4" opacity=".16" stroke-linecap="round"/>
    <path d="M-35 80 Q0 87 35 80" fill="none" stroke="${o.shade}" stroke-width="3" opacity=".55"/></g>`;
}
// Arms use the same shoulder transform as the torso. Each person has exactly
// two: the outside figures hold a neighbour in front and behind; the middle
// figures put one arm around each neighbour's shoulders.
function joint(pose, x, y) {
  const angle = pose.lean * Math.PI / 180;
  return [pose.x + x * Math.cos(angle) - (y - 80) * Math.sin(angle),
    80 + x * Math.sin(angle) + (y - 80) * Math.cos(angle)];
}
const xy = point => point.map(value => Number(value.toFixed(2))).join(' ');
function arm(p, i, path) {
  return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${path}" stroke="${TONES[p.tone].shade}" stroke-width="21" opacity=".35"/>
    <path d="${path}" stroke="url(#skin${i})" stroke-width="18"/>
  </g>`;
}
function hand(p, i, position, angle) {
  return `<g transform="translate(${xy(position)}) rotate(${angle})">
    <path d="M-10-5 Q-6-9-1-7 L7-5 Q12-3 10 2 Q9 6 4 7 L-5 6 Q-10 4-10-1Z" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1"/>
    <path d="M3-3 L7-1 M2 1 L6 3" fill="none" stroke="${TONES[p.tone].shade}" stroke-width="1" stroke-linecap="round" opacity=".5"/>
  </g>`;
}
function hugArms(people, poses) {
  const back = [], front = [], shoulderHands = [];
  const count = people.length;
  people.forEach((p, i) => {
    const pose = poses[i];
    if (count === 1) {
      // Offset the two forearms so the wrists stay legible at emoji size.
      [-1, 1].forEach(side => {
        const start = joint(pose, side * 36, 4);
        const elbow = joint(pose, side * 27, side < 0 ? 58 : 71);
        const wrist = joint(pose, -side * 31, side < 0 ? 18 : 33);
        const bend = joint(pose, side * 46, 41);
        const path = `M${xy(start)} Q${xy(bend)} ${xy(elbow)} Q${xy(joint(pose, -side * 3, 49))} ${xy(wrist)}`;
        front.push(arm(p, i, path) + hand(p, i, wrist, side < 0 ? -35 : -145));
      });
      return;
    }
    [-1, 1].forEach(side => {
      const neighbour = poses[i + side];
      const start = joint(pose, side * 36, 3);
      if (neighbour) {
        const wrist = joint(neighbour, side * 40, 5);
        const bend = [(start[0] + wrist[0]) / 2, Math.min(start[1], wrist[1]) - 26];
        back.push(arm(p, i, `M${xy(start)} Q${xy(bend)} ${xy(wrist)}`));
        shoulderHands.push(hand(p, i, wrist, side > 0 ? 70 : 110));
      } else {
        const partner = poses[i - side];
        const elbow = joint(pose, side * 5, side < 0 ? 55 : 70);
        const bend = joint(pose, side * 27, 37);
        const wrist = joint(partner, side * 33, side < 0 ? 27 : 48);
        const path = `M${xy(start)} Q${xy(bend)} ${xy(elbow)} Q${xy([(elbow[0] + wrist[0]) / 2, elbow[1] + 2])} ${xy(wrist)}`;
        const angle = Math.atan2(wrist[1] - elbow[1], wrist[0] - elbow[0]) * 180 / Math.PI;
        front.push(arm(p, i, path) + hand(p, i, wrist, angle));
      }
    });
  });
  return { back: back.join(''), front: front.join(''), shoulderHands: shoulderHands.join('') };
}
export function createHugSvg(people, { transparent = false } = {}) {
  const count = people.length;
  const gap = count === 4 ? 100 : 96;
  const scale = count === 4 ? .88 : count === 3 ? .96 : 1.1;
  const poses = people.map((_, i) => ({
    x: (i - (count - 1) / 2) * gap,
    lean: count === 1 ? 0 : 3 * (1 - 2 * i / (count - 1)),
  }));
  const upper = pose => `translate(${pose.x} 0) rotate(${pose.lean} 0 80)`;
  const arms = hugArms(people, poses);
  const label = count === 1 ? 'One person giving themselves a hug' : `${count} people hugging`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="560" viewBox="0 0 900 560" role="img" aria-label="${esc(label)}">
    <title>${esc(label)}</title>${defs(people)}
    ${transparent ? '' : '<rect width="900" height="560" rx="30" fill="url(#backdrop)"/>'}
    <ellipse cx="450" cy="503" rx="${(gap * (count - 1) / 2 + 48) * scale}" ry="12" fill="#896647" opacity=".18" filter="url(#shadow)"/>
    <g transform="translate(450 ${500 - 232 * scale}) scale(${scale})">
      ${arms.back}
      ${people.map((p, i) => `<g transform="translate(${poses[i].x} 0)">${lowerBody(p, i)}</g>`).join('')}
      ${people.map((p, i) => `<g transform="${upper(poses[i])}">${hairBack(p, i)}${torso(p, i)}</g>`).join('')}
      ${arms.front}${arms.shoulderHands}
      ${people.map((p, i) => `<g transform="${upper(poses[i])}"><g transform="rotate(${count === 1 ? 5 : poses[i].lean} 0 -40)">${head(p, i)}</g></g>`).join('')}
    </g>
  </svg>`;
}
