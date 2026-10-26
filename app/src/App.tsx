import { useMemo } from 'react';
import { ExportPanel } from './components/ExportPanel';
import { Header } from './components/Header';
import { Inspector } from './components/Inspector';
import { Preview } from './components/Preview';
import { Settings } from './components/Settings';
import { exportTheme } from './lib/export';
import { buildTheme } from './lib/theme';
import { useChroma } from './state';

export function App() {
  const [state, set] = useChroma();
  const { seed, mood, hue, sat, radius } = state;

  const light = useMemo(() => buildTheme({ seed, mood, hue, sat, radius }, false), [seed, mood, hue, sat, radius]);
  const dark = useMemo(() => buildTheme({ seed, mood, hue, sat, radius }, true), [seed, mood, hue, sat, radius]);
  const theme = state.mode === 'dark' ? dark : light;
  const code = exportTheme(state.exp, { light, dark, seed, mood, radius });

  return (
    <div className="app">
      <Header theme={theme} mode={state.mode} set={set} />
      <main className="layout">
        <Settings state={state} set={set} />
        <Preview theme={theme} preview={state.preview} set={set} />
        <Inspector theme={theme} />
        <ExportPanel format={state.exp} code={code} set={set} />
      </main>
    </div>
  );
}
