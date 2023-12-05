/// <reference types="vitest" />

import { Plugin, defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { augmentAppWithServiceWorker } from '@angular-devkit/build-angular/src/utils/service-worker';
import * as path from 'path';
import { UserConfig } from 'vite';

function swBuildPlugin(): Plugin {
  let config: UserConfig;
  return {
    name: 'analog-sw',
    config(_config) {
      config = _config;
    },
    async closeBundle() {
      if (config.build?.ssr) {
        return;
      }
      console.log('Building service worker');
      await augmentAppWithServiceWorker('.', process.cwd(), path.join(process.cwd(), 'dist/client'), '/');
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  publicDir: 'src/assets',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog(),
    swBuildPlugin()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test.ts'],
    include: ['**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
