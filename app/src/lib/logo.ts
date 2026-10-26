import { rgbToHex, rgbToHsl } from './color';

/**
 * Extrait la couleur dominante « vive » d'une image : les pixels sont
 * regroupés par tranches de teinte de 20°, pondérés par leur saturation ;
 * les pixels transparents, gris, trop sombres ou trop clairs sont ignorés.
 * Renvoie null si aucune couleur exploitable n'est trouvée.
 */
export function dominantColor(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas indisponible');
        ctx.drawImage(img, 0, 0, size, size);
        const d = ctx.getImageData(0, 0, size, size).data;

        const bins = new Map<number, { n: number; r: number; g: number; b: number }>();
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 128) continue;
          const [h, s, l] = rgbToHsl(d[i], d[i + 1], d[i + 2]);
          if (s < 0.2 || l < 0.12 || l > 0.92) continue;
          const k = Math.round(h / 20);
          const bin = bins.get(k) ?? { n: 0, r: 0, g: 0, b: 0 };
          bin.n += s;
          bin.r += d[i] * s;
          bin.g += d[i + 1] * s;
          bin.b += d[i + 2] * s;
          bins.set(k, bin);
        }

        let best: { n: number; r: number; g: number; b: number } | null = null;
        for (const bin of bins.values()) if (!best || bin.n > best.n) best = bin;
        resolve(best ? rgbToHex(best.r / best.n, best.g / best.n, best.b / best.n) : null);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('format'));
    };
    img.src = url;
  });
}
