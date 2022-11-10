import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import * as auth from 'authentication/auth-singular';
import { signMeUp } from 'pages/singular/navbar';
import PreScreeningPage from 'pages/singular/enrollment/pre-screening-page';
import MyDashboardPage from 'pages/singular/dashboard/my-dashboard-page';
import EnrollMyAdultDependentPage from 'pages/singular/enrollment/enroll-my-adult-dependent-page';
import { WHO } from 'data/constants';

async function signUp(page: Page) {
  await signMeUp(page);

  const preScreeningPage = new PreScreeningPage(page);
  await preScreeningPage.enterInformationAboutYourself();

  // Enter email alias and new password in Login popup
  await auth.createAccountWithEmailAlias(page);
}

async function getEnrollMyAdultDependentPage(page: Page) {
  const myDashboardPage = new MyDashboardPage(page);
  await myDashboardPage.enrollMyAdultDependent();
  return new EnrollMyAdultDependentPage(page);
}

test.describe('Adult Dependent visual tests', () => {
  // whoHasVentricleHeartDefect validation: Select `someone else` should trigger an error message
  test('select a "Someone else" option for adult dependent @visual @enrollment @singular', async ({
    page,
    homePage
  }) => {
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

    expect(await whoHasVentricleHeartDefect.toLocator().screenshot()).toMatchSnapshot(
      'whoHasVentricleHeartDefect-error-message.png'
    );

    // Clear the error message by select `The dependant being enrolled`
    await whoHasVentricleHeartDefect.uncheck(WHO.SomeoneElse);
    await whoHasVentricleHeartDefect.check(WHO.TheDependantBeingEnrolled);
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    expect(await whoHasVentricleHeartDefect.toLocator().screenshot()).toMatchSnapshot(
      'whoHasVentricleHeartDefect-no-errors.png'
    );
  });

  // Age validation: should be 18 y.o. or more
  test('should validate adult dependent age @visual @enrollment @singular', async ({ page, homePage }) => {
    await homePage.signUp();
    await signUp(page);
    const enrollMyAdultDependentPage = await getEnrollMyAdultDependentPage(page);

    const whoHasVentricleHeartDefect = enrollMyAdultDependentPage.whoHasVentricleHeartDefect();
    await whoHasVentricleHeartDefect.check(WHO.TheDependantBeingEnrolled);

    const age = enrollMyAdultDependentPage.howOldIsYourDependent();
    // No error before start entering age
    await expect(age.errorMessage()).toBeHidden();
    // Enter an invalid age
    await age.fill('2');
    await enrollMyAdultDependentPage.next();

    expect(await age.toQuestion().screenshot()).toMatchSnapshot('age-invalid-error-message.png');
    // Enter a valid age
    await age.fill('58');
    await expect(age.errorMessage()).toBeHidden();
    expect(await age.toQuestion().screenshot()).toMatchSnapshot('age-valid.png');
  });

  // eslint-disable-next-line max-len
  test('should validate `Does your dependent have a cognitive impairment` question @visual @enrollment @singular', async ({
    page,
    homePage
  }) => {
    await homePage.signUp();
    await signUp(page);
    const enrollMyAdultDependentPage = await getEnrollMyAdultDependentPage(page);

    const whoHasVentricleHeartDefect = enrollMyAdultDependentPage.whoHasVentricleHeartDefect();
    await whoHasVentricleHeartDefect.check(WHO.TheDependantBeingEnrolled);

    const age = enrollMyAdultDependentPage.howOldIsYourDependent();
    await age.fill('50');
    const cognitiveImpairmentQuestion = enrollMyAdultDependentPage.doesDependentHaveCognitiveImpairment();

    await cognitiveImpairmentQuestion.check('No');
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    expect(await age.toQuestion().screenshot()).toMatchSnapshot('age-of-majority-error-message.png');
    expect(await cognitiveImpairmentQuestion.toLocator().screenshot()).toMatchSnapshot(
      'cognitive-impairment-no-answer.png'
    );

    await cognitiveImpairmentQuestion.check('Yes');
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    expect(await age.toQuestion().screenshot()).toMatchSnapshot('age-without-errors.png');
    expect(await cognitiveImpairmentQuestion.toLocator().screenshot()).toMatchSnapshot(
      'cognitive-impairment-yes-answer.png'
    );
  });
});
