import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-website`;
const stack = new Stack(app, stackName);

const verifyDomain = !!process.env.VERIFY_DOMAIN;
const certificateArn = verifyDomain ? envars.WEBSITE_CERTIFICATE_ARN : '';

const website = new WebsiteConstruct(stack, 'Website', {
  domain: envars.WEBSITE_DOMAIN,
  comment: 'Testing my az-cdk library',
  certificateArn,
  verifyDomain,
});

new CfnOutput(stack, 'CloudFrontId', {
  value: website.cloudfrontDistributionId,
});
