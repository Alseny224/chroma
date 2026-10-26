import type { ChangeEvent } from 'react';
import { INSPIRATIONS, PRESETS, SOURCES } from '../data';
import { isHex6, normalizeHex } from '../lib/color';
import { dominantColor } from '../lib/logo';
import { buildTheme, MOOD_IDS, MOODS } from '../lib/theme';
import type { ChromaState, Patch } from '../state';

interface Props {
  state: ChromaState;
  set: (p: Patch) => void;
}

export function Settings({ state, set }: Props) {
  return (
    <section aria-label="Réglages" className="column">
      <SourceCard state={state} set={set} />
      <MoodCard state={state} set={set} />
      <AdjustCard state={state} set={set} />
    </section>
  );
}

function SourceCard({ state, set }: Props) {
  return (
    <div className="card">
      <h2 className="card__title">Point de départ</h2>
      <div role="group" aria-label="Source" className="source-grid">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            className="choice"
            aria-pressed={state.source === s.id}
            onClick={() => set({ source: s.id })}
          >
            {s.label}
          </button>
        ))}
      </div>
      {state.source === 'color' && <ColorSource state={state} set={set} />}
      {state.source === 'mood' && <InspirationSource state={state} set={set} />}
      {state.source === 'logo' && <LogoSource state={state} set={set} />}
    </div>
  );
}

function ColorSource({ state, set }: Props) {
  const onHex = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    set(isHex6(v.trim()) ? { draft: v, seed: normalizeHex(v) } : { draft: v });
  };

  return (
    <div className="stack-14">
      <div className="presets">
        {PRESETS.map((p) => (
          <button
            key={p.hex}
            type="button"
            className="preset"
            aria-label={p.name}
            aria-pressed={state.seed === p.hex}
            title={p.name}
            style={{ background: p.hex }}
            onClick={() => set({ seed: p.hex, draft: p.hex })}
          />
        ))}
      </div>
      <div className="seed-fields">
        <div className="field">
          <label htmlFor="seed-picker" className="field__label">Pipette</label>
          <input
            id="seed-picker"
            type="color"
            className="color-input"
            value={state.seed.toLowerCase()}
            onChange={(e) => {
              const v = e.target.value.toUpperCase();
              set({ seed: v, draft: v });
            }}
          />
        </div>
        <div className="field field--grow">
          <label htmlFor="seed-hex" className="field__label">Couleur de base (hex)</label>
          <input
            id="seed-hex"
            type="text"
            className="text-input"
            spellCheck={false}
            value={state.draft}
            onChange={onHex}
            aria-invalid={!isHex6(state.draft.trim())}
          />
        </div>
      </div>
    </div>
  );
}

// Aperçu du primaire et de l'accent de chaque inspiration, en mode clair.
const INSPIRATION_SWATCHES = INSPIRATIONS.map((i) => {
  const t = buildTheme({ seed: i.hex, mood: i.mood, hue: 0, sat: 100, radius: MOODS[i.mood].radius }, false);
  return { primary: t.primary, accent: t.accent };
});

function InspirationSource({ state, set }: Props) {
  const swatches = INSPIRATION_SWATCHES;
  return (
    <div className="stack-8">
      {INSPIRATIONS.map((i, idx) => (
        <button
          key={i.name}
          type="button"
          className="inspiration"
          aria-pressed={state.seed === i.hex && state.mood === i.mood}
          onClick={() =>
            set({ seed: i.hex, draft: i.hex, mood: i.mood, radius: MOODS[i.mood].radius, hue: 0, sat: 100 })
          }
        >
          <span aria-hidden="true" className="inspiration__swatch">
            <span style={{ background: swatches[idx].primary }} />
            <span style={{ background: swatches[idx].accent }} />
          </span>
          <span className="inspiration__text">
            <span className="inspiration__name">{i.name}</span>
            <span className="inspiration__mood">Ambiance {MOODS[i.mood].label.toLowerCase()}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function LogoSource({ state, set }: Props) {
  const onLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set({ logoStatus: `Analyse de « ${file.name} »…` });
    try {
      const hex = await dominantColor(file);
      if (!hex) {
        set({ logoStatus: 'Aucune couleur vive trouvée dans ce logo. Essaie un autre fichier ou choisis une couleur.' });
        return;
      }
      set({ seed: hex, draft: hex, hue: 0, logoStatus: `Couleur dominante extraite : ${hex}` });
    } catch (err) {
      set({
        logoStatus:
          err instanceof Error && err.message === 'format'
            ? 'Format non reconnu. Utilise un PNG, JPG ou SVG.'
            : 'Impossible de lire ce fichier.',
      });
    }
  };

  return (
    <div className="stack-10">
      <label htmlFor="logo-file" className="dropzone">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="dropzone__title">Choisis ton logo</span>
        <span className="dropzone__hint">PNG, JPG ou SVG — Chroma en extrait la couleur dominante.</span>
      </label>
      <input id="logo-file" type="file" accept="image/*" className="file-input" onChange={onLogo} />
      {state.logoStatus && (
        <p role="status" className="logo-status">
          {state.logoStatus}
        </p>
      )}
    </div>
  );
}

function MoodCard({ state, set }: Props) {
  return (
    <div className="card card--gap-14">
      <h2 className="card__title">Ambiance</h2>
      <div role="group" aria-label="Ambiance" className="chips">
        {MOOD_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className="choice choice--pill"
            aria-pressed={state.mood === id}
            onClick={() => set({ mood: id, radius: MOODS[id].radius })}
          >
            {MOODS[id].label}
          </button>
        ))}
      </div>
      <p className="mood-desc">{MOODS[state.mood].desc}</p>
    </div>
  );
}

function AdjustCard({ state, set }: Props) {
  return (
    <div className="card card--gap-18">
      <h2 className="card__title">Ajuster en direct</h2>
      <Slider id="r-hue" label="Teinte" min={-180} max={180} value={state.hue}
        display={`${state.hue > 0 ? '+' : ''}${state.hue}°`} onChange={(v) => set({ hue: v })} />
      <Slider id="r-sat" label="Saturation" min={0} max={150} value={state.sat}
        display={`${state.sat} %`} onChange={(v) => set({ sat: v })} />
      <Slider id="r-rad" label="Arrondis" min={0} max={28} value={state.radius}
        display={`${state.radius} px`} onChange={(v) => set({ radius: v })} />
      <button
        type="button"
        className="btn-outline"
        onClick={() => set({ hue: 0, sat: 100, radius: MOODS[state.mood].radius })}
      >
        Réinitialiser les réglages
      </button>
    </div>
  );
}

interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  display: string;
  onChange: (v: number) => void;
}

function Slider({ id, label, min, max, value, display, onChange }: SliderProps) {
  return (
    <div className="stack-8">
      <div className="slider__head">
        <label htmlFor={id} className="slider__label">{label}</label>
        <span className="mono-muted">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        className="range"
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      />
    </div>
  );
}
