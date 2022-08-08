# DDP Web UI

## Building Locally
To build locally during development, there are three main steps:

0. Registering your client in your local database
1. rendering the config file (either from vault or by hand-crafting)
2. building building an app

#### Registering your auth0 client with your local mysql database
Each developer has their own auth0 client.  You must register your client id
and secret in your local database manually--without liquibase--so that our official dev/test/prod
environments are not polluted with developer-specific clients.  To register your client, do the following:

1. Login to the [auth0 console](https://manage.auth0.com/#/clients) and find your client
2. Copy the `client ID` and `Client Secret` fields
3. Paste the id and secret fields into this snippet of SQL, and run it in your local mysql db:

```sql
insert into client (client_name, is_revoked, auth0_client_id, auth0_signing_secret,auth0_domain)
values ('[client name of your choosing]', 0, '[client id]', '[client secret]','https://ddp-dev.auth0.com/')
```

After your local client is registered, you also need to grant it access to the study you're interested in.

```sql
insert into client__umbrella_study (client_id, umbrella_study_id)
values ((select client_id from client where client_name = '[client name of your choosing]'),
        (select umbrella_study_id from umbrella_study where guid = '[the study guid]'))
```

#### Rendering `pepperConfig.js` file
The `pepperConfig.js` file is generated by running the DSDE toolbox script to translate `ctmpl` template file into
javascript config files (make sure Ruby and Docker are installed in order to run the script).  You must build these config files from the top-level directory (pepper-angular) like so:

```shell
# generate study specific configs.   Note semi-redundant args for angular dir, image name, and study guid
./build-study.sh [version] [env] . angio ANGIO --config
./build-study.sh [version] [env] . atcp atcp --config
./build-study.sh [version] [env] . brain cmi-brain --config
./build-study.sh [version] [env] . mbc cmi-mbc --config
./build-study.sh [version] [env] . mpc cmi-mpc --config
./build-study.sh [version] [env] . osteo CMI-OSTEO --config
./build-study.sh [version] [env] . prion PRION --config
./build-study.sh [version] [env] . rgp RGP --config
./build-study.sh [version] [env] . testboston testboston --config
./build-study.sh [version] [env] . pancan cmi-pancan --config
```
There is another way to get the pepperConfig.js file from the development environment: 
You can go to the project that you require, then open dev-tools and navigate to the network tab. The file can then be copied and pasted into your local environment.


**Do not commit rendered `ddpConfig.js` and `pepperConfig.js` files**.
Once rendered, you can hand-edit the `pepper-angular/ddp-workspace/projects/[ddp-angio | ddp-brain | ddp-mbc]/src/assets/config/pepperConfig.js` on-the-fly during front-end development via `ng serve` to alter your auth0 client and enable local registration for local development, editing it like so:
1. Find `DDP_ENV['basePepperUrl']` or `basePepperUrl` and change the value to `"http://localhost:4200"`
2. Find `DDP_ENV['auth0ClientId']` or `auth0ClientId` and change the value to your local dev auth0 client id
3. Find `doLocalRegistration` and change the value to `true`

#### Building, deploying, and interacting with the frontend

* Install [nvm](https://github.com/creationix/nvm) to manage different versions of node and npm
* `nvm use 12.20.0`
* `npm install -g @angular/cli@10.2.0` (if you're working on different angular projects, you may first need a `npm uninstall -g @angular/cli`)
* `cd ddp-workspace`
* `npm cache clean`, `rm -fr node_modules` and `rm -fr dist` (can often be skipped)
* `npm install` (this can often be skipped, but must be done at least once. If you get an error similar to "code: ERESOLVE - ERESOLVE    could not resolve", you can try by executing `npm install --legacy-peer-deps`)
* `ng serve [your app]` (sandbox-app, basil-app, ddp-angio, ddp-brain, ddp-mbc)

Finally...Point your local browser to [localhost](http://localhost:4200)

## Images
We build docker _images_ which we then use for deployment so that we build the app _once_ and then move
images around through different environnments.

## What's in the image?
The build creates a single image that contains both the SDK and the test app.  We build these two things together
for better development velocity.

## How do I build the image?
`docker-compose build`

## What happens when I run the image?
The image builds the sdk and the test app, then starts a container and maps it to port 80 so you can
see the component showcase test app.

## How do I deploy the sdk to artifactory?
Because there are private credentials in the build script, you must first render the build script using our vault utility,
then set the rendered file as executable, and finally run the script.

```sh
docker run --rm -v $PWD:/working -e VAULT_TOKEN=$(cat ~/.vault-token) -e ENVIRONMENT=dev -e VERSION=v1 -e OUT_PATH=./output-config -e INPUT_PATH=./config broadinstitute/dsde-toolbox:dev render-templates.sh
chmod +x output-config/deploy_to_artifactory.sh
docker run --rm -v $(pwd)/output-config/deploy_to_artifactory.sh:/deploy_to_artifactory.sh webui_demo-webapp /deploy_to_artifactory.sh
```

## How is the versioning of the sdk and the toolkit controlled?
The version is controlled via sdk [package.json](ddp-workspace/projects/ddp-sdk/package.json) and toolkit [package.json](ddp-workspace/projects/toolkit/package.json).  Whatever version is set there is what gets published to artifactory.  _If you attempt to re-publish a version that already exists, npm will fail_.  Be sure that you're always publishing a _new_ version.
