import { App } from '@aws-cdk/core';
import { PipelineStack, ssmSecret } from '@cpmech/az-cdk';
import { initEnvars } from '@plabs/envars';
import { envars } from './envars';
import config from './config.json';

initEnvars(envars);

const app = new App();

const githubSecret = ssmSecret(config.ssmParamGithub);

new PipelineStack(app, `${config.appName}-pipeline`, {
  githubRepo: config.githubRepo,
  githubUser: config.githubUser,
  githubSecret,
  services: ['apigateway', 'lambda'],
  envars,
});
