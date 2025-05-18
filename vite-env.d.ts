/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // aggiungi qui altre variabili di ambiente che userai nel frontend
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
