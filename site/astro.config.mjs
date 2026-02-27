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
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion': ['framer-motion'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion']
    }
  },

  integrations: [react()],

  compressHTML: true,
});
