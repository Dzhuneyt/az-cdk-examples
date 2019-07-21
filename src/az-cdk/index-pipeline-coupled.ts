import { App, Stack } from '@aws-cdk/core';
import { Location } from '@aws-cdk/aws-s3';
import { LambdaApiConstruct, PipelineStackCoupled, ssmSecret } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';

initEnvars(envars);

const app = new App();

const serviceStackName = `C-${config.appName}-service`;
const serviceStack = new Stack(app, serviceStackName);

const api = new LambdaApiConstruct(serviceStack, 'API', {
  gatewayName: `C-${config.appName}`,
  cognitoId: envars.USER_POOL_ID,
  lambdas,
});

const s3dirToParams = (coords: Location) => {
  return { ...api.lambdaDir.assign(coords) };
};

const githubSecret = ssmSecret(config.ssmParamGithub);

new PipelineStackCoupled(app, `C-${config.appName}-pipeline`, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  githubSecret,
  serviceStackName,
  s3dirToParams,
  envars,
});
