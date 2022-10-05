# PoC
# DDP test automation with Playwright

Playwright end-to-end (E2E) UI integration tests.


* See [Playwright Test Runner](https://playwright.dev/docs/api/class-test)
* See [Playwright API](https://playwright.dev/docs/api/class-playwright)
* See [Playwright Test Runner](https://playwright.dev/docs/test-runners#playwright-test)

## Set up *playwright-e2e* project on localhost

* Playwright [Node.js Requirement](https://playwright.dev/docs/troubleshooting#nodejs-requirements)
* Install `node.js` if not already installed 
  * Install the latest version of `Node.js`. See [Node.js Install](https://nodejs.dev/en/learn/how-to-install-nodejs/)
* Clone Github **ddp-angular** project: 
  * `git clone git@github.com:broadinstitute/ddp-angular.git`
* Install dependencies and Playwright web browsers inside the */playwright-e2e* dir:
  > cd playwright-e2e/
  > 
  > npm install
  > 
  > npx playwright install


## Run Tests Using `npx` from the Command-Line

By default, all tests will run in headless mode.

* To run Singular tests, change dir to */tests/singular*. See README.md for how-to in */singular* dir..

* To see the list of available *Playwright test* options:
  ```
  npx playwright test --help
  ```

## Set up to run tests in docker container on localhost

Note: Update docker image version when upgrading Playwright version

- Navigate to */playwright-e2e* dir
  > cd playwright-e2e/

- Start Playwright docker image
  > docker run -v $PWD:/e2e -w /e2e -it --rm --ipc=host mcr.microsoft.com/playwright:v1.25.0-focal /bin/bash

- Install dependencies in docker container
  > npm install
  >
  > npx playwright install

- Change dir to */singular* in docker container and start running any tests in docker container
  > cd tests/singular
  > 
  > npx playwright test self-enrollment-visual.spec.ts -u

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
