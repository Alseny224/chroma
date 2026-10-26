# Contribuer à Chroma

Merci de vouloir améliorer Chroma ! En proposant une contribution, tu acceptes qu'elle soit publiée sous la [licence MIT](LICENSE) du projet.

Ce guide explique comment installer le projet, ce qu'il faut vérifier avant de proposer une modification, et comment ajouter les éléments les plus courants : une ambiance, une police, un format d'export, un composant.

## Sommaire

- [Installer le projet](#installer-le-projet)
- [Proposer une modification](#proposer-une-modification)
- [Avant d'ouvrir une pull request](#avant-douvrir-une-pull-request)
- [Principes du projet](#principes-du-projet)
- [Ajouter…](#ajouter)
- [Conventions](#conventions)
- [Signaler un bug](#signaler-un-bug)

## Installer le projet

Prérequis : **Node.js 20** ou plus récent, et npm.

```bash
git clone <url-du-dépôt> chroma
cd chroma/app
npm install
npm run dev
```

Le générateur est sur <http://localhost:5173/generateur.html> et la landing page sur <http://localhost:5173/>.

## Proposer une modification

1. Crée une branche depuis `main` avec un nom parlant : `fix/contraste-accent-sombre`, `feat/export-scss`, `docs/readme-nextjs`…
2. Fais des commits ciblés : un commit = un changement compréhensible seul.
3. Écris les messages de commit **en français**, avec un titre court qui dit ce que fait le changement (« Ajoute l'export SCSS », « Corrige le contraste de l'accent en mode sombre »). Si besoin, ajoute un corps qui explique le *pourquoi*.
4. Ouvre une pull request qui décrit le problème, la solution et ce que tu as vérifié. Pour un changement visuel, joins une capture avant / après.

## Avant d'ouvrir une pull request

Dans `app/` :

```bash
npm test         # tests du moteur et des exports
npm run build    # vérification TypeScript (tsc -b) + build de production
```

Les deux doivent passer sans erreur ni avertissement.

Pour tout changement visible, vérifie aussi à la main dans `npm run dev` :

- [ ] le générateur **et** la landing page, si le changement touche du code partagé (`lib/`, `kit/`, `brand.css`) ;
- [ ] en **mode clair et en mode sombre** : le thème du système pour l'interface, le bouton Clair/Sombre pour l'aperçu ;
- [ ] à **1440 px**, **900 px** et **390 px** de large, puis **320 px** pour les petits téléphones ;
- [ ] au **clavier** : tout est atteignable avec Tab, le focus est visible, Échap ferme la modale et le panneau d'export ;
- [ ] **aucun défilement horizontal** de la page.

## Principes du projet

Le projet repose sur quelques règles. Une pull request qui les contourne devra être retravaillée.

### 1. Une seule source de vérité

`buildSystem()` (`lib/system.ts`) calcule tout le design system, et `systemVars()` le transforme en variables CSS. **L'aperçu et tous les exports partent de là.** On ne recalcule jamais une couleur, une taille ou une ombre ailleurs.

### 2. Ce qu'on affiche est ce qu'on exporte

Les fichiers de `app/src/kit/` sont **à la fois** utilisés par l'aperçu **et** exportés mot pour mot (importés en `?raw` dans `lib/export.ts`). Conséquences :

- toute modification de `kit/components.css`, `kit/base.css` ou `kit/ui.tsx` change ce que reçoivent les utilisateurs : traite-la comme un changement d'API publique ;
- `components.css` n'utilise **que** des variables du thème (`var(--color-…)`, `var(--space-…)`…), jamais de couleur en dur. Un test vérifie que chaque variable utilisée est bien définie ;
- `ui.tsx` doit rester **autonome** : il n'importe que `react`, puisque l'utilisateur le copie seul dans son projet. Ne mets pas `'use client'` dans le fichier : l'export l'ajoute.

### 3. L'accessibilité est une garantie, pas une option

Chroma promet des contrastes conformes « quelle que soit la couleur de départ ». Tout nouveau rôle de couleur doit :

- passer par un ajustement de contraste (`fitContrast` dans `lib/color.ts`, ou la sélection de nuance de `pickState` dans `lib/system.ts`) ;
- être couvert par les tests de contraste (`theme.test.ts`, `system.test.ts`) **et**, s'il sert à du texte ou à un contrôle, apparaître dans `contrastChecks()` (`lib/checks.ts`).

Côté interface : cibles tactiles d'au moins 44 px sur écran tactile, focus visible, animations désactivées avec `prefers-reduced-motion`, textes de 12 px minimum.

### 4. Pas de dépendance d'exécution

L'application ne dépend que de React. Avant d'ajouter une bibliothèque, ouvre une issue pour en discuter : la plupart des besoins (couleurs, modales, onglets) sont déjà couverts sans dépendance.

## Ajouter…

### Une ambiance

1. Dans `lib/theme.ts`, ajoute l'identifiant au type `MoodId`, puis l'entrée dans `MOODS` : saturation, teinte des neutres, décalage d'accent, rayon, et paire de polices, échelle et densité par défaut.
2. C'est tout. L'ambiance apparaît dans le générateur, sur la landing et dans les liens partageables, et elle est **automatiquement testée** : les tests parcourent `MOOD_IDS`.
3. Lance `npm test`. Si un contraste échoue, ajuste les paramètres de l'ambiance plutôt que d'assouplir le test.

### Une paire de polices

1. Dans `lib/fonts.ts`, ajoute l'identifiant au type `FontPairId`, puis l'entrée dans `FONT_PAIRS` : piles CSS complètes avec une police de secours système, graisse et interlettrage des titres, et familles Google Fonts au format `Famille:wght@400;600`.
2. La police est chargée à la demande dans le générateur et ajoutée en `@import` aux exports.

### Un format d'export

1. Dans `lib/export.ts`, ajoute l'identifiant au type `ExportFormat`, une entrée dans `EXPORT_FORMATS` (libellé, nom de fichier, aide, groupe `theme` ou `components`), puis le `case` correspondant dans `exportTheme()`.
2. Construis la sortie à partir de `modeTokens()` / `baseTokens()` (ou de `sys` directement), jamais à partir de valeurs recopiées.
3. Ajoute un test dans `system.test.ts` qui vérifie la structure attendue du fichier généré.

### Une variable du système

Ajoute-la dans `modeTokens()` si elle change entre clair et sombre, sinon dans `baseTokens()` (`lib/system.ts`). Les exports CSS et Tailwind v4 la reprennent automatiquement. Les exports Tailwind v3, shadcn/ui et Figma ont leur propre correspondance de noms : mets-les à jour si la variable y a un sens.

### Un composant

1. Styles dans `kit/components.css`, avec une classe préfixée `ui-` en notation BEM (`ui-carte`, `ui-carte__titre`, `ui-carte--compacte`), uniquement à partir des variables du thème.
2. Composant React dans `kit/ui.tsx` : typé, avec `className` transmis, `forwardRef` pour les champs, et les attributs ARIA nécessaires.
3. Ajoute-le à la vitrine `components/previews/Components.tsx`, pour qu'il soit visible et vérifié dans les deux modes.
4. Mets à jour le décompte des composants dans le README si besoin.

### Une page d'aperçu

1. Ajoute l'identifiant à `PreviewId` et l'entrée dans `PREVIEWS` (`data.ts`).
2. Crée le composant dans `components/previews/`. Les pages d'exemple utilisent les variables `--t-*` (`themeVars()`), le kit utilise les variables exportées (`systemVars()`) : les deux sont disponibles dans le cadre d'aperçu.
3. Branche-le dans `components/Preview.tsx`.

## Conventions

- **Langue** : interface, commentaires et documentation en **français**. L'interface tutoie l'utilisateur (« Choisis une couleur »).
- **TypeScript** strict : pas de `any`, pas de `@ts-ignore`.
- **Commentaires** : ils expliquent le *pourquoi* (un seuil, un contournement de navigateur), pas ce que le code dit déjà.
- **CSS** :
  - interface du générateur : jetons de `styles.css` (`--ink`, `--paper`, `--line`…), eux-mêmes branchés sur `brand.css` ;
  - landing : variables de `brand.css` ;
  - kit : uniquement les variables du thème exporté ;
  - pas de couleur en dur, sauf exception justifiée en commentaire.
- **Nommage** : composants React en `PascalCase`, classes CSS en BEM (`bloc__élément--variante`).
- **Accessibilité** : utilise de vrais éléments (`<button>`, `<label>`, `<dialog>`) plutôt que des `<div>` cliquables.

## Signaler un bug

Ouvre une issue avec :

- ce que tu as fait, ce que tu attendais et ce qui s'est passé ;
- le **lien partageable** du générateur (bouton « Copier le lien ») : il contient le thème exact et permet de reproduire le problème ;
- le navigateur, le système et la largeur d'écran ;
- une capture, si c'est visuel.

Pour un problème de contraste, indique la paire concernée et le ratio affiché dans le panneau « Contrastes WCAG ».
