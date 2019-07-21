import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { LambdaApiConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stack = new Stack(app, `${config.appName}-service`);

const construct = new LambdaApiConstruct(stack, 'API', {
  gatewayName: config.appName,
  assetsDir: 'dist',
  cognitoId: envars.USER_POOL_ID,
  lambdas,
});

new CfnOutput(stack, 'ApiUrl', { value: construct.apiUrl });
