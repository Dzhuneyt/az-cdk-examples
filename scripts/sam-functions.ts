import fs from 'fs';
import yaml from 'js-yaml';
import { runCmd } from '@cpmech/basic';

const TEMPLATE = `/tmp/template-MYAPP.yml`;

async function runLambda(key: string) {
  const out = await runCmd(
    'sam',
    ['local', 'invoke', key, '--no-event', '--template', TEMPLATE],
    false,
  );
  const res = JSON.parse(out);
  const body = JSON.parse(res.body);
  console.log(res.statusCode, body);
}

async function main() {
  try {
    const out = await runCmd('npm', [
      'run',
      'cdk-service',
      '--silent',
      '--',
      'synth',
      '--no-staging',
    ]);
    fs.writeFileSync(TEMPLATE, out);
    const doc = yaml.safeLoad(out);
    const res = doc.Resources;
    for (const [key, value] of Object.entries(res)) {
      if ((value as any).Type === 'AWS::Lambda::Function') {
        console.log(`... running ${key} ...`);
        await runLambda(key);
      }
    }
  } catch (err) {
    console.warn(err);
  }
}

main();
