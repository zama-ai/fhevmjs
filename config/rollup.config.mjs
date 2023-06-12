import { wasm } from '@rollup/plugin-wasm';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const plugins = [
  nodePolyfills(),
  replace({
    preventAssignment: true,
    'node-tfhe': 'tfhe',
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
];

export default [
  {
    input: 'src/web.ts',
    output: {
      dir: 'lib',
      name: 'zamaWeb3',
      format: 'cjs',
    },
    plugins: [...plugins],
  },
  {
    input: 'src/node.ts',
    output: {
      dir: 'lib',
      name: 'zamaWeb3',
      format: 'cjs',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
    ],
  },
];
