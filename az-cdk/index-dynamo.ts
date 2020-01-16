import { App, Stack } from '@aws-cdk/core';
import { AttributeType, ProjectionType } from '@aws-cdk/aws-dynamodb';
import { DynamoConstruct } from '@cpmech/az-cdk';
import { cfg } from './envars';

const app = new App();

const stack = new Stack(app, `${cfg.prefix}-dynamo`);

new DynamoConstruct(stack, 'Dynamo', {
  dynamoTables: [
    {
      name: cfg.tableParams,
      partitionKey: 'paramId',
      sortKey: 'category',
      onDemand: true,
    },
    {
      name: cfg.tableUsers,
      partitionKey: 'userId',
      sortKey: 'aspect',
      onDemand: true,
      gsi: {
        indexName: 'email2access',
        partitionKey: { name: 'access', type: AttributeType.STRING },
        sortKey: { name: 'email', type: AttributeType.STRING },
        nonKeyAttributes: ['phone', 'accountStatus'],
        projectionType: ProjectionType.INCLUDE,
      },
    },
  ],
});
