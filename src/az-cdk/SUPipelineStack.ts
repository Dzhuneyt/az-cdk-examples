import { Construct, Stack, StackProps, SecretValue } from '@aws-cdk/core';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { Project, LinuxBuildImage, BuildSpec, Artifacts } from '@aws-cdk/aws-codebuild';
import { Bucket } from '@aws-cdk/aws-s3';
import {
  GitHubSourceAction,
  CodeBuildAction,
  CloudFormationCreateUpdateStackAction,
} from '@aws-cdk/aws-codepipeline-actions';
import { envars2cdk, Ienvars } from './envars2cdk';
import { npmCommands } from './npmCommands';
import { CfnParametersCode } from '@aws-cdk/aws-lambda';

export interface ISUPipelineStackProps extends StackProps {
  githubRepo: string; // e.g. myrepo (not the full path)
  githubUser: string; // the user (owner) of the GH repo
  githubSecret: SecretValue; // the secret to access GitHub
  serviceStackName: string; // e.g. LambdaApiStack
  serviceStackGroup?: string; // e.g. service [default=service]
  dirDist?: CfnParametersCode[]; // parameters to be set with the 'dist' directory
  dirLayers?: CfnParametersCode[]; // parameters to be set with the (lambda) 'layers' directory
  envars?: Ienvars; // environment variables
  useYarn?: boolean; // default: use NPM
}

// Self-Updating Pipeline (SUP) Stack
export class SUPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: ISUPipelineStackProps) {
    super(scope, id, props);

    const group = props.serviceStackGroup || 'service';
    const stage = (props.envars && props.envars.stage) || '';
    const cmds = npmCommands(props.useYarn);

    const commands = props.useYarn
      ? [`yarn cdk ${group}-sup synth ${stage} -o ./cdk.out > /dev/null`]
      : [`npm run cdk -- ${group}-sup synth ${stage} -o ./cdk.out > /dev/null`];

    // const files = ['dist/**/*', 'cdk.out/**/*'];
    // if (props.dirLayers && props.dirLayers.length > 0) {
    //   commands.push(`mv layers/nodejs nodejs`);
    //   files.push('nodejs/**/*');
    // }

    const project = new Project(this, 'Project', {
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
      environmentVariables: props.envars ? envars2cdk(props.envars) : {},
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: cmds.install,
          },
          build: {
            commands: cmds.build,
          },
          post_build: {
            commands,
          },
        },
        artifacts: {
          files: [
            'dist/**/*',
            `cdk.out/${id}.template.json`,
            `cdk.out/${props.serviceStackName}.template.json`,
          ],
          'discard-paths': 'yes',
          'secondary-artifacts': {
            lambdaLayers: {
              files: ['layers/**/*'],
            },
          },
        },
      }),
    });

    const sourceOutput = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: 'SourceAction',
      owner: props.githubUser,
      repo: props.githubRepo,
      oauthToken: props.githubSecret,
      output: sourceOutput,
    });

    const buildOutput = new Artifact();
    const buildAction = new CodeBuildAction({
      actionName: 'BuildAction',
      project,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    const secArtifacts = new Bucket(this, 'SecondaryArtifacts', {
      bucketName: `${id.toLowerCase()}-secondary-artifacts`,
    });

    project.addSecondaryArtifact(
      Artifacts.s3({
        identifier: 'lambdaLayers',
        bucket: secArtifacts,
        // path: 'some/path',
        name: 'lambda-layers.zip',
      }),
    );

    const parameterOverrides: { [name: string]: any } = {};

    if (props.dirDist) {
      props.dirDist.forEach(dir => {
        const res = dir.assign(buildOutput.s3Location);
        Object.keys(res).forEach(key => (parameterOverrides[key] = res[key]));
      });
    }

    if (props.dirLayers) {
      props.dirLayers.forEach(dir => {
        const res = dir.assign(buildOutput.s3Location);
        Object.keys(res).forEach(key => (parameterOverrides[key] = res[key]));
      });
    }

    const updateAction = new CloudFormationCreateUpdateStackAction({
      actionName: 'SelfUpdateAction',
      templatePath: buildOutput.atPath(`${id}.template.json`),
      stackName: id,
      adminPermissions: true,
      extraInputs: [buildOutput],
    });

    const deployAction = new CloudFormationCreateUpdateStackAction({
      actionName: 'DeployAction',
      templatePath: buildOutput.atPath(`${props.serviceStackName}.template.json`),
      stackName: props.serviceStackName,
      adminPermissions: true,
      extraInputs: [buildOutput],
      parameterOverrides,
    });

    const artifacts = new Bucket(this, 'Artifacts', {
      bucketName: `${id.toLowerCase()}-artifacts`,
    });

    new Pipeline(this, 'Pipeline', {
      artifactBucket: artifacts,
      restartExecutionOnUpdate: true,
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'SelfUpdate',
          actions: [updateAction],
        },
        {
          stageName: 'Deploy',
          actions: [deployAction],
        },
      ],
    });
  }
}
