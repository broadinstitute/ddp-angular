import { expect, test } from '@playwright/test';

import PreScreeningPage from 'pages/singular/enrollment/pre-screening-page';
import HomePage from 'pages/singular/home/home-page';
import * as user from 'data/fake-user.json';
import * as nav from 'pages/singular/navbar';
import { fillSitePassword } from 'authentication/auth-singular';

test.describe('Child Enrollment', () => {
  test.beforeEach(async ({ page }) => {
    await nav.goToPath(page, '/password');
    await fillSitePassword(page);
    await new HomePage(page).waitForReady();
  });

  /**
   * Child (age under 19) cannot complete self-enrollment
   */
  test('self-enrollment cannot complete @enrollment @singular', async ({ page }) => {
    await nav.signMeUp(page);

    // On “Create your account” page
    const preScreeningPage = new PreScreeningPage(page);

    // Enter an age < 19
    await preScreeningPage.age().fill(user.child.age);
    await preScreeningPage.country().select().selectOption(user.child.country.abbreviation);
    await preScreeningPage.state().select().selectOption(user.child.state.abbreviation);
    // In the “Do you or your immediate family member have a single ventricle heart defect?” select “Yes”
    await preScreeningPage.haveVentricleHeartDefect().check('Yes');
    await preScreeningPage.checkReCaptcha(); // ReCaptcha "I'm not a robot"
    await preScreeningPage.signMeUp();

    // Verify expected error messages
    const age = preScreeningPage.age();
    await expect(age.errorMessage()).toHaveText(
      'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
    );

    await expect(page.locator('.error-message')).toHaveText(
      'Submission cannot proceed. Please review messages in form for details.'
    );
  });
});
