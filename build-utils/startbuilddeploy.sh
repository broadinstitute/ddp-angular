#!/usr/bin/env bash
CI_PROJECT_SLUG='gh/broadinstitute/ddp-angular'
DEFAULT_BRANCH=develop
STUDY_KEY=$1
STUDY_GUID=$2

CI_TOKEN=$(xargs <  ~/.circleci-token)
if [[ -z $CI_TOKEN ]]; then
  echo "Need to store personal circleci token value at \$HOME/.circleci-token"
  echo "You can generate it from this URL: https://circleci.com/account/api"
  exit 1
fi

if [[ -z $STUDY_KEY ]] || [[ -z $STUDY_GUID ]]; then
  echo "usage: $(basename "$0") STUDY_KEY STUDY_GUID [BRANCH]"
  echo "Will build from branch $DEFAULT_BRANCH if not provided"
  exit 1
fi

BRANCH=${3-$DEFAULT_BRANCH}

echo "Will try to initiate build from branch: $BRANCH"
curl -u "${CI_TOKEN}:" -X POST --header "Content-Type: application/json" -d "{
                                  \"branch\": \"$BRANCH\",
                                  \"parameters\": {
                                      \"study_key\": \"$STUDY_KEY\",
                                      \"study_guid\": \"$STUDY_GUID\",
                                      \"do-builds\": true
                                  }
}" "https://circleci.com/api/v2/project/${CI_PROJECT_SLUG}/pipeline"
