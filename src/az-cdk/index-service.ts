import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { LambdaApiConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-service1`;
const stack = new Stack(app, stackName);

const api = new LambdaApiConstruct(stack, 'API', {
  gatewayName: `${config.appName}-${envars.STAGE}-api1`,
  assetsDir: 'dist',
  cognitoId: envars.USER_POOL_ID,
  lambdas,
});

new CfnOutput(stack, 'ApiUrl', { value: api.apiUrl });
