import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        about: resolve(__dirname, 'about.html'),
        vision: resolve(__dirname, 'vision.html'),
        careers: resolve(__dirname, 'careers.html'),
      },
    },
  },
});
