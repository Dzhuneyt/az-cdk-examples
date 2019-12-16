#!/bin/bash

yarn build

yarn cdk:simple website deploy --require-approval never
yarn cdk:simple website-pip deploy --require-approval never
yarn cdk:simple website-app deploy --require-approval never
yarn cdk:simple website-app-pip deploy --require-approval never
yarn cdk:simple emails deploy --require-approval never
yarn cdk:simple dynamo deploy --require-approval never
yarn cdk:simple cognito deploy --require-approval never
yarn cdk:simple service deploy --require-approval never
yarn cdk:simple service-pip deploy --require-approval never
