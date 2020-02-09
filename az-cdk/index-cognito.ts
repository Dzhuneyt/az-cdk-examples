import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';

const appUrl = `https://app.${envars.AZCDK_WEBSITE_DOMAIN}/`;
const tableUsers = `${envars.AZCDK_TABLE_USERS}-${envars.STAGE.toUpperCase()}`;

const app = new App();
const stack = new Stack(app, `AZCDK-${envars.STAGE}-cognito`);

const construct = new CognitoConstruct(stack, 'Cognito', {
  poolName: `AZCDK-${envars.STAGE}-users`,
  emailSendingAccount: `admin@${envars.AZCDK_EMAILS_SENDING_DOMAIN}`,
  domainPrefix: envars.AZCDK_USER_POOL_DOMAIN_PREFIX,
  facebookClientId: envars.AZCDK_FACEBOOK_CLIENT_ID,
  facebookClientSecret: envars.AZCDK_FACEBOOK_CLIENT_SECRET,
  googleClientId: envars.AZCDK_GOOGLE_CLIENT_ID,
  googleClientSecret: envars.AZCDK_GOOGLE_CLIENT_SECRET,
  callbackUrls: [appUrl, `https://localhost:3000/`],
  logoutUrls: [appUrl, `https://localhost:3000/`],
  postConfirmTrigger: true,
  postConfirmSendEmail: true,
  postConfirmDynamoTable: tableUsers,
  useLayers: true,
  dirDist: 'dist_cognito',
  envars,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });
new CfnOutput(stack, 'ClientId', { value: construct.clientId });
