import { test as baseTest } from '@playwright/test';
import SingularHomePage from 'pages/singular/home/home-page';
import { fillSitePassword } from 'utils/test-utils';

type Fixtures = {
  homePage: SingularHomePage;
};

/**
 *
 * Fixture prepares resources/env per test case on an "opt-in" basis.
 * See Playwright test fixture https://playwright.dev/docs/test-fixtures
 */
const fixture = baseTest.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new SingularHomePage(page);
    await homePage.gotoURLPath('/password');
    await fillSitePassword(page);
    await homePage.waitForReady();
    // Use the fixture value in the test.
    await use(homePage);
    // Add code that cleans up or log out
  }
});
export const test = fixture;
