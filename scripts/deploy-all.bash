#!/bin/bash

yarn cdk-cognito deploy --require-approval never
yarn cdk-emails deploy --require-approval never
yarn cdk-service deploy --require-approval never
yarn cdk-pipeline deploy --require-approval never
yarn cdk-coupled-pipeline deploy --require-approval never
yarn cdk-website deploy --require-approval never
