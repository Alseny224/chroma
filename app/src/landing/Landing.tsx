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
                <span className="hero__highlight">Accessible par défaut.</span>
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
                <a className="btn btn--ghost btn--lg" href="#comment">
                  Comment ça marche
                </a>
              </div>
              <ul className="hero__trust">
                <li>Sans inscription</li>
                <li>Tailwind, shadcn/ui, React ou CSS</li>
                <li>Rien n'est envoyé : tout tourne dans ton navigateur</li>
              </ul>
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

        <section className="stats" aria-label="Chroma en chiffres">
          <div className="container stats__grid">
            <Stat value="77" label="nuances, du primaire aux états" />
            <Stat value="17" label="composants prêts à l'emploi" />
            <Stat value="10" label="contrôles de contraste WCAG" />
            <Stat value="7" label="formats d'export" />
          </div>
        </section>

        <section id="comment" className="section">
          <div className="container">
            <SectionHead kicker="Comment ça marche" title="Du coup de cœur au code, en trois étapes." />
            <ol className="steps">
              <Step n={1} title="Choisis un point de départ">
                Une couleur de ta marque, une inspiration toute faite ou ton logo : Chroma en extrait la teinte
                dominante.
              </Step>
              <Step n={2} title="Règle l'ambiance">
                Calme, vif, luxe, tech ou naturel : saturation, accent, arrondis et typographie s'accordent. Affine
                ensuite la teinte au curseur.
              </Step>
              <Step n={3} title="Exporte et code">
                Thème Tailwind, shadcn/ui ou CSS, plus le kit de composants en React ou en CSS. Clair et sombre
                inclus.
              </Step>
            </ol>
          </div>
        </section>

        <section id="fonctionnalites" className="section section--tinted">
          <div className="container">
            <SectionHead
              kicker="Fonctionnalités"
              title="Un design system complet, pas une palette."
              lead="Tout ce que tu dessinais à la main à chaque projet, généré et cohérent en quelques secondes."
            />
            <div className="features">
              <Feature icon={<IconCheck />} title="Contraste WCAG garanti">
                Texte, boutons, bordures de champs, couleurs d'état : 10 paires vérifiées et ajustées
                automatiquement, quelle que soit la couleur de départ.
              </Feature>
              <Feature icon={<IconSliders />} title="Tout le système">
                Nuances 50 → 950, succès / attention / erreur / info, typographie, espacements, arrondis et ombres.
              </Feature>
              <Feature icon={<IconLayout />} title="Kit de composants">
                Boutons, formulaires, alertes, cartes, onglets, tableau, modale… accessibles et déjà à tes couleurs.
              </Feature>
              <Feature icon={<IconCode />} title="Prêt pour ta stack">
                Tailwind v4 ou v3, shadcn/ui pour Next.js, composants React typés, CSS pur ou tokens Figma.
              </Feature>
              <Feature icon={<IconMoon />} title="Clair et sombre d'un coup">
                Chaque thème est livré avec son pendant sombre, calculé et vérifié lui aussi.
              </Feature>
              <Feature icon={<IconImage />} title="Depuis ton logo">
                Dépose un PNG, un JPG ou un SVG : la couleur dominante devient la base de ton thème.
              </Feature>
            </div>
          </div>
        </section>

        <section id="composants" className="section">
          <div className="container">
            <SectionHead
              kicker="Composants"
              title="Des composants, pas juste des couleurs."
              lead="Le kit que tu exportes, en direct, aux couleurs de la démo. Change de couleur en haut de page : il suit."
            />
            <KitShowcase sys={sys} mode={dark ? 'dark' : 'light'} />
          </div>
        </section>

        <section id="ambiances" className="section section--tinted">
          <div className="container">
            <SectionHead
              kicker="Ambiances"
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

        <section className="section">
          <div className="container">
            <div className="cta">
              <h2 className="cta__title">Ton prochain thème est à un clic.</h2>
              <p className="cta__lead">Gratuit, sans compte, et tes couleurs ne quittent jamais ton navigateur.</p>
              <a className="btn btn--inverse btn--lg" href={generatorUrl(demo.seed, demo.mood)}>
                Ouvrir le générateur
                <Arrow />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <Logo />
          <span className="footer__note">De l'inspiration au thème prêt à créer.</span>
          <nav className="footer__links" aria-label="Pied de page">
            <a href="#fonctionnalites">Fonctionnalités</a>
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
          <a href="#comment">Comment ça marche</a>
          <a href="#fonctionnalites">Fonctionnalités</a>
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

function SectionHead({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <div className="section-head">
      <span className="kicker">{kicker}</span>
      <h2 className="section-head__title">{title}</h2>
      {lead && <p className="section-head__lead">{lead}</p>}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="step">
      <span className="step__n" aria-hidden="true">
        {String(n).padStart(2, '0')}
      </span>
      <h3 className="step__title">{title}</h3>
      <p className="step__text">{children}</p>
    </li>
  );
}

function Feature({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="feature">
      <span className="feature__icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="feature__title">{title}</h3>
      <p className="feature__text">{children}</p>
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
            kicker="Export"
            title="Colle, c'est prêt."
            lead="Le code du thème affiché plus haut, en direct. Change de couleur dans la démo et regarde-le se mettre à jour."
          />
          <ul className="checklist">
            <li>Variables CSS, Tailwind v3/v4, shadcn/ui ou tokens Figma</li>
            <li>Nuances 50 → 950, couleurs d'état, typo, espacements, ombres</li>
            <li>Kit de composants en CSS pur ou en React/Next.js</li>
          </ul>
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

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconCheck = () => (
  <svg {...iconProps}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IconLayout = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M9 20V9" />
  </svg>
);
const IconMoon = () => (
  <svg {...iconProps}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);
const IconImage = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);
const IconSliders = () => (
  <svg {...iconProps}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);
const IconCode = () => (
  <svg {...iconProps}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  </svg>
);
