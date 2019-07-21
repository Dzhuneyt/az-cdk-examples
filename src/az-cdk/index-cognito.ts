import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stack = new Stack(app, `${config.appName}-cognito`);

const poolName = 'dear-users';

const construct = new CognitoConstruct(stack, 'Cognito', {
  emailSendingAccount: envars.TESTER_EMAIL,
  poolName,
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });
