import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const cacheRoot = '/tmp/rollup_typescript_cache';

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default [
  {
    input: 'src/components/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    external,
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfig: 'tsconfig.rlib.json',
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      terser(),
    ],
  },
  {
    input: {
      index: 'src/components/index.ts',
    },
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    external,
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfig: 'tsconfig.rlib.json',
        tsconfigOverride: { compilerOptions: { declaration: true } },
      }),
      terser(),
    ],
  },
];
