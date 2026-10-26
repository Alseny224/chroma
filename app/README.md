# Chroma — Générateur de thèmes

De l'inspiration au thème prêt à créer : une couleur, une ambiance ou un logo →
une palette claire + sombre conforme WCAG, prévisualisée sur 3 interfaces et
exportable en variables CSS, config Tailwind ou tokens Figma (W3C).

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173 (landing) et /generateur.html
npm test         # tests du moteur de couleurs
npm run build    # build de production dans dist/
```

## Structure

```
src/
  lib/color.ts      conversions hex/rgb/hsl, contraste WCAG, ajustement de luminosité
  lib/theme.ts      ambiances + buildTheme() : rôles de couleur clair/sombre
  lib/system.ts     buildSystem() : nuances 50→950, états, typo, espacements,
                    arrondis, ombres + variables CSS (source unique des exports)
  lib/fonts.ts      paires de polices (Google Fonts)
  lib/export.ts     exports CSS, Tailwind v4/v3, shadcn/ui, Figma, composants
  kit/              base.css + components.css (classes ui-*) + ui.tsx (React),
                    affichés dans l'aperçu ET exportés tels quels
  lib/logo.ts       extraction de la couleur dominante d'une image
  landing/          landing page (accueil) avec démo interactive
  lib/checks.ts     contrôles de contraste WCAG partagés
  brand.css         palette de marque du site (exportée depuis Chroma)
  state.ts          état du générateur (useChroma, lecture de ?seed=&mood=)
  data.ts           presets, inspirations, contenu des aperçus
  components/       Header, Settings, Preview (+ previews/), Inspector, ExportPanel
  styles.css        styles de l'outil + aperçu piloté par les variables --t-*
```

La maquette d'origine se trouve dans `../source/`.
