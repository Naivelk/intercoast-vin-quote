import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': {
        ...Object.entries(env).reduce((prev, [key, val]) => {
          return {
            ...prev,
            [key]: val,
          };
        }, {}),
      },
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
  };
});
