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
* `playwright.config.ts` - [Playwright test config](https://playwright.dev/docs/test-configuration) for all tests
* `/tests/angio` - Angiosarcoma Project (ANGIO) tests
* `/tests/dsm` - DSM tests
* `/tests/rgp` - Rare Genomic Project (RGP) tests
* `/lib` - Common UI widgets and components. For example, Checkbox, Question, etc.
* `/utils` - Common test helper functions

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


## Test Users

> process.env.DSM_USER1_EMAIL: Hunter.Stormreaver@test.firecloud.org
>
> ![Hunter Stormreaver screenshot](data/readme/hunter_stormreaver.png)

> process.env.DSM_USER2_EMAIL: Mason.Whiteclaw@test.firecloud.org
>
> ![Mason Whiteclaw screenshot](data/readme/mason_whiteclaw.png)

> process.env.DSM_USER3_EMAIL: Maya.Bonechewer@test.firecloud.org
>
> ![Maya Bonechewer screenshot](data/readme/maya_bonechewer.png)

> process.env.DSM_USER4_EMAIL: GP.Collection.Date@test.firecloud.org
>
> ![GP Collection screenshot](data/readme/gp_collection_date.png)

> process.env.DSM_USER5_EMAIL: Eli.Stormreaver@test.firecloud.org
>
>  ![Eli Stormreaver screenshot](data/readme/eli_stormreaver.png)

> process.env.DSM_USER6_EMAIL: Paisley.Whiteclaw@test.firecloud.org
>
>  ![Paisley Whiteclaw screenshot](data/readme/paisley_whiteclaw.png)

> process.env.DSM_USER7_EMAIL: Noah.Shadowmoon@test.firecloud.org
>
>  ![Noah Shadowmoon screenshot](data/readme/noah_shadowmoon.png)




## Email forwarding
* Tests run assertions that probe actual delivered email using gmail APIs.  In order for
  these tests to work properly, the emails that pepper sends need to be forwarded into a shared 
  gmail account that we have API access into.  The test accounts in vault have this forwarding
  enabled, but when you add a new account for a new study or when you want to run the tests
  locally using your own email account, you will need to setup email forwarding.
* Set up **selective** forwarding by creating a filter in your gmail account that identifies the
pattern of the `to:`.  You don't want to forward everything in your gmail account to the shared account
since that would mean you're leaking all of your email into a shared account.
* For the various `_EMAIL_` values in your `.env` file, use a pattern like `[your username]+forward@broad.dev`
that you are sure will not pick up any stray emails.  Playwright tests will generate new accounts
for each test, resulting in email addresses like `[your user]+forward+383839392920@broad.dev`.  We will
use this pattern to drive the email filter.
* Use the `email.forwardTo` email from `secret/pepper/test/v1/e2e`
* You can choose to either keep a copy in your inbox or delete it.  You can change this
as you see fit over time.

![gmail forward screenshot](gmail-forward2.png)

![gmail filter screenshot](gmail-filter.png)

![gmail forward screenshot](gmail-forward.png)

* Once you have added your filter and forwarding, you will need to login to the shared gmail
account and approve the request for forwarding.  Use the `forwardTo` and `forwardPassword` 
in `secret/pepper/etst/v1/e2e` to login to the shared gmail account and approve forwarding.



## Set up to run tests in docker container on localhost

Note: Update docker image version when upgrading Playwright version

- Change dir to **/playwright-e2e**
  > cd playwright-e2e/

- Start running Playwright docker image
  > docker run -v $PWD:/e2e -w /e2e -it --rm --ipc=host -p 9323:9323 mcr.microsoft.com/playwright:v1.41.0-jammy /bin/bash

- Install dependencies inside docker container
  > npm install
  > npx playwright install

- Start running tests inside docker container
  > npx playwright test
        
- To view test results
  - In another Terminal window (outside docker container), from **/playwright-e2e** dir, run command:
  > npx playwright show-report html-test-results

## Run Tests Using `npx` from the Command-Line

By default, all tests will run in headless mode.
* To see the list of available *Playwright test* options:
  > npx playwright test --help

* Run all DSM tests
  * Change dir to **/tests/dsm**
  * Alternatively, run DSM tests from **/playwright-e2e** dir by specifying flag `--config`
  >  npx playwright test --config=tests/dsm/playwright.config.ts -g @dsm

#### More Examples

* Run all tests (visual, functional, nightly) in parallel in **headless** mode
  > npx playwright test

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
  * For example:
  > npx cross-env SITE_PASSWORD=<SITE_PASSWORD> DSM_USER1_EMAIL=<EMAIL> DSM_USER1_PASSWORD=<PASSWORD> DSM_BASE_URL=<URL> npx playwright test --project="dsm"

### Running tests on CircleCI
* To verify new or modified tests working on CircleCI
  - CI workflow name is `playwright-e2e-test-workflow`. Trigger this workflow via `build-utils/run_ci.sh`.
    - If this is the first time, set personal CI token in `$HOME/.circleci-token` file. To know how to generate a personal token, see https://app.circleci.com/settings/user/tokens
    - `<STUDY_NAME>` [TEST_SUITE_NAME]: dss, dsm or UNKNOWN (lowercase)
    - `<BRANCH_NAME>` [PR_BRANCH_NAME]
    - `<ENV_NAME>` [ENV_NAME]: dev or test (lowercase)
    
    ```
    > cd build-utils
    > ./run_ci.sh run-e2e-tests [TEST_SUITE_NAME] [PR_BRANCH_NAME] [ENV_NAME]
    ```

    Examples:
    
    - Run all tests against Dev env
      > 
      > ./run_ci.sh run-e2e-tests UNKNOWN playwright-new-test dev
    
    - Run all DSS tests against Dev env
      > 
      > ./run_ci.sh run-e2e-tests dss playwright-new-test dev
      
    - Run all DSM tests against Dev env
       >
       > ./run_ci.sh run-e2e-tests dsm playwright-new-test dev

### Debugging in Intellij

- [TODO]

### Test Development Tips

- To skip a DSM test if env is not Test, add a `test.skip` condition inside the `test.describe` block.
  > `test.skip(DSM_BASE_URL === undefined || (DSM_BASE_URL as string).indexOf('test') === -1);`

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
  - `homePage` in `fixtures/pancan-fixture.ts` is an example of custom user-defined fixture.
  - To use above fixture in a test, for example,
  ```
    import { Page } from '@playwright/test';
    import { test } from 'fixtures/pancan-fixture';
    test('an example', async ({ page }) => {
      await page.signUp();
      ...
    }
  ```
