import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-website`);

const website = new WebsiteConstruct(stack, 'Website', {
  domain: envars.WEBSITE_DOMAIN,
  comment: 'Testing my az-cdk library',
  hostedZoneId: envars.WEBSITE_HOSTED_ZONE_ID,
  certificateArn: envars.WEBSITE_CERTIFICATE_ARN,
});

new CfnOutput(stack, 'CloudFrontId', {
  value: website.cloudfrontDistributionId,
});
