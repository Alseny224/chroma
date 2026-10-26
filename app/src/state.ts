import { useCallback, useState } from 'react';
import type { PreviewId, SourceId } from './data';
import { isHex6, normalizeHex } from './lib/color';
import type { ExportFormat } from './lib/export';
import { MOODS, type MoodId } from './lib/theme';

export interface ChromaState {
  seed: string;
  /** Contenu du champ hex, qui peut être temporairement invalide. */
  draft: string;
  mood: MoodId;
  hue: number;
  sat: number;
  radius: number;
  mode: 'light' | 'dark';
  source: SourceId;
  preview: PreviewId;
  exp: ExportFormat;
  logoStatus: string;
}

export function initialState(startColor = '#4F46E5'): ChromaState {
  const seed = startColor.toUpperCase();
  return {
    seed,
    draft: seed,
    mood: 'calme',
    hue: 0,
    sat: 100,
    radius: MOODS.calme.radius,
    mode: 'light',
    source: 'color',
    preview: 'landing',
    exp: 'css',
    logoStatus: '',
  };
}

/** Thème de départ passé par la landing page : ?seed=%23059669&mood=tech */
function fromUrl(): Partial<ChromaState> {
  const q = new URLSearchParams(window.location.search);
  const out: Partial<ChromaState> = {};
  const seed = q.get('seed');
  if (seed && isHex6(seed)) out.seed = out.draft = normalizeHex(seed);
  const mood = q.get('mood');
  if (mood && mood in MOODS) {
    out.mood = mood as MoodId;
    out.radius = MOODS[mood as MoodId].radius;
  }
  return out;
}

export type Patch = Partial<ChromaState>;

export function useChroma() {
  const [state, setState] = useState(() => ({ ...initialState(), ...fromUrl() }));
  const set = useCallback((patch: Patch) => setState((s) => ({ ...s, ...patch })), []);
  return [state, set] as const;
}
