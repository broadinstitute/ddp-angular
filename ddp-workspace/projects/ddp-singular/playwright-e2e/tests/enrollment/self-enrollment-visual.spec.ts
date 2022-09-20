import { expect, test } from '@playwright/test';
import AboutYourselfPage from 'tests/enrollment/about-yourself-page';
import HomePage from 'tests/home/home-page';
import { fillSitePassword, goToPath, NavSelectors } from 'tests/nav';

test.describe('Self enroll', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    const home = new HomePage(page);
    await home.waitForReady();
  });

  test('young age triggers error', async ({ page }) => {
    const signMeUp = page.locator(NavSelectors.SignMeUp);
    await signMeUp.click();

    // Parent node for the Age Question that contains input, error, label, etc.
    const aboutYourself = new AboutYourselfPage(page);
    const ageQuestionLocator = aboutYourself.ageLocator;

    // No error before start entering age
    await expect(ageQuestionLocator.locator('.ErrorMessage')).toBeHidden();

    // Age validation: 0 - 18 in US triggers message: requires parent or guardian to register in US
    await aboutYourself.fillAge('2');

    // Select US country and press Tab should trigger the message
    await aboutYourself.selectCountry('US');
    await page.keyboard.press('Tab');

    await expect(ageQuestionLocator.locator('.ErrorMessage')).toContainText(
      'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
    );

    let screenshot = await ageQuestionLocator.screenshot();
    expect(screenshot).toMatchSnapshot('age-input-err-message.png');

    // Clear error message by entering age > 18
    await aboutYourself.fillAge('19');
    await page.keyboard.press('Tab');
    await expect(ageQuestionLocator.locator('.ErrorMessage')).toBeHidden();
    screenshot = await ageQuestionLocator.screenshot();
    expect(screenshot).toMatchSnapshot('age-input.png');

    // Country selected value is not changed
    const countryValue = await aboutYourself.getCountryValue();
    expect(countryValue).toEqual('US');
  });

  test('age has error and should blocks workflow', async ({ page }) => {
    const signMeUp = page.locator(NavSelectors.SignMeUp);
    await signMeUp.click();

    const aboutYourself = new AboutYourselfPage(page);

    // Enter Age: 18
    await aboutYourself.fillAge('18');

    // Select Country: US, State: MA
    await aboutYourself.selectCountry('US');
    const countryValue = await aboutYourself.getCountryValue();
    expect(countryValue).toEqual('US');
    // expect(await aboutYourself.countryLocator.screenshot()).toMatchSnapshot('country-us.png');

    await aboutYourself.selectState('MA');
    const stateValue = await aboutYourself.getStateValue();
    expect(stateValue).toEqual('MA');
    // expect(await aboutYourself.stateLocator.screenshot()).toMatchSnapshot('state-ma.png');

    // Click Yes radiobutton
    await aboutYourself.setVentricleHeartDefect(true);
    expect(
      await aboutYourself.hasVentricleHeartDefectLocator.locator('label', { hasText: 'Yes' }).screenshot()
    ).toMatchSnapshot('radiobutton-yes.png');
  });
});
