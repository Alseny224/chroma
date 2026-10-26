import { contrastRatio } from './color';
import type { Theme } from './theme';

export interface ContrastCheck {
  name: string;
  fg: string;
  bg: string;
  min: number;
  ratio: number;
  pass: boolean;
  grade: string;
}

/** Les paires de couleurs vérifiées par Chroma, avec leur seuil WCAG. */
export function contrastChecks(t: Theme): ContrastCheck[] {
  return [
    { name: 'Texte / arrière-plan', fg: t.text, bg: t.bg, min: 4.5 },
    { name: 'Texte secondaire / fond', fg: t.muted, bg: t.bg, min: 4.5 },
    { name: 'Texte / surface', fg: t.text, bg: t.surface, min: 4.5 },
    { name: 'Bouton primaire', fg: t.onPrimary, bg: t.primary, min: 4.5 },
    { name: 'Accent (graphique) / fond', fg: t.accent, bg: t.bg, min: 3 },
  ].map((c) => {
    const ratio = contrastRatio(c.fg, c.bg);
    const pass = ratio >= c.min;
    const grade = !pass ? 'Échec' : ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'AA graph.';
    return { ...c, ratio, pass, grade };
  });
}
