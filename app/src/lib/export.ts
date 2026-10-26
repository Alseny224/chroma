import baseCss from '../kit/base.css?raw';
import componentsCss from '../kit/components.css?raw';
import uiSource from '../kit/ui.tsx?raw';
import { toOklchCss } from './color';
import { googleFontsUrl } from './fonts';
import {
  baseTokens,
  modeTokens,
  PALETTES,
  shadowCss,
  SPACE_STEPS,
  STATES,
  STEPS,
  TEXT_STEPS,
  type DesignSystem,
  type Mode,
  type TokenGroup,
} from './system';
import { MOODS } from './theme';

export type ExportFormat = 'css' | 'tailwind4' | 'tailwind3' | 'shadcn' | 'figma' | 'components' | 'react';

export interface ExportFormatInfo {
  id: ExportFormat;
  label: string;
  file: string;
  /** Où mettre le fichier. */
  hint: string;
  group: 'theme' | 'components';
}

export const EXPORT_FORMATS: ExportFormatInfo[] = [
  { id: 'css', label: 'CSS', file: 'theme.css', group: 'theme', hint: 'Variables CSS — tout projet, HTML/CSS compris.' },
  { id: 'tailwind4', label: 'Tailwind v4', file: 'globals.css', group: 'theme', hint: 'Remplace ton globals.css : toutes les classes Tailwind suivent le thème.' },
  { id: 'tailwind3', label: 'Tailwind v3', file: 'tailwind.config.js', group: 'theme', hint: 'À combiner avec theme.css (variables).' },
  { id: 'shadcn', label: 'shadcn/ui', file: 'app/globals.css', group: 'theme', hint: 'Remplace le globals.css créé par « npx shadcn init » (Next.js).' },
  { id: 'figma', label: 'Figma', file: 'chroma.tokens.json', group: 'theme', hint: 'Format W3C Design Tokens (Tokens Studio, variables Figma).' },
  { id: 'components', label: 'CSS', file: 'components.css', group: 'components', hint: 'Styles de base + classes ui-* ; à charger après le thème.' },
  { id: 'react', label: 'React', file: 'components/ui.tsx', group: 'components', hint: 'Composants typés (React, Next.js) ; nécessitent components.css.' },
];

function header(sys: DesignSystem, title: string): string {
  const { mood, seed } = sys.input;
  return `/* Chroma — ${title}\n   Ambiance « ${MOODS[mood].label} », base ${seed}, polices ${sys.fonts.label.split(' — ')[1]} */\n`;
}

const fontImport = (sys: DesignSystem) => `@import url('${googleFontsUrl(sys.fonts)}');\n`;

function block(selector: string, groups: TokenGroup[], indent = '  '): string {
  const body = groups
    .map((g) => `${indent}/* ${g.title} */\n` + g.vars.map(([k, v]) => `${indent}${k}: ${v};`).join('\n'))
    .join('\n\n');
  return `${selector} {\n${body}\n}\n`;
}

const DARK_SELECTOR = '[data-theme="dark"],\n.dark';

// --- CSS ---------------------------------------------------------------------

function toCss(sys: DesignSystem): string {
  return (
    header(sys, 'variables du thème') +
    fontImport(sys) +
    '\n' +
    block(':root', [...modeTokens(sys, 'light'), ...baseTokens(sys)]) +
    '\n' +
    block(DARK_SELECTOR, modeTokens(sys, 'dark'))
  );
}

// --- Tailwind v4 -------------------------------------------------------------

