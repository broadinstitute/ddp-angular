#!/bin/bash
# Script will list the Angular projects have been modified comparing two git SHAs
# Can run anywhere within the repo
# If a file from a common area, like the root diretory was modified, we call that _SHARED_
set +x
#ignore these file name patterns when figuring out what modules changed
declare -a exclude_patterns=( '^.*\.md' '^.*.pdf', '^.*\.spec\.ts', 'playwright' )

EXCLUDE_CMD='grep -v -E'

for exclude_pattern in "${exclude_patterns[@]}"
do
	EXCLUDE_CMD="${EXCLUDE_CMD} -e ${exclude_pattern}"
done
NG_PROJECT_PATH_PREFIX='ddp-workspace\/projects\/'
SHARED='_SHARED_'
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD='gsed -E'
else
  SED_CMD='sed -E'
fi
git diff --name-only $1 $2 |
${EXCLUDE_CMD} | # Exclude from changes files that we want to ignore
${SED_CMD} "/${NG_PROJECT_PATH_PREFIX}[^\/]*/! s/.*/${SHARED}/" | # If does not match Angular project path we call it _SHARED_
${SED_CMD} "s_${NG_PROJECT_PATH_PREFIX}([^\/]*)/.*_\1_" | # If it does match Angular project path, save only the project dir name
sort |
uniq

