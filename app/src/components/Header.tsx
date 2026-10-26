import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../lib/theme';

interface Props {
  theme: Theme;
  onExport: () => void;
}

export function Header({ theme: t, onExport }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Presse-papiers indisponible : l'URL reste visible dans la barre d'adresse.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <header className="header">
      <div className="header__brand">
        <a href="./" className="logo" aria-label="Chroma — accueil">
          {/* Le logo prend les couleurs du thème en cours. */}
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="logo__mark">
            <rect x="2" y="2" width="11" height="11" rx="3" fill={t.primary} />
            <rect x="15" y="2" width="11" height="11" rx="3" fill={t.accent} />
            <rect x="2" y="15" width="11" height="11" rx="3" fill={t.text} />
            <rect x="15" y="15" width="11" height="11" rx="3" fill={t.surface} />
          </svg>
          <span className="logo__name">Chroma</span>
        </a>
        <span className="header__tagline">De l'inspiration au thème prêt à créer</span>
      </div>
      <div className="header__actions">
        <button type="button" className="btn-ghost" onClick={copyLink} aria-label={copied ? 'Lien copié' : 'Copier le lien'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
          <span className="btn-label" aria-live="polite">
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </span>
        </button>
        <button type="button" className="btn-dark" onClick={onExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Exporter
        </button>
      </div>
    </header>
  );
}
