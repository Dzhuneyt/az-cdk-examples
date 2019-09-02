import { App, Stack, CfnOutput } from '@aws-cdk/core';
import {
  LambdaApiConstruct,
  ssmSecret,
  LambdaLayersConstruct,
  SUPipelineStack,
} from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';

initEnvars(envars);

const app = new App();

const serviceStackName = `${config.appName}-${envars.STAGE}-service2`;
const serviceStack = new Stack(app, serviceStackName);

const layers = new LambdaLayersConstruct(serviceStack, 'Layers', { dirLayers: '' });

const api = new LambdaApiConstruct(serviceStack, 'API', {
  gatewayName: `${config.appName}-${envars.STAGE}-api2`,
  cognitoId: envars.USER_POOL_ID,
  dirDist: '',
  lambdas,
  layers,
  customDomain: {
    prefixedDomain: `api2-dev.${envars.WEBSITE_DOMAIN}`,
    certificateArn: envars.WEBSITE_CERTIFICATE_ARN,
    r53HostedZoneId: envars.WEBSITE_HOSTED_ZONE_ID,
  },
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
