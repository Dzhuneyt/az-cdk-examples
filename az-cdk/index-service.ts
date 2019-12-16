import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { LambdaApiConstruct } from '@cpmech/az-cdk';
import { envars, cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-service`);

const api = new LambdaApiConstruct(stack, 'API', {
  gatewayName: cfg.gatewayName,
  cognitoId: envars.USER_POOL_ID,
  lambdas: [
    {
      filenameKey: 'open',
      handlerName: 'open',
      httpMethods: ['GET'],
      route: 'open',
      unprotected: true,
      dirDist: 'dist_api',
    },
    {
      filenameKey: 'closed',
      handlerName: 'closed',
      httpMethods: ['GET'],
      route: 'closed',
      dirDist: 'dist_api',
    },
    {
      filenameKey: 'graphql',
      handlerName: 'server',
      httpMethods: ['POST'],
      route: 'graphql',
      accessDynamoTables: [cfg.tableUsers],
      envars: {
        STAGE: envars.STAGE,
        TABLE_USERS_PREFIX: envars.TABLE_USERS_PREFIX,
      },
      dirDist: 'dist_graphql',
    },
  ],
  useLayers: true,
  customDomain: {
    prefixedDomain: cfg.apiDomain,
    certificateArn: envars.WEBSITE_CERTIFICATE_ARN,
    r53HostedZoneId: envars.WEBSITE_HOSTED_ZONE_ID,
  },
});

new CfnOutput(stack, 'ApiUrl', { value: api.apiUrl });
