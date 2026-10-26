import { BARS, KPIS, NAV_ITEMS, ORDERS } from '../../data';

export function Dashboard() {
  return (
    <div className="pv-dash">
      <div className="pv-sidebar">
        <div className="pv-sidebar__brand">
          <span aria-hidden="true" className="pv-sidebar__mark" />
          Pilotage
        </div>
        {NAV_ITEMS.map((n, i) => (
          <span key={n} className={'pv-nav-item' + (i === 0 ? ' is-active' : '')}>
            {n}
          </span>
        ))}
      </div>

      <div className="pv-dash__main">
        <div className="pv-dash__head">
          <h3 className="pv-dash__title">Vue d'ensemble</h3>
          <button type="button" className="pv-btn pv-btn--surface">30 derniers jours</button>
        </div>

        <div className="pv-kpis">
          {KPIS.map((k) => (
            <div key={k.label} className="pv-card pv-kpi">
              <span className="pv-meta pv-meta--13">{k.label}</span>
              <span className="pv-kpi__value">{k.value}</span>
              <span className="pv-kpi__delta">
                <span aria-hidden="true" className="pv-dot" />
                {k.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="pv-card pv-chart">
          <div className="pv-chart__head">
            <span className="pv-chart__title">Ventes hebdomadaires</span>
            <span className="pv-legend">
              <span><span aria-hidden="true" className="pv-legend__key" />Semaines passées</span>
              <span><span aria-hidden="true" className="pv-legend__key pv-legend__key--accent" />Cette semaine</span>
            </span>
          </div>
          <div role="img" aria-label="Histogramme des ventes sur 12 semaines" className="pv-bars">
            {BARS.map((v, i) => (
              <span
                key={i}
                className={'pv-bar' + (i === BARS.length - 1 ? ' pv-bar--accent' : '')}
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>

        <div className="pv-card pv-table">
          {ORDERS.map((o) => (
            <div key={o.id} className="pv-table__row">
              <span className="pv-table__id">{o.id}</span>
              <span className="pv-table__client">{o.client}</span>
              <span className={'pv-status' + (o.done ? '' : ' pv-status--pending')}>{o.status}</span>
              <span className="pv-table__total">{o.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
