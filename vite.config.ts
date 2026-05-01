import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/My-Learning-Playground/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        404: '404.html',
        app: 'src/main.tsx',
        index: 'index.html',
      },
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/site.js',
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
