# Examples using az-cdk

This project contains some examples that use the high-level az-cdk library. The examples are located in `src/az-cdk` while some lambda functions are located in `src/lambda`.

The folder `src/az-cdk` contains `index-GROUP.ts` files where GROUP correponds to a stack group (e.g. cognito, emails, etc.).

Each index-GROUP.ts is an independent cdk app.

The cdk binary can be called by means of `yarn cdk-cognito diff` where here _cognito_ is a GROUP.

Examples of index/groups:

- `index-cognito` Stack with a Cognito User Pool
- `index-emails` Stack with SES, SNS, and SES to receive emails
- `index-service` Stack with an API Gateway and Lambda functions
- `index-pipeline` Stack with Code Pipeline to deploy the `service` stack
- `index-pipeline-coupled` Two stacks: service and pipeline, where the pipeline can self-update and deploy the `service` stack
- `index-website` Stack with Route53, S3, Certificate Manager, and Cloud Front to deploy a static website
