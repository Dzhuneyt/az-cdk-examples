import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { IUserInput } from '@cpmech/az-cognito';
import { envars, cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-cognito`);

const users: IUserInput[] = [
  {
    email: cfg.testerEmail,
    password: envars.TESTER_USER_PASSWORD,
    groups: 'testers',
  },
];

const construct = new CognitoConstruct(stack, 'Cognito', {
  users,
  poolName: cfg.poolName,
  emailSendingAccount: cfg.senderEmail,
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
  updateClientSettings: true,
  envars,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });

new CfnOutput(stack, 'ClientId', { value: construct.clientId });
