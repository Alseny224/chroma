import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Deux pages : la landing (accueil) et le générateur.
      input: { main: 'index.html', generateur: 'generateur.html' },
    },
  },
});
