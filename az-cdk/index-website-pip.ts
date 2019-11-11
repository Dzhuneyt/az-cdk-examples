import { App } from '@aws-cdk/core';
import { WebsitePipelineStack, ssmSecret } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';
import { config } from './config';

const app = new App();

const githubSecret = ssmSecret(config.ssmParamGithub);

new WebsitePipelineStack(app, `${cfg.prefix}-website-pip`, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  websiteBucketName: cfg.websiteBucketName,
  cloudfrontDistributionId: envars.WEBSITE_CLOUDFRONT_ID,
  notificationEmails: envars.PIPELINE_NOTIFICATION_EMAILS.split(','),
  assetsDir: 'public',
  githubSecret,
  envars,
});
