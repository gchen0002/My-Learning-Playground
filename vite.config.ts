import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/My-Learning-Playground/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
