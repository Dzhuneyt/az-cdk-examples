import { App } from '@aws-cdk/core';
import { WebsitePipelineStack, ssmSecret } from '@cpmech/az-cdk';
import { envars } from './envars';

const app = new App();

new WebsitePipelineStack(app, `AZCDK-${envars.STAGE}-app-pip`, {
  githubRepo: 'az-cdk-examples',
  githubUser: 'cpmech',
  githubSecret: ssmSecret({ name: 'GHTOKEN', version: '1' }),
  websiteBucketName: `app.${envars.AZCDK_WEBSITE_DOMAIN}-app`,
  cloudfrontDistributionId: envars.AZCDK_WEBSITE_CLOUDFRONT_ID,
  notificationEmails: envars.AZCDK_PIPELINE_NOTIFICATION_EMAILS.split(','),
  assetsDir: 'public-app/build',
  envars,
});
