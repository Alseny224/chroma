# Feuille de route

Les chantiers prévus pour Chroma, classés par type. Chaque entrée est rédigée pour devenir une issue GitHub.

**Priorités** : **P1** important ou bloquant · **P2** utile · **P3** confort

| Statut | |
|---|---|
| ✅ | Fait |
| ⬜ | À faire |

## Vue d'ensemble

| # | Titre | Type | Priorité | Statut |
|---|---|---|---|---|
| 1 | Ombres de l'export shadcn/ui trop faibles en mode sombre | Bug | P1 | ✅ |
| 2 | Le champ hex refuse `#abc`, `rgb()`, `hsl()`, `oklch()` | Bug | P2 | ⬜ |
| 3 | Un logo monochrome ou gris ne donne aucun résultat | Bug | P2 | ⬜ |
| 4 | Tests d'accessibilité automatiques (Playwright + axe) | Accessibilité | P1 | ⬜ |
| 5 | Simulation du daltonisme dans l'aperçu | Accessibilité | P2 | ⬜ |
| 6 | Score de contraste APCA | Accessibilité | P3 | ⬜ |
| 7 | Compiler les exports dans de vrais projets en CI | Export | P1 | ⬜ |
| 8 | « Tout télécharger » en .zip | Export | P2 | ⬜ |
| 9 | Polices auto-hébergées / `next/font` | Export | P2 | ⬜ |
| 10 | Exports SCSS, Style Dictionary, MUI, Flutter | Export | P3 | ⬜ |
| 11 | Imposer une couleur de marque précise | Fonctionnalité | P1 | ⬜ |
| 12 | Annuler / rétablir et historique | Fonctionnalité | P2 | ⬜ |
| 13 | Composants manquants dans le kit | Fonctionnalité | P2 | ⬜ |
| 14 | Bibliothèque de sections et starter kit | Fonctionnalité | P2 | ⬜ |
| 15 | Transmettre le mode clair/sombre de la démo au générateur | Fonctionnalité | P3 | ⬜ |
| 16 | Interface en anglais | Fonctionnalité | P3 | ⬜ |
| 17 | Ajouter une licence | Projet | P1 | ✅ |
| 18 | CI GitHub Actions | Projet | P1 | ✅ |
| 19 | Vérifier Safari et Firefox | Projet | P2 | ⬜ |
| 20 | Modèles d'issues et de pull request | Projet | P3 | ✅ |

**Ordre conseillé** : #7 et #4 (les filets de sécurité), puis #11, la fonctionnalité qui manque le plus pour de vrais projets.

---

## Bugs

### 1. Ombres de l'export shadcn/ui trop faibles en mode sombre — P1 ✅

Les ombres de l'export shadcn/ui étaient calculées avec l'opacité du mode clair pour les deux modes, ce qui les rendait presque invisibles en sombre.

**Corrigé** : chaque mode définit ses propres ombres (`--chroma-shadow-*` dans `:root` et `.dark`), sur lesquelles pointent les classes `shadow-*`. Un test le vérifie.

### 2. Le champ hex refuse les formats courants — P2

`#abc`, `rgb(…)`, `hsl(…)` et `oklch(…)` collés depuis Figma ou les outils de développement sont ignorés sans message : `isHex6` n'accepte que 6 caractères hexadécimaux.

**Fait quand** :
- ces formats sont convertis ;
- une valeur invalide affiche un message d'erreur relié au champ (`aria-describedby`).

### 3. Un logo monochrome ou gris ne donne aucun résultat — P2

L'extraction (`lib/logo.ts`) ignore les pixels peu saturés, trop clairs ou trop sombres. Un logo noir, gris ou blanc affiche donc « Aucune couleur vive trouvée ».

**Fait quand** :
- Chroma propose les 3 couleurs dominantes au choix ;
- un logo neutre produit un thème neutre plutôt qu'une erreur.

## Accessibilité

### 4. Tests d'accessibilité automatiques — P1

Les tests couvrent les contrastes générés, mais pas le site lui-même : focus, rôles ARIA, noms accessibles, ordre de tabulation.

**Fait quand** des tests Playwright + axe-core passent, en CI :
- sur la landing et sur les 5 onglets du générateur ;
- en clair et en sombre ;
- à 1440 et 390 px.

### 5. Simulation du daltonisme — P2

