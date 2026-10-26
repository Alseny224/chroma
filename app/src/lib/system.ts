import { contrastRatio, hexToOklch, hexToRgb, mix, oklchToHex } from './color';
import { FONT_PAIRS, type FontPair } from './fonts';
import { buildTheme, MOODS, type DensityId, type ScaleId, type Theme, type ThemeInput } from './theme';

// ==========================================================================
// Système de design complet : nuances, couleurs d'état, typographie,
// espacements, arrondis et ombres, dérivés du thème.
// ==========================================================================

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEPS)[number];
export type Scale = Record<Step, string>;

export const PALETTES = ['primary', 'accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const;
export type PaletteId = (typeof PALETTES)[number];

export const STATES = ['success', 'warning', 'danger', 'info'] as const;
export type StateId = (typeof STATES)[number];

export const STATE_LABELS: Record<StateId, string> = {
  success: 'Succès',
  warning: 'Attention',
  danger: 'Erreur',
  info: 'Info',
};

/** Couleur d'état pour un mode : `base` sert de texte et de fond plein. */
export interface StateColor {
  base: string;
  on: string;
  soft: string;
}

export const SCALE_RATIOS: Record<ScaleId, { label: string; ratio: number }> = {
  compacte: { label: 'Compacte', ratio: 1.2 },
  equilibree: { label: 'Équilibrée', ratio: 1.25 },
  expressive: { label: 'Expressive', ratio: 1.333 },
};

export const DENSITIES: Record<DensityId, { label: string; factor: number }> = {
  compacte: { label: 'Compacte', factor: 0.875 },
  normale: { label: 'Normale', factor: 1 },
  aeree: { label: 'Aérée', factor: 1.125 },
};

export const TEXT_STEPS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;
export type TextStep = (typeof TEXT_STEPS)[number];

export const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

export interface SystemInput extends ThemeInput {
  scale: ScaleId;
  density: DensityId;
}

export interface ShadowLayer {
  y: number;
  blur: number;
  spread: number;
  alpha: number;
}

export interface DesignSystem {
  input: SystemInput;
  light: Theme;
  dark: Theme;
  scales: Record<PaletteId, Scale>;
  states: { light: Record<StateId, StateColor>; dark: Record<StateId, StateColor> };
  fonts: FontPair;
  /** Taille en rem et interligne pour chaque niveau. */
  text: Record<TextStep, { size: number; lineHeight: number }>;
  /** Unité d'espacement en rem (1 = 0,25 rem en densité normale). */
  spaceUnit: number;
  radii: { sm: number; md: number; lg: number; xl: number };
  shadows: Record<'sm' | 'md' | 'lg' | 'xl', ShadowLayer[]>;
  /** Couleur des ombres : neutre teinté en clair, noir en sombre. */
  shadowColor: { light: string; dark: string };
}

// --- Nuances ---------------------------------------------------------------

// Luminosité OKLCH de chaque niveau et part du chroma maximal (calées sur Tailwind v4).
const LIGHTNESS = [0.975, 0.935, 0.885, 0.81, 0.71, 0.625, 0.55, 0.49, 0.425, 0.375, 0.28];
const CHROMA = [0.07, 0.15, 0.27, 0.45, 0.68, 0.88, 1, 0.97, 0.82, 0.62, 0.42];
const NEUTRAL_CHROMA = [0.35, 0.45, 0.55, 0.65, 0.8, 0.95, 1, 1, 0.95, 0.85, 0.75];

export function buildScale(hue: number, peakChroma: number, neutral = false): Scale {
  const curve = neutral ? NEUTRAL_CHROMA : CHROMA;
  return Object.fromEntries(
    STEPS.map((step, i) => [step, oklchToHex(LIGHTNESS[i], peakChroma * curve[i], hue)]),
  ) as Scale;
}

// Teintes OKLCH des couleurs d'état et chroma de base.
const STATE_HUES: Record<StateId, { hue: number; chroma: number }> = {
  success: { hue: 150, chroma: 0.17 },
  warning: { hue: 70, chroma: 0.16 },
  danger: { hue: 25, chroma: 0.21 },
  info: { hue: 245, chroma: 0.16 },
};

/** Rapproche légèrement une teinte d'état de celle du primaire (±8° max). */
function harmonize(stateHue: number, primaryHue: number): number {
  const delta = ((primaryHue - stateHue + 540) % 360) - 180;
  return stateHue + Math.max(-8, Math.min(8, delta * 0.1));
}

function pickState(scale: Scale, soft: string, bg: string, on: string, candidates: Step[]): string {
  const ok = (c: string) =>
    contrastRatio(c, soft) >= 4.5 && contrastRatio(c, bg) >= 4.5 && contrastRatio(on, c) >= 4.5;
  return scale[candidates.find((s) => ok(scale[s])) ?? candidates[candidates.length - 1]];
}

function stateColors(scales: Record<PaletteId, Scale>, t: Theme): Record<StateId, StateColor> {
  return Object.fromEntries(
    STATES.map((id) => {
      const scale = scales[id];
      if (!t.dark) {
        const soft = scale[50];
        return [id, { soft, on: '#FFFFFF', base: pickState(scale, soft, t.bg, '#FFFFFF', [600, 700, 800, 900]) }];
      }
      const soft = mix(scale[500], t.bg, 0.18);
      return [id, { soft, on: t.bg, base: pickState(scale, soft, t.bg, t.bg, [400, 300, 200, 100]) }];
    }),
  ) as Record<StateId, StateColor>;
}

// --- Système complet ------------------------------------------------------

export function buildSystem(input: SystemInput): DesignSystem {
  const M = MOODS[input.mood];
  const light = buildTheme(input, false);
  const dark = buildTheme(input, true);

  const [, pC, pH] = hexToOklch(light.primary);
  const [, aC, aH] = hexToOklch(light.accent);
  const satFactor = Math.max(0.55, Math.min(1.15, (M.sat * input.sat) / 100));

  const scales = {
    primary: buildScale(pH, Math.max(pC, 0.02) / 0.95),
    accent: buildScale(aH, Math.max(aC, 0.02) / 0.95),
    neutral: buildScale(pH, Math.min(0.035, pC * 0.12) * M.tint, true),
  } as Record<PaletteId, Scale>;
  for (const id of STATES) {
    const { hue, chroma } = STATE_HUES[id];
    scales[id] = buildScale(harmonize(hue, pH), chroma * satFactor);
  }

  const ratio = SCALE_RATIOS[input.scale].ratio;
  const text = Object.fromEntries(
    TEXT_STEPS.map((name, i) => {
      const step = i - 2; // xs = -2, base = 0
      // L'échelle ne s'applique qu'en montant : en dessous de base, une échelle
      // expressive donnerait 9–10 px, illisible. xs et sm restent à 12 et 14 px.
      const px = step < 0 ? [12, 14][step + 2] : 16 * Math.pow(ratio, step);
      return [
        name,
        {
          size: Math.round((px / 16) * 1000) / 1000,
          lineHeight: Math.round(Math.max(1.05, 1.55 - 0.08 * Math.max(step, 0)) * 100) / 100,
        },
      ];
    }),
  ) as DesignSystem['text'];

  const r = input.radius;
  const shadowBase = hexToRgb(scales.neutral[900]);

  return {
    input,
    light,
    dark,
    scales,
    states: { light: stateColors(scales, light), dark: stateColors(scales, dark) },
    fonts: FONT_PAIRS[input.fonts ?? M.fonts],
    text,
    spaceUnit: 0.25 * DENSITIES[input.density].factor,
    radii: { sm: Math.max(r ? 2 : 0, Math.round(r * 0.45)), md: r, lg: Math.round(r * 1.35), xl: Math.round(r * 1.8) },
    shadows: {
      sm: [{ y: 1, blur: 2, spread: 0, alpha: 0.06 }],
      md: [
        { y: 4, blur: 12, spread: -2, alpha: 0.1 },
        { y: 2, blur: 4, spread: -2, alpha: 0.06 },
      ],
      lg: [
        { y: 12, blur: 28, spread: -6, alpha: 0.14 },
        { y: 4, blur: 10, spread: -4, alpha: 0.08 },
      ],
      xl: [
        { y: 24, blur: 48, spread: -12, alpha: 0.22 },
        { y: 8, blur: 16, spread: -8, alpha: 0.1 },
      ],
    },
    shadowColor: { light: shadowBase.join(' '), dark: '0 0 0' },
  };
}

// --- Variables CSS ----------------------------------------------------------

export type Mode = 'light' | 'dark';
export type TokenGroup = { title: string; vars: [string, string][] };

const rem = (n: number) => `${+n.toFixed(4)}rem`;

export function shadowCss(layers: ShadowLayer[], rgb: string, mode: Mode): string {
  // En sombre, les ombres doivent être bien plus opaques pour rester visibles.
  const k = mode === 'dark' ? 3 : 1;
  return layers
    .map((l) => `0 ${l.y}px ${l.blur}px ${l.spread}px rgb(${rgb} / ${Math.min(0.8, l.alpha * k).toFixed(2)})`)
    .join(', ');
}

/** Variables qui changent entre clair et sombre. */
export function modeTokens(sys: DesignSystem, mode: Mode): TokenGroup[] {
  const t = mode === 'dark' ? sys.dark : sys.light;
  const states = sys.states[mode];
  return [
    {
      title: 'Couleurs — rôles',
      vars: [
        ['--color-bg', t.bg],
        ['--color-surface', t.surface],
        ['--color-border', t.border],
        ['--color-input', t.input],
        ['--color-text', t.text],
        ['--color-text-muted', t.muted],
        ['--color-primary', t.primary],
        ['--color-primary-hover', t.primaryHover],
        ['--color-primary-soft', t.primarySoft],
        ['--color-on-primary', t.onPrimary],
        ['--color-accent', t.accent],
        ['--color-accent-soft', t.accentSoft],
        ['--color-ring', t.primary],
      ],
    },
    {
      title: 'Couleurs — états',
      vars: STATES.flatMap((id): [string, string][] => [
        [`--color-${id}`, states[id].base],
        [`--color-on-${id}`, states[id].on],
        [`--color-${id}-soft`, states[id].soft],
      ]),
    },
    {
      title: 'Ombres',
      vars: (['sm', 'md', 'lg', 'xl'] as const).map((k): [string, string] => [
        `--shadow-${k}`,
        shadowCss(sys.shadows[k], sys.shadowColor[mode], mode),
      ]),
    },
  ];
}

/** Variables communes aux deux modes. */
export function baseTokens(sys: DesignSystem): TokenGroup[] {
  const r = sys.radii;
  return [
    {
      title: 'Nuances',
      vars: PALETTES.flatMap((p) => STEPS.map((s): [string, string] => [`--color-${p}-${s}`, sys.scales[p][s]])),
    },
    {
      title: 'Typographie',
      vars: [
        ['--font-heading', sys.fonts.heading],
        ['--font-body', sys.fonts.body],
        ['--font-mono', sys.fonts.mono],
        ['--font-weight-heading', String(sys.fonts.headingWeight)],
        ['--tracking-heading', sys.fonts.tracking],
        ...TEXT_STEPS.flatMap((k): [string, string][] => [
          [`--text-${k}`, rem(sys.text[k].size)],
          [`--text-${k}--line-height`, String(sys.text[k].lineHeight)],
        ]),
      ],
    },
    {
      title: 'Espacements',
      vars: SPACE_STEPS.map((n): [string, string] => [`--space-${n}`, rem(sys.spaceUnit * n)]),
    },
    {
      title: 'Arrondis',
      vars: [
        ['--radius', `${r.md}px`],
        ['--radius-sm', `${r.sm}px`],
        ['--radius-md', `${r.md}px`],
        ['--radius-lg', `${r.lg}px`],
        ['--radius-xl', `${r.xl}px`],
        ['--radius-full', '9999px'],
      ],
    },
  ];
}

/** Toutes les variables d'un mode, à poser sur un conteneur d'aperçu. */
export function systemVars(sys: DesignSystem, mode: Mode): Record<string, string> {
  return Object.fromEntries([...baseTokens(sys), ...modeTokens(sys, mode)].flatMap((g) => g.vars));
}
