import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-cognito`;

const stack = new Stack(app, stackName);

const poolName = 'dear-users';

const construct = new CognitoConstruct(stack, 'Cognito', {
  emailSendingAccount: `tester@${envars.EMAILS_DOMAIN}`,
  poolName,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });
