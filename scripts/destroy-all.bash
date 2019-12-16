#!/bin/bash

yarn build

yarn cdk:simple website destroy
yarn cdk:simple website-pip destroy
yarn cdk:simple emails destroy
yarn cdk:simple cognito destroy
yarn cdk:simple service destroy
yarn cdk:simple service-pip destroy
