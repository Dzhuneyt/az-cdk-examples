# Examples using az-cdk

This project contains some examples that use the high-level az-cdk library. The examples are located in `src/az-cdk` while some lambda functions are located in `src/lambda`.

## CDK Apps

The folder `src/az-cdk` contains `index-GROUP[-KIND].ts` files where _GROUP_ correponds to an independent CDK APP and _KIND_ indicates whether the the app contains a Codepipeline or not.

The files are:

- `index-cognito` Cognito User Pool
- `index-emails` SES, SNS, and SES to receive emails
- `index-service` API Gateway and Lambda functions
- `index-service-pip` Code Pipeline to deploy the `service` stack
- `index-service-sup` Two stacks: service and pipeline, where the pipeline can self-update and deploy its service stack
- `index-website` Route53, S3, Certificate Manager, and Cloudfront to deploy a static website
- `index-website-pip` Code Pipeline to deploy the `website` stack

## Stacks

The deployed stacks are named as `MYAPP-STAGE-GROUP[-KIND]` with the following options:

_STAGE_

- **dev**: development
- **pro**: production

_GROUP_

- **cognito**: Cognito User Pool
- **emails**: SES, SNS, and SES to receive emails
- **service**: API Gateway and Lambda functions
- **website**: Route53, S3, Certificate Manager, and Cloudfront to deploy a static website

_KIND_

- NONE: Without the _KIND_ label, the stack simply corresponds to the named _GROUP_
- **pip**: CI/CD Pipeline to deploy the corresponding stack
- **sup**: CI/CD Self-Updating Pipeline to deploy the corresponding stack

Thus, the deployed stacks are:

```
MYAPP-{dev,pro}-{cognito,emails,service,website}[-{pip,sup}]
```

## CDK command

You can run the `cdk` binary command as follows:

```
yarn cdk GROUP[-KIND] [COMMAND] [STAGE] [OPTIONS]
```

For example:

```bash
yarn cdk service-sup bootstrap
yarn cdk cognito synth --strict
yarn cdk emails deploy
yarn cdk service diff
yarn cdk service-pip deploy
yarn cdk service-sup deploy
yarn cdk website synth --verbose
```

## Notes

1. For the first time, it's better to set `verifyDomain = false` in index-website.ts
2. When the `deploy` command is passed with a self-updating pipeline (sup), only the pipeline stack will be deployed. I.e. `yarn cdk GROUP-sup deploy` will deploy the pipeline whereas the GROUP will be automatically deployed by Code Pipeline.
