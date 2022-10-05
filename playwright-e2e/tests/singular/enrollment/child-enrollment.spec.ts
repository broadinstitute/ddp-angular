import { expect, test } from '@playwright/test';

import AboutYourselfPage from './about-yourself-page';
import HomePage from 'tests/singular/home/home-page';
import * as user from 'tests/singular/mock-data/fake-user.json';
import { clickSignMeUp, goToPath } from 'tests/singular/lib/nav';
import { fillSitePassword } from 'tests/lib/auth-singular';
import { makeRandomNum } from 'tests/lib/utils';

test.describe('Child', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    await new HomePage(page).waitForReady();
  });

  /**
   * Child (age under 19) cannot complete self-enrollment
   */
  test('cannot complete self-enrollment @child @enrollment @singular', async ({ page }) => {
    await clickSignMeUp(page);

    // On “Create your account” page
    const aboutYourself = new AboutYourselfPage(page);
    await aboutYourself.waitForReady();

    // Enter an age < 19
    await aboutYourself.age().textInput().fill(makeRandomNum(1, 18).toString());
    await aboutYourself.country().select().selectOption(user.patient.country.abbreviation);
    await aboutYourself.state().select().selectOption(user.patient.state.abbreviation);
    // In the “Do you or your immediate family member have a single ventricle heart defect?” select “Yes”
    await aboutYourself.haveVentricleHeartDefect().checkbox('Yes').check();
    // Checkbox "I'm not a robot"
    await aboutYourself.checkReCaptcha();
    await aboutYourself.signMeUp.click();

    // Verify expected error messages
    const age = aboutYourself.age();
    await expect(age.errorMessage()).toHaveText(
      'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
    );

    await expect(page.locator('.error-message')).toHaveText(
      'Submission cannot proceed. Please review messages in form for details.'
    );

    await expect(aboutYourself.signMeUp).not.toBeHidden();
  });
});
