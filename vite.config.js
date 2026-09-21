import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const page = (name) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
  root,
  publicDir: 'public',

  // Source maps: on in dev automatically; explicitly enabled for prod build below.
  css: {
    devSourcemap: true, // source maps for CSS/Sass during `vite dev`
  },

  build: {
    sourcemap: true, // emit .map files for JS and CSS in `vite build`
    rollupOptions: {
      // Multi-page site: every top-level .html file is its own entry point.
      input: {
        main: page('index.html'),
        catalog: page('catalog.html'),
      },
    },
  },
});
