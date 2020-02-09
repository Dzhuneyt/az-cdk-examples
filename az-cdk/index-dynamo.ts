import { App, Stack } from '@aws-cdk/core';
import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { DynamoConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';

const tableUsers = `${envars.AZCDK_TABLE_USERS}-${envars.STAGE.toUpperCase()}`;
const indexUsers = `${envars.AZCDK_TABLE_USERS}-index`;

const app = new App();
const stack = new Stack(app, `AZCDK-${envars.STAGE}-dynamo`);

new DynamoConstruct(stack, 'Dynamo', {
  dynamoTables: [
    {
      name: tableUsers,
      partitionKey: 'itemId',
      sortKey: 'aspect',
      gsi: {
        indexName: indexUsers,
        partitionKey: { name: 'aspect', type: AttributeType.STRING },
        sortKey: { name: 'indexSK', type: AttributeType.STRING },
      },
    },
  ],
});
