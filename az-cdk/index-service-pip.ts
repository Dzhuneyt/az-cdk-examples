import { App } from '@aws-cdk/core';
import { PipelineStack, ssmSecret } from '@cpmech/az-cdk';
import { envars } from './envars';

const app = new App();

new PipelineStack(app, `AZCDK-${envars.STAGE}-service-pip`, {
  githubRepo: 'az-cdk-examples',
  githubUser: 'cpmech',
  githubSecret: ssmSecret({ name: 'GHTOKEN', version: '1' }),
  notificationEmails: envars.AZCDK_PIPELINE_NOTIFICATION_EMAILS.split(','),
  services: ['apigateway', 'lambda'],
  envars,
});
