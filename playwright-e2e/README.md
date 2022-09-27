# PoC
# DDP test automation with Playwright

Playwright end-to-end (E2E) UI integration tests.


* See [Playwright Test Runner](https://playwright.dev/docs/api/class-test)
* See [Playwright API](https://playwright.dev/docs/api/class-playwright)
* See [Playwright Test Runner](https://playwright.dev/docs/test-runners#playwright-test)

## Set up *playwright-e2e* project

* Playwright [Node.js Requirement](https://playwright.dev/docs/troubleshooting#nodejs-requirements)
* Install `node.js` if not already installed 
  * Install the latest version of `Node.js`. See [Node.js Install](https://nodejs.dev/en/learn/how-to-install-nodejs/)
* Clone Github **ddp-angular** project: 
  * `git clone git@github.com:broadinstitute/ddp-angular.git`
* Install dependencies and web browsers:
  * `npm install`
  * `npx playwright install`


## Run Tests Using `npx` from the Command-Line

By default, all tests will run in headless mode.

To see the list of available *npx* commands in *package.json*: <div class="text-blue">```npm run```</div>

To see the list of available *Playwright test* options:<div class="text-blue">```npx playwright test --help```</div>

### Debugging in Intellij

- [TODO]

### Test Development Tips
- Use `npm run lint:singular` to find eslint issues in *singular* dir. Note: Not all eslint rules are fixable by `--fix`.
