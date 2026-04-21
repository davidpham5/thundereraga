/**
 * Utility: anonymous handle generator
 *
 * Produces handles like "Portland-Engineer-42". Deterministic when seeded
 * with a stable device/user id; random otherwise.
 */

const CITIES = [
  'Austin', 'Boulder', 'Brooklyn', 'Chicago', 'Denver', 'Madison',
  'Oakland', 'Portland', 'Raleigh', 'Seattle', 'Tacoma', 'Richmond',
];

const ROLES = [
  'Engineer', 'Designer', 'Manager', 'Analyst', 'Researcher',
  'Writer', 'Recruiter', 'Operator', 'Scientist', 'Producer',
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

export function generateHandle(seed?: string): string {
  const r = seed
    ? [hash(seed + ':c'), hash(seed + ':r'), hash(seed + ':n')]
    : [Math.random() * 1e9, Math.random() * 1e9, Math.random() * 1e9].map(Math.floor);
  const city = CITIES[r[0] % CITIES.length];
  const role = ROLES[r[1] % ROLES.length];
  const num = (r[2] % 98) + 2;
  return `${city}-${role}-${num}`;
}
