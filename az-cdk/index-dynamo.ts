import { App, Stack } from '@aws-cdk/core';
import { DynamoConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';
import { config } from './config';

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-dynamo`;

const stack = new Stack(app, stackName);

const construct = new DynamoConstruct(stack, 'Dynamo', {
  dynamoTables: [
    {
      name: 'PARAMS',
      partitionKey: 'category',
      sortKey: 'key',
    },
    {
      name: 'USERS',
      partitionKey: 'userId',
      sortKey: 'aspect',
    },
  ],
});
