import { wasm } from '@rollup/plugin-wasm';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const plugins = [
  nodePolyfills(),
  replace({
    preventAssignment: true,
    'node-tfhe': 'tfhe',
    'kms/node/': 'kms/web/',
  }),
  typescript({
    tsconfig: './tsconfig.rollup.json',
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
      dir: 'lib',
      name: 'fhevm',
      format: 'es',
    },
    plugins: [...plugins],
  },
  {
    input: 'src/node.ts',
    output: {
      file: 'lib/node.cjs',
      name: 'fhevm',
      format: 'cjs',
    },
    plugins: [
      commonjs(),
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
    ],
  },
];
