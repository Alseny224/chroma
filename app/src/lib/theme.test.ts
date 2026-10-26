import { describe, expect, it } from 'vitest';
import { contrastRatio, hexToRgb, hslToHex, rgbToHex, rgbToHsl } from './color';
import { exportTheme } from './export';
import { buildTheme, MOOD_IDS } from './theme';

describe('color', () => {
  it('fait l’aller-retour hex → rgb → hex', () => {
    expect(rgbToHex(...hexToRgb('#4F46E5'))).toBe('#4F46E5');
    expect(hexToRgb('#abc')).toEqual([170, 187, 204]);
  });

  it('fait l’aller-retour rgb → hsl → hex', () => {
    const [h, s, l] = rgbToHsl(...hexToRgb('#059669'));
    expect(hslToHex(h, s, l)).toBe('#059669');
  });

  it('calcule le contraste noir/blanc à 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });
});

describe('buildTheme', () => {
  const seeds = ['#4F46E5', '#C2410C', '#FDE047', '#FFFFFF', '#000000', '#22D3EE', '#808080'];

  for (const dark of [false, true]) {
    for (const mood of MOOD_IDS) {
      it(`tient les seuils WCAG — ${mood}, ${dark ? 'sombre' : 'clair'}`, () => {
        for (const seed of seeds) {
          const t = buildTheme({ seed, mood, hue: 0, sat: 100, radius: 12 }, dark);
          expect(contrastRatio(t.text, t.bg)).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(t.muted, t.bg)).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(t.onPrimary, t.primary)).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(t.accent, t.bg)).toBeGreaterThanOrEqual(3);
        }
      });
    }
  }

  it('dérive les rayons du réglage', () => {
    const t = buildTheme({ seed: '#4F46E5', mood: 'calme', hue: 0, sat: 100, radius: 20 }, false);
    expect([t.radius, t.radiusSm, t.radiusLg]).toEqual(['20px', '9px', '27px']);
  });
});

describe('exportTheme', () => {
  const input = {
    light: buildTheme({ seed: '#4F46E5', mood: 'calme', hue: 0, sat: 100, radius: 14 }, false),
    dark: buildTheme({ seed: '#4F46E5', mood: 'calme', hue: 0, sat: 100, radius: 14 }, true),
    seed: '#4F46E5',
    mood: 'calme' as const,
    radius: 14,
  };

  it('produit les deux modes en CSS', () => {
    const css = exportTheme('css', input);
    expect(css).toContain(':root {');
    expect(css).toContain('[data-theme="dark"] {');
    expect(css).toContain(`--color-primary: ${input.light.primary};`);
    expect(css).toContain('--radius: 14px;');
  });

  it('produit des tokens W3C valides', () => {
    const doc = JSON.parse(exportTheme('figma', input));
    expect(doc.chroma.dark.accent).toEqual({ $type: 'color', $value: input.dark.accent });
    expect(doc.chroma.radius.$value).toBe('14px');
  });
});
