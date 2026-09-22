export const TONES = [
  { name: 'Classic yellow', base: '#f9cc49', light: '#ffe583', shade: '#c88e22' },
  { name: 'Light', base: '#f4d6ba', light: '#ffead8', shade: '#be8e72' },
  { name: 'Medium-light', base: '#dbac82', light: '#f3cfaa', shade: '#9f684c' },
  { name: 'Medium', base: '#b87852', light: '#d99c73', shade: '#78462f' },
  { name: 'Medium-dark', base: '#855139', light: '#ad7658', shade: '#4d2a20' },
  { name: 'Dark', base: '#54372b', light: '#795441', shade: '#2c1b17' },
];
export const GENDERS = ['Woman', 'Man', 'Person'];
export const ILLUSTRATION_VERSION = 3;
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
    ${people.map((person, i) => {
      const t = TONES[person.tone], o = OUTFITS[i];
      return `<radialGradient id="skin${i}" cx="30%" cy="19%" r="85%"><stop stop-color="${t.light}"/><stop offset=".58" stop-color="${t.base}"/><stop offset="1" stop-color="${t.shade}"/></radialGradient>
      <linearGradient id="shirt${i}" x1=".12" y1="0" x2=".91" y2="1"><stop stop-color="${o.light}"/><stop offset=".43" stop-color="${o.base}"/><stop offset="1" stop-color="${o.shade}"/></linearGradient>
      <linearGradient id="hair${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${person.gender === 'Woman' ? '#76502d' : person.gender === 'Man' ? '#4c392b' : '#73533b'}"/><stop offset=".55" stop-color="${person.gender === 'Woman' ? '#56341d' : person.gender === 'Man' ? '#30251e' : '#513c2c'}"/><stop offset="1" stop-color="#261b17"/></linearGradient>`;
    }).join('')}
  </defs>`;
}
function hairBack(p, i) {
  if (p.gender === 'Woman') return `<path d="M-48-80 C-53-124-25-137 0-135 C34-138 53-113 49-78 L44-36 Q40-23 27-25 L23-55 L-24-55 L-28-25 Q-42-22-45-37Z" fill="url(#hair${i})" stroke="#39281f" stroke-width="2"/>`;
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
// Pose coordinates are shared by the browser, exports, and server previews.
// Far arms are occluded by the embrace. Only hands with a visible wrist are
// exposed; showing every limb would make a close group hug anatomically wrong.
const PAIR_ARMS = [
  { person: 1, path: 'M29-4 C20-16 7-12 0 0 L-21 18 C-28 24-37 21-51 11 L-61 25 C-35 47-17 44-4 34 L35 11 Q40 1 29-4Z', hand: [-59, 19, 40] },
  { person: 0, path: 'M-67 0 C-78-3-85 7-78 23 C-63 50-38 79-16 87 C1 95 25 79 43 69 L61 57 L52 40 C24 55 4 66-7 64 C-19 60-44 23-54 8 Q-61 0-67 0Z', hand: [59, 47, -25] },
];
const SCENES = {
  1: {
    scale: 1.7, y: 307,
    people: [{ x: 0, y: 13, turn: 0, headX: 0, headY: 13, tilt: 7 }],
    arms: [
      { person: 0, path: 'M-42 13 C-54 11-61 23-56 41 L-44 73 C-38 85-23 83-12 76 L33 43 L24 25 L-25 57 L-30 32 C-30 22-30 14-42 13Z', hand: [29, 33, -40] },
      { person: 0, path: 'M40 15 C54 15 62 28 57 47 L47 86 C44 100 28 102 16 94 L-36 58 L-26 41 L28 76 L31 43 C33 25 28 18 40 15Z', hand: [-31, 49, -145] },
    ],
  },
  2: {
    scale: 1.6, y: 310,
    people: [
      { x: -42, y: 3, turn: 8, headX: -42, headY: 3, tilt: 12 },
      { x: 42, y: 12, turn: -8, headX: 40, headY: 12, tilt: -12 },
    ],
    arms: PAIR_ARMS,
  },
  3: {
    scale: 1.43, y: 292,
    people: [
      { x: -69, y: 0, turn: 12, headX: -76, headY: 0, tilt: 10 },
      { x: 0, y: 40, turn: 0, headX: 0, headY: 40, tilt: 0 },
      { x: 69, y: 4, turn: -12, headX: 76, headY: 4, tilt: -10 },
    ],
    headOrder: [0, 2, 1],
    bodyOrder: [0, 2, 1],
    arms: [
      { person: 0, path: 'M-92-2 C-106-7-116 3-110 21 C-97 49-82 82-64 100 C-51 113-32 112-16 106 L32 89 L25 69 L-24 86 Q-40 92-48 83 C-65 64-80 25-81 10 Q-83 1-92-2Z', hand: [31, 77, -20] },
      { person: 2, path: 'M93 1 C108-4 118 7 111 25 L88 77 Q80 95 63 93 C39 90 7 75-30 64 L-24 45 L64 69 L78 15 Q82 4 93 1Z', hand: [-29, 54, -160] },
    ],
  },
  4: {
    scale: 1.17, y: 236,
    people: [
      { x: -52, y: -6, turn: 11, headX: -59, headY: -6, tilt: 8 },
      { x: 52, y: -8, turn: -11, headX: 59, headY: -8, tilt: -8 },
      { x: -42, y: 109, turn: 8, headX: -42, headY: 109, tilt: 12 },
      { x: 42, y: 118, turn: -8, headX: 40, headY: 118, tilt: -12 },
    ],
    arms: [
      { person: 0, path: 'M-75-8 C-91-10-101 2-103 19 L-116 86 Q-119 104-106 117 L-69 144 L-57 128 L-91 99 Q-98 94-94 81 L-81 22 Q-67 3-75-8Z', hand: [-61, 136, 22] },
      { person: 1, path: 'M77-10 C92-13 104 0 105 20 L118 84 Q121 103 105 115 L65 139 L55 121 L91 97 Q99 92 95 79 L82 20 Q66 0 77-10Z', hand: [58, 130, 155] },
      ...PAIR_ARMS.map(arm => ({ ...arm, person: arm.person + 2, y: 106 })),
    ],
  },
};

function torso(p, i) {
  const o = OUTFITS[i];
  return `<g>
    <path d="M-12-39 L-13-13 Q0-3 13-13 L12-39Z" fill="url(#skin${i})"/>
    <path d="M-19-22 Q-8-12 12-23 C35-18 45 8 43 42 L39 106 Q4 125-38 109 L-43 49 C-48 12-42-13-19-22Z" fill="url(#shirt${i})" stroke="${o.shade}" stroke-width="1.5"/>
    <path d="M-14-22 Q-1-8 15-23" fill="none" stroke="${o.light}" stroke-width="3"/>
    <path d="M-32 9 Q-39 53-29 96" fill="none" stroke="#fff" opacity=".14" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}
