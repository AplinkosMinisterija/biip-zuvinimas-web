import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { manifestForPlugIn } from './manifest';

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn as Partial<VitePWAOptions>)],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    assetsInclude: ['**/*.png'],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      // @aplinkosministerija/design-system's package.json "main" points at
      // a UMD build that assumes a global React and breaks under Vitest.
      // The real app (vite build / vite dev) already resolves the "module"
      // (ESM) build instead — pin the test resolution to that same file so
      // tests exercise the same code the app actually ships.
      alias: {
        '@aplinkosministerija/design-system': fileURLToPath(
          new URL(
            './node_modules/@aplinkosministerija/design-system/dist/index.es.js',
            import.meta.url,
          ),
        ),
      },
      // Also route it (and its own `styled-components` import) through
      // Vite's resolver/transform instead of Node's native ESM loader, so
      // it shares the same single `styled-components` instance as the rest
      // of the app instead of a second one resolved independently.
      server: {
        deps: {
          inline: ['@aplinkosministerija/design-system'],
        },
      },
    },
  });
};
