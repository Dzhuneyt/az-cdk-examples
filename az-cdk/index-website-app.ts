import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';

const app = new App();

const stack = new Stack(app, `AZCDK-${envars.STAGE}-app`);

const website = new WebsiteConstruct(stack, 'App', {
  domain: envars.AZCDK_WEBSITE_DOMAIN,
  prefix: 'app',
  comment: 'This is the App',
  hostedZoneId: envars.AZCDK_WEBSITE_HOSTED_ZONE_ID,
  certificateArn: envars.AZCDK_WEBSITE_CERTIFICATE_ARN,
});

new CfnOutput(stack, 'AppCloudFrontId', {
  value: website.cloudfrontDistributionId,
});
