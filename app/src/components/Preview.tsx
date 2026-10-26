import type { CSSProperties } from 'react';
import { PREVIEWS, type PreviewId } from '../data';
import { systemVars, type DesignSystem, type Mode } from '../lib/system';
import { themeVars } from '../lib/theme';
import type { Patch } from '../state';
import { Components } from './previews/Components';
import { Dashboard } from './previews/Dashboard';
import { Landing } from './previews/Landing';
import { Shop } from './previews/Shop';
import { SystemSheet } from './previews/SystemSheet';
import { Segmented } from './Segmented';

interface Props {
  sys: DesignSystem;
  mode: Mode;
  preview: PreviewId;
  set: (p: Patch) => void;
}

export function Preview({ sys, mode, preview, set }: Props) {
  const current = PREVIEWS.find((p) => p.id === preview) ?? PREVIEWS[0];
  const theme = mode === 'dark' ? sys.dark : sys.light;
  // --t-* pour les pages d'exemple, variables exportées pour le kit de composants.
  const vars = { ...themeVars(theme), ...systemVars(sys, mode) } as CSSProperties;

  return (
    <section id="apercu" aria-label="Aperçu" className="card preview column--preview">
      <div className="section-head">
        <div className="section-head__titles">
          <h2 className="card__title">Aperçu sur une vraie interface</h2>
          <span className="caption">{current.caption}</span>
        </div>
        <Segmented label="Type de page" options={PREVIEWS} value={preview} onChange={(id) => set({ preview: id })} />
      </div>

      <div className="browser">
        <div className="browser__bar">
          <span aria-hidden="true" className="browser__dots">
            <span />
            <span />
            <span />
          </span>
          <span className="browser__url">{current.url}</span>
          <button
            type="button"
            className="browser__mode"
            aria-pressed={mode === 'dark'}
            aria-label="Aperçu en mode sombre"
            title={mode === 'dark' ? 'Passer l’aperçu en clair' : 'Passer l’aperçu en sombre'}
            onClick={() => set({ mode: mode === 'dark' ? 'light' : 'dark' })}
          >
            {mode === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
            <span>{mode === 'dark' ? 'Sombre' : 'Clair'}</span>
          </button>
        </div>
        <div className="pv" style={vars} data-theme={mode}>
          {preview === 'landing' && <Landing />}
          {preview === 'shop' && <Shop />}
          {preview === 'dash' && <Dashboard />}
          {preview === 'components' && <Components />}
          {preview === 'system' && <SystemSheet sys={sys} mode={mode} />}
        </div>
      </div>
    </section>
  );
}
