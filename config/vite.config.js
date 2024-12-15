import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { ignoreURL, changeLoadingWorker } from './vite.replace';

const basePath = 'https://dtabdkf62u742.cloudfront.net/fhevmjs/0.6.2/';

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  build: {
    lib: {
      name: 'fhevmjs',
      fileName: 'fhevmjs',
      entry: ['lib/web.js'],
    },
    outDir: 'bundle',
  },
  plugins: [
    changeLoadingWorker(basePath),
    ignoreURL(basePath),
    nodePolyfills(),
    viteStaticCopy({
      targets: [
        {
          src: 'lib/tfhe_bg.wasm',
          dest: '.',
        },
        {
          src: 'lib/kms_lib_bg.wasm',
          dest: '.',
        },
      ],
    }),
  ],
  worker: {
    format: 'iife',
    plugins: [ignoreURL(basePath)],
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
