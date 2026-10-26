import { useEffect, useRef, useState } from 'react';
import { EXPORT_FORMATS, type ExportFormat } from '../lib/export';
import type { Patch } from '../state';
import { Segmented } from './Segmented';

interface Props {
  format: ExportFormat;
  code: string;
  set: (p: Patch) => void;
  onClose?: () => void;
}

const THEME_FORMATS = EXPORT_FORMATS.filter((f) => f.group === 'theme');
const COMPONENT_FORMATS = EXPORT_FORMATS.filter((f) => f.group === 'components');

export function ExportPanel({ format, code, set, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  const info = EXPORT_FORMATS.find((f) => f.id === format) ?? EXPORT_FORMATS[0];
  const lines = code.split('\n').length - 1;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (id: ExportFormat) => {
    setCopied(false);
    set({ exp: id });
  };

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

  const download = () => {
    const type = info.file.endsWith('.json') ? 'application/json' : 'text/plain';
    const url = URL.createObjectURL(new Blob([code], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = info.file.split('/').pop()!;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-label="Exporter" className="export">
      <div className="section-head">
        <div className="section-head__titles">
          <h2 className="export__title">Exporter</h2>
          <span className="caption">Thème clair + sombre et composants, prêts à coller dans ton projet.</span>
        </div>
        <div className="export__actions">
          <button type="button" className="btn-outline btn-outline--sm" onClick={download}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Télécharger
          </button>
          <button type="button" className="btn-dark" onClick={copy}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            <span aria-live="polite">{copied ? 'Copié !' : 'Copier'}</span>
          </button>
          {onClose && (
            <button type="button" className="icon-btn" aria-label="Fermer" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="export__formats">
        <div className="export__group">
          <span className="field__label">Thème</span>
          <Segmented
            label="Format du thème"
            options={THEME_FORMATS}
            value={info.group === 'theme' ? format : ('' as ExportFormat)}
            onChange={pick}
          />
        </div>
        <div className="export__group">
          <span className="field__label">Composants</span>
          <Segmented
            label="Format des composants"
            options={COMPONENT_FORMATS}
            value={info.group === 'components' ? format : ('' as ExportFormat)}
            onChange={pick}
          />
        </div>
      </div>

      <div className="export__file">
        <span>
          {info.file} · {lines} lignes
        </span>
        <span className="export__hint">{info.hint}</span>
      </div>
      <pre className="export__code">{code}</pre>
    </section>
  );
}
