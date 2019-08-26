#!/bin/bash

set -e

# set directory with the index*.ts files
DIR="src/az-cdk"

# set rule set name
# TODO: capture this from the stack
RULE_SET_NAME="integration-tests"

# check input
if [[ $# -lt 1 ]]; then
  echo
  echo "Usage:"
  echo
  echo "  ./`basename $0` GROUP[-KIND] [COMMAND] [STAGE] [OPTIONS]"
  echo
  echo "where ${DIR}/index-GROUP[-KIND].ts must exist"
  echo
  exit 1
  echo
fi

# extract input
array=(${1//-/ })
GROUP=${array[0]}
KIND=${array[1]}
COMMAND=$2
STAGE="dev"
OPTIONS=""

# set stage and options according to the optional inputs
if [[ $3 != "" ]]; then
  if [[ $3 == -* ]]; then
    OPTIONS="${@:3}"
  else
    STAGE=$3
    OPTIONS="${@:4}"
  fi
fi

# check stage name
if [[ $STAGE != "dev" && $STAGE != "pro" ]]; then
  echo
  echo "ERROR: STAGE must be either 'dev' or 'pro' (or empty => 'dev')"
  echo
  exit 1
fi

# deternine stack name pattern
STACK=""
if [[ $KIND == "sup" && $COMMAND != "bootstrap" ]]; then
  STACK="*-sup"
fi

# show input
echo
echo "======================================="
echo "  GROUP   = $GROUP"
echo "  KIND    = $KIND"
echo "  COMMAND = $COMMAND"
echo "  STAGE   = $STAGE"
echo "  OPTIONS = $OPTIONS"
echo "======================================="
echo

# declare some constants
BIN='./node_modules/.bin'
CDK=$BIN/cdk
TSNODE="$BIN/ts-node -O '{\"module\":\"commonjs\",\"resolveJsonModule\":true}'"

# define function to execute the cdk command
runcdk() {
  dashkind=""
  if [[ $KIND != "" ]]; then
    dashkind="-$KIND"
  fi
  app="$TSNODE $DIR/index-$GROUP$dashkind.ts"
  export STAGE=$STAGE
  cmd="$CDK --app "$app" $COMMAND $STACK $OPTIONS"
  if [[ $COMMAND == "diff" ]]; then
    $CDK --app "$app" $COMMAND $STACK $OPTIONS || true
  else
    $CDK --app "$app" $COMMAND $STACK $OPTIONS
  fi
}

# remove cdk.out dir
rm -rf cdk.out

# set default rule set
if [[ $GROUP == "emails" && $COMMAND == "destroy" ]]; then
  aws ses set-active-receipt-rule-set --rule-set-name default-rule-set
fi

# set verify domain flag
if [[ $GROUP == "website" && $KIND == "" && $COMMAND == "diff" ]]; then
  export VERIFY_DOMAIN='true'
fi

# run the cdk
runcdk

# reset default rule set 
if [[ $GROUP == "emails" && $COMMAND == "deploy" ]]; then
  aws ses set-active-receipt-rule-set --rule-set-name $RULE_SET_NAME
fi

# verify domain
if [[ $GROUP == "website" && $KIND == "" && $COMMAND == "deploy" ]]; then
  echo "Do you wish to verify the domain? (choose 1 or 2)"
  export VERIFY_DOMAIN='true'
  select yn in "verify" "skip"; do
      case $yn in
          verify) runcdk; break;;
          skip) exit;;
      esac
  done
fi
