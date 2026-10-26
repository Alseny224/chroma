import type { MoodId } from '../lib/theme';

export function generatorUrl(seed?: string, mood?: MoodId): string {
  const q = new URLSearchParams();
  if (seed) q.set('seed', seed);
  if (mood) q.set('mood', mood);
  const s = q.toString();
  return 'generateur.html' + (s ? `?${s}` : '');
}
