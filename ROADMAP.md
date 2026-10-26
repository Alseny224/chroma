# Feuille de route

Les chantiers de Chroma sont suivis dans les [issues GitHub](https://github.com/Alseny224/chroma/issues). Le détail et les critères « Fait quand » de chaque chantier sont dans son issue ; ce fichier n'en est que le sommaire.

**Priorités** : **P1** important ou bloquant · **P2** utile · **P3** confort

**Par où commencer** : [#6](https://github.com/Alseny224/chroma/issues/6) et [#3](https://github.com/Alseny224/chroma/issues/3) (les filets de sécurité), puis [#10](https://github.com/Alseny224/chroma/issues/10), la fonctionnalité qui manque le plus pour de vrais projets. Pour une première contribution, voir les issues [`good first issue`](https://github.com/Alseny224/chroma/issues?q=is%3Aopen+label%3A%22good+first+issue%22).

## Priorité haute (P1)

| Issue | Chantier | Type |
|---|---|---|
| [#3](https://github.com/Alseny224/chroma/issues/3) | Tests d'accessibilité automatiques (Playwright + axe) | Accessibilité |
| [#6](https://github.com/Alseny224/chroma/issues/6) | Compiler les exports dans de vrais projets en CI | Export |
| [#10](https://github.com/Alseny224/chroma/issues/10) | Imposer une couleur de marque précise | Fonctionnalité |

## Priorité moyenne (P2)

| Issue | Chantier | Type |
|---|---|---|
| [#1](https://github.com/Alseny224/chroma/issues/1) | Le champ hex refuse `#abc`, `rgb()`, `hsl()` et `oklch()` | Bug |
| [#2](https://github.com/Alseny224/chroma/issues/2) | Un logo monochrome ou gris ne donne aucun résultat | Bug |
| [#4](https://github.com/Alseny224/chroma/issues/4) | Simulation du daltonisme dans l'aperçu | Accessibilité |
| [#7](https://github.com/Alseny224/chroma/issues/7) | « Tout télécharger » en .zip | Export |
| [#8](https://github.com/Alseny224/chroma/issues/8) | Polices auto-hébergées / `next/font` | Export |
| [#11](https://github.com/Alseny224/chroma/issues/11) | Annuler / rétablir et historique | Fonctionnalité |
| [#12](https://github.com/Alseny224/chroma/issues/12) | Composants manquants dans le kit | Fonctionnalité |
| [#13](https://github.com/Alseny224/chroma/issues/13) | Bibliothèque de sections et starter kit | Fonctionnalité |
| [#16](https://github.com/Alseny224/chroma/issues/16) | Vérifier Safari et Firefox | Projet |

## Priorité basse (P3)

| Issue | Chantier | Type |
|---|---|---|
| [#5](https://github.com/Alseny224/chroma/issues/5) | Score de contraste APCA | Accessibilité |
| [#9](https://github.com/Alseny224/chroma/issues/9) | Exports SCSS, Style Dictionary, MUI et Flutter | Export |
| [#14](https://github.com/Alseny224/chroma/issues/14) | Transmettre le mode clair/sombre de la démo au générateur | Fonctionnalité |
| [#15](https://github.com/Alseny224/chroma/issues/15) | Interface en anglais | Fonctionnalité |

## Déjà fait

| Chantier | Où |
|---|---|
| Ombres de l'export shadcn/ui trop faibles en mode sombre | `app/src/lib/export.ts`, testé dans `system.test.ts` |
| CI GitHub Actions (tests, types, build) | `.github/workflows/ci.yml` |
| Modèles d'issues et de pull request | `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md` |
| Licence MIT | `LICENSE` |
