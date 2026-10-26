import { contrastRatio } from '../../lib/color';
import {
  PALETTES,
  SPACE_STEPS,
  STATE_LABELS,
  STATES,
  STEPS,
  TEXT_STEPS,
  type DesignSystem,
  type Mode,
  type PaletteId,
} from '../../lib/system';

const PALETTE_LABELS: Record<PaletteId, string> = {
  primary: 'Primaire',
  accent: 'Accent',
  neutral: 'Neutre',
  success: 'Succès',
  warning: 'Attention',
  danger: 'Erreur',
  info: 'Info',
};

/** Planche du système : tout ce qui est exporté, visualisé. */
export function SystemSheet({ sys, mode }: { sys: DesignSystem; mode: Mode }) {
  const states = sys.states[mode];

  return (
    <div className="kit">
      <section className="kit-section">
        <h3 className="kit-section__title">Nuances</h3>
        <div className="scales">
          {PALETTES.map((p) => (
            <div key={p} className="scale">
              <span className="scale__name">{PALETTE_LABELS[p]}</span>
              <div className="scale__steps">
                {STEPS.map((s) => {
                  const hex = sys.scales[p][s];
                  // Texte lisible sur la pastille : blanc ou encre selon le contraste.
                  const ink = contrastRatio(hex, '#FFFFFF') >= 4.5 ? '#FFFFFF' : '#111318';
                  return (
                    <span key={s} className="scale__step" style={{ background: hex, color: ink }} title={`${p}-${s} · ${hex}`}>
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-section">
        <h3 className="kit-section__title">Couleurs d’état</h3>
        <div className="states">
          {STATES.map((id) => (
            <div key={id} className="state" style={{ background: states[id].soft }}>
              <span className="state__dot" style={{ background: states[id].base }} />
              <span className="state__label" style={{ color: states[id].base }}>
                {STATE_LABELS[id]}
              </span>
              <span className="state__hex">{states[id].base}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-section">
        <h3 className="kit-section__title">
          Typographie <span className="kit-muted">· {sys.fonts.label}</span>
        </h3>
        <div className="type-scale">
          {[...TEXT_STEPS].reverse().map((k) => {
            const heading = ['5xl', '4xl', '3xl', '2xl', 'xl'].includes(k);
            return (
              <div key={k} className="type-row">
                <span className="type-row__meta">
                  text-{k}
                  <br />
                  {Math.round(sys.text[k].size * 16)} px / {sys.text[k].lineHeight}
                </span>
                <span
                  className="type-row__sample"
                  style={{
                    fontSize: `var(--text-${k})`,
                    lineHeight: `var(--text-${k}--line-height)`,
                    fontFamily: heading ? 'var(--font-heading)' : 'var(--font-body)',
                    fontWeight: heading ? 'var(--font-weight-heading)' : 400,
                    letterSpacing: heading ? 'var(--tracking-heading)' : undefined,
                  }}
                >
                  {heading ? 'Des interfaces qui ont du caractère' : 'Un texte lisible, confortable et cohérent sur tout le site.'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="kit-grid kit-grid--wide">
        <section className="kit-section">
          <h3 className="kit-section__title">Espacements</h3>
          <div className="spaces">
            {SPACE_STEPS.map((n) => (
              <div key={n} className="space">
                <span className="space__name">space-{n}</span>
                <span className="space__bar" style={{ width: `var(--space-${n})` }} />
                <span className="space__px">{+(sys.spaceUnit * n * 16).toFixed(1)} px</span>
              </div>
            ))}
          </div>
        </section>

        <section className="kit-section">
          <h3 className="kit-section__title">Arrondis et ombres</h3>
          <div className="tiles">
            {(['sm', 'md', 'lg', 'xl'] as const).map((k) => (
              <div key={k} className="tile" style={{ borderRadius: `var(--radius-${k})`, boxShadow: `var(--shadow-${k})` }}>
                <span>{k}</span>
                <span className="kit-muted">{sys.radii[k]} px</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
