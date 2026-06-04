/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  // Agrega aquí otras variables de entorno que necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
