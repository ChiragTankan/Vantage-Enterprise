import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // This ensures that variables like API_KEY are available during build.
  // Fix: Cast process to any to bypass typing conflict where 'Process' might refer to browser types instead of Node types
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Direct injection of the provided key while keeping the process.env.API_KEY reference in the app code
      'process.env.API_KEY': JSON.stringify('AIzaSyCK53ENC5PZAK9TdmqUSwKY4cXBs9ir7yY'),
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: './index.html'
        }
      }
    },
    server: {
      port: 3000
    }
  };
});