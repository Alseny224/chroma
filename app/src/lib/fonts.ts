export type FontPairId = 'moderne' | 'editorial' | 'technique' | 'elegant' | 'amical' | 'geometrique';

export interface FontPair {
  label: string;
  /** Piles CSS complètes. */
  heading: string;
  body: string;
  mono: string;
  headingWeight: number;
  /** Interlettrage des titres, en em. */
  tracking: string;
  /** Familles Google Fonts à charger (paramètre `family=`). */
  google: string[];
}

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const MONO_GOOGLE = 'JetBrains+Mono:wght@400;500;600';

export const FONT_PAIRS: Record<FontPairId, FontPair> = {
  moderne: {
    label: 'Moderne — Space Grotesk + Inter',
    heading: "'Space Grotesk', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: MONO, headingWeight: 700, tracking: '-0.02em',
    google: ['Space+Grotesk:wght@500;600;700', 'Inter:wght@400;500;600;700', MONO_GOOGLE],
  },
  editorial: {
    label: 'Éditorial — Fraunces + Inter',
    heading: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: MONO, headingWeight: 600, tracking: '-0.01em',
    google: ['Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700', 'Inter:wght@400;500;600;700', MONO_GOOGLE],
  },
  technique: {
    label: 'Technique — JetBrains Mono + Inter',
    heading: MONO,
    body: "'Inter', system-ui, sans-serif",
    mono: MONO, headingWeight: 700, tracking: '-0.03em',
    google: ['JetBrains+Mono:wght@400;500;600;700', 'Inter:wght@400;500;600;700'],
  },
  elegant: {
    label: 'Élégant — Playfair Display + Source Sans 3',
    heading: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
    mono: MONO, headingWeight: 600, tracking: '-0.01em',
    google: ['Playfair+Display:wght@500;600;700', 'Source+Sans+3:wght@400;500;600;700', MONO_GOOGLE],
  },
  amical: {
    label: 'Amical — Nunito',
    heading: "'Nunito', system-ui, sans-serif",
    body: "'Nunito', system-ui, sans-serif",
    mono: MONO, headingWeight: 800, tracking: '-0.01em',
    google: ['Nunito:wght@400;500;600;700;800', MONO_GOOGLE],
  },
  geometrique: {
    label: 'Géométrique — Outfit + DM Sans',
    heading: "'Outfit', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    mono: MONO, headingWeight: 600, tracking: '-0.02em',
    google: ['Outfit:wght@500;600;700', 'DM+Sans:wght@400;500;600;700', MONO_GOOGLE],
  },
};

export const FONT_PAIR_IDS = Object.keys(FONT_PAIRS) as FontPairId[];

export function googleFontsUrl(pair: FontPair): string {
  return `https://fonts.googleapis.com/css2?${pair.google.map((f) => `family=${f}`).join('&')}&display=swap`;
}

/** Ajoute la feuille Google Fonts de la paire si elle n'est pas déjà chargée. */
export function ensureFontsLoaded(id: FontPairId) {
  const key = `chroma-fonts-${id}`;
  if (document.getElementById(key)) return;
  const link = document.createElement('link');
  link.id = key;
  link.rel = 'stylesheet';
  link.href = googleFontsUrl(FONT_PAIRS[id]);
  document.head.appendChild(link);
}
