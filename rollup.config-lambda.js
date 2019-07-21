import fs from 'fs';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const cacheRoot = '/tmp/rollup_typescript_cache';

const isTest = filename => /\.(test|spec)\.[jt]sx?$/.test(filename);

const lamDir = path.resolve(__dirname, 'src', 'lambda');
const lambdas = fs.readdirSync(lamDir).filter(name => !isTest(name));

export default lambdas.map(lambda => ({
  input: path.join('src', 'lambda', lambda),
  output: {
    file: path.join('dist', lambda.substr(0, lambda.lastIndexOf('.')) + '.js'),
    format: 'cjs',
  },
  external: ['aws-sdk'],
  plugins: [
    typescript({
      cacheRoot,
      typescript: require('typescript'),
    }),
    resolve({
      mainFields: ['module'],
    }),
  ],
}));
