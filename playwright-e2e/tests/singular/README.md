# Singular Project E2E Test

## Test Users

- **DO NOT** store passwords in `.env` files.

- **DO NOT** use these users for local development.

Supple credentials for pre-existing test users (rather than by generating new users) using an environment property file `.env`. See `.env.singular.test` for an
example.

A `.env` file requires following fields:
```angular2html
- baseURL
- sitePassword
- userEmail
- userPassword
```

If you don't want to use the `.env` file, you can also specify environment variables in cmd. See an example of this in **Examples**.

## Run Tests Using `npx` from the Command-Line

By default, all tests will run in headless mode.

To see the list of available **Playwright** test options: <div class="text-blue">```npx playwright test --help```</div>

### Running Tests on Localhost

Fill out local test user credentials

- Copy `.env.singular.sample`, save as `.env`.
- Update `.env`

### Examples

* Run all tests (visual, functional, nightly) in parallel in **headless** mode
  > npx playwright test
  
* Run a single test in **headless** mode
  > npx playwright test <TEST_FILE_NAME>

* Debug one test in **headed** mode
  > npx playwright test <TEST_FILE_NAME> --debug

* Run all visual tests in **headed** mode
  > npx playwright test -g visual  --headed

* Run all tests in `nightly` directory
  > npx playwright test nightly/

* Run one test on your local server (UI and API or just UI)
  > [TODO]

* If you don't want to use the `.env` file, you can also specify environment
  variables in cmd.
  * For example, run `login-visual.spec.ts` test:
  > npx cross-env sitePassword=<SITE_PASSWORD> userEmail=<YOUR_EMAIL> userPasswd=<YOUR_PASSWORD> baseURL=<HOME_URL> npx playwright test login-visual.spec.ts


## Project Structure
E2E automation test follows the **Page Object Model** design

Worthy of note:
* `.env`     - Environment variables
* `utils.ts` - Test utility functions
* `nav.ts`   - Page navigation functions
* `playwright.config.ts` - [Playwright test config](https://playwright.dev/docs/test-configuration) for Singular tests
* `playwright-ci.config.ts` - Playwright test config for running tests on CircleCI

### Test Development Tips
- Generate screenshots for a visual test on localhost with flag `-u`
  - For example,
  > `npx playwright test self-enrollment-visual.spec.ts -u`
  - Save new screenshots and commit to GitHub
  

- Generate screenshots for testing on CircleCI

   Note: Update docker image version when upgrading Playwright version
  - For example,
  >`docker run -v $PWD:/e2e -w /e2e -it --rm --ipc=host mcr.microsoft.com/playwright:v1.25.0-focal /bin/bash`
    
  > `npx playwright test self-enrollment-visual.spec.ts -u`
  - Save new screenshots and commit to GitHub


- [TODO]
