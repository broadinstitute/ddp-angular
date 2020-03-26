#!/usr/bin/env bash
current_branch() {
  echo $(git branch --contains HEAD | grep -E '^\*' | grep -Eo '\b\w.*' );
}
short_git_sha() {
  echo $(git rev-parse --short HEAD)
}
current_head_commit() {
  echo $(git log -1 --format=%H)
}
other_branches_same_commit() {
  CURRENT_BRANCH=$(current_branch)
  CURRENT_COMMIT=$(current_head_commit)
  REMOTE_BRANCH_PREFIX='refs/remotes/origin/'

  git show-ref |  #list all references in current rep
  grep $CURRENT_COMMIT |  #find current commit sha
  grep -Eo "$REMOTE_BRANCH_PREFIX.*" |  #keep only remote branches
  cut -c "$((${#REMOTE_BRANCH_PREFIX} + 1))-" | #remove prefixes
  grep -Ev "^${CURRENT_BRANCH}"  #exclude the current working branch
  EXIT_CODE=$?
  # turns out grep if no matching lines found returns exit code 1. We don't want that for our script!
  if [ $EXIT_CODE == 1 ] || [ $EXIT_CODE == 0 ]
  then
    exit 0
  else
    exit $EXIT_CODE
  fi
}
TZ=America/New_York
DATE=`TZ=$TZ date +%F`
TIME=`TZ=$TZ date +%T`
RELEASE_SHEET_ID=$1
COMPONENT=$2
BRANCH=$(current_branch)
SHORT_GIT_SHA=$(short_git_sha)
# Picking up any tags attached to the current commit
TAG=`git tag --points-at HEAD | xargs`
# List of other branches that have same commit
#OTHER_BRANCHES=$(./scripts/ci/otherbranchessamecommit.sh | xargs)
OTHER_BRANCHER=other_branches_same_commit
# Extract email from current commit
AUTHOR=`git show -s --format='%ae' HEAD`
for argument in $RELEASE_SHEET_ID $DATE $TIME "$COMPONENT" $ENVIRONMENT $BRANCH "$TAG" $SHORT_GIT_SHA "$AUTHOR" $CIRCLE_BUILD_NUM "$CIRCLE_BUILD_URL" "$OTHER_BRANCHES"
do
  echo "-${argument}-"
done
#vault read -format=json secret/pepper/${ENVIRONMENT}/v1/conf  | jq -r .data.gcp.serviceKey | \
#sheetappend $RELEASE_SHEET_ID $DATE $TIME "$COMPONENT" $ENVIRONMENT $BRANCH "$TAG" $SHORT_GIT_SHA "$AUTHOR" $CIRCLE_BUILD_NUM "$CIRCLE_BUILD_URL" "$OTHER_BRANCHES"
