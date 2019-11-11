import { App } from '@aws-cdk/core';
import { PipelineStack, ssmSecret } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';
import { config } from './config';

const app = new App();

new PipelineStack(app, `${cfg.prefix}-service-pip`, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  githubSecret: ssmSecret(config.ssmParamGithub),
  notificationEmails: envars.PIPELINE_NOTIFICATION_EMAILS.split(','),
  services: ['apigateway', 'lambda'],
  envars,
});
