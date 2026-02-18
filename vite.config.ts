import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readDataEnvApiKey = (): string | undefined => {
  const dataEnvPath = resolve(process.cwd(), 'data.env');

  if (!existsSync(dataEnvPath)) {
    return undefined;
  }

  const content = readFileSync(dataEnvPath, 'utf8');
  const match = content.match(/^\s*VITE_API_KEY\s*=\s*(.+)\s*$/m);

  if (!match) {
    return undefined;
  }

  return match[1].replace(/^['"]|['"]$/g, '').trim();
};

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' loads all variables regardless of prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const resolvedApiKey = env.VITE_API_KEY || env.API_KEY || readDataEnvApiKey() || '';

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(resolvedApiKey),
      'process.env.VITE_API_KEY': JSON.stringify(resolvedApiKey),
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
