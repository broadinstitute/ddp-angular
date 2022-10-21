# PoC
# DDP test automation with Playwright

Playwright end-to-end (E2E) UI integration tests.


* See [Playwright Test Runner](https://playwright.dev/docs/api/class-test)
* See [Playwright API](https://playwright.dev/docs/api/class-playwright)
* See [Playwright Test Runner](https://playwright.dev/docs/test-runners#playwright-test)

## Project Structure
E2E automation test follows the **Page Object Model** design

Worthy of note:
* `.env`     - Environment variables
* `playwright.config.ts` - [Playwright test config](https://playwright.dev/docs/test-configuration) for Singular tests
* `/tests/dsm` - DSM tests
* `/tests/singular` - Singular tests
* `/lib` - Reusable functions

## Set up *playwright-e2e* project on localhost

* Playwright [Node.js Requirement](https://playwright.dev/docs/troubleshooting#nodejs-requirements)
* Install `node.js` if not already installed 
  * Install the latest version of `Node.js`. See [Node.js Install](https://nodejs.dev/en/learn/how-to-install-nodejs/)
* Clone Github **ddp-angular** project
  > git clone git@github.com:broadinstitute/ddp-angular.git
* Change to **/playwright-e2e** dir.
* Set Up `.env` file. This file contains env variables which are required to run tests.
  * **DO NOT** commit local `.env` file.
  * Copy `.env.sample`, save as `.env`, fill it out.
  * If you need to know common test users credential, read it from Vault. Try not to use common users for local development.
  > vault read -format=json secret/pepper/test/v1/e2e 

* Install dependencies and Playwright web browsers in **/playwright-e2e** dir.
  > cd playwright-e2e/
  > 
  > npm install
  > 
  > npx playwright install

If you don't want to use the `.env` file, you can also specify environment variables in cmd. See an example of this in **Examples** section.


## Set up to run tests in docker container on localhost

Note: Update docker image version when upgrading Playwright version

- Change dir to **/playwright-e2e**
  > cd playwright-e2e/

- Start Playwright docker image
  > docker run -v $PWD:/e2e -w /e2e -it --rm --ipc=host mcr.microsoft.com/playwright:v1.25.0-focal /bin/bash

- Install dependencies in docker container
  > npm install
  >
  > npx playwright install

- Start running tests in docker container
  - For example, to run Singular tests, change dir to **/singular** first
    > cd tests/singular
    > 
    > npx playwright test pre-screening-page-visual.spec.ts -u


## Run Tests Using `npx` from the Command-Line

By default, all tests will run in headless mode.
* To see the list of available *Playwright test* options:
  > npx playwright test --help

* Run all Singular tests
  * Change dir to **/tests/singular**
  > npx playwright test --config=playwright.config.ts
  * Alternatively, run Singular tests from **/playwright-e2e** dir by specifying flag `--config`
  >  npx playwright test --config=tests/singular/playwright.config.ts -g @singular

* Run all DSM tests
  * Change dir to **/tests/dsm**
  * Alternatively, run DSM tests from **/playwright-e2e** dir by specifying flag `--config`
  >  npx playwright test --config=tests/dsm/playwright.config.ts -g @dsm

#### More Examples

In **/tests/singular** dir, run Singular tests only:

* Run all tests (visual, functional, nightly) in parallel in **headless** mode
  > npx playwright test --config=playwright.config.ts

* Run a single test in **headless** mode
  > npx playwright test --config=playwright.config.ts <TEST_FILE_NAME>

* Debug one test in **headed** mode
  > npx playwright test --config=playwright.config.ts <TEST_FILE_NAME> --debug

* Run all visual tests in **headed** mode
  > npx playwright test --config=playwright.config.ts -g @visual  --headed

* Run all tests in `nightly` directory
  > npx playwright test --config=playwright.config.ts nightly/

* Run one test on your local server (UI and API or just UI)
  > [TODO]

* If you don't set up `.env` file, you can also specify environment
  variables in cmd (Not recommended)
  * For example, to run `login-visual.spec.ts` test:
  > npx cross-env singularSitePassword=<SITE_PASSWORD> singularUserEmail=<YOUR_EMAIL> singularUserPasswd=<YOUR_PASSWORD> singularBaseURL=<HOME_URL> npx playwright test --config=playwright.config.ts login-visual.spec.ts

### Debugging in Intellij

- [TODO]

### Test Development Tips
- In */playwright-e2e* dir, use npm script `npm run lint:singular` to find eslint issues in *singular* dir. Note: Not all eslint rules are fixable by `--fix`.

- For a click action that initiate page navigation, it's a good practice to wait for `navigation` and `load` events.
  - For an example, below is a function that clicks the `submit` button and waits for events.
  ```
  async submit(): Promise<void> {
    const submitButton = this.page.locator('button', { hasText: 'Submit' });
    await Promise.all([this.page.waitForNavigation(), this.page.waitForLoadState('load'), submitButton.click()]);
  }
   ```

- Generate screenshots for a visual test on localhost with flag `--update-snapshots` or `-u`.
  - For example, update `pre-screening-page-visual.spec.ts` test screenshots on localhost
  > `npx playwright test pre-screening-page-visual.spec.ts -u`
  - Save new screenshots and commit to GitHub

- Before merging PR, from project root dir, `/playwright-e2e`, run `tsc build` to compile and build, then run `lint` to check formatting.
  > npm run build
  > 
  > npm run lint
- Test fixture
  - To understand build-in support for fixture, see https://playwright.dev/docs/test-fixtures#creating-a-fixture
  - `homePage` in `fixtures/singular-fixture.ts` is an example of custom user-defined fixture.
  - To use above fixture in a test, for example,
  ```
    import { Page } from '@playwright/test';
    import { test } from 'fixtures/singular-fixture';
    test('an example', async ({ page, homePage }) => {
      await homePage.signUp();
      ...
    }
  ```
