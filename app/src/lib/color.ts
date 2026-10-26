// Conversions de couleurs et calculs de contraste WCAG.

export type Rgb = [number, number, number];
export type Hsl = [number, number, number];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function hexToRgb(hex: string): Rgb {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/** Renvoie [teinte en degrés, saturation 0–1, luminosité 0–1]. */
export function rgbToHsl(r: number, g: number, b: number): Hsl {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  let h = 0;
  let s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 1);
  l = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Luminance relative WCAG 2.x. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const A = luminance(a);
  const B = luminance(b);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
}

/**
 * Décale la luminosité par pas de 1 % (dir = -1 assombrit, +1 éclaircit)
 * jusqu'à atteindre le contraste `target` contre `against`.
 * Renvoie la couleur obtenue et la luminosité finale.
 */
export function fitContrast(
  h: number,
  s: number,
  l: number,
  against: string,
  target: number,
  dir: 1 | -1,
): [string, number] {
  let hex = hslToHex(h, s, l);
  for (let i = 0; contrastRatio(hex, against) < target && i < 100; i++) {
    l += dir * 0.01;
    if (l < 0 || l > 1) break;
    hex = hslToHex(h, s, l);
  }
  return [hex, l];
}

/** Mélange linéaire en RGB : t = part de `a`. */
export function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A[0] * t + B[0] * (1 - t), A[1] * t + B[1] * (1 - t), A[2] * t + B[2] * (1 - t));
}

export function isHex6(v: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(v);
}

export function normalizeHex(v: string): string {
  return ('#' + v.trim().replace('#', '')).toUpperCase();
}
