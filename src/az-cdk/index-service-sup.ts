import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { Location } from '@aws-cdk/aws-s3';
import { LambdaApiConstruct, PipelineStackCoupled, ssmSecret } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';

initEnvars(envars);

const app = new App();

const serviceStackName = `${config.appName}-${envars.STAGE}-service2`;
const serviceStack = new Stack(app, serviceStackName);

const api = new LambdaApiConstruct(serviceStack, 'API', {
  gatewayName: `${config.appName}-${envars.STAGE}-api2`,
  cognitoId: envars.USER_POOL_ID,
  lambdas,
});

new CfnOutput(serviceStack, 'ApiUrl', { value: api.apiUrl });

const s3dirToParams = (coords: Location) => {
  return { ...api.lambdaDir.assign(coords) };
};

const githubSecret = ssmSecret(config.ssmParamGithub);

const stackName = `${config.appName}-${envars.STAGE}-service-sup`;
new PipelineStackCoupled(app, stackName, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  githubSecret,
  serviceStackName,
  s3dirToParams,
  envars,
});
