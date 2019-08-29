import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { LambdaApiConstruct, LambdaLayersConstruct } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import { lambdas } from './lambdas';
import config from './config.json';

initEnvars(envars);

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-service1`;
const stack = new Stack(app, stackName);

const layers = new LambdaLayersConstruct(stack, 'Layers', {
  dirLayers: 'layers',
});

const api = new LambdaApiConstruct(stack, 'API', {
  gatewayName: `${config.appName}-${envars.STAGE}-api1`,
  dirDist: 'dist',
  cognitoId: envars.USER_POOL_ID,
  lambdas,
  layers,
  customDomain: {
    prefixedDomain: `api1-dev.${envars.WEBSITE_DOMAIN}`,
    certificateArn: envars.WEBSITE_CERTIFICATE_ARN,
    r53HostedZoneId: envars.WEBSITE_HOSTED_ZONE_ID,
  },
});

new CfnOutput(stack, 'ApiUrl', { value: api.apiUrl });
