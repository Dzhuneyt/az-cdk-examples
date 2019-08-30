import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { ReceiveEmailSQSConstruct } from '@cpmech/az-cdk';
import { email2key } from '@cpmech/basic';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-emails`;
const stack = new Stack(app, stackName);

const emails = [`admin@${envars.EMAILS_DOMAIN}`, `tester@${envars.EMAILS_DOMAIN}`];

new ReceiveEmailSQSConstruct(stack, 'EmailSQS', {
  emails,
});

emails.forEach(email => {
  const topic = email2key(email);
  new CfnOutput(stack, `Q-${topic}`, {
    value: `https://sqs.us-east-1.amazonaws.com/${stack.account}/${topic}`,
  });
});
