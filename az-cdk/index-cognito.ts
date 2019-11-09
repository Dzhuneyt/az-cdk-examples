import { IRole, PolicyStatement } from '@aws-cdk/aws-iam';
import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { Code, Function, Runtime, LayerVersion } from '@aws-cdk/aws-lambda';
import { CognitoConstruct } from '@cpmech/az-cdk';
import { envars } from './envars';
import { config } from './config';

const app = new App();

const stackName = `${config.appName}-${envars.STAGE}-cognito`;

const stack = new Stack(app, stackName);

const poolName = `${config.appName}-${envars.STAGE}-users`;

const layer = new LayerVersion(stack, 'CommonLibs', {
  code: Code.fromAsset('layers'),
  compatibleRuntimes: [Runtime.NODEJS_10_X],
  license: 'MIT',
  description: 'Common NodeJS Libraries',
});

const postConfirm = new Function(stack, 'PostConfirmation', {
  runtime: Runtime.NODEJS_10_X,
  code: Code.fromAsset('dist'),
  handler: `cognitoPostConfirm.postConfirmation`,
  layers: [layer],
});

(postConfirm.role as IRole).addToPolicy(
  new PolicyStatement({
    actions: ['ses:SendEmail'],
    resources: ['*'],
  }),
);

const construct = new CognitoConstruct(stack, 'Cognito', {
  emailSendingAccount: `tester@${envars.EMAILS_DOMAIN}`,
  poolName,
  lambdaTriggers: {
    postConfirmation: postConfirm,
  },
});

new CfnOutput(stack, 'PoolId', { value: construct.poolId });

new CfnOutput(stack, 'ClientId', { value: construct.clientId });
