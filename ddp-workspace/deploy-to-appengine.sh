#!/usr/bin/env bash

# options for clean build, incremental build, which project, prod mode, service name, rewrite app.yaml with service name

# make API calls to auth0 to register callback urls

./build-study.sh v1 dev . brain cmi-brain --config
cp output-config/pepperConfig.js ddp-workspace/projects/ddp-brain/src/assets/config/pepperConfig.js
pushd ddp-workspace
ng build ddp-brain --outputPath=projects/ddp-brain/dist
popd
gcloud app deploy ./ddp-workspace/projects/ddp-brain/app.yaml -q
