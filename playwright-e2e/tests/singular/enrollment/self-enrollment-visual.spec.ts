import { expect, test } from '@playwright/test';

import AboutYourselfPage from './about-yourself-page';
import HomePage from 'tests/singular/home/home-page';
import { fillSitePassword } from 'tests/lib/auth-singular';
import { goToPath, NavSelectors } from 'tests/singular/lib/nav';

test.describe('Check About Yourself page', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    const home = new HomePage(page);
    await home.waitForReady();

    const signMeUp = page.locator(NavSelectors.SignMeUp);
    await signMeUp.click();
  });

  // Country validation: Select a country which is not US and Canada should triggers an error message
  test('select a country which is not US or Canada @visual @enrollment @singular', async ({ page }) => {
    const aboutYourself = new AboutYourselfPage(page);

    const country = aboutYourself.country();
    // No error before select a country
    await expect(country.select().locator('.ErrorMessage')).toBeHidden();

    // Select country France and press Tab should start triggering the error message
    await aboutYourself.country().select().selectOption('FR');
    //await page.keyboard.press('Tab');

    await expect(country.locator.locator('.ErrorMessage')).toContainText(
      'Project Singular is currently open only to participants in the United States and Territories or Canada.' +
        ' Thank you for your interest.'
    );

    let screenshot = await country.locator.screenshot();
    expect(screenshot).toMatchSnapshot('country-france-err-message.png');

    // Clear error message by select country US
    await aboutYourself.country().select().selectOption('US');
    // await page.keyboard.press('Tab');

    await expect(country.locator.locator('.ErrorMessage')).toBeHidden();
    screenshot = await country.locator.screenshot();
    expect(screenshot).toMatchSnapshot('country-reset-value.png');
  });

  // Age validation: 0 - 18 in country US should triggers an error message: requires parent or guardian to register in US
  test('validate age requirement in US @visual @enrollment @singular', async ({ page }) => {
    const aboutYourself = new AboutYourselfPage(page);

    const age = aboutYourself.age();
    // No error before start entering age
    await expect(age.locator.locator('.ErrorMessage')).toBeHidden();
    // Enter a minor age
    await aboutYourself.age().textInput().fill('2');

    // No state before select country US
    await expect(aboutYourself.state().select()).toBeHidden();

    // Select a country and press Tab should start triggering the error message
    await aboutYourself.country().select().selectOption('US');
    await page.keyboard.press('Tab');

    await expect(age.locator.locator('.ErrorMessage')).toContainText(
      'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
    );

    const screenshot = await age.locator.screenshot();
    expect(screenshot).toMatchSnapshot('age-input-err-message.png');
  });

  test('should blocks workflow in US for a minor person @visual @enrollment @singular', async ({ page }) => {
    const aboutYourself = new AboutYourselfPage(page);

    await aboutYourself.age().textInput().fill('17');

    // Select Country: US, State: MA
    const country = aboutYourself.country();
    await country.select().selectOption('US');
    expect(await country.select().screenshot()).toMatchSnapshot('country-us.png');

    const state = aboutYourself.state();
    await state.select().selectOption('MA');
    expect(await state.select().screenshot()).toMatchSnapshot('state-ma.png');

    // Click Yes radiobutton
    await aboutYourself.haveVentricleHeartDefect().checkbox('Yes').check();

    // Sign me up! button is disabled before ReCAPTCHA is checked
    expect(await aboutYourself.signMeUp.isDisabled()).toBeTruthy();

    await aboutYourself.checkReCaptcha();
    expect(await aboutYourself.signMeUp.isDisabled()).toBe(true);
    expect(await aboutYourself.signMeUp.screenshot()).toMatchSnapshot('sign-me-up-button-disabled.png');
  });
});
