import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-app`);

const website = new WebsiteConstruct(stack, 'App', {
  domain: envars.WEBSITE_DOMAIN,
  prefix: 'app',
  comment: 'This is the App',
  hostedZoneId: envars.WEBSITE_HOSTED_ZONE_ID,
  certificateArn: envars.WEBSITE_CERTIFICATE_ARN,
});

new CfnOutput(stack, 'AppCloudFrontId', {
  value: website.cloudfrontDistributionId,
});
