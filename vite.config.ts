import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", // <--- AGGIUNTO: fondamentale per routing SPA
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
});
