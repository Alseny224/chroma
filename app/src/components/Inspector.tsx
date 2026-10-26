import { contrastChecks } from '../lib/checks';
import type { Theme } from '../lib/theme';

const frNumber = (v: number | string) => String(v).replace('.', ',');

export function Inspector({ theme: t }: { theme: Theme }) {
  const roles = [
    { label: 'Arrière-plan', desc: 'Fond des pages', hex: t.bg },
    { label: 'Surface', desc: 'Cartes, panneaux', hex: t.surface },
    { label: 'Bordure', desc: 'Séparateurs, contours', hex: t.border },
    { label: 'Texte', desc: 'Titres et paragraphes', hex: t.text },
    { label: 'Texte secondaire', desc: 'Légendes, métadonnées', hex: t.muted },
    { label: 'Primaire', desc: 'Boutons, liens, actif', hex: t.primary },
    { label: 'Texte sur primaire', desc: 'Libellés des boutons', hex: t.onPrimary },
    { label: 'Accent', desc: 'Badges, graphiques, détails', hex: t.accent },
  ];

  const checks = contrastChecks(t);
  const passed = checks.filter((c) => c.pass).length;

  return (
    <section aria-label="Rôles et contrastes" className="column">
      <div className="card card--gap-14">
        <div className="card__head">
          <h2 className="card__title">Rôles des couleurs</h2>
          <span className="caption caption--12">{t.dark ? 'Mode sombre' : 'Mode clair'}</span>
        </div>
        <div className="roles">
          {roles.map((r) => (
            <div key={r.label} className="role">
              <span aria-hidden="true" className="role__swatch" style={{ background: r.hex }} />
              <span className="role__text">
                <span className="role__label">{r.label}</span>
                <span className="caption caption--12">{r.desc}</span>
              </span>
              <span className="role__hex">{r.hex}</span>
            </div>
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
