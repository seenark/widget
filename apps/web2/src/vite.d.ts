/// <reference types="vite/client" />
/** biome-ignore-all lint/style/useConsistentTypeDefinitions: Vite need this */

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  VITE_CONVEX_URL: string;
  VITE_CONVEX_SITE_URL: string;
  // more env variables...
}
