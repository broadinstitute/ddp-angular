import { expect, test } from '@playwright/test';
import { goToAboutUs, goToPath } from 'tests/singular/lib/nav';
import { fillSitePassword } from 'tests/lib/auth-singular';

/**
 * Functional tests for the Home page
 */
test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    await goToAboutUs(page);
  });

  test('Our teams @visual @singular', async ({ page }) => {
    const headerText = page.locator('.our-team h1');

    expect(await headerText.screenshot()).toMatchSnapshot('our-team-text.png');
    expect(await page.locator('.our-team .cards').screenshot({ mask: [page.locator('img')] })).toMatchSnapshot(
      'our-team-cards.png'
    );
  });

  test('Our scientific advisors @visual @singular', async ({ page }) => {
    const headerText = page.locator('.advisors h1');
    const cards = page.locator('.advisors .cards');

    expect(await headerText.screenshot()).toMatchSnapshot('our-advisors-text.png');

    expect(await cards.screenshot({ mask: [page.locator('img')] })).toMatchSnapshot('our-scientific-advisors.png');
  });
});
