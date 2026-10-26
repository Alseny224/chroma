import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Par défaut Vitest vide les CSS ; les exports lisent kit/*.css en ?raw.
  test: { css: true },
});