function toTailwind4(sys: DesignSystem): string {
  // Les noms --color-* sont ceux de theme.css : components.css fonctionne tel quel.
  // Les valeurs claires vont dans @theme, le mode sombre les surcharge à l'exécution.
  const themeGroups = [...modeTokens(sys, 'light'), ...baseTokens(sys)].map((g) => ({
    ...g,
    vars: g.vars.filter(([k]) => !k.startsWith('--space-') && k !== '--radius'),
  }));
  themeGroups.push({
    title: 'Polices et espacements Tailwind',
    vars: [
      ['--font-sans', sys.fonts.body],
      ['--spacing', `${+sys.spaceUnit.toFixed(4)}rem`],
    ],
  });

  const aliases: [string, string][] = [
    ['--color-background', 'var(--color-bg)'],
    ['--color-foreground', 'var(--color-text)'],
    ['--color-muted', 'var(--color-text-muted)'],
    ['--color-primary-foreground', 'var(--color-on-primary)'],
    ...STATES.map((s): [string, string] => [`--color-${s}-foreground`, `var(--color-on-${s})`]),
  ];

  return (
    header(sys, 'thème Tailwind CSS v4') +
    fontImport(sys) +
    '@import "tailwindcss";\n\n' +
    '/* dark: s\'active avec la classe .dark ou data-theme="dark" (compatible next-themes). */\n' +
    '@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));\n\n' +
    '/* static : émet toutes les variables, même celles qu\'aucune classe n\'utilise (components.css en dépend). */\n' +
    block('@theme static', themeGroups) +
    '\n/* Alias pratiques : bg-background, text-foreground, text-muted… */\n' +
    `@theme inline {\n${aliases.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n\n` +
    '@layer base {\n' +
    indent(block(DARK_SELECTOR, modeTokens(sys, 'dark')), '  ') +
    '\n  /* Espacements nommés, utilisés par components.css */\n' +
    `  :root {\n${SPACE_STEPS.map((n) => `    --space-${n}: calc(var(--spacing) * ${n});`).join('\n')}\n  }\n` +
    indent(baseCss.replace(/\/\*[\s\S]*?\*\/\n*/, ''), '  ') +
    '}\n'
  );
}

const indent = (s: string, pad: string) =>
  s
    .trim()
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n') + '\n';

// --- Tailwind v3 -------------------------------------------------------------

function toTailwind3(sys: DesignSystem): string {
  const roles = ['bg', 'surface', 'border', 'input', 'text', 'text-muted', 'primary', 'primary-hover', 'primary-soft', 'on-primary', 'accent', 'accent-soft', 'ring'];
  const v = (name: string) => `'var(--color-${name})'`;
  const colorLines = [
    ...roles.map((r) => `        '${r}': ${v(r)},`),
    ...STATES.flatMap((s) => [`        '${s}': ${v(s)},`, `        'on-${s}': ${v('on-' + s)},`, `        '${s}-soft': ${v(s + '-soft')},`]),
    ...PALETTES.map(
      (p) => `        '${p}-scale': {\n${STEPS.map((s) => `          ${s}: '${sys.scales[p][s]}',`).join('\n')}\n        },`,
    ),
  ];
  return (
    `/** tailwind.config.js — Chroma (Tailwind v3), à combiner avec theme.css.\n` +
    ` *  Nuances : bg-primary-scale-100, text-danger-scale-700…  Mode sombre : classe .dark ou data-theme="dark". */\n` +
    `module.exports = {\n` +
    `  darkMode: ['variant', ['&:where(.dark, .dark *)', '&:where([data-theme="dark"], [data-theme="dark"] *)']],\n` +
    `  theme: {\n    extend: {\n` +
    `      colors: {\n${colorLines.join('\n')}\n      },\n` +
    `      fontFamily: {\n` +
    `        heading: 'var(--font-heading)',\n        sans: 'var(--font-body)',\n        mono: 'var(--font-mono)',\n      },\n` +
    `      fontSize: {\n${TEXT_STEPS.map((k) => `        '${k}': ['var(--text-${k})', { lineHeight: 'var(--text-${k}--line-height)' }],`).join('\n')}\n      },\n` +
    `      borderRadius: {\n        sm: 'var(--radius-sm)',\n        DEFAULT: 'var(--radius-md)',\n        md: 'var(--radius-md)',\n        lg: 'var(--radius-lg)',\n        xl: 'var(--radius-xl)',\n      },\n` +
    `      boxShadow: {\n${['sm', 'md', 'lg', 'xl'].map((k) => `        ${k}: 'var(--shadow-${k})',`).join('\n')}\n      },\n` +
    `    },\n  },\n};\n`
  );
}

