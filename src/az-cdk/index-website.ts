import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-website`;
const stack = new Stack(app, stackName);

const website = new WebsiteConstruct(stack, 'Website', {
  domain: envars.WEBSITE_DOMAIN,
  comment: 'Testing my az-cdk library',
  hostedZoneId: envars.WEBSITE_HOSTED_ZONE_ID,
  certificateArn: envars.WEBSITE_CERTIFICATE_ARN,
});

new CfnOutput(stack, 'CloudFrontId', {
  value: website.cloudfrontDistributionId,
});
