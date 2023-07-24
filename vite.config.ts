import react from '@vitejs/plugin-react';
import { UserConfig, ConfigEnv } from 'vite';
import { join } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'

const srcRoot = join(__dirname, 'src');

export default ({ command }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    root: srcRoot,
    plugins: [react(), tsconfigPaths()],
    build: {
      outDir: join(srcRoot, '/out'),
      emptyOutDir: true,
      rollupOptions: {}
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT
    },
    optimizeDeps: {
      exclude: ['path']
    }
  }
  // DEV
  if (command === 'serve') {
    return {
      base: '/',
      ...config
    };
  }
  // PROD
  return {
    base: './',
    ...config
  };
};
