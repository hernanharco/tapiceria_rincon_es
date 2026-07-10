// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertimos import.meta.url a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // @ apunta a src
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Librerías de UI y utilidades pesadas separadas del bundle principal
          'vendor-ui': [
            'react-icons',
            'sweetalert2',
            'sonner',
          ],
          'vendor-pdf': [
            'jspdf',
            'html2canvas',
            'react-pdf',
          ],
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
        },
      },
    },
    // Advertencia de chunk grande a partir de 500kB (por defecto 500kB)
    chunkSizeWarningLimit: 500,
  },
});
