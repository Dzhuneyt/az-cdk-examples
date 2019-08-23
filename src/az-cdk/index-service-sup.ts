import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { LambdaApiConstruct, ssmSecret, LambdaLayersConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';
import { SUPipelineStack } from './SUPipelineStack';

initEnvars(envars);

const app = new App();

const serviceStackName = `${config.appName}-${envars.STAGE}-service2`;
const serviceStack = new Stack(app, serviceStackName);

const layers = new LambdaLayersConstruct(serviceStack, 'Layers');

const api = new LambdaApiConstruct(serviceStack, 'API', {
  gatewayName: `${config.appName}-${envars.STAGE}-api2`,
  cognitoId: envars.USER_POOL_ID,
  lambdas,
  layers,
});

const stackName = `${config.appName}-${envars.STAGE}-service-sup`;
new SUPipelineStack(app, stackName, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  githubSecret: ssmSecret(config.ssmParamGithub),
  dirDist: [api.dirDist],
  dirLayers: [layers.dirLayers],
  serviceStackName,
  envars,
});

new CfnOutput(serviceStack, 'ApiUrl', { value: api.apiUrl });
