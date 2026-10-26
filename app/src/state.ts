import { useCallback, useState } from 'react';
import type { PreviewId, SourceId } from './data';
import { isHex6, normalizeHex } from './lib/color';
import type { ExportFormat } from './lib/export';
import { FONT_PAIRS, type FontPairId } from './lib/fonts';
import { DENSITIES, SCALE_RATIOS } from './lib/system';
import { MOODS, type DensityId, type MoodId, type ScaleId } from './lib/theme';

export interface ChromaState {
  seed: string;
  /** Contenu du champ hex, qui peut être temporairement invalide. */
  draft: string;
  mood: MoodId;
  hue: number;
  sat: number;
  radius: number;
  /** 'auto' : la paire de polices de l'ambiance. */
  fonts: FontPairId | 'auto';
  scale: ScaleId;
  density: DensityId;
  mode: 'light' | 'dark';
  source: SourceId;
  preview: PreviewId;
  exp: ExportFormat;
  logoStatus: string;
}

/** Réglages qu'une ambiance impose quand on la choisit (ou qu'on réinitialise). */
export function moodDefaults(mood: MoodId) {
  const M = MOODS[mood];
  return { radius: M.radius, scale: M.scale, density: M.density };
}

export function initialState(startColor = '#4F46E5'): ChromaState {
  const seed = startColor.toUpperCase();
  return {
    seed,
    draft: seed,
    mood: 'calme',
    hue: 0,
    sat: 100,
    ...moodDefaults('calme'),
    fonts: 'auto',
    mode: 'light',
    source: 'color',
    preview: 'landing',
    exp: 'css',
    logoStatus: '',
  };
}

// --- Lien partageable ----------------------------------------------------------
// L'URL contient le thème : ?seed=%23059669&mood=tech&hue=12&sat=80&radius=8&fonts=amical…
// Seuls les réglages qui diffèrent des valeurs par défaut de l'ambiance y figurent.

const int = (v: string | null, min: number, max: number) => {
  const n = v === null ? NaN : parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : undefined;
};

function fromUrl(): Partial<ChromaState> {
  const q = new URLSearchParams(window.location.search);
  const out: Partial<ChromaState> = {};
  const seed = q.get('seed');
  if (seed && isHex6(seed)) out.seed = out.draft = normalizeHex(seed);
  const mood = q.get('mood');
  if (mood && mood in MOODS) {
    out.mood = mood as MoodId;
    Object.assign(out, moodDefaults(mood as MoodId));
  }
  const hue = int(q.get('hue'), -180, 180);
  const sat = int(q.get('sat'), 0, 150);
  const radius = int(q.get('radius'), 0, 28);
  if (hue !== undefined) out.hue = hue;
  if (sat !== undefined) out.sat = sat;
  if (radius !== undefined) out.radius = radius;
  const fonts = q.get('fonts');
  if (fonts && fonts in FONT_PAIRS) out.fonts = fonts as FontPairId;
  const scale = q.get('scale');
  if (scale && scale in SCALE_RATIOS) out.scale = scale as ScaleId;
  const density = q.get('density');
  if (density && density in DENSITIES) out.density = density as DensityId;
  return out;
}

export function themeQuery(s: ChromaState): string {
  const d = moodDefaults(s.mood);
  const q = new URLSearchParams({ seed: s.seed, mood: s.mood });
  if (s.hue !== 0) q.set('hue', String(s.hue));
  if (s.sat !== 100) q.set('sat', String(s.sat));
  if (s.radius !== d.radius) q.set('radius', String(s.radius));
  if (s.fonts !== 'auto') q.set('fonts', s.fonts);
  if (s.scale !== d.scale) q.set('scale', s.scale);
  if (s.density !== d.density) q.set('density', s.density);
  return `?${q}`;
}

export type Patch = Partial<ChromaState>;

export function useChroma() {
  const [state, setState] = useState(() => ({ ...initialState(), ...fromUrl() }));
  const set = useCallback((patch: Patch) => setState((s) => ({ ...s, ...patch })), []);
  return [state, set] as const;
}
