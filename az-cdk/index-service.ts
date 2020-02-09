import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { LambdaApiConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';

const tableUsers = `${envars.AZCDK_TABLE_USERS}-${envars.STAGE.toUpperCase()}`;

const app = new App();
const stack = new Stack(app, `AZCDK-${envars.STAGE}-dynamo`);

const api = new LambdaApiConstruct(stack, 'API', {
  gatewayName: `AZCDK-${envars.STAGE}-api`,
  cognitoId: envars.AZCDK_USER_POOL_ID,
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
      accessDynamoTables: [tableUsers],
      envars: {
        STAGE: envars.STAGE,
        TABLE_USERS: envars.AZCDK_TABLE_USERS,
      },
      dirDist: 'dist_graphql',
    },
  ],
  useLayers: true,
  customDomain: {
    prefixedDomain: `api-${envars.STAGE}.${envars.AZCDK_WEBSITE_DOMAIN}`,
    certificateArn: envars.AZCDK_WEBSITE_CERTIFICATE_ARN,
    r53HostedZoneId: envars.AZCDK_WEBSITE_HOSTED_ZONE_ID,
  },
});

new CfnOutput(stack, 'ApiUrl', { value: api.apiUrl });
