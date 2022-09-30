import { expect, test } from '@playwright/test';
import AboutMePage from 'tests/singular/enrollment/about-me-page';
import AboutYourselfPage from './about-yourself-page';
import HomePage from 'tests/singular/home/home-page';
import ConsentFormPage from 'tests/singular/enrollment/consent-form-page';
import { enterEmailPassword, clickSignMeUp, fillSitePassword, goToPath } from 'tests/singular/nav';
import { makeRandomEmail, makeRandomNum } from 'tests/singular/utils';
import MedicalRecordReleaseForm from './medical-record-release-form';
import Question from 'tests/lib/Question';
import * as user from 'tests/singular/mock-data/fake-user.json';
import PatientSurveyPage from './patient-survey-page';
import Table from 'tests/lib/table';

test.describe('New adult can enroll self', () => {
  const aliasEmailPassword = 'NotAnyMora1';
  const aliasEmail = makeRandomEmail(process.env.userEmail as string);
  const firstName = 'E2E';
  const lastName = 'Tester';

  test.beforeEach(async ({ page }) => {
    await goToPath(page, '/password');
    await fillSitePassword(page);
    await new HomePage(page).waitForReady();
    await clickSignMeUp(page);
  });

  // Country validation: Select a country which is not US and Canada should triggers an error message
  test('select a country which is not US or Canada', async ({ page }) => {
    // On “Create your account” page
    const aboutYourself = new AboutYourselfPage(page);
    await aboutYourself.waitForReady();

    // Enter an age >= 21
    await aboutYourself.fillAge(makeRandomNum(21, 99));
    // Select US as country
    await aboutYourself.selectCountry('US');
    // Select MA as state
    await aboutYourself.selectState('MA');
    // In the “Do you or your immediate family member have a single ventricle heart defect?” select “Yes”
    await aboutYourself.setVentricleHeartDefect(true);
    // Checkbox "I'm not a robot"
    await aboutYourself.checkReCaptcha();
    await aboutYourself.clickSignMeUpButton();

    await Promise.all([page.waitForNavigation(), enterEmailPassword(page, aliasEmail, aliasEmailPassword)]);

    const consentForm = new ConsentFormPage(page);
    await consentForm.waitForReady();

    // Your Consent Form
    expect(await page.locator('h1.activity-header').innerText()).toEqual('Your Consent Form');
    expect(await page.locator('h3.progress-title').innerText()).toEqual('Page 1 of 3');
    await consentForm.clickNextButton();

    expect(await page.locator('h3.progress-title').innerText()).toEqual('Page 2 of 3');
    await consentForm.clickNextButton();

    expect(await page.locator('h3.progress-title').innerText()).toEqual('Page 3 of 3');
    await consentForm.fillFirstName(firstName);
    await consentForm.fillLastName(lastName);
    await consentForm.enterDateOfBirth(12, 20, 1950);
    await consentForm.checkIWantToKnowSecondaryFinding(true);
    await consentForm.fillYourSignature('E2E Tester');
    await consentForm.fillAuthorizationSignature('E2E Tester');
    await consentForm.clickIAgreeButton();

    // About Me
    expect(await page.locator('h1.activity-header').innerText()).toEqual('About Me');
    const aboutMePage = new AboutMePage(page);
    await aboutMePage.fillFullName(`${firstName} ${lastName}`);
    await aboutMePage.selectCountry();
    await aboutMePage.fillStreetAddress();
    await aboutMePage.fillCity();
    await aboutMePage.selectState();
    await aboutMePage.fillZipCode();
    await aboutMePage.fillTelephoneNumber();
    await aboutMePage.clickNextButton();

    // Medical Record Release Form
    expect(await page.locator('h1.activity-header').innerText()).toEqual('Medical Record Release Form');
    expect(await page.locator('h3.progress-title').innerText()).toEqual('Page 1 of 3');
    const medicalRecordReleaseForm = new MedicalRecordReleaseForm(page);
    await medicalRecordReleaseForm.checkNoneOfOptionsWork();
    await medicalRecordReleaseForm.fillPhysicianName('Dr. Strange');
    await medicalRecordReleaseForm.fillPhoneNumber();
    await medicalRecordReleaseForm.selectDoctorSpecialty('PRIMARY_CARE');
    await medicalRecordReleaseForm.next.click();

    expect(await page.locator('h3.progress-title').innerText()).toEqual('Page 2 of 3');
    await consentForm.clickNextButton();

    expect(await page.locator('h3.progress-title').innerText()).toEqual('Page 3 of 3');
    const nameQuestion = new Question(page, 'Name');
    await nameQuestion.textInput().fill(user.doctor.name);
    const signatureQuestion = new Question(page, 'Signature:');
    await nameQuestion.textInput().fill(user.doctor.name);
    await medicalRecordReleaseForm.submit.click();

    // Medical Record File Upload
    expect(await page.locator('h1.activity-header').innerText()).toEqual('Medical Record File Upload');
    await page.setInputFiles(
      'input[class="file-input"]',
      `${process.cwd()}/mock-data/upload/BroadInstitute_Wikipedia.pdf`
    );
    // Assert uploaded file was successful
    await expect(await page.locator('.uploaded-file .file-name').textContent()).toEqual('BroadInstitute_Wikipedia.pdf');
    await medicalRecordReleaseForm.next.click();


    expect(await page.locator('h1.activity-header').innerText()).toEqual(
      'Please complete this survey so that we may learn more about your medical background.'
    );

    // Patient Survey
    const patientSurveyPage = new PatientSurveyPage(page);
    await patientSurveyPage.cityBornIn().fill(user.patient.city);
    await patientSurveyPage.stateOrProvince().selectOption(user.patient.state.abbreviation);
    await patientSurveyPage.oldZipCode().fill(user.patient.zip);
    await patientSurveyPage.currentZipCode().fill(user.patient.zip);
    await patientSurveyPage.setAtBirth('Prefer not to answer').check();
    await patientSurveyPage.race(new RegExp('^Other')).check();
    await patientSurveyPage.isHispanic('No').check();
    await patientSurveyPage.ventricleDiagnosis('Ebstein').check();
    await patientSurveyPage.submit.click();

    // Assert contents in My Dashboard table
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = new Table(page);
    const headers = await table.getColumnHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCellLocator = await table.findCellByRowValue('Title', 'Consent', 'Summary');
    console.log(await summaryCellLocator?.innerText());

    const statusCellLocator = await table.findCellByRowValue('Title', 'Consent', 'Status');
    console.log(await statusCellLocator?.innerText());
  });
});
