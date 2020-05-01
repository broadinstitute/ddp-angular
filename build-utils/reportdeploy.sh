#!/usr/bin/env bash
set +x
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
  grep -Ev "^(${CURRENT_BRANCH})|(HEAD)"  #exclude the current working branch
}

tags_same_commit() {
  echo $(git tag --points-at HEAD)
}

commit_author() {
  echo $(git show -s --format='%ae' HEAD)
}
if [ "$#" -lt 5 ]; then
  echo "usage: GOOGLE_JSON_KEY | $(basename $0) RELEASE_SHEET_ID COMPONENT ENVIRONMENT CIRCLE_BUILD_NUM CIRCLE_BUILD_URL"
  exit 1
fi
RELEASE_SHEET_ID=$1
COMPONENT=$2
ENVIRONMENT=$3
CIRCLE_BUILD_NUM=$4
CIRCLE_BUILD_URL=$5
# Stick both into one column with a formula
CIRCLE_BUILD_HYPERLINK="=HYPERLINK(\"$CIRCLE_BUILD_URL\",\"$CIRCLE_BUILD_NUM\")"

TZ=America/New_York
DATE=`TZ=$TZ date +%F`
TIME=`TZ=$TZ date +%T`
BRANCH=$(current_branch)
SHORT_GIT_SHA=$(short_git_sha)
# Picking up any tags attached to the current commit
TAG=$(tags_same_commit | xargs)
# List of other branches that have same commit
OTHER_BRANCHES=$(other_branches_same_commit | xargs)
# Extract email from current commit
AUTHOR=$(commit_author)
# Passing to sheetappend the GCP credentials we are expecting to be piped into this script
cat /dev/stdin |
   sheetappend $RELEASE_SHEET_ID $DATE $TIME "$COMPONENT" $ENVIRONMENT $BRANCH "$TAG" $SHORT_GIT_SHA "$AUTHOR" "$CIRCLE_BUILD_HYPERLINK" "" "$OTHER_BRANCHES"
