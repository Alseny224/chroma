import { FILTERS } from '../../data';

const PRODUCTS = [
  { name: 'Tasse en grès', cat: 'Céramique · émail mat', price: '24 €', w: 84, h: 96, r: '14px 14px 30px 30px', color: 'var(--t-primary)' },
  { name: 'Plaid en lin', cat: 'Linge · 130 × 170 cm', price: '89 €', w: 120, h: 86, r: 'var(--t-radius)', color: 'var(--t-accent)' },
  { name: 'Lampe Galet', cat: 'Luminaire · laiton', price: '145 €', w: 96, h: 96, r: '50%', color: 'var(--t-primary-soft)' },
];

export function Shop() {
  return (
    <div>
      <div className="pv-topbar">
        <span className="pv-shop-name">Maison Argile</span>
        <span className="pv-search">Rechercher un objet…</span>
        <button type="button" className="pv-btn pv-btn--ghost pv-btn--md">Panier (2)</button>
      </div>

      <div className="pv-shop-intro">
        <h3 className="pv-shop-title">Nouveautés d'automne</h3>
        <p className="pv-shop-lead">Céramiques, linge et luminaires façonnés en petites séries.</p>
        <div className="pv-row pv-row--8">
          {FILTERS.map((f, i) => (
            <button key={f} type="button" className={'pv-filter' + (i === 0 ? ' is-active' : '')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="pv-products">
        {PRODUCTS.map((p) => (
          <div key={p.name} className="pv-card pv-product">
            <div aria-hidden="true" className="pv-product__stage">
              <span style={{ width: p.w, height: p.h, borderRadius: p.r, background: p.color }} />
              <span className="pv-product__shadow" />
            </div>
            <div className="pv-product__head">
              <span className="pv-product__name">{p.name}</span>
              <span className="pv-product__price">{p.price}</span>
            </div>
            <span className="pv-meta pv-meta--13">{p.cat}</span>
            <button type="button" className="pv-btn pv-btn--primary pv-btn--block">Ajouter au panier</button>
          </div>
        ))}
      </div>
    </div>
  );
}
