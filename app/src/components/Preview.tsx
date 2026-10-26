import type { CSSProperties } from 'react';
import { PREVIEWS, type PreviewId } from '../data';
import { themeVars, type Theme } from '../lib/theme';
import type { Patch } from '../state';
import { Dashboard } from './previews/Dashboard';
import { Landing } from './previews/Landing';
import { Shop } from './previews/Shop';
import { Segmented } from './Segmented';

interface Props {
  theme: Theme;
  preview: PreviewId;
  set: (p: Patch) => void;
}

export function Preview({ theme, preview, set }: Props) {
  const current = PREVIEWS.find((p) => p.id === preview) ?? PREVIEWS[0];

  return (
    <section id="apercu" aria-label="Aperçu" className="card preview">
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
        </div>
        <div className="pv" style={themeVars(theme) as CSSProperties}>
          {preview === 'landing' && <Landing />}
          {preview === 'shop' && <Shop />}
          {preview === 'dash' && <Dashboard />}
        </div>
      </div>
    </section>
  );
}
