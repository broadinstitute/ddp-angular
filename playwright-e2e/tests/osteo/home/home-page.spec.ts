import { expect } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { test } from 'fixtures/osteo-fixture';


/**
 * Functional tests
 */
test.describe('Home page', () => {
  test('test case for PEPPER-357 bug fix', async ({ page, homePage }) => {
    const countMeIn = await homePage.getJoinCountMeInButton();
    await countMeIn.click();
    await waitForNoSpinner(page);

    const aboutYouStep = page.locator('.header .breadcrumbs >> text=About You');
    await expect(aboutYouStep).not.toBeVisible();

    const mainNavMenu = page.locator('.header__nav ul.links-list');
    await expect(mainNavMenu).toBeVisible();
  });
});
