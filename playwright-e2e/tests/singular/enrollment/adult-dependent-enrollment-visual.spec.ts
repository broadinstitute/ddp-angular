import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import * as auth from 'authentication/auth-singular';
import PreScreeningPage from 'pages/singular/enrollment/pre-screening-page';
import DashboardPage from 'pages/singular/dashboard-page';
import EnrollMyAdultDependentPage from 'pages/singular/enrollment/enroll-my-adult-dependent-page';
import { WHO } from 'data/constants';

const { SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

async function signUp(page: Page) {
  const preScreeningPage = new PreScreeningPage(page);
  await preScreeningPage.enterInformationAboutYourself();

  // Enter email alias and new password in Login popup
  await auth.createAccountWithEmailAlias(page, { email: SINGULAR_USER_EMAIL, password: SINGULAR_USER_PASSWORD });
}

async function getEnrollMyAdultDependentPage(page: Page) {
  const myDashboardPage = new DashboardPage(page);
  await myDashboardPage.enrollMyAdultDependent();
  return new EnrollMyAdultDependentPage(page);
}

test.describe('Adult Dependent visual tests', () => {
  // whoHasVentricleHeartDefect validation: Select `someone else` should trigger an error message
  test('select a "Someone else" option for adult dependent @visual @enrollment @singular', async ({ page, homePage }) => {
    await homePage.signUp();
    await signUp(page);
    const enrollMyAdultDependentPage = await getEnrollMyAdultDependentPage(page);

    const whoHasVentricleHeartDefect = enrollMyAdultDependentPage.whoHasVentricleHeartDefect();
    // No error before select who has ventricle heart defect
    await expect(whoHasVentricleHeartDefect.errorMessage()).toBeHidden();

    await whoHasVentricleHeartDefect.check(WHO.SomeoneElse);
    await expect(whoHasVentricleHeartDefect.errorMessage()).toContainText(
      'Only an individual with single ventricle heart defect or immediate family members of an individual with ' +
        'single ventricle heart defect can be enrolled.'
    );

    const screenshotError = await whoHasVentricleHeartDefect.toLocator().screenshot();
    expect(screenshotError).toMatchSnapshot('whoHasVentricleHeartDefect-error-message.png');

    // Clear the error message by select `The dependant being enrolled`
    await whoHasVentricleHeartDefect.uncheck(WHO.SomeoneElse);
    await whoHasVentricleHeartDefect.check(WHO.TheDependantBeingEnrolled);
    await expect(whoHasVentricleHeartDefect.errorMessage()).toBeHidden();
    const screenshotSuccess = await whoHasVentricleHeartDefect.toLocator().screenshot();
    expect(screenshotSuccess).toMatchSnapshot('whoHasVentricleHeartDefect-no-errors.png');
  });

  // Age validation: should be 18 y.o. or more
  test('should validate adult dependent age @visual @enrollment @singular', async ({ page, homePage }) => {
    await homePage.signUp();
    await signUp(page);
    const enrollMyAdultDependentPage = await getEnrollMyAdultDependentPage(page);

    const age = enrollMyAdultDependentPage.howOldIsYourDependent();
    // No error before start entering age
    await expect(age.errorMessage()).toBeHidden();
    // Enter an invalid age
    await age.fill('2');
    await enrollMyAdultDependentPage.next();
    const screenshotInvalidAge = await age.toQuestion().screenshot();
    expect(screenshotInvalidAge).toMatchSnapshot('age-invalid-error-message.png');
    // Enter a valid age
    await age.fill('58');
    await expect(age.errorMessage()).toBeHidden();
    const screenshotValidAge = await age.toQuestion().screenshot();
    expect(screenshotValidAge).toMatchSnapshot('age-valid.png');
  });

  // eslint-disable-next-line max-len
  test('should validate `Does your dependent have a cognitive impairment` question @visual @enrollment @singular', async ({
    page,
    homePage
  }) => {
    await homePage.signUp();
    await signUp(page);
    const enrollMyAdultDependentPage = await getEnrollMyAdultDependentPage(page);

    const age = enrollMyAdultDependentPage.howOldIsYourDependent();
    await age.fill('50');
    const cognitiveImpairmentQuestion = enrollMyAdultDependentPage.doesDependentHaveCognitiveImpairment();

    await cognitiveImpairmentQuestion.check('No');
    await expect(age.errorMessage()).toBeVisible();
    const screenshotAgeOfMajorityError = await age.toQuestion().screenshot();
    expect(screenshotAgeOfMajorityError).toMatchSnapshot('age-of-majority-error-message.png');
    const screenshotCognitiveImpairmentNoAnswer = await cognitiveImpairmentQuestion.toLocator().screenshot();
    expect(screenshotCognitiveImpairmentNoAnswer).toMatchSnapshot('cognitive-impairment-no-answer.png');

    await cognitiveImpairmentQuestion.check('Yes');
    await expect(age.errorMessage()).toBeHidden();
    const screenshotCognitiveImpairment = await age.toQuestion().screenshot();
    expect(screenshotCognitiveImpairment).toMatchSnapshot('age-without-errors.png');
    await expect(cognitiveImpairmentQuestion.errorMessage()).toBeHidden();
    const screenshotCognitiveImpairmentYesAnswer = await cognitiveImpairmentQuestion.toLocator().screenshot();
    expect(screenshotCognitiveImpairmentYesAnswer).toMatchSnapshot('cognitive-impairment-yes-answer.png');
  });
});
