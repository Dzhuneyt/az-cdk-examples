# Examples using az-cdk

This project contains some examples that use the high-level az-cdk library. The examples are located in `src/az-cdk` while some lambda functions are located in `src/lambda`.

## Stacks

The folder `src/az-cdk` contains `index-GROUP.ts` files where _GROUP_ correponds to a stack group (e.g. cognito, emails, service, pipeline, etc.).

Each index-GROUP.ts is an independent cdk app.

Apps:

- `index-cognito` Stack with a Cognito User Pool
- `index-emails` Stack with SES, SNS, and SES to receive emails
- `index-service` Stack with an API Gateway and Lambda functions
- `index-pipeline` Stack with Code Pipeline to deploy the `service` stack
- `index-pipeline-coupled` Two stacks: service and pipeline, where the pipeline can self-update and deploy the `service` stack
- `index-website` Stack with Route53, S3, Certificate Manager, and Cloud Front to deploy a static website

## CDK command and deployment

You can run the `cdk` binary command as follows `yarn cdk [GROUP] [COMMAND]`. For example:

```bash
yarn cdk service diff
yarn cdk emails deploy
```

where `service` and `emails` are the GROUP and `diff` and `deploy` are the CDK commands.

For convenience, `package.json` contains a number of shortcuts such as `yarn cdk-cognito diff`.
