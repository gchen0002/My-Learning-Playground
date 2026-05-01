import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'spa',
  base: '/My-Learning-Playground/',
  plugins: [
    react(),
    {
      name: 'local-clean-url-fallback',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = request.url ?? '/';
          const acceptsHtml = request.headers.accept?.includes('text/html');
          const isAsset = url.includes('.') || url.startsWith('/@') || url.startsWith('/src/');

          if (request.method === 'GET' && acceptsHtml && !isAsset) {
            request.url = '/My-Learning-Playground/';
          }

          next();
        });
      },
    },
  ],
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
