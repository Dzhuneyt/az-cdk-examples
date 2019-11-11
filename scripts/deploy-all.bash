#!/bin/bash

yarn cdk website deploy --require-approval never
yarn cdk website-pip deploy --require-approval never
yarn cdk website-app deploy --require-approval never
yarn cdk website-app-pip deploy --require-approval never
yarn cdk emails deploy --require-approval never
yarn cdk dynamo deploy --require-approval never
yarn cdk cognito deploy --require-approval never
yarn cdk service deploy --require-approval never
yarn cdk service-pip deploy --require-approval never
