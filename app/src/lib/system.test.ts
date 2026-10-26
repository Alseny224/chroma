import { describe, expect, it } from 'vitest';
import { contrastRatio, hexToOklch } from './color';
import { exportTheme, EXPORT_FORMATS } from './export';
import { FONT_PAIR_IDS } from './fonts';
import { buildSystem, PALETTES, STATES, STEPS, systemVars, type SystemInput } from './system';
import { MOOD_IDS, MOODS } from './theme';

const input = (over: Partial<SystemInput> = {}): SystemInput => ({
  seed: '#4F46E5',
  mood: 'calme',
  hue: 0,
  sat: 100,
  radius: 14,
  scale: 'equilibree',
  density: 'normale',
  ...over,
});

describe('nuances', () => {
  it('vont du plus clair au plus foncé, pour chaque palette', () => {
    const sys = buildSystem(input());
    for (const p of PALETTES) {
      const L = STEPS.map((s) => hexToOklch(sys.scales[p][s])[0]);
      for (let i = 1; i < L.length; i++) expect(L[i]).toBeLessThan(L[i - 1]);
    }
  });

  it('gardent la teinte du primaire', () => {
    const sys = buildSystem(input({ seed: '#059669' }));
    const hue = (hex: string) => hexToOklch(hex)[2];
    expect(Math.abs(hue(sys.scales.primary[600]) - hue(sys.light.primary))).toBeLessThan(6);
  });
});

describe('couleurs d’état', () => {
  const seeds = ['#4F46E5', '#C2410C', '#FDE047', '#22D3EE', '#808080', '#000000'];
  for (const mood of MOOD_IDS) {
    it(`sont lisibles — ${mood}`, () => {
      for (const seed of seeds) {
        const sys = buildSystem(input({ seed, mood }));
        for (const mode of ['light', 'dark'] as const) {
          const bg = sys[mode].bg;
          for (const id of STATES) {
            const c = sys.states[mode][id];
            expect(contrastRatio(c.base, c.soft), `${seed} ${mode} ${id} / soft`).toBeGreaterThanOrEqual(4.5);
            expect(contrastRatio(c.base, bg), `${seed} ${mode} ${id} / bg`).toBeGreaterThanOrEqual(4.5);
            expect(contrastRatio(c.on, c.base), `${seed} ${mode} on-${id}`).toBeGreaterThanOrEqual(4.5);
          }
        }
      }
    });
  }
});

describe('typographie et espacements', () => {
  it('suivent l’échelle et la densité', () => {
    const compact = buildSystem(input({ scale: 'compacte', density: 'compacte' }));
    const wide = buildSystem(input({ scale: 'expressive', density: 'aeree' }));
    expect(compact.text.base.size).toBe(1);
    expect(wide.text['4xl'].size).toBeGreaterThan(compact.text['4xl'].size);
    expect(wide.spaceUnit).toBeGreaterThan(compact.spaceUnit);
  });

  it('ne descend jamais sous 12 px, quelle que soit l’échelle', () => {
    for (const scale of ['compacte', 'equilibree', 'expressive'] as const) {
      const sys = buildSystem(input({ scale }));
      expect(sys.text.xs.size * 16).toBe(12);
      expect(sys.text.sm.size * 16).toBe(14);
    }
  });

  it('utilise la paire de polices de l’ambiance par défaut, ou celle choisie', () => {
    expect(buildSystem(input({ mood: 'luxe' })).fonts.heading).toContain('Fraunces');
    expect(buildSystem(input({ mood: 'luxe', fonts: 'amical' })).fonts.heading).toContain('Nunito');
    expect(FONT_PAIR_IDS).toContain(MOODS.tech.fonts);
  });
});

describe('exports', () => {
  const sys = buildSystem(input());

  it('chaque variable utilisée par components.css est définie par le thème', () => {
    const used = new Set(exportTheme('components', sys).match(/var\((--[\w-]+)\)/g)!.map((v) => v.slice(4, -1)));
    used.delete('--ui-tone');
    used.delete('--ui-tone-soft');
    const defined = systemVars(sys, 'light');
    for (const v of used) expect(defined, v).toHaveProperty(v);
  });

  it('le CSS contient les deux modes et tous les groupes', () => {
    const css = exportTheme('css', sys);
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"],\n.dark {');
    expect(css).toContain(`--color-primary: ${sys.light.primary};`);
    expect(css).toContain(`--color-primary-500: ${sys.scales.primary[500]};`);
    expect(css).toContain('--color-danger-soft:');
    expect(css).toContain('--text-4xl--line-height:');
    expect(css).toContain('--shadow-lg:');
    expect(css).toContain('@import url(');
  });

  it('Tailwind v4 déclare un @theme static et le variant dark', () => {
    const tw = exportTheme('tailwind4', sys);
    expect(tw).toContain('@import "tailwindcss";');
    expect(tw).toContain('@theme static {');
    expect(tw).toContain('@custom-variant dark');
    expect(tw).toContain(`--color-primary: ${sys.light.primary};`);
    expect(tw).toContain(`--color-primary: ${sys.dark.primary};`);
    expect(tw).toContain('--space-4: calc(var(--spacing) * 4);');
    expect(tw.indexOf('@import url(')).toBeLessThan(tw.indexOf('@import "tailwindcss"'));
  });

  it('shadcn/ui expose les variables attendues en oklch', () => {
    const css = exportTheme('shadcn', sys);
    for (const v of ['--background', '--foreground', '--primary', '--destructive', '--ring', '--chart-5', '--sidebar-ring'])
      expect(css).toMatch(new RegExp(`${v}: oklch\\(`));
    expect(css).toContain('.dark {');
    expect(css).toContain('--color-primary: var(--primary);');
  });

  it('les tokens Figma sont du JSON valide', () => {
    const doc = JSON.parse(exportTheme('figma', sys));
    expect(doc.chroma.dark.color.primary).toEqual({ $type: 'color', $value: sys.dark.primary });
    expect(doc.chroma.palette.danger['500'].$value).toBe(sys.scales.danger[500]);
    expect(doc.chroma.shadow ?? doc.chroma.light.shadow.md.$type).toBe('shadow');
  });

  it('React est marqué client et exporte les composants', () => {
    const tsx = exportTheme('react', sys);
    expect(tsx.startsWith("'use client';")).toBe(true);
    for (const c of ['Button', 'Field', 'Input', 'Select', 'Switch', 'Badge', 'Alert', 'Card', 'Tabs', 'Modal', 'Toast'])
      expect(tsx).toContain(`export ${c === 'Button' || c === 'Input' || c === 'Select' ? 'const' : 'function'} ${c}`);
  });

  it('chaque format a un nom de fichier', () => {
    for (const f of EXPORT_FORMATS) expect(exportTheme(f.id, sys).length).toBeGreaterThan(100);
  });
});