// --- shadcn/ui ---------------------------------------------------------------

function shadcnVars(sys: DesignSystem, mode: Mode): [string, string][] {
  const t = mode === 'dark' ? sys.dark : sys.light;
  const st = sys.states[mode];
  const n = sys.scales.neutral;
  const o = toOklchCss;
  return [
    ['--background', o(t.bg)],
    ['--foreground', o(t.text)],
    ['--card', o(t.surface)],
    ['--card-foreground', o(t.text)],
    ['--popover', o(t.bg)],
    ['--popover-foreground', o(t.text)],
    ['--primary', o(t.primary)],
    ['--primary-foreground', o(t.onPrimary)],
    ['--secondary', o(mode === 'dark' ? n[800] : n[100])],
    ['--secondary-foreground', o(t.text)],
    ['--muted', o(t.surface)],
    ['--muted-foreground', o(t.muted)],
    // Dans shadcn, « accent » est le fond de survol (menus, boutons ghost).
    ['--accent', o(t.primarySoft)],
    ['--accent-foreground', o(t.text)],
    ['--destructive', o(st.danger.base)],
    ['--destructive-foreground', o(st.danger.on)],
    ['--border', o(t.border)],
    ['--input', o(t.input)],
    ['--ring', o(t.primary)],
    ['--chart-1', o(t.primary)],
    ['--chart-2', o(t.accent)],
    ['--chart-3', o(st.success.base)],
    ['--chart-4', o(st.info.base)],
    ['--chart-5', o(st.warning.base)],
    ['--sidebar', o(t.surface)],
    ['--sidebar-foreground', o(t.text)],
    ['--sidebar-primary', o(t.primary)],
    ['--sidebar-primary-foreground', o(t.onPrimary)],
    ['--sidebar-accent', o(t.primarySoft)],
    ['--sidebar-accent-foreground', o(t.text)],
    ['--sidebar-border', o(t.border)],
    ['--sidebar-ring', o(t.primary)],
    // Ajouts Chroma : accent de marque et couleurs d'état.
    ['--brand-accent', o(t.accent)],
    ...STATES.filter((s) => s !== 'danger').flatMap((s): [string, string][] => [
      [`--${s}`, o(st[s].base)],
      [`--${s}-foreground`, o(st[s].on)],
    ]),
    // Ombres propres à chaque mode : en sombre, elles doivent être bien plus opaques.
    ...(['sm', 'md', 'lg', 'xl'] as const).map((k): [string, string] => [
      `--chroma-shadow-${k}`,
      shadowCss(sys.shadows[k], sys.shadowColor[mode], mode),
    ]),
  ];
}

function toShadcn(sys: DesignSystem): string {
  const lines = (vars: [string, string][]) => vars.map(([k, v]) => `  ${k}: ${v};`).join('\n');
  const mapped = shadcnVars(sys, 'light')
    .map(([k]) => k)
    .filter((k) => !k.startsWith('--chroma-shadow-'))
    .map((k) => `  --color-${k.slice(2)}: var(${k});`);
  return (
    header(sys, 'thème shadcn/ui (Tailwind v4)') +
    `/* Polices : avec next/font, expose-les en --font-heading et --font-body ;\n   sinon l'import Google Fonts ci-dessous suffit. */\n` +
    fontImport(sys) +
    '@import "tailwindcss";\n@import "tw-animate-css";\n\n' +
    '@custom-variant dark (&:is(.dark *));\n\n' +
    `:root {\n  --radius: ${+(sys.radii.md / 16).toFixed(4)}rem;\n${lines(shadcnVars(sys, 'light'))}\n}\n\n` +
    `.dark {\n${lines(shadcnVars(sys, 'dark'))}\n}\n\n` +
    '@theme inline {\n' +
    `  --font-sans: var(--font-body, ${sys.fonts.body});\n` +
    `  --font-heading: var(--font-heading, ${sys.fonts.heading});\n` +
    `  --font-mono: ${sys.fonts.mono};\n` +
    '  --radius-sm: calc(var(--radius) * 0.6);\n  --radius-md: calc(var(--radius) * 0.8);\n  --radius-lg: var(--radius);\n  --radius-xl: calc(var(--radius) * 1.4);\n' +
    (['sm', 'md', 'lg', 'xl'] as const)
      .map((k) => `  --shadow-${k}: var(--chroma-shadow-${k});`)
      .join('\n') +
    '\n' +
    mapped.join('\n') +
    '\n}\n\n' +
    '@layer base {\n  * {\n    @apply border-border outline-ring/50;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n' +
    `  h1, h2, h3, h4 {\n    font-family: var(--font-heading);\n    letter-spacing: ${sys.fonts.tracking};\n  }\n}\n`
  );
}

