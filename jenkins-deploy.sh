#!/bin/bash

set -ex
#
# This script will fail if any of the environment variables
# referenced are not defined when this script starts up.
#


if [ -z "${SSHCMD}" ]; then
    echo "FATAL ERROR: SSHCMD undefined."
    exit 1
fi

if [ -z "${SSH_USER}" ]; then
    echo "FATAL ERROR: SSH_USER undefined."
    exit 2
fi

if [ -z "${SSH_HOST}" ]; then
    echo "FATAL ERROR: SSH_HOST undefined."
    exit 3
fi

if [ -z "${ENV}" ]; then
    echo "FATAL ERROR: ENV undefined."
    exit 4
fi

if [ -z "${VERSION}" ]; then
    echo "FATAL ERROR: VERSION undefined."
    exit 5
fi

if [ -z "${PROJECT}" ]; then
    echo "FATAL ERROR: PROJECT undefined."
    exit 6
fi
set -a

is_cmi_study() {
    local subproject=$1
    [ "${subproject}" = 'pepper-angio' ] || [ "${subproject}" = 'pepper-brain' ] || [ "${subproject}" = 'pepper-mbc' ] || [ "${subproject}" = 'pepper-osteo' ]
}

VAULT_TOKEN=$(cat /etc/vault-token-kdux)
OUTPUT_DIR=app
INPUT_DIR=$PROJECT/config
BUILD_CONTAINERS=false

# Custom compose for subprojects
if is_cmi_study "$WEBSITE"; then
    # `study_key` is a shortname for the study, used to lookup vault configs, directories, etc.
    # `study_guid` is the identifier for the study, as defined in pepper.

    COMPOSE_FILE="/$OUTPUT_DIR/docker-compose-study.yaml"
    MANIFEST=manifest-study.rb
    if [ "$WEBSITE" = "pepper-angio" ]; then
	STUDY_KEY=angio
	STUDY_GUID=ANGIO
    elif  [ "$WEBSITE" = "pepper-brain" ]; then
	STUDY_KEY=brain
	STUDY_GUID=cmi-brain
     elif  [ "$WEBSITE" = "pepper-mbc" ]; then
	STUDY_KEY=mbc
	STUDY_GUID=cmi-mbc
     elif  [ "$WEBSITE" = "pepper-osteo" ]; then
	STUDY_KEY=osteo
	STUDY_GUID=CMI-OSTEO
    else
	echo "FATAL ERROR: unknown cmi study $SUBPROJECT"
	exit 7
    fi
else
    COMPOSE_FILE="/$OUTPUT_DIR/docker-compose.yaml"
    MANIFEST=manifest.rb
fi

# configure outside the kdux host, with retries in case vault times out
for i in {1..3}; do
  ruby pepper-apis/configure.rb -y && break || sleep 3
done

scp -r $SSHOPTS $OUTPUT_DIR/* $SSH_USER@$SSH_HOST:/$OUTPUT_DIR

#### Deploy ####

# Start new application container with the current version, pulling latest container images from the registry
$SSHCMD $SSH_USER@$SSH_HOST "docker-compose -p $PROJECT -f $COMPOSE_FILE pull"
$SSHCMD $SSH_USER@$SSH_HOST "docker-compose -p $PROJECT -f $COMPOSE_FILE stop"
$SSHCMD $SSH_USER@$SSH_HOST "docker-compose -p $PROJECT -f $COMPOSE_FILE rm -f"
$SSHCMD $SSH_USER@$SSH_HOST "docker-compose -p $PROJECT -f $COMPOSE_FILE up -d --remove-orphans"

# Remove any dangling images that might be hanging around
$SSHCMD $SSH_USER@$SSH_HOST "docker images -aq --no-trunc --filter dangling=true | xargs docker rmi || /bin/true"
