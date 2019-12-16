#!/bin/bash

yarn build

yarn cdk:simple website diff
yarn cdk:simple website-pip diff
yarn cdk:simple website-app diff
yarn cdk:simple website-app-pip diff
yarn cdk:simple emails diff
yarn cdk:simple dynamo diff
yarn cdk:simple cognito diff
yarn cdk:simple service diff
yarn cdk:simple service-pip diff
