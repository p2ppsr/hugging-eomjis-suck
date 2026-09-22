import { GENDERS, TONES } from './illustration.js';

export const defaults = [
  { gender: 'Woman', tone: 0 },
  { gender: 'Man', tone: 2 },
  { gender: 'Person', tone: 4 },
  { gender: 'Woman', tone: 1 },
];

export function parseHug(search) {
  const params = new URLSearchParams(search);
  const count = Number(params.get('n'));
  const length = Number.isInteger(count) && count >= 1 && count <= 4 ? count : 2;
  return Array.from({ length }, (_, index) => {
    const code = params.get(`p${index + 1}`);
    const genderIndex = code && /^[0-2][0-5]$/.test(code) ? Number(code[0]) : -1;
    return genderIndex < 0 ? { ...defaults[index] } : { gender: GENDERS[genderIndex], tone: Number(code[1]) };
  });
}

export function hugQuery(people) {
  const query = new URLSearchParams({ n: String(people.length) });
  people.forEach((person, index) => query.set(`p${index + 1}`, `${GENDERS.indexOf(person.gender)}${person.tone}`));
  return query.toString();
}

export function hugDescription(people) {
  const persons = people.map((person, index) => `${index + 1}: ${TONES[person.tone].name.toLowerCase()} ${person.gender.toLowerCase()}`).join('; ');
  return people.length === 1
    ? `A self hug starring you (${persons}). Make your own hug with any skin tone and presentation.`
    : `A ${people.length}-person hug (${persons}). Make your own and send it to someone who needs one.`;
}
