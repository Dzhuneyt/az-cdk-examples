#!/bin/bash

yarn cdk-cognito destroy
yarn cdk-emails destroy
yarn cdk-service destroy
yarn cdk-pipeline destroy
yarn cdk-coupled-pipeline destroy
yarn cdk-website destroy