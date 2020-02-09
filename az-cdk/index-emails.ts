import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { ReceiveEmailSQSConstruct } from '@cpmech/az-cdk';
import { email2key } from '@cpmech/basic';
import { envars } from './envars';

const receiverEmails = [
  `admin@${envars.AZCDK_EMAILS_RECEIVING_DOMAIN}`,
  `tester@${envars.AZCDK_EMAILS_RECEIVING_DOMAIN}`,
];

const app = new App();
const stack = new Stack(app, `AZCDK-${envars.STAGE}-dynamo`);

new ReceiveEmailSQSConstruct(stack, 'EmailSQS', {
  emails: receiverEmails,
});

receiverEmails.forEach(email => {
  const topic = email2key(email);
  new CfnOutput(stack, `Q-${topic}`, {
    value: `https://sqs.us-east-1.amazonaws.com/${stack.account}/${topic}`,
  });
});
