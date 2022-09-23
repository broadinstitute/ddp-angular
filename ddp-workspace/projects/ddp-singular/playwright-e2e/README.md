# DDP Singular project test automation with Playwright

Playwright end-to-end (E2E) UI integration tests.


* See [Playwright Test Runner](https://playwright.dev/docs/api/class-test)
* See [Playwright API](https://playwright.dev/docs/api/class-playwright)


## Set up *playwright-e2e* project

* Playwright [Node.js Requirement](https://playwright.dev/docs/troubleshooting#nodejs-requirements)
* Install `node.js` if not already installed 
  * Install the latest version of `Node.js`. See [Node.js Install](https://nodejs.dev/en/learn/how-to-install-nodejs/)
* Clone Github **ddp-angular** project: 
  * `git clone git@github.com:broadinstitute/ddp-angular.git`
* Install dependencies:
  * `cd ddp-angular/ddp-workspace/projects/ddp-singular/playwright-e2e`
  * `npm install`
  * `npx playwright install`

## Test Users

- **DO NOT** store passwords in `.env` files.

- **DO NOT** use these users for local development.

Supple credentials for pre-existing test users (rather than by generating new users) using an environment property file `.env`. See `.env.singular.test` for an
example.

A `.env` file requires following fields:
- `baseURL`
- `sitePassword`
- `userEmail`
- `userPasswd`


## Run Tests Using `npx` from the Command-Line

**By default, all tests will run in headless mode.**

**To see the list of available *npx* commands in package.json** <div class="text-blue">`npm run`</div>

**To see the list of available *Playwright test* options** <div class="text-blue">`npx playwright test --help`</div>

### Running Tests on Localhost

Fill out local test user credentials

- Copy `.env.singular.sample`, save as `.env`.
- Update `.env`

### Examples

* Run all tests in parallel in **headless mode** <div class="text-blue">`npx playwright test --headless`</div>
<div></div>

* Run a single test in **headless mode** <div class="text-blue">`npx playwright test <TEST_FILE_NAME> --headless` </div>
<div></div>

* Debug one test in **headed mode** <div class="text-blue">`npx playwright test <TEST_FILE_NAME> --debug` </div>
<div></div>

* Run all visual tests in **headed mode** <div class="text-blue">`npx playwright test -g visual  --headed`</div>
<div></div>

* Run all tests in `nightly` directory <div class="text-blue">`npx playwright test nightly/` or `npm run-script test:e2e:ci:nightly`</div>
<div></div>

* Run one test on your local server (UI and API or just UI) <div class="text-blue">`[TODO]` </div>
<div></div>

* If you don't want to use the `.env` file, you can also specify environment
  variables in cmd. For example, to set `USER_NAME` and `PASSWORD` env variables and run `login-visual.spec.ts` test, do the following: <div class="text-blue">`USER_NAME=<YOUR_USERID> PASSWORD=<YOUR_USER_PASSWORD> npx playwright test login-visual.spec.ts`</div>
<div></div>

### Debugging in Intellij

- [TODO]


## Project Structure

* `test-data` - test data
* `tests/`    - **e2e tests**, organized by page
* `utils.ts`  - test utility functions
* `nav.ts`    -  page navigation functions

### Test Development Tips
- Use `npm run format` to format code
- Use `npm run lint --fix` to fix eslint issues. Note: Not all eslint rules are fixable by `--fix`.
- Use flag `-u` to generate screenshots for a visual test on localhost.
  - For example, `npx playwright test self-enrollment-visual.spec.ts -u`
  - Save screenshots to GitHub
- Generate screenshots for running tests on CircleCI by doing the following:
  - In *playwright-e2e* dir, run docker with cmd `docker run -v $PWD:/e2e -w /e2e -it --rm --ipc=host mcr.microsoft.com/playwright:v1.25.0-focal /bin/bash`
  - `npx playwright test self-enrollment-visual.spec.ts -u`
  - Save screenshots to GitHub
- [TODO]
