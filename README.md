# Angular modules for DDP

## General layout
This repo contains source for DDP's Angular SDK.  Inside the repo, we have module code, tests, and an angular
app.  The app itself serves only demonstration and testing purposes; in the real world, DDP app code lives
in its own repo and loads the modules from this repo via `package.json` imports.

Each released version of the SDK corresponds to a tag.  When working on an upcoming release, we use a branch
 for that release.  Once we deploy the release to artifactory, we put a tag into that release so that 1) it's crystal clear what
 source code was used for what npm version and 2) we maintain clarity (and some freedom) within branches.
 
Within the `app` directory, we setup independent angular modules.  With this approach, we can kick the tires
on new modules in the context of a representative (if make believe) app.  Each module is deployed to npm/artifactory as its own thing under the `@ddp` _scope_. 

## Building
```shell
nvm use v7.9.0
npm install
```

## Backend-less UI Tests
These tests will pop open a chome browser and run tests via karma.  To set breakpoints in the angular ts code or in the tests
themselves, navigate to `webpack://./src/app` in chrome dev tools and use chrome debugger.  Yes, debugging of _typescript_
works!
```shell
ng test
```


## Artifactory setup
We will deploy our modules to [our local artifactory](https://broadinstitute.jfrog.io/broadinstitute).  To do this, you must
have an artifactory account.  If you don't have one, ping Zim.  Once your artifactory account is setup, you have to configure
your `.npmrc` to selectively look in artifactory for `@ddp`-scoped artifacts, while looking in the usual npm repo for everything else.

### .npmrc setup
Run this command, setting your username and password. 
```shell
curl -u "[username:pwd]"  https://broadinstitute.jfrog.io/broadinstitute/api/npm/npm-local/auth/ddp
```

This should output something like:
```shell
@ddp:registry=https://broadinstitute.jfrog.io/broadinstitute/api/npm/npm-local/
//broadinstitute.jfrog.io/broadinstitute/api/npm/npm-local/:_password=[blah]
//broadinstitute.jfrog.io/broadinstitute/api/npm/npm-local/:username=[your user]
//broadinstitute.jfrog.io/broadinstitute/api/npm/npm-local/:email=[your email]
//broadinstitute.jfrog.io/broadinstitute/api/npm/npm-local/:always-auth=true
```

Copy paste that into `~.nprmrc`.

## Deploying a module to artifactory
Each module should exist in its own directory so that the module can be built and deployed as its own thing.  The
`package.json` exists (in slightly different forms) both at the module level and in the `dist` directory; `rollup.config.js`
exists in each module directory as well.  There is room for improvement in this area in terms of DRY-ness.  Setting things
up this way came about based largely on theses posts:
* http://blog.mgechev.com/2017/01/21/distributing-an-angular-library-aot-ngc-types/
* https://medium.com/@cyrilletuzi/how-to-build-and-publish-an-angular-module-7ad19c0b4464
* https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency

From within a module directory:
```shell
npm run build
cd dist
npm publish
```

