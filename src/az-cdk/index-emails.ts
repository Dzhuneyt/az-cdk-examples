import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { ReceiveEmailSQSConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-emails`;
const stack = new Stack(app, stackName);

const topic = 'tester-emails';

new ReceiveEmailSQSConstruct(stack, 'EmailSQS', {
  ruleSetName: 'integration-tests',
  emails: [
    {
      email: envars.TESTER_EMAIL,
      topic,
    },
  ],
});

new CfnOutput(stack, 'QueueUrl', {
  value: `https://sqs.us-east-1.amazonaws.com/${stack.account}/${topic}`,
});
