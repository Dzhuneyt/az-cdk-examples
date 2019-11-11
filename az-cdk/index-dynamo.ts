import { App, Stack } from '@aws-cdk/core';
import { DynamoConstruct } from '@cpmech/az-cdk';
import { cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-dynamo`);

new DynamoConstruct(stack, 'Dynamo', {
  dynamoTables: [
    {
      name: cfg.tableParams,
      partitionKey: 'category',
      sortKey: 'key',
    },
    {
      name: cfg.tableUsers,
      partitionKey: 'userId',
      sortKey: 'aspect',
    },
  ],
});
