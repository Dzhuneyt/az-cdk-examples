import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { IUserInput } from '@cpmech/az-cognito';
import { envars } from './envars';
import { config } from './config';

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-cognito`;

const stack = new Stack(app, stackName);

const poolName = `${config.appName}-${envars.STAGE}-users`;

const usersTable = `${envars.TABLE_USERS_PREFIX}-${envars.STAGE.toUpperCase()}`;

const users: IUserInput[] = [
  {
    email: `tester@${envars.WEBSITE_DOMAIN}`,
    password: envars.TESTER_USER_PASSWORD,
    groups: 'testers',
  },
];

const construct = new CognitoConstruct(stack, 'Cognito', {
  emailSendingAccount: `tester@${envars.EMAILS_DOMAIN}`,
  poolName,
  users,
  facebookClientId: envars.FACEBOOK_CLIENT_ID,
  facebookClientSecret: envars.FACEBOOK_CLIENT_SECRET,
  googleClientId: envars.GOOGLE_CLIENT_ID,
  googleClientSecret: envars.GOOGLE_CLIENT_SECRET,
  callbackUrls: [`https://app.${envars.WEBSITE_DOMAIN}/`, `https://localhost:3000/`],
  logoutUrls: [`https://app.${envars.WEBSITE_DOMAIN}/`, `https://localhost:3000/`],
  postConfirmTrigger: true,
  postConfirmSendEmail: true,
  postConfirmDynamoTable: usersTable,
  useLayers: true,
  updateClientSettings: true,
  envars,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });

new CfnOutput(stack, 'ClientId', { value: construct.clientId });
