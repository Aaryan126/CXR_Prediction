import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are loaded from the root of the static site
  server: {
    port: 3000,
    open: true,
  },
});
