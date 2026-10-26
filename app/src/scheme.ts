// L'interface du site suit le thème système (indépendant du mode des aperçus).
export function syncColorScheme() {
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => (document.documentElement.dataset.theme = darkQuery.matches ? 'dark' : 'light');
  apply();
  darkQuery.addEventListener('change', apply);
}
