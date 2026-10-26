import type { CSSProperties } from 'react';
import { PRESETS } from '../data';
import { contrastChecks } from '../lib/checks';
import { MOOD_IDS, MOODS, themeVars, type MoodId, type Theme } from '../lib/theme';
import { generatorUrl } from './links';

interface Props {
  seed: string;
  mood: MoodId;
  dark: boolean;
  theme: Theme;
  onSeed: (hex: string) => void;
  onMood: (mood: MoodId) => void;
  onDark: (dark: boolean) => void;
}

const BARS = [38, 52, 46, 64, 58, 76, 88];

/** Mini-générateur interactif affiché dans le hero. */
export function HeroDemo({ seed, mood, dark, theme: t, onSeed, onMood, onDark }: Props) {
  const checks = contrastChecks(t);
  const passed = checks.filter((c) => c.pass).length;
  const swatches = [t.bg, t.surface, t.border, t.text, t.muted, t.primary, t.onPrimary, t.accent];

  return (
    <div className="demo">
      <div className="demo__controls">
        <div role="group" aria-label="Couleur de départ" className="demo__swatches">
          {PRESETS.map((p) => (
            <button
              key={p.hex}
              type="button"
              className="demo__swatch"
              aria-label={p.name}
              aria-pressed={seed === p.hex}
              title={p.name}
              style={{ background: p.hex }}
              onClick={() => onSeed(p.hex)}
            />
          ))}
        </div>
        <div className="demo__row">
          <div role="group" aria-label="Ambiance" className="demo__moods">
            {MOOD_IDS.map((id) => (
              <button key={id} type="button" className="demo__chip" aria-pressed={mood === id} onClick={() => onMood(id)}>
                {MOODS[id].label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="demo__chip"
            aria-pressed={dark}
            onClick={() => onDark(!dark)}
            aria-label="Aperçu en mode sombre"
          >
            {dark ? '☾ Sombre' : '☀ Clair'}
          </button>
        </div>
      </div>

      <div className="mock" style={themeVars(t) as CSSProperties} aria-hidden="true">
        <div className="mock__nav">
          <span className="mock__brand">
            <span className="mock__mark" />
            Ton produit
          </span>
          <span className="mock__links">
            <span>Produit</span>
            <span>Tarifs</span>
          </span>
          <span className="mock__btn mock__btn--sm">Commencer</span>
        </div>
        <div className="mock__body">
          <div className="mock__copy">
            <span className="mock__badge">
              <span className="mock__dot" />
              Nouveau
            </span>
            <span className="mock__title">Ton interface, à tes couleurs.</span>
            <span className="mock__text">Un thème cohérent, lisible et prêt pour la production.</span>
            <span className="mock__actions">
              <span className="mock__btn">Essayer</span>
              <span className="mock__btn mock__btn--ghost">Démo</span>
            </span>
          </div>
          <div className="mock__card">
            <span className="mock__card-head">
              <span>Ventes</span>
              <span className="mock__muted">+18 %</span>
            </span>
            <span className="mock__bars">
              {BARS.map((h, i) => (
                <span key={i} className={i === BARS.length - 1 ? 'is-accent' : ''} style={{ height: `${h}%` }} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="demo__footer">
        <div className="demo__palette" aria-label="Palette générée">
          {swatches.map((c, i) => (
            <span key={i} style={{ background: c }} title={c} />
          ))}
        </div>
        <span className="demo__wcag">
          <span aria-hidden="true">✓</span> {passed}/{checks.length} contrastes WCAG
        </span>
      </div>
      <a className="demo__open" href={generatorUrl(seed, mood)}>
        Ouvrir ce thème dans le générateur <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
