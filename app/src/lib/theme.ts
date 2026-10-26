import { fitContrast, hexToRgb, hslToHex, mix, rgbToHsl } from './color';

export type MoodId = 'calme' | 'vif' | 'luxe' | 'tech' | 'naturel';

export interface Mood {
  label: string;
  desc: string;
  /** Multiplicateur de saturation du primaire. */
  sat: number;
  /** Teinte des neutres (fond, surfaces, texte). */
  tint: number;
  /** Décalage de teinte de l'accent par rapport au primaire. */
  off: number;
  /** Teinte d'accent fixe (ignore `off`), ex. doré pour le luxe. */
  fixed: number | null;
  accSat: number;
  radius: number;
  head: string;
  body: string;
}

export const MOODS: Record<MoodId, Mood> = {
  calme: {
    label: 'Calme',
    desc: 'Couleurs adoucies, accent voisin, formes rondes. Idéal pour le bien-être, l’éducation, les services.',
    sat: 0.7, tint: 1, off: 35, fixed: null, accSat: 0.85, radius: 14,
    head: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
  },
  vif: {
    label: 'Vif',
    desc: 'Saturation poussée et accent complémentaire. Pour les marques jeunes, l’événementiel, le divertissement.',
    sat: 1.2, tint: 1.3, off: 170, fixed: null, accSat: 1.1, radius: 10,
    head: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif",
  },
  luxe: {
    label: 'Luxe',
    desc: 'Neutres profonds, saturation retenue, accent doré et angles nets. Pour la mode, l’hôtellerie, l’artisanat haut de gamme.',
    sat: 0.45, tint: 0.5, off: 0, fixed: 40, accSat: 1.4, radius: 2,
    head: "'Fraunces', Georgia, serif", body: "'Inter', sans-serif",
  },
  tech: {
    label: 'Tech',
    desc: 'Contraste franc, accent froid, titres en monospace. Pour les SaaS, les outils de dev, les dashboards.',
    sat: 1, tint: 0.8, off: -150, fixed: null, accSat: 1, radius: 6,
    head: "'JetBrains Mono', monospace", body: "'Inter', sans-serif",
  },
  naturel: {
    label: 'Naturel',
    desc: 'Tons terreux, accent analogue, courbes généreuses. Pour l’alimentation, le jardin, la slow-fashion.',
    sat: 0.55, tint: 1.1, off: -45, fixed: null, accSat: 0.8, radius: 20,
    head: "'Fraunces', Georgia, serif", body: "'Inter', sans-serif",
  },
};

export const MOOD_IDS = Object.keys(MOODS) as MoodId[];

export interface ThemeInput {
  seed: string;
  mood: MoodId;
  /** Rotation de teinte, -180 à 180. */
  hue: number;
  /** Saturation en %, 0 à 150. */
  sat: number;
  /** Rayon de base en px. */
  radius: number;
}

export interface Theme {
  bg: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  onPrimary: string;
  accent: string;
  primarySoft: string;
  accentSoft: string;
  radius: string;
  radiusSm: string;
  radiusLg: string;
  head: string;
  body: string;
  dark: boolean;
}

export function buildTheme(input: ThemeInput, dark: boolean): Theme {
  const M = MOODS[input.mood];
  const [baseH, baseS, l] = rgbToHsl(...hexToRgb(input.seed));
  const h = baseH + input.hue;
  const s = Math.min(1, (baseS * M.sat * input.sat) / 100);
  const ns = Math.min(0.35, s * 0.35) * M.tint;
  const accH = M.fixed !== null ? M.fixed : h + M.off;
  const accS = Math.min(1, Math.max(0.3, s * M.accSat)) * Math.min(1, input.sat / 100 + 0.2);

  let bg: string, surface: string, border: string, text: string, muted: string;
  let primary: string, onPrimary: string, accent: string;

  if (!dark) {
    bg = hslToHex(h, ns * 0.6, 0.985);
    surface = hslToHex(h, ns * 0.7, 0.955);
    border = hslToHex(h, ns * 0.6, 0.875);
    text = hslToHex(h, ns * 0.9, 0.13);
    // Avec des neutres très teintés (ambiance Vif), L = 0,40 peut passer sous 4,5:1.
    muted = fitContrast(h, ns * 0.5, 0.4, bg, 4.6, -1)[0];
    // Primaire foncé + texte blanc, ou primaire clair + encre : on garde
    // la variante la plus proche de la couleur de départ.
    const inkOn = hslToHex(h, ns * 0.9, 0.12);
    const darker = fitContrast(h, s, Math.min(l, 0.55), '#FFFFFF', 4.6, -1);
    const lighter = fitContrast(h, s, Math.max(Math.min(l, 0.8), 0.5), inkOn, 4.6, 1);
    if (l > 0.58 && Math.abs(lighter[1] - l) < Math.abs(darker[1] - l)) {
      primary = lighter[0];
      onPrimary = inkOn;
    } else {
      primary = darker[0];
      onPrimary = '#FFFFFF';
    }
    accent = fitContrast(accH, accS, 0.52, bg, 3.1, -1)[0];
  } else {
    bg = hslToHex(h, ns * 0.8, 0.08);
    surface = hslToHex(h, ns * 0.8, 0.12);
    border = hslToHex(h, ns * 0.6, 0.23);
    text = hslToHex(h, ns * 0.4, 0.95);
    muted = fitContrast(h, ns * 0.4, 0.7, bg, 4.6, 1)[0];
    onPrimary = hslToHex(h, ns * 0.8, 0.08);
    primary = fitContrast(h, s, Math.max(l, 0.6), onPrimary, 4.6, 1)[0];
    accent = fitContrast(accH, accS, 0.62, bg, 3.1, 1)[0];
  }

  const r = input.radius;
  return {
    bg, surface, border, text, muted, primary, onPrimary, accent,
    primarySoft: mix(primary, bg, dark ? 0.22 : 0.12),
    accentSoft: mix(accent, bg, dark ? 0.26 : 0.18),
    radius: `${r}px`,
    radiusSm: `${Math.max(2, Math.round(r * 0.45))}px`,
    radiusLg: `${Math.round(r * 1.35)}px`,
    head: M.head,
    body: M.body,
    dark,
  };
}

/** Variables CSS appliquées au conteneur d'aperçu. */
export function themeVars(t: Theme): Record<string, string> {
  return {
    '--t-bg': t.bg,
    '--t-surface': t.surface,
    '--t-border': t.border,
    '--t-text': t.text,
    '--t-muted': t.muted,
    '--t-primary': t.primary,
    '--t-on-primary': t.onPrimary,
    '--t-accent': t.accent,
    '--t-primary-soft': t.primarySoft,
    '--t-accent-soft': t.accentSoft,
    '--t-radius': t.radius,
    '--t-radius-sm': t.radiusSm,
    '--t-radius-lg': t.radiusLg,
    '--t-head': t.head,
    '--t-body': t.body,
  };
}
