// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1000,
      cssMinify: 'lightningcss',
      minify: 'esbuild',
      target: 'esnext',
      modulePreload: { polyfill: false },
      rollupOptions: {
        treeshake: {
          preset: 'recommended',
          moduleSideEffects: false,
        },
        output: {
          manualChunks(id) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('lenis')) return 'lenis';
            if (id.includes('lucide')) return 'icons';
            if (id.includes('three')) return 'three-vendor';
          },
          compact: true,
        },
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'gsap', 'lenis'],
      exclude: ['@dotlottie/player-component'],
    },
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
      target: 'esnext',
    },
  },

  integrations: [react()],

  compressHTML: true,
});
