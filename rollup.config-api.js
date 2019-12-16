import fs from 'fs';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';

const external = [
  'aws-sdk',
  'graphql',
  'graphql-tag',
  'graphql-tools',
  'apollo-server-lambda',
  'querystring',
  'mailparser',
];

const dir = 'api';

const cacheRoot = `/tmp/rollup_typescript_${dir}`;

const isTest = filename => /\.(test|spec)\.[jt]sx?$/.test(filename);

const isJSFile = filename => /\.[jt]sx?$/.test(filename);

const lamDir = path.resolve(__dirname, 'src', dir);

const lambdas = fs
  .readdirSync(lamDir)
  .filter(n => !isTest(n))
  .filter(n => isJSFile(n));

export default lambdas.map(lambda => ({
  external,
  input: path.join('src', dir, lambda),
  output: {
    file: path.join(`dist_${dir}`, lambda.substr(0, lambda.lastIndexOf('.')) + '.js'),
    format: 'cjs',
  },
  plugins: [
    typescript({
      cacheRoot,
      typescript: require('typescript'),
      tsconfigOverride: { compilerOptions: { declaration: false } },
    }),
    resolve({
      mainFields: ['module'],
      preferBuiltins: true,
    }),
  ],
}));
