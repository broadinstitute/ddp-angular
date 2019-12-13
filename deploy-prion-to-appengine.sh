# assumes you've already run npm install and gcloud auth login for the appropriate gcp project


# render config
./build-study.sh v1 dev . prion prion --config
cp output-config/pepperConfig.js ddp-workspace/projects/ddp-prion/src/assets/config/pepperConfig.js
pushd ddp-workspace

# build in dev mode
ng build ddp-prion --outputPath=projects/ddp-prion/dist
popd

# deploy to GAE
gcloud app deploy ./ddp-workspace/projects/ddp-prion/app.yaml -q
