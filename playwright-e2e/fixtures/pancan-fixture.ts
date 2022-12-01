import { test as baseTest } from '@playwright/test';
import PancanHomePage from 'pages/pancan/home/home-page';
import { fillSitePassword } from 'utils/test-utils';

// Create a Type for the fixture
type Fixtures = {
  homePage: PancanHomePage;
};

/**
 * Fixture prepares resources/env per test case on an "opt-in" basis. It's used to set up the specific environment for test that requires.
 * See Playwright test fixture https://playwright.dev/docs/test-fixtures
 *
 * Extend Playwright test object to include the new fixture. Then use fixtures as argument in test()
 */
// This fixture runs per test when called. Removes duplicated code in every test.
const fixture = baseTest.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new PancanHomePage(page);
    await homePage.gotoURLPath('/password');
    await fillSitePassword(page);
    await homePage.waitForReady();
    // Use the fixture value in the test.
    await use(homePage);
    // Add code that cleans up or log out
  }
});
export const test = fixture;
