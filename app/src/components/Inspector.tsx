import { useEffect, useRef, useState } from 'react';
import { contrastChecks } from '../lib/checks';
import { STATE_LABELS, STATES, type DesignSystem, type Mode } from '../lib/system';

const frNumber = (v: number | string) => String(v).replace('.', ',');

export function Inspector({ sys, mode }: { sys: DesignSystem; mode: Mode }) {
  const t = mode === 'dark' ? sys.dark : sys.light;
  const states = sys.states[mode];
  const roles = [
    { label: 'Arrière-plan', desc: 'Fond des pages', hex: t.bg },
    { label: 'Surface', desc: 'Cartes, panneaux', hex: t.surface },
    { label: 'Bordure', desc: 'Séparateurs, contours', hex: t.border },
    { label: 'Bordure de champ', desc: 'Formulaires (3:1 min.)', hex: t.input },
    { label: 'Texte', desc: 'Titres et paragraphes', hex: t.text },
    { label: 'Texte secondaire', desc: 'Légendes, métadonnées', hex: t.muted },
    { label: 'Primaire', desc: 'Boutons, liens, actif', hex: t.primary },
    { label: 'Texte sur primaire', desc: 'Libellés des boutons', hex: t.onPrimary },
    { label: 'Accent', desc: 'Badges, graphiques, détails', hex: t.accent },
  ];

  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async (label: string, hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Presse-papiers indisponible.
    }
    setCopied(label);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1400);
  };

  const checks = contrastChecks(t, states);
  const passed = checks.filter((c) => c.pass).length;

  return (
    <section aria-label="Rôles et contrastes" className="column column--inspector">
      <div className="card card--gap-14">
        <div className="card__head">
          <h2 className="card__title">Rôles des couleurs</h2>
          <span className="caption caption--12">{t.dark ? 'Mode sombre' : 'Mode clair'}</span>
        </div>
        <div className="roles">
          {roles.map((r) => (
            <button
              key={r.label}
              type="button"
              className="role"
              aria-label={`${r.label} : ${r.hex}, copier`}
              onClick={() => copy(r.label, r.hex)}
            >
              <span aria-hidden="true" className="role__swatch" style={{ background: r.hex }} />
              <span className="role__text">
                <span className="role__label">{r.label}</span>
                <span className="caption caption--12">{r.desc}</span>
              </span>
              <span className="role__hex">{copied === r.label ? 'Copié' : r.hex}</span>
            </button>
          ))}
        </div>
        <div className="state-chips" aria-label="Couleurs d'état">
          {STATES.map((id) => (
            <span key={id} className="state-chip" style={{ background: states[id].soft, color: states[id].base }}>
              <span aria-hidden="true" className="state-chip__dot" style={{ background: states[id].base }} />
              {STATE_LABELS[id]}
            </span>
          ))}
        </div>
      </div>

      <div className="card card--gap-14">
        <div className="card__head">
          <h2 className="card__title">Contrastes WCAG</h2>
          <span className="caption caption--12">
            {passed}/{checks.length} conformes
          </span>
        </div>
        <div className="checks">
          {checks.map((c) => (
            <div key={c.name} className="check">
              <span aria-hidden="true" className="check__sample" style={{ background: c.bg, color: c.fg }}>
                Aa
              </span>
              <span className="check__text">
                <span className="check__name">{c.name}</span>
                <span className="check__ratio">
                  {frNumber(c.ratio.toFixed(2))}:1 · min. {frNumber(c.min)}:1
                </span>
              </span>
              <span className={'grade' + (c.pass ? ' grade--pass' : ' grade--fail')}>{c.grade}</span>
            </div>
          ))}
        </div>
        <p className="footnote">
          Chroma ajuste la luminosité du primaire et de l'accent pour tenir ces seuils, quelle que soit la couleur de
          départ.
        </p>
      </div>
    </section>
  );
}
