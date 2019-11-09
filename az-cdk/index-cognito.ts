import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';
import { config } from './config';

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-cognito`;

const stack = new Stack(app, stackName);

const poolName = `${config.appName}-${envars.STAGE}-users`;

const construct = new CognitoConstruct(stack, 'Cognito', {
  emailSendingAccount: `tester@${envars.EMAILS_DOMAIN}`,
  poolName,
  facebookClientId: envars.FACEBOOK_CLIENT_ID,
  facebookClientSecret: envars.FACEBOOK_CLIENT_SECRET,
  googleClientId: envars.GOOGLE_CLIENT_ID,
  googleClientSecret: envars.GOOGLE_CLIENT_SECRET,
  callbackUrls: [`https://app.${envars.WEBSITE_DOMAIN}/`],
  logoutUrls: [`https://app.${envars.WEBSITE_DOMAIN}/`],
  postConfirmTrigger: true,
  postConfirmSendEmail: true,
  postConfirmDynamoTable: 'USERS',
  useLayers: true,
  updateClientSettings: true,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });

new CfnOutput(stack, 'ClientId', { value: construct.clientId });
