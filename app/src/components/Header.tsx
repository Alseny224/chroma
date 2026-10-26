import type { Theme } from '../lib/theme';
import type { ChromaState, Patch } from '../state';
import { Segmented } from './Segmented';

const MODES: { id: ChromaState['mode']; label: string }[] = [
  { id: 'light', label: 'Clair' },
  { id: 'dark', label: 'Sombre' },
];

interface Props {
  theme: Theme;
  mode: ChromaState['mode'];
  set: (p: Patch) => void;
}

export function Header({ theme: t, mode, set }: Props) {
  return (
    <header className="header">
      <div className="header__brand">
        <a href="./" className="logo" aria-label="Chroma — accueil">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect x="2" y="2" width="11" height="11" rx="3" fill={t.primary} />
            <rect x="15" y="2" width="11" height="11" rx="3" fill={t.accent} />
            <rect x="2" y="15" width="11" height="11" rx="3" fill={t.text} />
            <rect x="15" y="15" width="11" height="11" rx="3" fill={t.surface} stroke="#D5D8DF" />
          </svg>
          <span className="logo__name">Chroma</span>
        </a>
        <span className="header__tagline">De l'inspiration au thème prêt à créer</span>
      </div>
      <div className="header__actions">
        <Segmented label="Mode du thème" options={MODES} value={mode} onChange={(m) => set({ mode: m })} />
        <a href="#export" className="btn-dark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Exporter
        </a>
      </div>
    </header>
  );
}
