import { MOODS, type MoodId, type Theme } from './theme';

export type ExportFormat = 'css' | 'tailwind' | 'figma';

export const EXPORT_FORMATS: { id: ExportFormat; label: string; file: string }[] = [
  { id: 'css', label: 'Variables CSS', file: 'theme.css' },
  { id: 'tailwind', label: 'Tailwind', file: 'tailwind.config.js' },
  { id: 'figma', label: 'Tokens Figma', file: 'chroma.tokens.json — format W3C Design Tokens' },
];

interface ExportInput {
  light: Theme;
  dark: Theme;
  seed: string;
  mood: MoodId;
  radius: number;
}

const pairs = (t: Theme): [string, string][] => [
  ['bg', t.bg],
  ['surface', t.surface],
  ['border', t.border],
  ['text', t.text],
  ['text-muted', t.muted],
  ['primary', t.primary],
  ['on-primary', t.onPrimary],
  ['accent', t.accent],
];

const cssVars = (t: Theme) => pairs(t).map(([k, v]) => `  --color-${k}: ${v};`).join('\n');

function toCss({ light, dark, seed, mood, radius }: ExportInput): string {
  return (
    `/* Chroma — ambiance « ${MOODS[mood].label} », base ${seed} */\n` +
    `:root {\n${cssVars(light)}\n  --radius: ${radius}px;\n}\n\n` +
    `[data-theme="dark"] {\n${cssVars(dark)}\n}\n`
  );
}

const TAILWIND = `/** tailwind.config.js — à combiner avec l’export CSS (variables) */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        foreground: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-on-primary)',
        },
        accent: 'var(--color-accent)',
      },
      borderRadius: {
        theme: 'var(--radius)',
      },
    },
  },
};
`;

function toFigma({ light, dark, radius }: ExportInput): string {
  const tokens = (t: Theme) =>
    Object.fromEntries(pairs(t).map(([k, v]) => [k, { $type: 'color', $value: v }]));
  const doc = {
    chroma: {
      light: tokens(light),
      dark: tokens(dark),
      radius: { $type: 'dimension', $value: `${radius}px` },
    },
  };
  return JSON.stringify(doc, null, 2) + '\n';
}

export function exportTheme(format: ExportFormat, input: ExportInput): string {
  switch (format) {
    case 'css':
      return toCss(input);
    case 'tailwind':
      return TAILWIND;
    case 'figma':
      return toFigma(input);
  }
}
