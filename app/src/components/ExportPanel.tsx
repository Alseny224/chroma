import { useEffect, useRef, useState } from 'react';
import { EXPORT_FORMATS, type ExportFormat } from '../lib/export';
import type { Patch } from '../state';
import { Segmented } from './Segmented';

interface Props {
  format: ExportFormat;
  code: string;
  set: (p: Patch) => void;
}

export function ExportPanel({ format, code, set }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  const file = EXPORT_FORMATS.find((f) => f.id === format)?.file;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Presse-papiers indisponible (http, permissions) : on garde le retour visuel.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="export" aria-label="Exporter" className="card export">
      <div className="section-head">
        <div className="section-head__titles">
          <h2 className="card__title">Exporter le thème</h2>
          <span className="caption">Modes clair et sombre inclus, prêts à coller dans ton projet.</span>
        </div>
        <div className="export__actions">
          <Segmented
            label="Format d'export"
            options={EXPORT_FORMATS}
            value={format}
            onChange={(id) => {
              setCopied(false);
              set({ exp: id });
            }}
          />
          <button type="button" className="btn-dark" onClick={copy}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            <span aria-live="polite">{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>
      <div className="export__file">{file}</div>
      <pre className="export__code">{code}</pre>
    </section>
  );
}
