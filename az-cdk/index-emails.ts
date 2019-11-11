import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { ReceiveEmailSQSConstruct } from '@cpmech/az-cdk';
import { email2key } from '@cpmech/basic';
import { cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-emails`);

new ReceiveEmailSQSConstruct(stack, 'EmailSQS', {
  emails: cfg.receiverEmails,
});

cfg.receiverEmails.forEach(email => {
  const topic = email2key(email);
  new CfnOutput(stack, `Q-${topic}`, {
    value: `https://sqs.us-east-1.amazonaws.com/${stack.account}/${topic}`,
  });
});
