#!/usr/bin/env bash
CI_PROJECT_SLUG='gh/broadinstitute/ddp-angular'
DEFAULT_BRANCH=develop
COMMAND=$1
STUDY_KEY=$2
BRANCH=$3
TARGET_ENV=$4

CI_TOKEN=$(xargs <  ~/.circleci-token)
if [[ -z $CI_TOKEN ]]; then
  echo "Need to store personal circleci token value at \$HOME/.circleci-token"
  echo "You can generate it from this URL: https://circleci.com/account/api"
  exit 1
fi

if [[ -z $COMMAND || -z $STUDY_KEY || -z $BRANCH || ($COMMAND == "deploy" && -z $TARGET_ENV) ]] ; then
  echo "usage: $(basename "$0") COMMAND STUDY_KEY BRANCH [TARGET_ENV]"
  echo "where COMMAND is one of following"
  echo "    build-and-store"
  echo "        Create build of given study and store for later use"
  echo "    deploy"
  echo "        Deploy saved build of corresponding to given branch to specified TARGET_ENV"
  echo "    run-tests"
  echo "        Run tests for given study and given branch"
  echo "    run-e2e-tests"
  echo "        Run Playwright E2E tests for given branch against specified TARGET_ENV (dev, test or staging)"
  echo "        Given study is ignored"
  echo "        Example: ./run_ci.sh run-e2e-tests singular pepper-227-circleci-playwright-test dev"
  echo ""
  exit 1
fi

if [[ -n $TARGET_ENV ]] ; then
  DEPLOY_ENV_PROPERTY="\"deploy_env\": \"$TARGET_ENV\","
fi

echo "Will try to initiate build from branch: $BRANCH"
curl -u "${CI_TOKEN}:" -X POST --header "Content-Type: application/json" -d "{
                                  \"branch\": \"$BRANCH\",
                                  \"parameters\": {
                                      $DEPLOY_ENV_PROPERTY
                                      \"study_key\": \"$STUDY_KEY\",
                                      \"api_call\": \"$COMMAND\"
                                  }
}" "https://circleci.com/api/v2/project/${CI_PROJECT_SLUG}/pipeline"
