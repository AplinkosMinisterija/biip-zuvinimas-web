/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production';
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_MAPS_HOST?: string;
  readonly VITE_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
