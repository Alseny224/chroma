import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ExportPanel } from './components/ExportPanel';
import { Header } from './components/Header';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Settings } from './components/Settings';
import { exportTheme } from './lib/export';
import { ensureFontsLoaded } from './lib/fonts';
import { buildSystem } from './lib/system';
import { MOODS } from './lib/theme';
import { themeQuery, useChroma } from './state';

export function App() {
  const [state, set] = useChroma();
  const [exportOpen, setExportOpen] = useState(false);
  const { seed, mood, hue, sat, radius, scale, density } = state;
  const fonts = state.fonts === 'auto' ? MOODS[mood].fonts : state.fonts;

  const sys = useMemo(
    () => buildSystem({ seed, mood, hue, sat, radius, scale, density, fonts }),
    [seed, mood, hue, sat, radius, scale, density, fonts],
  );
  const code = useMemo(() => exportTheme(state.exp, sys), [state.exp, sys]);
  const query = themeQuery(state);

  useEffect(() => ensureFontsLoaded(fonts), [fonts]);
  // L'URL reflète le thème : recharger la page ou partager le lien le conserve.
  useEffect(() => window.history.replaceState(null, '', query), [query]);

  return (
    <div className="app">
      <Header theme={state.mode === 'dark' ? sys.dark : sys.light} onExport={() => setExportOpen(true)} />
      <main className="workspace">
        <Settings state={state} set={set} />
        <Preview sys={sys} mode={state.mode} preview={state.preview} set={set} />
        <Inspector sys={sys} mode={state.mode} />
      </main>
      <Drawer open={exportOpen} onClose={() => setExportOpen(false)} label="Exporter">
        <ExportPanel format={state.exp} code={code} set={set} onClose={() => setExportOpen(false)} />
      </Drawer>
    </div>
  );
}

/** Panneau latéral basé sur <dialog> : focus piégé et Échap gérés par le navigateur. */
function Drawer({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (open && d && !d.open) d.showModal();
    if (!open && d?.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && children}
    </dialog>
  );
}
