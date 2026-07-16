import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Serve o site estático e as apps dinâmicas (ficha / admin)
 * a partir da raiz do repositório.
 *
 * Conteúdo wiki (1.x–5.x): HTML estático
 * App dinâmico: 5.6_ficha, 3.11_samurais, 2.11_civis, kigen_administração
 * Shared: ./shared (config, auth, schema, supabase client)
 */
export default defineConfig({
  root: '.',
  publicDir: false,
  server: {
    port: 5173,
    open: '/index.html'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ficha: resolve(__dirname, '5.6_ficha.html'),
        admin: resolve(__dirname, 'kigen_administração/index.html'),
        samurais: resolve(__dirname, '3.11_samurais.html'),
        civis: resolve(__dirname, '2.11_civis_listas.html')
      }
    }
  }
});
