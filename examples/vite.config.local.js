import {defineConfig} from 'vite';
import {getOcularConfig} from '@vis.gl/dev-tools';
import {join} from 'path';
import {fileURLToPath} from 'url';

const rootDir = join(fileURLToPath(import.meta.url), '../..');

/** https://vitejs.dev/config/ */
export default defineConfig(async () => {
  const {aliases} = await getOcularConfig({root: rootDir});

  return {
    resolve: {
      alias: aliases
    },
    server: {
      open: true,
      port: 8080
    },
    optimizeDeps: {
      esbuildOptions: {target: 'es2020'}
    }
  };
});
