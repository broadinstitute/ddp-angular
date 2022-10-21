import { expect, test } from '@playwright/test';

import HomePage from 'tests/singular/home/home-page';
import { fillSitePassword } from 'tests/lib/auth-singular';
import { goToPath, NavSelectors } from 'tests/singular/lib/nav';
import PreScreeningPage from './pre-screening-page';

test.describe('About Yourself page', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    const home = new HomePage(page);
    await home.waitForReady();

    const signMeUp = page.locator(NavSelectors.SignMeUp);
    await signMeUp.click();
  });

  // Country validation: Select a country which is not US and Canada should triggers an error message
  test('select country France @visual @enrollment @singular', async ({ page }) => {
    const preScreeningPage = new PreScreeningPage(page);

    const country = preScreeningPage.country();
    // No error before select a country
    await expect(country.errorMessage()).toBeHidden();

    // Select country France and press Tab should start triggering the error message
    await preScreeningPage.country().select().selectOption('FR');
    //await page.keyboard.press('Tab');

    await expect(country.errorMessage()).toContainText(
      'Project Singular is currently open only to participants in the United States and Territories or Canada.' +
        ' Thank you for your interest.'
    );
    expect(await country.toLocator().screenshot()).toMatchSnapshot('country-france-err-message.png');
  });

  // Age validation: 0 - 18 in country US should triggers an error message: requires parent or guardian to register in US
  test('Enter age 2 in US @visual @enrollment @singular', async ({ page }) => {
    const preScreeningPage = new PreScreeningPage(page);

    const age = preScreeningPage.age();
    // No error before start entering age
    await expect(age.errorMessage()).toBeHidden();
    // Enter a minor age
    await preScreeningPage.age().fill('2');

    // No state before select country US
    await expect(preScreeningPage.state().toLocator()).toBeHidden();

    // Select a country and press Tab should start triggering the error message
    await preScreeningPage.country().select().selectOption('US');
    await page.keyboard.press('Tab');

    await expect(age.errorMessage()).toContainText(
      'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
    );
    expect(await age.toQuestion().screenshot()).toMatchSnapshot('age-err-message.png');
  });
});