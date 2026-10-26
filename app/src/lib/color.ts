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

// --- OKLCH ----------------------------------------------------------------
// Espace perceptuel : à luminosité L égale, les teintes paraissent aussi claires.
// Sert à générer des nuances 50 → 950 régulières, quelle que soit la teinte.

const toLinear = (c: number) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

/** Renvoie [L 0–1, C (chroma), H en degrés]. */
export function hexToOklch(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const H = (Math.atan2(B, A) * 180) / Math.PI;
  return [L, Math.hypot(A, B), H < 0 ? H + 360 : H];
}

function oklchToLinearRgb(L: number, C: number, H: number): Rgb {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** Convertit en hex en réduisant le chroma si la couleur sort de l'espace sRGB. */
export function oklchToHex(L: number, C: number, H: number): string {
  const inGamut = (c: number) => oklchToLinearRgb(L, c, H).every((v) => v >= -1e-4 && v <= 1 + 1e-4);
  let c = Math.max(0, C);
  if (!inGamut(c)) {
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(mid)) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  const [r, g, b] = oklchToLinearRgb(L, c, H).map((v) => fromLinear(clamp(v, 0, 1)) * 255);
  return rgbToHex(r, g, b);
}

/** Notation CSS, ex. « oklch(55.2% 0.143 152.4) » (format attendu par shadcn/ui). */
export function toOklchCss(hex: string): string {
  const [L, C, H] = hexToOklch(hex);
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${C < 0.002 ? 0 : H.toFixed(1)})`;
}
