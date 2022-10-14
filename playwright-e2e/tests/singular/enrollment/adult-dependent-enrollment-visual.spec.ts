// import { expect, Page, test } from '@playwright/test';
//
// import AboutYourselfPage from './about-yourself-page';
// import HomePage from 'tests/singular/home/home-page';
// import { fillEmailPassword, fillSitePassword, login } from 'tests/lib/auth-singular';
// import { clickSignMeUp, goToPath } from 'tests/singular/lib/nav';
// import MyDashboardPage, { PatientType, WHO_Adult_Dependent } from '../dashboard/my-dashboard-page';
// import { makeEmailAlias, makeRandomNum } from '../../lib/utils';
// import * as user from '../mock-data/fake-user.json';
// import AboutMyAdultDependentPage from './about-my-adult-dependent-page';
//
//
// async function signUp(page: Page) {
//   await clickSignMeUp(page);
//
//   // On “Create your account” page
//   const aboutYourself = new AboutYourselfPage(page);
//   await aboutYourself.waitForReady();
//   // Enter an age >= 21 and <= 99
//   await aboutYourself.age().textInput().fill(makeRandomNum(21, 99).toString());
//   await aboutYourself.country().select().selectOption(user.patient.country.abbreviation);
//   await aboutYourself.state().select().selectOption(user.patient.state.abbreviation);
//   // In the “Do you or your immediate family member have a single ventricle heart defect?” select “Yes”
//   await aboutYourself.haveVentricleHeartDefect().checkbox('Yes').check();
//   // Checkbox "I'm not a robot"
//   await aboutYourself.checkReCaptcha();
//   await aboutYourself.signMeUp.click();
//
//   // Enter email alias and new password in Login popup
//   await fillEmailPassword(page, {
//     email: makeEmailAlias(process.env.singularUserEmail as string),
//     password: process.env.singularUserPassword,
//     waitForNavigation: true
//   });
// }
//
//
// test.describe('Adult Dependent visual tests', () => {
//   let myDashboardPage: MyDashboardPage;
//
//   test.beforeEach(async ({ page }) => {
//     await goToPath(page, '/password');
//     await fillSitePassword(page);
//     await new HomePage(page).waitForReady();
//     await signUp(page);
//
//     myDashboardPage = new MyDashboardPage(page);
//     await myDashboardPage.waitForReady();
//     await myDashboardPage.enrollMyAdultDependent.click();
//   });
//
//   // Country validation: Select a country which is not US and Canada should triggers an error message
//   test('select a "Someone else" option for adult dependent @visual @enrollment @singular', async ({ page }) => {
//
//     // const await myDashboardPage.whoHasVentricleHeartDefect(WHO_Adult_Dependent.SomeoneElse, PatientType.AdultDependent).check();
//
//     const whoHasVentricleHeartDefect = await myDashboardPage.whoHasVentricleHeartDefect(WHO_Adult_Dependent.SomeoneElse, PatientType.AdultDependent);
//     // No error before select who has ventricle heart defect
//     // await expect(whoHasVentricleHeartDefect.errorMessage()).toBeHidden();
//
//     whoHasVentricleHeartDefect.check();
//
//     // // Select country France and press Tab should start triggering the error message
//     // await aboutYourself.country().select().selectOption('FR');
//     // //await page.keyboard.press('Tab');
//     //
//     // await expect(country.errorMessage()).toContainText(
//     //   'Project Singular is currently open only to participants in the United States and Territories or Canada.' +
//     //     ' Thank you for your interest.'
//     // );
//     //
//     // let screenshot = await country.locator.screenshot();
//     // expect(screenshot).toMatchSnapshot('country-france-err-message.png');
//     //
//     // // Clear error message by select country US
//     // await aboutYourself.country().select().selectOption('US');
//     // // await page.keyboard.press('Tab');
//     //
//     // await expect(country.errorMessage()).toBeHidden();
//     // screenshot = await country.locator.screenshot();
//     // expect(screenshot).toMatchSnapshot('country-reset-value.png');
//   });
//
//   // Age validation: 0 - 18 in country US should triggers an error message: requires parent or guardian to register in US
//   // test('validate age requirement in US @visual @enrollment @singular', async ({ page }) => {
//   //   const aboutYourself = new AboutYourselfPage(page);
//   //
//   //   const age = aboutYourself.age();
//   //   // No error before start entering age
//   //   await expect(age.errorMessage()).toBeHidden();
//   //   // Enter a minor age
//   //   await aboutYourself.age().textInput().fill('2');
//   //
//   //   // No state before select country US
//   //   await expect(aboutYourself.state().select()).toBeHidden();
//   //
//   //   // Select a country and press Tab should start triggering the error message
//   //   await aboutYourself.country().select().selectOption('US');
//   //   await page.keyboard.press('Tab');
//   //
//   //   await expect(age.errorMessage()).toContainText(
//   //     'In order to participate in Project Singular, a parent or guardian must register and consent for you.'
//   //   );
//   //
//   //   const screenshot = await age.locator.screenshot();
//   //   expect(screenshot).toMatchSnapshot('age-input-err-message.png');
//   // });
//   //
//   // test('should blocks workflow in US for a minor person @visual @enrollment @singular', async ({ page }) => {
//   //   const aboutYourself = new AboutYourselfPage(page);
//   //
//   //   await aboutYourself.age().textInput().fill('17');
//   //
//   //   // Select Country: US, State: MA
//   //   const country = aboutYourself.country();
//   //   await country.select().selectOption('US');
//   //   expect(await country.select().screenshot()).toMatchSnapshot('country-us.png');
//   //
//   //   const state = aboutYourself.state();
//   //   await state.select().selectOption('MA');
//   //   expect(await state.select().screenshot()).toMatchSnapshot('state-ma.png');
//   //
//   //   // Click Yes radiobutton
//   //   await aboutYourself.haveVentricleHeartDefect().checkbox('Yes').check();
//   //
//   //   // Sign me up! button is disabled before ReCAPTCHA is checked
//   //   expect(await aboutYourself.signMeUp.isDisabled()).toBeTruthy();
//   //
//   //   await aboutYourself.checkReCaptcha();
//   //   expect(await aboutYourself.signMeUp.isDisabled()).toBe(true);
//   //   expect(await aboutYourself.signMeUp.screenshot()).toMatchSnapshot('sign-me-up-button-disabled.png');
//   // });
// });
