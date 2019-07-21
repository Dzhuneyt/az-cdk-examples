#!/bin/bash

set -e

DIR='src/az-cdk'
BIN='./node_modules/.bin'

if [[ $# -lt 1 ]]; then
  echo
  echo "Usage:"
  echo
  echo "  ./`basename $0` LABEL_OF_INDEX [STACK_NAME] [CDK_CMD] [CDK_OPTIONS]"
  echo
  echo "where ${DIR}/index-LABEL_OF_INDEX.ts must exist"
  echo
  echo
  echo "ERROR: LABEL_OF_INDEX is required"
  echo
  exit 1
  echo
fi

LABEL=$1
STACK=$2
CDKCMD=$3
CDKOPTS="${@:4}"

CDK=$BIN/cdk
TSNODE="$BIN/ts-node -O '{\"module\":\"commonjs\",\"resolveJsonModule\":true}'"
APP="$TSNODE $DIR/index-$LABEL.ts"

rm -rf cdk.out

if [[ $CDKCMD == "diff" ]]; then
  $CDK --app "$APP" $CDKCMD $STACK $CDKOPTS || true
  exit 0
fi

if [[ $LABEL == "emails" ]] && [[ $CDKCMD == "destroy" ]]; then
  aws ses set-active-receipt-rule-set --rule-set-name default-rule-set
fi

$CDK --app "$APP" $CDKCMD $STACK $CDKOPTS

if [[ $LABEL == "emails" ]] && [[ $CDKCMD == "deploy" ]]; then
  aws ses set-active-receipt-rule-set --rule-set-name integration-tests
fi
