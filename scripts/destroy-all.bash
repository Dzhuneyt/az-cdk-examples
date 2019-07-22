#!/bin/bash

yarn cdk cognito destroy
yarn cdk emails destroy
yarn cdk service-pip destroy
yarn cdk service-sup destroy
yarn cdk website destroy