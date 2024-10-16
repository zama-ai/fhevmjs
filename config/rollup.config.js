import { createRequire } from 'node:module';

import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import { wasm } from '@rollup/plugin-wasm';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);

const wasmBindgenRayon = fs.readdirSync(
  path.resolve('node_modules/tfhe/snippets'),
)[0];

const nodePlugins = [
  json(),
  wasm(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.rollup.json',
  }),
];

const webPlugins = [
  json(),
  url(),
  nodePolyfills(),
  replace({
    preventAssignment: true,
    'node-tfhe': 'tfhe',
    'node-tkms': 'tkms',
  }),
  typescript({
    tsconfig: './tsconfig.rollup.json',
    exclude: 'node_modules/**',
  }),
  wasm({
    targetEnv: 'browser',
    maxFileSize: 10000000,
  }),
  commonjs(),
  resolve({
    browser: true,
    resolveOnly: ['tfhe', 'tkms'],
    extensions: ['.js', '.ts', '.wasm'],
  }),
];

export default [
  {
    input: 'src/web.ts',
    output: {
      file: 'lib/web.js',
      name: 'fhevm',
      format: 'es',
    },
    plugins: [...webPlugins],
  },
  {
    input: `./node_modules/tfhe/snippets/${wasmBindgenRayon}/src/workerHelpers.worker.js`,
    output: {
      file: 'lib/workerHelpers.worker.js',
      name: 'worker',
      format: 'es',
    },
    plugins: [...webPlugins],
  },
  {
    input: 'src/node.ts',
    output: {
      file: 'lib/node.cjs',
      name: 'fhevm',
      format: 'cjs',
    },
    plugins: [...nodePlugins],
  },
];
