import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';

const app = new App();
const stack = new Stack(app, `AZCDK-${envars.STAGE}-dynamo`);

const website = new WebsiteConstruct(stack, 'Website', {
  domain: envars.AZCDK_WEBSITE_DOMAIN,
  comment: 'Testing my az-cdk library',
  hostedZoneId: envars.AZCDK_WEBSITE_HOSTED_ZONE_ID,
  certificateArn: envars.AZCDK_WEBSITE_CERTIFICATE_ARN,
});

new CfnOutput(stack, 'CloudFrontId', {
  value: website.cloudfrontDistributionId,
});