function arm(p, i, path) {
  return `<path d="${path}" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.2"/>`;
}
function hand(p, i, [x, y, angle]) {
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <path d="M-12-6 Q-10-11-4-10 L3-8 L11-4 Q15-2 13 1 Q12 3 9 2 L4 0 L12 4 Q15 6 12 9 Q10 10 7 8 L2 5 L9 10 Q11 12 8 14 Q6 15 3 12 L-3 8 L2 12 Q3 14 0 14 L-8 8 Q-15 4-12-6Z" fill="url(#skin${i})" stroke="${TONES[p.tone].shade}" stroke-width="1.1"/>
    <path d="M-8-6 Q-4-13 0-10 L5-5" fill="none" stroke="${TONES[p.tone].shade}" opacity=".5" stroke-width="1"/>
  </g>`;
}
export function createHugSvg(people, { transparent = false } = {}) {
  const count = people.length;
  const scene = SCENES[count];
  const order = people.map((_, i) => i);
  const headTransform = pose => `translate(${pose.headX} ${pose.headY}) rotate(${pose.tilt} 0 -35) scale(.94 1)`;
  const label = count === 1 ? 'One person giving themselves a hug' : `${count} people hugging`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560" role="img" aria-label="${esc(label)}">
    <title>${esc(label)}</title>${defs(people)}
    ${transparent ? '' : '<rect width="900" height="560" rx="30" fill="url(#backdrop)"/>'}
    <g transform="translate(450 ${scene.y}) scale(${scene.scale})">
      ${(scene.bodyOrder || order).map(i => `<g transform="${headTransform(scene.people[i])}">${hairBack(people[i], i)}</g>`).join('')}
      ${(scene.bodyOrder || order).map(i => {
        const pose = scene.people[i];
        return `<g transform="translate(${pose.x} ${pose.y}) skewX(${pose.turn}) scale(.83 1)">${torso(people[i], i)}</g>`;
      }).join('')}
      ${scene.arms.map(limb => `<g transform="translate(0 ${limb.y || 0})">${arm(people[limb.person], limb.person, limb.path)}</g>`).join('')}
      ${scene.arms.map(limb => `<g transform="translate(0 ${limb.y || 0})">${hand(people[limb.person], limb.person, limb.hand)}</g>`).join('')}
      ${(scene.headOrder || order).map(i => `<g transform="${headTransform(scene.people[i])}">${head(people[i], i)}</g>`).join('')}
    </g>
  </svg>`;
}
