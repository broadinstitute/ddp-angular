import { test as base } from '@playwright/test';

/*
 * Intercept and abort all Google analytics "https://www.google-analytics.com/*" and facebook requests because
 * data generated by automation tests are generally not meaningful and useful.
 */
const REQUEST_EXCLUDES = ['google-analytics', 'facebook'];

/**
 * Fixture prepares resources/env per test case on an "opt-in" basis. It's used to set up the specific environment for test that requires.
 * See Playwright test fixture https://playwright.dev/docs/test-fixtures
 *
 * Extend Playwright test object to include the new fixture. Then use fixtures as argument in test()
 */
// This fixture runs per test when called.
export const fixtureBase = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      return REQUEST_EXCLUDES.some((urlPart) => route.request().url().includes(urlPart)) ? route.abort() : route.continue();
    });
    await use(page);
  }
});
