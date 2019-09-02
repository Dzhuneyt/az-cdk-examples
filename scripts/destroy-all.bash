#!/bin/bash

yarn cdk website destroy
yarn cdk website-pip destroy
yarn cdk emails destroy
yarn cdk cognito destroy
yarn cdk service destroy
yarn cdk service-pip destroy
