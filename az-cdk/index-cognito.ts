import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-cognito`);

const construct = new CognitoConstruct(stack, 'Cognito', {
  poolName: cfg.poolName,
  emailSendingAccount: cfg.senderEmail,
  domainPrefix: envars.USER_POOL_DOMAIN_PREFIX,
  facebookClientId: envars.FACEBOOK_CLIENT_ID,
  facebookClientSecret: envars.FACEBOOK_CLIENT_SECRET,
  googleClientId: envars.GOOGLE_CLIENT_ID,
  googleClientSecret: envars.GOOGLE_CLIENT_SECRET,
  callbackUrls: [cfg.appUrl, `https://localhost:3000/`],
  logoutUrls: [cfg.appUrl, `https://localhost:3000/`],
  postConfirmTrigger: true,
  postConfirmSendEmail: true,
  postConfirmDynamoTable: cfg.tableUsers,
  useLayers: true,
  envars,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });

new CfnOutput(stack, 'ClientId', { value: construct.clientId });
