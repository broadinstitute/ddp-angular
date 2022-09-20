# DDP Singular project test automation with Playwright

Playwright end-to-end (E2E) UI integration tests.


* See [Playwright Test Runner](https://playwright.dev/docs/api/class-test)
* See [Playwright API](https://playwright.dev/docs/api/class-playwright)


## Set up *playwright-e2e* project

* Playwright [Node.js Requirement](https://playwright.dev/docs/troubleshooting#nodejs-requirements)
* Install `node.js` and `yarn` if not already installed 
  * Install the latest version of `Node.js`. See [Node.js Install](https://nodejs.dev/en/learn/how-to-install-nodejs/)
  * Install the latest version of `yarn`. See [Yarn Install](https://yarnpkg.com/getting-started/install)
* Clone github ddp-angular project: 
  * `git clone git@github.com:broadinstitute/ddp-angular.git`
* Install dependencies:
  * `cd ddp-angular/ddp-workspace/projects/ddp-singular/playwright-e2e`
  * `yarn install`

## Test Users

- **DO NOT** store passwords in `.env` files.

- **DO NOT** use these users for local development.

Supple credentials for pre-existing test users (rather than by generating new users) using an environment property file `.env`. See `.env.singular.test` for an
example.

A `.env` file requires following fields:
- `baseURL`
- `sitePassword`
- `userEmail`


## Running Tests on Localhost

### Local Test Users

Fill out local test user credentials

- Copy `.env.singular.sample`, save as `.env`.
- Update `.env`

## Run Tests Using `Yarn` from the Command-Line

**To see the list of available Yarn commands** <div class="text-blue">`yarn run`</div>

By default, all tests will run in headless mode.

### Examples

* Ask for help <div class="text-blue">`yarn test:e2e --help`</div>
<div></div>

* Run all tests in parallel in **headless mode** <div class="text-blue">`yarn test:e2e --headless`</div>
<div></div>

* Run a single test in **headless mode** <div class="text-blue">`yarn test:e2e <TEST_FILE_NAME> --headless` </div>
<div></div>

* Debug one test in **headed mode** <div class="text-blue">`yarn test:e2e <TEST_FILE_NAME> --debug` </div>
<div></div>

* Run all visual tests in **headed mode** <div class="text-blue">`yarn test:e2e -g visual  --headed`</div>
<div></div>

* Run all tests in `nightly` directory <div class="text-blue">`yarn test:e2e nightly/`</div>
<div></div>

* Run one test on your local server (UI and API or just UI) <div class="text-blue">`[TODO]` </div>
<div></div>

* If you don't want to use the `.env` file, you can also specify `USER_NAME` and `PASSWORD` as environment
  variables. <div class="text-blue">`USER_NAME=<YOUR_USERID> PASSWORD=<YOUR_USER_PASSWORD> [TODO]`</div>
<div></div>

### Debugging in Intellij

- [TODO]


## Project Structure

* `test-data` - test data
* `tests/`    - **e2e tests**, organized by page
* `utils.ts`  - test utility functions
* `nav.ts`    -  page navigation functions

### Test Development Tips
- Use `yarn format` to format code
- Use `yarn lint --fix` to fix eslint issues
- 
- [TODO]
