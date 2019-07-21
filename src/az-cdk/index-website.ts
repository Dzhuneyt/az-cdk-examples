import { App, Stack } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stack = new Stack(app, `${config.appName}-website`);

new WebsiteConstruct(stack, 'Website', {
  domain: 'azcdk.xyz',
  comment: 'Testing my az-cdk library',
  certificateId: envars.CERTIFICATE_ID,
  verifyDomain: true,
});
