import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/events': 'http://localhost:3000',
      '/demo': 'http://localhost:3000',
      '/reset': 'http://localhost:3000',
      '/health': 'http://localhost:3000'
    }
  }
});
