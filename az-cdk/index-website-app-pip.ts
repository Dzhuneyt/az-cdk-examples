import { App } from '@aws-cdk/core';
import { WebsitePipelineStack, ssmSecret } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';
import { config } from './config';

const app = new App();

const githubSecret = ssmSecret(config.ssmParamGithub);

new WebsitePipelineStack(app, `${cfg.prefix}-app-pip`, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  websiteBucketName: cfg.appWebsiteBucketName,
  cloudfrontDistributionId: envars.WEBSITE_CLOUDFRONT_ID,
  notificationEmails: envars.PIPELINE_NOTIFICATION_EMAILS.split(','),
  assetsDir: 'public-app/build',
  githubSecret,
  envars,
});
