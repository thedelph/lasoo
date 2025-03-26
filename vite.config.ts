import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          mapbox: ['mapbox-gl', 'react-map-gl'],
          ui: ['lucide-react', 'sonner'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
