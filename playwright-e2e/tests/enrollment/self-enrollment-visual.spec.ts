import { expect, test } from '@playwright/test';
import AboutYourselfPage from './about-yourself-page';
import HomePage from 'tests/home/home-page';
import { fillSitePassword, goToPath, NavSelectors } from 'tests/nav';

test.describe('Self enroll', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    const home = new HomePage(page);
    await home.waitForReady();

    const signMeUp = page.locator(NavSelectors.SignMeUp);
    await signMeUp.click();
  });

  // Country validation: Select a country which is not US and Canada should triggers an error message
  test('select a country which is not US or Canada', async ({ page }) => {
    const aboutYourself = new AboutYourselfPage(page);

    const countryQuestionLocator = aboutYourself.countryLocator;
    // No error before select a country
    await expect(countryQuestionLocator.locator('.ErrorMessage')).toBeHidden();

    // Select country France and press Tab should start triggering the error message
    await aboutYourself.selectCountry('FR');
    //await page.keyboard.press('Tab');

    await expect(countryQuestionLocator.locator('.ErrorMessage')).toContainText(
      'Project Singular is currently open only to participants in the United States and Territories or Canada.' +
        ' Thank you for your interest.'
    );

    let screenshot = await countryQuestionLocator.screenshot();
    expect(screenshot).toMatchSnapshot('country-france-err-message.png');

    // Clear error message by select country US
    await aboutYourself.selectCountry('US');
    // await page.keyboard.press('Tab');

    await expect(countryQuestionLocator.locator('.ErrorMessage')).toBeHidden();
    screenshot = await countryQuestionLocator.screenshot();
    expect(screenshot).toMatchSnapshot('country-reset-value.png');
  });

  // Age validation: 0 - 18 in country US should triggers an error message: requires parent or guardian to register in US
  test('validate age requirement in US', async ({ page }) => {
    const aboutYourself = new AboutYourselfPage(page);

    const ageQuestionLocator = aboutYourself.ageLocator;
    // No error before start entering age
    await expect(ageQuestionLocator.locator('.ErrorMessage')).toBeHidden();
    await aboutYourself.fillAge('2');

    // No state before select country US
    await expect(aboutYourself.stateLocator).toBeHidden();

    // Select a country and press Tab should start triggering the error message
    await aboutYourself.selectCountry('US');
    await page.keyboard.press('Tab');

    await expect(ageQuestionLocator.locator('.ErrorMessage')).toContainText(
      'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
    );

    let screenshot = await ageQuestionLocator.screenshot();
    expect(screenshot).toMatchSnapshot('age-input-err-message.png');

    // Clear error message by entering an age > 18
    await aboutYourself.fillAge('19');
    await page.keyboard.press('Tab');

    await expect(ageQuestionLocator.locator('.ErrorMessage')).toBeHidden();
    screenshot = await ageQuestionLocator.screenshot();
    expect(screenshot).toMatchSnapshot('age-input.png');

    // Country selected value is not changed
    const countryValue = await aboutYourself.getCountryValue();
    expect(countryValue).toEqual('US');
  });

  test.fixme('should blocks workflow in US for a minor person', async ({ page }) => {
    const aboutYourself = new AboutYourselfPage(page);

    await aboutYourself.fillAge('18');

    // Select Country: US, State: MA
    await aboutYourself.selectCountry('US');
    const countryValue = await aboutYourself.getCountryValue();
    expect(countryValue).toEqual('US');
    expect(await aboutYourself.countryLocator.screenshot()).toMatchSnapshot('country-us.png');

    await aboutYourself.selectState('MA');
    const stateValue = await aboutYourself.getStateValue();
    expect(stateValue).toEqual('MA');
    expect(await aboutYourself.stateLocator.screenshot()).toMatchSnapshot('state-ma.png');

    // Click Yes radiobutton
    await aboutYourself.setVentricleHeartDefect(true);
    expect(
      await aboutYourself.hasVentricleHeartDefectLocator.locator('label', { hasText: 'Yes' }).screenshot()
    ).toMatchSnapshot('heart-defect-radiobutton-yes.png');

    // Sign me up! button is still disabled unless ReCAPTCHA is checked
    expect(await aboutYourself.signMeUpLocator.isDisabled()).toBeTruthy();

    await aboutYourself.checkReCaptcha();
    // FAIL HERE: reCAPTCHA is not disabled on non-prod env
    expect(await aboutYourself.signMeUpLocator.isDisabled()).toBeFalsy();
    expect(await aboutYourself.signMeUpLocator.screenshot()).toMatchSnapshot('sign-me-up-button-enabled.png');
  });
});
