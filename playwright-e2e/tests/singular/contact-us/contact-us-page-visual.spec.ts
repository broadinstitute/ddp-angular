import { expect } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';

/**
 * Functional tests for the Home page
 */
test.describe('Home page', () => {
  test('Our teams @visual @singular', async ({ page, homePage }) => {
    await homePage.gotoURLPath('/about');
    const headerText = page.locator('.our-team h1');

    expect(await headerText.screenshot()).toMatchSnapshot('our-team-text.png');
    expect(await page.locator('.our-team .cards').screenshot({ mask: [page.locator('img')] })).toMatchSnapshot(
      'our-team-cards.png'
    );
  });

  test('Our scientific advisors @visual @singular', async ({ page, homePage }) => {
    await homePage.gotoURLPath('/about');
    const headerText = page.locator('.advisors h1');
    const cards = page.locator('.advisors .cards');

    expect(await headerText.screenshot()).toMatchSnapshot('our-advisors-text.png');

    expect(await cards.screenshot({ mask: [page.locator('img')] })).toMatchSnapshot('our-scientific-advisors.png');
  });
});
