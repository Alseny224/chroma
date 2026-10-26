import { FEATURES, TASKS } from '../../data';

export function Landing() {
  return (
    <div>
      <div className="pv-topbar">
        <div className="pv-brand">
          <span aria-hidden="true" className="pv-brand__mark" />
          Atelier Nord
        </div>
        <div className="pv-nav">
          <span>Produit</span>
          <span>Tarifs</span>
          <span>Ressources</span>
        </div>
        <button type="button" className="pv-btn pv-btn--primary pv-btn--sm">Commencer</button>
      </div>

      <div className="pv-hero">
        <div className="pv-hero__copy">
          <span className="pv-badge">
            <span aria-hidden="true" className="pv-dot" />
            Nouveau · Version 2.0
          </span>
          <h3 className="pv-hero__title">Des outils simples pour les équipes qui avancent vite.</h3>
          <p className="pv-hero__lead">
            Planifie, partage et livre tes projets au même endroit, sans tableur ni chaîne d'e-mails.
          </p>
          <div className="pv-row">
            <button type="button" className="pv-btn pv-btn--primary pv-btn--lg">Essayer gratuitement</button>
            <button type="button" className="pv-btn pv-btn--ghost pv-btn--lg">Voir la démo</button>
          </div>
        </div>

        <div className="pv-card pv-card--tasks">
          <div className="pv-card__head">
            <span className="pv-card__title">Sprint de la semaine</span>
            <span className="pv-meta">4 tâches</span>
          </div>
          {TASKS.map((k) => (
            <div key={k.label} className="pv-task">
              <span aria-hidden="true" className={'pv-task__check' + (k.done ? ' is-done' : '')} />
              <span className="pv-task__label">{k.label}</span>
              <span className="pv-tag">{k.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pv-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="pv-card pv-feature">
            <span aria-hidden="true" className="pv-feature__icon">
              <span />
            </span>
            <span className="pv-feature__title">{f.title}</span>
            <span className="pv-feature__text">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
