import { expect } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';

/**
 * Functional tests for the Home page
 */
test.describe.skip('Home page', () => {
  test('Our teams @visual @singular', async ({ page, homePage }) => {
    await homePage.gotoURLPath('/about');
    const headerText = page.locator('.our-team h1');
    await expect(headerText).toHaveText('Our Team');
    await expect(headerText).toHaveScreenshot('our-team-text.png');
    await expect(page.locator('.our-team .cards')).toHaveScreenshot('our-team-cards.png', {
      mask: [page.locator('img'), page.locator('.header')]
    });
  });

  test('Our scientific advisors @visual @singular', async ({ page, homePage }) => {
    await homePage.gotoURLPath('/about');
    const headerText = page.locator('.advisors h1');
    const cards = page.locator('.advisors .cards');

    await expect(headerText).toHaveScreenshot('our-advisors-text.png');
    await expect(cards).toHaveScreenshot('our-scientific-advisors.png', { mask: [page.locator('img'), page.locator('.header')] });
  });
});
