import { contrastRatio } from './color';
import { STATE_LABELS, STATES, type StateColor, type StateId } from './system';
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
export function contrastChecks(t: Theme, states?: Record<StateId, StateColor>): ContrastCheck[] {
  const stateChecks = states
    ? STATES.map((id) => ({ name: `${STATE_LABELS[id]} / fond doux`, fg: states[id].base, bg: states[id].soft, min: 4.5 }))
    : [];
  return [
    { name: 'Texte / arrière-plan', fg: t.text, bg: t.bg, min: 4.5 },
    { name: 'Texte secondaire / fond', fg: t.muted, bg: t.bg, min: 4.5 },
    { name: 'Texte / surface', fg: t.text, bg: t.surface, min: 4.5 },
    { name: 'Bouton primaire', fg: t.onPrimary, bg: t.primary, min: 4.5 },
    { name: 'Accent (graphique) / fond', fg: t.accent, bg: t.bg, min: 3 },
    { name: 'Bordure de champ / fond', fg: t.input, bg: t.bg, min: 3 },
    ...stateChecks,
  ].map((c) => {
    const ratio = contrastRatio(c.fg, c.bg);
    const pass = ratio >= c.min;
    const grade = !pass ? 'Échec' : ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'AA graph.';
    return { ...c, ratio, pass, grade };
  });
}
