import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { PRESETS } from '../data';
import { exportTheme, type ExportFormat } from '../lib/export';
import { buildSystem, type DesignSystem } from '../lib/system';
import { buildTheme, MOOD_IDS, MOODS, themeVars, type MoodId } from '../lib/theme';
import { HeroDemo } from './HeroDemo';
import { KitShowcase } from './KitShowcase';
import { generatorUrl } from './links';

// Chaque couleur de la démo automatique est associée à une ambiance.
const SHOWCASE = PRESETS.map((p, i) => ({ seed: p.hex, mood: MOOD_IDS[i % MOOD_IDS.length] }));

export function Landing() {
  const [demo, setDemo] = useState(SHOWCASE[0]);
  const [dark, setDark] = useState(false);
  const [touched, setTouched] = useState(false);

  // Défilement automatique tant que le visiteur n'a pas pris la main.
  useEffect(() => {
    if (touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setDemo((d) => SHOWCASE[(SHOWCASE.findIndex((s) => s.seed === d.seed) + 1) % SHOWCASE.length]);
    }, 2800);
    return () => window.clearInterval(id);
  }, [touched]);

  const update = (patch: Partial<typeof demo>) => {
    setTouched(true);
    setDemo((d) => ({ ...d, ...patch }));
  };

  const M = MOODS[demo.mood];
  const sys = buildSystem({ ...demo, hue: 0, sat: 100, radius: M.radius, scale: M.scale, density: M.density });
  const { light, dark: darkTheme } = sys;

  return (
    <div className="lp">
      <Nav />
      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <h1 className="hero__title">
                Une couleur.
                <br />
                Un thème complet.
                <br />
                <span className="hero__second">Accessible par défaut.</span>
              </h1>
              <p className="hero__lead">
                Choisis une teinte, une ambiance ou ton logo. Chroma compose une palette claire et sombre qui respecte
                les contrastes WCAG, la montre sur de vraies interfaces et te la livre prête à coller.
              </p>
              <div className="hero__ctas">
                <a className="btn btn--primary btn--lg" href={generatorUrl()}>
                  Créer mon thème
                  <Arrow />
                </a>
                <a className="link-quiet" href="#composants">
                  Voir les composants
                </a>
              </div>
              <p className="hero__note">
                Gratuit, sans inscription. Exports Tailwind, shadcn/ui, React ou CSS.
              </p>
            </div>
            <HeroDemo
              seed={demo.seed}
              mood={demo.mood}
              dark={dark}
              theme={dark ? darkTheme : light}
              states={sys.states[dark ? 'dark' : 'light']}
              onSeed={(seed) => update({ seed })}
              onMood={(mood) => update({ mood })}
              onDark={(d) => {
                setTouched(true);
                setDark(d);
              }}
            />
          </div>
        </section>

        <section id="systeme" className="section">
          <div className="container split">
            <SectionHead
              title="Un design system complet, pas une palette."
              lead="Tout ce que tu redessinais à chaque projet, généré d'un coup et cohérent."
            />
            <dl className="facts">
              <Fact title="Des contrastes tenus">
                Texte, boutons, bordures de champs et couleurs d'état : dix paires vérifiées et ajustées
                automatiquement, quelle que soit la couleur de départ.
              </Fact>
              <Fact title="Tout le système">
                Des nuances de 50 à 950, quatre couleurs d'état, une échelle typographique, des espacements, des
                arrondis et des ombres qui vont ensemble.
              </Fact>
              <Fact title="Clair et sombre">
                Chaque thème est livré avec son pendant sombre, calculé et vérifié lui aussi.
              </Fact>
              <Fact title="Depuis ton logo">
                Dépose un PNG, un JPG ou un SVG : sa couleur dominante devient la base du thème.
              </Fact>
            </dl>
          </div>
        </section>

        <section id="composants" className="section">
          <div className="container">
            <SectionHead
              title="Des composants, pas juste des couleurs."
              lead="Le kit que tu exportes, affiché ici aux couleurs de la démo. Change de couleur en haut de page : il suit."
            />
            <KitShowcase sys={sys} mode={dark ? 'dark' : 'light'} />
          </div>
        </section>

        <section id="ambiances" className="section">
          <div className="container">
            <SectionHead
              title="Même couleur, cinq personnalités."
              lead="Chaque ambiance règle la saturation, l'accent, les arrondis et la typographie. Voici ta couleur actuelle dans chacune d'elles."
            />
            <div className="moods">
              {MOOD_IDS.map((id) => (
                <MoodCard key={id} id={id} seed={demo.seed} />
              ))}
            </div>
          </div>
        </section>

        <ExportShowcase sys={sys} />

        <section className="section closing">
          <div className="container closing__inner">
            <h2 className="closing__title">Ton prochain projet commence avec un thème fini.</h2>
            <a className="btn btn--primary btn--lg" href={generatorUrl(demo.seed, demo.mood)}>
              Ouvrir le générateur
              <Arrow />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <Logo />
          <span className="footer__note">Tout se passe dans ton navigateur : aucune couleur n'est envoyée.</span>
          <nav className="footer__links" aria-label="Pied de page">
            <a href="#systeme">Système</a>
            <a href="#composants">Composants</a>
            <a href="#ambiances">Ambiances</a>
            <a href={generatorUrl()}>Générateur</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="./" className="nav__logo" aria-label="Chroma — accueil">
          <Logo />
        </a>
        <nav className="nav__links" aria-label="Principale">
          <a href="#systeme">Système</a>
          <a href="#composants">Composants</a>
          <a href="#ambiances">Ambiances</a>
          <a href="#export">Export</a>
        </nav>
        <a className="btn btn--primary" href={generatorUrl()}>
          {/* Un seul nœud texte : le gap du bouton ne s'insère pas entre les mots. */}
          <span>
            Ouvrir<span className="nav__cta-long"> le générateur</span>
          </span>
        </a>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="brand">
      <svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="2" y="2" width="11" height="11" rx="3" fill="var(--color-primary)" />
        <rect x="15" y="2" width="11" height="11" rx="3" fill="var(--color-accent)" />
        <rect x="2" y="15" width="11" height="11" rx="3" fill="var(--color-text)" />
        <rect x="15" y="15" width="11" height="11" rx="3" fill="var(--color-surface)" stroke="var(--color-border)" />
      </svg>
      <span className="brand__name">Chroma</span>
    </span>
  );
}

function SectionHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="section-head">
      <h2 className="section-head__title">{title}</h2>
      {lead && <p className="section-head__lead">{lead}</p>}
    </div>
  );
}

function Fact({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="fact">
      <dt className="fact__title">{title}</dt>
      <dd className="fact__text">{children}</dd>
    </div>
  );
}

function MoodCard({ id, seed }: { id: MoodId; seed: string }) {
  const M = MOODS[id];
  const t = buildTheme({ seed, mood: id, hue: 0, sat: 100, radius: M.radius }, false);
  return (
    <a className="mood" href={generatorUrl(seed, id)} style={themeVars(t) as CSSProperties}>
      <span className="mood__stage">
        <span className="mood__title">{M.label}</span>
        <span className="mood__btn">Découvrir</span>
        <span className="mood__chips">
          {[t.primary, t.accent, t.surface, t.text].map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </span>
      </span>
      <span className="mood__desc">{M.desc.split('.')[0]}.</span>
    </a>
  );
}

const SHOWCASE_FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind4', label: 'Tailwind' },
  { id: 'shadcn', label: 'shadcn/ui' },
  { id: 'components', label: 'Composants' },
];

function ExportShowcase({ sys }: { sys: DesignSystem }) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  const code = exportTheme(format, sys);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Presse-papiers indisponible : on garde le retour visuel.
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="export" className="section">
      <div className="container export-grid">
        <div>
          <SectionHead
            title="Colle, c'est prêt."
            lead="Le code du thème affiché plus haut, mis à jour en direct."
          />
          <p className="prose">
            Un thème Tailwind v4 ou v3, un <code>globals.css</code> pour shadcn/ui, des variables CSS ou des tokens
            Figma. Le kit de composants suit, en CSS pur ou en React pour Next.js.
          </p>
        </div>
        <div className="code">
          <div className="code__bar">
            <div role="group" aria-label="Format d'export" className="code__tabs">
              {SHOWCASE_FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={format === f.id}
                  onClick={() => {
                    setFormat(f.id);
                    setCopied(false);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button type="button" className="code__copy" onClick={copy}>
              <span aria-live="polite">{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
          <pre className="code__pre">{code}</pre>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
