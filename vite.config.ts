import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  plugins: [react(), vercel()],
  base: "/", // <--- AGGIUNTO: fondamentale per routing SPA
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
});
