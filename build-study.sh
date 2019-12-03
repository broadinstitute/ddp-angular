#!/usr/bin/env bash

set -e

docker_build() {
    echo "building ${GIT_SHA_IMAGE} docker image"
    docker build --build-arg GIT_SHA=$GIT_SHA --build-arg ANGULAR_DIR=$ANGULAR_DIR -t ${GIT_SHA_IMAGE} . -f Dockerfile-study
    echo "retagging ${GIT_SHA_IMAGE} as ${FINAL_IMAGE}"
    docker tag ${GIT_SHA_IMAGE} ${FINAL_IMAGE}
}

# used only when rendering stuff for local development.  not used by jenkins
render_local_config() {
    local output_dir="${PWD}/${DIR}/output-config"
    INPUT_DIR=config IMAGE_NAME=$FINAL_IMAGE OUTPUT_DIR=$output_dir STUDY_KEY=$STUDY_KEY STUDY_GUID=$STUDY_GUID ENV=$ENV VERSION=$VERSION MANIFEST=manifest-study.rb OUTPUT_DIR=$output_dir DIR=$output_dir ruby configure.rb -y
    local angular_config_dir="ddp-workspace/projects/${ANGULAR_DIR}/src/assets/config"
    mkdir -p "${angular_config_dir}"
    ln -snf "${output_dir}/pepperConfig.js" "${angular_config_dir}/pepperConfig.js"
}

docker_push() {
    echo "pushing ${IMAGE_BASE}:${GIT_SHA}"
    docker push ${IMAGE_BASE}:${GIT_SHA:0:12}
    echo "pushing ${IMAGE_BASE}:$tag"
    docker push ${IMAGE_BASE}:$tag
}

VERSION=$1; shift
ENV=$1; shift
DIR=$1; shift
STUDY_KEY=$1; shift # handy name for the study, such as angio or brain.  Not the guid.
STUDY_GUID=$1; shift # guid for the study, as per pepper study configuration

ANGULAR_DIR="ddp-${STUDY_KEY}" # location of angular code
IMAGE_BASE="broadinstitute/pepper-${STUDY_KEY}" # base name fo rimage
VAULT_TOKEN=$VAULT_TOKEN
tag=${VERSION}_${ENV}
GIT_SHA=$(git rev-parse --verify HEAD)
GIT_SHA_IMAGE="${IMAGE_BASE}:${GIT_SHA:0:12}" # image name with git sha
FINAL_IMAGE="${IMAGE_BASE}:${tag}" # final version/env-tagged image name
while [ "$1" != "" ]; do
    case $1 in
        --config) render_local_config ;;
        --docker-build)  docker_build ;;
        --docker-push)   docker_build
                  docker_push ;;
        --jenkins)    docker_build
                  docker_push ;;
    esac
    shift
done
