import { expect, Page, test } from '@playwright/test';

import AboutYourselfPage from './about-yourself-page';
import MedicalRecordReleaseForm from './medical-record-release-form';
import PatientSurveyPage from './patient-survey-page';
import HomePage from 'tests/singular/home/home-page';
import AboutMePage from 'tests/singular/enrollment/about-me-page';
import ConsentFormPage from 'tests/singular/enrollment/consent-form-page';
import MyDashboardPage, { WHO } from 'tests/singular/dashboard/my-dashboard-page';
import * as user from 'tests/singular/mock-data/fake-user.json';
import { clickSignMeUp, goToPath } from 'tests/singular/nav';
import { makeEmailAlias, makeRandomNum } from 'tests/singular/utils';
import { fillEmailPassword, fillSitePassword } from 'tests/lib/authentication';

test.describe('Adult Self Enrollment', () => {
  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    await new HomePage(page).waitForReady();
  });

  /**
   * Test case: https://docs.google.com/document/d/1Ewsh4ULh5LVdZiUapvG-PyI2kL3XzVf4seeLq8Mt-B0/edit?usp=sharing
   */
  test('can finish enrollment', async ({ page }) => {
    // Assertion helper functions
    const assertActivityHeader = async (page: Page, expectedText: string) => {
      await expect(page.locator('h1.activity-header')).toHaveText(expectedText);
    };

    const assertActivityProgress = async (page: Page, expectedText: string) => {
      await expect(page.locator('h3.progress-title')).toHaveText(expectedText);
    };

    await clickSignMeUp(page);

    // On “Create your account” page
    const aboutYourself = new AboutYourselfPage(page);
    await aboutYourself.waitForReady();
    // Enter an age >= 21 and <= 99
    await aboutYourself.age().textInput().fill(makeRandomNum(21, 99).toString());
    await aboutYourself.country().select().selectOption(user.patient.country.abbreviation);
    await aboutYourself.state().select().selectOption(user.patient.state.abbreviation);
    // In the “Do you or your immediate family member have a single ventricle heart defect?” select “Yes”
    await aboutYourself.haveVentricleHeartDefect().checkbox('Yes').check();
    // Checkbox "I'm not a robot"
    await aboutYourself.checkReCaptcha();
    await aboutYourself.signMeUp.click();

    // Enter email alias and new password in Login popup
    await fillEmailPassword(page, {
      email: makeEmailAlias(process.env.userEmail as string),
      password: process.env.userPassword,
      waitForNavigation: true
    });

    // On "My Dashboard" page
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.waitForReady();
    await myDashboardPage.enrollMyself.click();

    // On "Enroll myself" page
    await assertActivityHeader(page, 'Enroll myself');
    await myDashboardPage.whoHasVentricleHeartDefect(WHO.Me).check();
    await myDashboardPage.next.click();

    // On "Consent Form" page
    const consentForm = new ConsentFormPage(page);
    await consentForm.waitForReady();
    await assertActivityHeader(page, 'Your Consent Form');
    await assertActivityProgress(page, 'Page 1 of 3');
    await consentForm.next.click();
    await assertActivityProgress(page, 'Page 2 of 3');
    await consentForm.next.click();
    await assertActivityProgress(page, 'Page 3 of 3');
    await consentForm.firstName().fill(user.patient.firstName);
    await consentForm.lastName().fill(user.patient.lastName);
    await consentForm.enterDateOfBirth(12, 20, 1950);
    await consentForm.wantToKnowSecondaryFinding('I want to know.').check();
    await consentForm.signature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await consentForm.authorizationSignature().fill(user.patient.lastName);
    await consentForm.agree();

    // on "About Me" page
    const aboutMePage = new AboutMePage(page);
    await aboutMePage.waitForReady();
    await assertActivityHeader(page, 'About Me');
    await aboutMePage.fullName().locator.fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await aboutMePage.country(user.patient.country.name);
    await aboutMePage.street().locator.fill(user.patient.streetAddress);
    await aboutMePage.city().locator.fill(user.patient.city);
    await aboutMePage.state(user.patient.state.name);
    await aboutMePage.zipCode().locator.fill(user.patient.zip);
    await aboutMePage.telephone().locator.fill(user.patient.phone);
    await aboutMePage.next.click();
    // Trigger validation
    await aboutMePage.pickSuggestedAddressEntry('As Entered:');
    await Promise.all([page.waitForNavigation(), aboutMePage.next.click()]);

    // on "Medical Record Release Form" page
    const medicalRecordReleaseForm = new MedicalRecordReleaseForm(page);
    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 1 of 3');
    await medicalRecordReleaseForm.unableToProvideMedicalRecords().check();
    await medicalRecordReleaseForm.physician().textInput('PHYSICIAN NAME:').fill(user.doctor.name);
    await medicalRecordReleaseForm
      .physician()
      .textInput('HOSPITAL, CLINIC, OR PROVIDER NAME (if any):')
      .fill(user.doctor.hospital);
    await medicalRecordReleaseForm.physician().textInput('ADDRESS').fill(user.doctor.address);
    await medicalRecordReleaseForm.physician().textInput('PHONE NUMBER:').fill(user.doctor.phone);
    await medicalRecordReleaseForm
      .physician()
      .select('Please specify your doctor’s specialty:')
      .selectOption('PRIMARY_CARE');
    // Wait for request to finish before click the Next button or click has has no affect
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    await medicalRecordReleaseForm.next.click();

    await assertActivityProgress(page, 'Page 2 of 3');
    await medicalRecordReleaseForm.next.click();

    await assertActivityProgress(page, 'Page 3 of 3');
    await medicalRecordReleaseForm.name().textInput('Your name').fill(user.doctor.name);
    await medicalRecordReleaseForm.signature().textInput('Type your full name to sign').fill(user.doctor.name);
    await medicalRecordReleaseForm.submit();

    // Medical Record File Upload
    await assertActivityHeader(page, 'Medical Record File Upload');
    await medicalRecordReleaseForm.uploadFile(`mock-data/upload/BroadInstitute_Wikipedia.pdf`);
    await medicalRecordReleaseForm.clickNext();

    await assertActivityHeader(
      page,
      'Please complete this survey so that we may learn more about your medical background.'
    );

    // Patient Survey
    const patientSurveyPage = new PatientSurveyPage(page);
    await patientSurveyPage.cityBornIn().textInput().fill(user.patient.city);
    await patientSurveyPage.stateOrProvince().select().selectOption(user.patient.state.abbreviation);
    await patientSurveyPage.oldZipCode().textInput().fill(user.patient.zip);
    await patientSurveyPage.currentZipCode().textInput().fill(user.patient.zip);
    await patientSurveyPage.setAtBirth().checkbox('Prefer not to answer').check();
    await patientSurveyPage.race().checkbox(new RegExp('^Other')).check();
    await patientSurveyPage.isHispanic().checkbox(new RegExp('^\\s*No\\s*$')).check();
    await patientSurveyPage.ventricleDiagnosis().toggle('Ebstein').check();
    await patientSurveyPage.submit();

    // Assert contents in My Dashboard table
    await myDashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = myDashboardPage.getDashboardTable();
    const headers = await table.getColumnHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCellLocator = await table.findCellByRowValue('Title', 'Consent', 'Summary');
    console.log(await summaryCellLocator?.innerText());

    const statusCellLocator = await table.findCellByRowValue('Title', 'Consent', 'Status');
    console.log(await statusCellLocator?.innerText());
  });
});