Ajouter à l'aperçu un sélecteur « Vision : normale / deutéranopie / protanopie / tritanopie », par filtre SVG. C'est essentiel pour juger si succès, attention et erreur restent distinguables.

### 6. Score de contraste APCA — P3

Afficher le score APCA, qui servira de base à WCAG 3, à côté du ratio WCAG 2 dans le panneau « Contrastes WCAG ».

## Exports

### 7. Compiler les exports dans de vrais projets — P1

Le contenu des exports est vérifié par des tests, mais aucun n'est compilé dans un vrai projet. C'est la première limite connue du README.

**Fait quand** une tâche CI génère trois projets, y colle les exports et les compile, puis prend une capture :
- Vite + React + Tailwind v4 ;
- Next.js + shadcn/ui ;
- une page HTML.

Un export cassé doit faire échouer la CI.

### 8. « Tout télécharger » en .zip — P2

Une archive par stack (HTML/CSS, React + Tailwind, Next.js) qui contient :
- le thème ;
- `components.css` et `ui.tsx` ;
- un court README d'installation.

C'est la première étape vers le starter kit (#14).

### 9. Polices auto-hébergées / `next/font` — P2

Proposer un export sans Google Fonts :
- un snippet `next/font/google` pour Next.js ;
- ou des `@font-face` vers des fichiers locaux.

C'est une question de vie privée (RGPD) et de performance.

### 10. Exports supplémentaires — P3

SCSS (variables + map), Style Dictionary, thème MUI, `ThemeData` Flutter.

## Fonctionnalités

### 11. Imposer une couleur de marque précise — P1

Aujourd'hui, l'accent est dérivé du primaire, et le primaire est ajusté pour le contraste. Une marque qui a déjà ses couleurs ne peut pas les imposer.

**Fait quand** :
- on peut **verrouiller** le primaire et/ou l'accent à une valeur exacte ;
- Chroma ajuste le reste du thème autour ;
- un avertissement explicite apparaît si la couleur imposée ne tient pas un seuil de contraste, avec une suggestion de variante conforme.

### 12. Annuler / rétablir et historique — P2

Ctrl+Z / Ctrl+Y dans le générateur, et les boutons précédent/suivant du navigateur entre les thèmes. Aujourd'hui, l'URL est remplacée à chaque changement, sans historique.

### 13. Composants manquants dans le kit — P2

Infobulle, menu déroulant, accordéon, pagination, fil d'Ariane, squelette de chargement. Chaque ajout suit le guide « Un composant » de [CONTRIBUTING.md](CONTRIBUTING.md).

### 14. Bibliothèque de sections et starter kit — P2

- Des sections de page prêtes : hero, fonctionnalités, tarifs, témoignages, FAQ, connexion, 404.
- Un assembleur de pages.
- Un projet Next.js ou Vite téléchargeable, déjà thématisé.

### 15. Transmettre le mode clair/sombre de la démo — P3

Sur la landing, « Ouvrir ce thème dans le générateur » transmet la couleur et l'ambiance, mais pas le mode choisi. Il faut ajouter un paramètre `mode` au lien partageable.

### 16. Interface en anglais — P3

Le site et la documentation n'existent qu'en français, ce qui limite l'audience d'un outil pour développeurs.

## Projet

### 17. Ajouter une licence — P1 ✅

Licence MIT © 2026 vectorX64 (`LICENSE`), mentionnée dans le README et le CONTRIBUTING. Le README précise que les thèmes générés appartiennent à l'utilisateur.

### 18. CI GitHub Actions — P1 ✅

`.github/workflows/ci.yml` lance les tests, la vérification TypeScript et le build à chaque push sur `main` et à chaque pull request. Les tests de #4 et #7 s'y ajouteront.

### 19. Vérifier Safari et Firefox — P2

Points à risque :
- l'interrupteur (`input::before` avec `appearance: none`) ;
- `color-mix()` ;
- les `<dialog>` (modale, panneau d'export) ;
- `100dvh` pour l'aperçu épinglé sur mobile ;
- l'extraction de couleur d'un logo SVG via `<canvas>`.

### 20. Modèles d'issues et de pull request — P3 ✅

Dans `.github/` :
- un formulaire de bug, qui demande le lien partageable du thème ;
- un formulaire de proposition de fonctionnalité ;
- un modèle de PR qui reprend la checklist du CONTRIBUTING.
