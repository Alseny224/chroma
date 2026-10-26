import { describe, expect, it } from 'vitest';
import { contrastRatio, hexToRgb, hslToHex, rgbToHex, rgbToHsl } from './color';
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
          expect(contrastRatio(t.input, t.bg)).toBeGreaterThanOrEqual(3);
          expect(contrastRatio(t.onPrimary, t.primaryHover)).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }

  it('dérive les rayons du réglage', () => {
    const t = buildTheme({ seed: '#4F46E5', mood: 'calme', hue: 0, sat: 100, radius: 20 }, false);
    expect([t.radius, t.radiusSm, t.radiusLg]).toEqual(['20px', '9px', '27px']);
  });
});
