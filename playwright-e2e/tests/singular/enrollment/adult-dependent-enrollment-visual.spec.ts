import { expect, Page, test } from '@playwright/test';
import HomePage from 'tests/singular/home/home-page';
import { fillEmailPassword } from 'tests/lib/auth-singular';
import MyDashboardPage from '../dashboard/my-dashboard-page';
import EnrollMyAdultDependentPage from './enroll-my-adult-dependent-page';
import PreScreeningPage from './pre-screening-page';
import * as nav from '../lib/nav';
import * as auth from '../../lib/auth-singular';
import { WHO } from '../../../data/constants';
import { makeEmailAlias } from '../../../utils/string-utils';


async function signUp(page: Page) {
  await nav.signMeUp(page);

  const preScreeningPage = new PreScreeningPage(page);
  await preScreeningPage.enterInformationAboutYourself();

  // Enter email alias and new password in Login popup
  await fillEmailPassword(page, {
    email: makeEmailAlias(process.env.singularUserEmail as string),
    password: process.env.singularUserPassword,
    waitForNavigation: true
  });
}


test.describe('Adult Dependent visual tests', () => {
  test.beforeEach(async ({ page }) => {
    await nav.goToPath(page, '/password');
    await auth.fillSitePassword(page);
    await new HomePage(page).waitForReady();
    await signUp(page);

    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.enrollMyAdultDependent();
  });

  // whoHasVentricleHeartDefect validation: Select `someone else` should trigger an error message
  test('select a "Someone else" option for adult dependent @visual @enrollment @singular', async ({ page }) => {
    // On "Enroll my adult dependent" page
    const enrollMyAdultDependentPage = new EnrollMyAdultDependentPage(page);
    const whoHasVentricleHeartDefect = enrollMyAdultDependentPage.whoHasVentricleHeartDefect();
    // No error before select who has ventricle heart defect
    await expect(whoHasVentricleHeartDefect.errorMessage()).toBeHidden();

    await whoHasVentricleHeartDefect.check(WHO.SomeoneElse);
    await expect(whoHasVentricleHeartDefect.errorMessage()).toContainText(
      'Only an individual with single ventricle heart defect or immediate family members of an individual with single ventricle heart defect can be enrolled.'
    );

    let screenshotError = await whoHasVentricleHeartDefect.toLocator().screenshot();
    expect(screenshotError).toMatchSnapshot('whoHasVentricleHeartDefect-error-message.png');

    // Clear the error message by select `The dependant being enrolled`
    await whoHasVentricleHeartDefect.uncheck(WHO.SomeoneElse);
    await whoHasVentricleHeartDefect.check(WHO.TheDependantBeingEnrolled);
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    let screenshotSuccess = await whoHasVentricleHeartDefect.toLocator().screenshot();
    expect(screenshotSuccess).toMatchSnapshot('whoHasVentricleHeartDefect-no-errors.png');
  });

  // Age validation: should be 18 y.o. or more
  test('should validate adult dependent age @visual @enrollment @singular', async ({ page }) => {
    const enrollMyAdultDependentPage = new EnrollMyAdultDependentPage(page);
    const age = enrollMyAdultDependentPage.howOldIsYourDependent();
    // No error before start entering age
    await expect(age.errorMessage()).toBeHidden();
    // Enter an invalid age
    await age.fill('2');
    await enrollMyAdultDependentPage.next();
    let screenshotInvalidAge = await age.toLocator().screenshot();
    expect(screenshotInvalidAge).toMatchSnapshot('age-invalid-error-message.png');
    // Enter a valid age
    await age.fill('58');
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    let screenshotValidAge = await age.toLocator().screenshot();
    expect(screenshotValidAge).toMatchSnapshot('age-valid.png');
  });

  test('should validate `Does your dependent have a cognitive impairment` question @visual @enrollment @singular', async ({ page }) => {
    const enrollMyAdultDependentPage = new EnrollMyAdultDependentPage(page);
    const age = enrollMyAdultDependentPage.howOldIsYourDependent();
    await age.fill('50');
    const cognitiveImpairmentQuestion = enrollMyAdultDependentPage.doesDependentHaveCognitiveImpairment();

    await cognitiveImpairmentQuestion.check('No');
    await page.waitForTimeout(300);
    let screenshotAgeOfMajorityError = await age.toLocator().screenshot();
    expect(screenshotAgeOfMajorityError).toMatchSnapshot('age-of-majority-error-message.png');
    let screenshotCognitiveImpairmentNoAnswer = await cognitiveImpairmentQuestion.toLocator().screenshot();
    expect(screenshotCognitiveImpairmentNoAnswer).toMatchSnapshot('cognitive-impairment-no-answer.png');

    await cognitiveImpairmentQuestion.check('Yes');
    await page.waitForTimeout(300);
    let screenshotCognitiveImpairment = await age.toLocator().screenshot();
    expect(screenshotCognitiveImpairment).toMatchSnapshot('age-without-errors.png');
    let screenshotCognitiveImpairmentYesAnswer = await cognitiveImpairmentQuestion.toLocator().screenshot();
    expect(screenshotCognitiveImpairmentYesAnswer).toMatchSnapshot('cognitive-impairment-yes-answer.png');
  });
});
