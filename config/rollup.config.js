import { createRequire } from 'node:module';

import { wasm } from '@rollup/plugin-wasm';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const require = createRequire(import.meta.url);

const nodePlugins = [
  alias({
    entries: [
      {
        find: 'node-kms',
        replacement: require.resolve('../src/kms/node/index.js'),
      },
    ],
  }),
  copy({
    targets: [
      {
        src: require.resolve('../src/kms/node/kms_lib_bg.wasm'),
        dest: 'lib/node/',
      },
    ],
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.node.rollup.json',
  }),
];

const webPlugins = [
  alias({
    entries: [
      {
        find: 'node-kms',
        replacement: require.resolve('../src/kms/web/kms_lib.js'),
      },
    ],
  }),
  copy({
    targets: [
      {
        src: require.resolve('../src/kms/web/kms_lib_bg.wasm'),
        dest: 'lib/web',
      },
    ],
  }),
  nodePolyfills(),
  replace({
    preventAssignment: true,
    'node-tfhe': 'tfhe',
    'kms/node/': 'kms/web/',
  }),
  typescript({
    tsconfig: './tsconfig.web.rollup.json',
    exclude: 'node_modules/**',
  }),
  wasm({
    targetEnv: 'browser',
    maxFileSize: 10000000,
  }),
  resolve({
    browser: true,
    resolveOnly: ['tfhe'],
    extensions: ['.js', '.ts', '.wasm'],
  }),
  commonjs(),
];

export default [
  {
    input: 'src/web.ts',
    output: {
      file: 'lib/web/index.js',
      name: 'fhevm',
      format: 'es',
    },
    plugins: [...webPlugins],
  },
  {
    input: 'src/node.ts',
    output: {
      file: 'lib/node/index.cjs',
      name: 'fhevm',
      format: 'cjs',
    },
    plugins: [...nodePlugins],
  },
];