// --- Figma (W3C Design Tokens) ---------------------------------------------

function toFigma(sys: DesignSystem): string {
  const color = (v: string) => ({ $type: 'color', $value: v });
  const modeGroup = (mode: Mode) =>
    Object.fromEntries(
      modeTokens(sys, mode)
        .filter((g) => !g.title.startsWith('Ombres'))
        .flatMap((g) => g.vars)
        .map(([k, v]) => [k.replace('--color-', ''), color(v)]),
    );
  const shadow = (mode: Mode) =>
    Object.fromEntries(
      (['sm', 'md', 'lg', 'xl'] as const).map((k) => [
        k,
        {
          $type: 'shadow',
          $value: sys.shadows[k].map((l) => ({
            color: `rgb(${sys.shadowColor[mode]} / ${Math.min(0.8, l.alpha * (mode === 'dark' ? 3 : 1)).toFixed(2)})`,
            offsetX: '0px',
            offsetY: `${l.y}px`,
            blur: `${l.blur}px`,
            spread: `${l.spread}px`,
          })),
        },
      ]),
    );
  const doc = {
    chroma: {
      light: { color: modeGroup('light'), shadow: shadow('light') },
      dark: { color: modeGroup('dark'), shadow: shadow('dark') },
      palette: Object.fromEntries(
        PALETTES.map((p) => [p, Object.fromEntries(STEPS.map((s) => [s, color(sys.scales[p][s])]))]),
      ),
      font: {
        heading: { $type: 'fontFamily', $value: sys.fonts.heading },
        body: { $type: 'fontFamily', $value: sys.fonts.body },
        mono: { $type: 'fontFamily', $value: sys.fonts.mono },
        'heading-weight': { $type: 'fontWeight', $value: sys.fonts.headingWeight },
      },
      'font-size': Object.fromEntries(
        TEXT_STEPS.map((k) => [k, { $type: 'dimension', $value: `${Math.round(sys.text[k].size * 16)}px` }]),
      ),
      'line-height': Object.fromEntries(TEXT_STEPS.map((k) => [k, { $type: 'number', $value: sys.text[k].lineHeight }])),
      space: Object.fromEntries(
        SPACE_STEPS.map((n) => [n, { $type: 'dimension', $value: `${+(sys.spaceUnit * n * 16).toFixed(2)}px` }]),
      ),
      radius: Object.fromEntries(
        Object.entries(sys.radii).map(([k, v]) => [k, { $type: 'dimension', $value: `${v}px` }]),
      ),
    },
  };
  return JSON.stringify(doc, null, 2) + '\n';
}

// --- Composants --------------------------------------------------------------

function toComponents(sys: DesignSystem): string {
  return header(sys, 'styles de base et composants (classes ui-*)') + '\n' + baseCss + '\n' + componentsCss;
}

function toReact(): string {
  return (
    "'use client';\n\n" +
    '// Utilisation : importe theme.css (ou globals.css) puis components.css une fois dans ton app.\n' +
    uiSource
  );
}

export function exportTheme(format: ExportFormat, sys: DesignSystem): string {
  switch (format) {
    case 'css':
      return toCss(sys);
    case 'tailwind4':
      return toTailwind4(sys);
    case 'tailwind3':
      return toTailwind3(sys);
    case 'shadcn':
      return toShadcn(sys);
    case 'figma':
      return toFigma(sys);
    case 'components':
      return toComponents(sys);
    case 'react':
      return toReact();
  }
}
