# Examples using az-cdk -- v1.1.0

This project contains some examples that use the high-level az-cdk library. The examples are located in `src/az-cdk` while some lambda functions are located in `src/lambda`.

## CDK Apps

The folder `src/az-cdk` contains `index-GROUP[-KIND].ts` files where _GROUP_ correponds to an independent CDK APP and _KIND_ indicates whether the the app contains a Codepipeline or not.

The files are:

- `index-cognito` Cognito User Pool
- `index-emails` SES, SNS, and SES to receive emails
- `index-service` API Gateway and Lambda functions
- `index-service-pip` Code Pipeline to deploy the `service` stack
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

Thus, the deployed stacks are:

```
MYAPP-{dev,pro}-{cognito,emails,service,website}[-{pip}]
```

## CDK command

You can run the `cdk` binary command as follows:

```
yarn cdk GROUP[-KIND] [COMMAND] [STAGE] [OPTIONS]
```

For example:

```bash
yarn cdk cognito synth --strict
yarn cdk emails deploy
yarn cdk service diff
yarn cdk service-pip deploy
yarn cdk website synth --verbose
```

## ERRORS

### Deployment

```
Amazon SES account is in Sandbox. Verify Send-to email address or Amazon SES Account (Service: AWSCognitoIdentityProviderService; Status Code: 400; Error Code: InvalidParameterException; Request ID: ae2863a6-0c8d-4fe0-81e8-3e6e2d8906a3)
```

This means that the `senderEmail` email has not been manually verified

### Graphql test

If you get `{ \"message\": \"Unauthorized\" }` means that the Cognito IDs are wrong in API Gateway

We have to destroy the graphql lambda function first and then re-deploy to induce an update on the Gateway
