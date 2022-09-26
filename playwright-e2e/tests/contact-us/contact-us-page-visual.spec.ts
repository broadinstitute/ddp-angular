import { expect, test } from '@playwright/test';
import { fillSitePassword, goToAboutUs, goToPath } from 'tests/nav';

/**
 * Functional tests for the Home page
 */
test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    await goToAboutUs(page);
  });

  test('match header title', async ({ page }) => {
    const header = page.locator('h1 >> text="About Us"');

    expect(await header.screenshot()).toMatchSnapshot('title-text.png');
  });

  test('match about-us', async ({ page }) => {
    const aboutText = page.locator('.about-left p');
    expect(await aboutText.count()).toEqual(5);
    for (let i = 0; i < 5; i++) {
      expect(await aboutText.nth(i).screenshot()).toMatchSnapshot(`about-us-text-${i}.png`);
    }
  });

  test('match our teams', async ({ page }) => {
    const headerText = page.locator('.our-team h1');

    expect(await headerText.screenshot()).toMatchSnapshot('our-team-text.png');
    expect(await page.locator('.our-team .cards').screenshot({ mask: [page.locator('img')] })).toMatchSnapshot(
      'our-team-cards.png'
    );
  });

  test('match our scientific advisors', async ({ page }) => {
    const headerText = page.locator('.advisors h1');
    const cards = page.locator('.advisors .cards');

    expect(await headerText.screenshot()).toMatchSnapshot('our-advisors-text.png');

    expect(await cards.screenshot({ mask: [page.locator('img')] })).toMatchSnapshot('our-scientific-advisors.png');
  });
});
