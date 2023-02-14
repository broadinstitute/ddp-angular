import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import * as auth from 'authentication/auth-singular';
import MedicalRecordReleaseForm from 'pages/singular/enrollment/medical-record-release-form';
import PatientSurveyPage from 'pages/singular/enrollment/patient-survey-page';
import PreScreeningPage from 'pages/singular/enrollment/pre-screening-page';
import EnrollMyAdultDependentPage from 'pages/singular/enrollment/enroll-my-adult-dependent-page';
import ConsentFormForAdultDependentPage from 'pages/singular/enrollment/consent-form-for-adult-dependent-page';
import AboutMyAdultDependentPage from 'pages/singular/enrollment/about-my-adult-dependent-page';
import MyDashboardPage from 'pages/singular/dashboard/my-dashboard-page';
import { WHO } from 'data/constants';
import * as user from 'data/fake-user.json';
import { assertActivityHeader, assertActivityProgress } from 'utils/assertion-helper';
import { generateUserName } from 'utils/faker-utils';

const { SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

test.describe('Enrol an adult dependent', () => {
  // Randomize last name
  const dependentLastName = generateUserName(user.adultDependent.lastName);

  const assertProgressBar = async (page: Page): Promise<void> => {
    const locator = page.locator('app-progress-bar li .item .item__name');
    await expect(locator).toHaveCount(5);
    const items: string[] = ['Consent Form', 'About Me', 'Medical Release', 'Medical Record File Upload', 'Patient Survey'];
    await expect(locator).toHaveText(items);
  };

  const assertProgressCurrentItem = async (page: Page, itemName: string): Promise<void> => {
    const locator = page.locator('app-progress-bar li .item--current');
    await expect(locator).toHaveCount(1);
    await expect(locator).toContainText(itemName);
  };

  /** Test skip due to bug https://broadworkbench.atlassian.net/browse/PEPPER-485. Re-enable after bug fix. */
  /**
   * Test case: https://docs.google.com/document/d/1vaiSfsYeDzEHeK2XOVO3n_7I1W0Z94Kkqx_82w8-Vpc/edit#heading=h.6snot4x1e1uw
   */
  test.skip('can finish adult-dependent-enrollment @enrollment @singular', async ({ page, homePage }) => {
    await homePage.signUp();

    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.enterInformationAboutYourself();

    // Enter email alias and new password in Login popup
    await auth.createAccountWithEmailAlias(page, { email: SINGULAR_USER_EMAIL, password: SINGULAR_USER_PASSWORD });

    // On "My Dashboard" page
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.enrollMyAdultDependent();

    // On "Enroll my adult dependent" page
    await assertActivityHeader(page, 'Enroll my adult dependent');
    const enrollMyAdultDependentPage = new EnrollMyAdultDependentPage(page);
    await enrollMyAdultDependentPage.whoHasVentricleHeartDefect().check(WHO.TheDependantBeingEnrolled);
    await enrollMyAdultDependentPage.howOldIsYourDependent().fill(user.adultDependent.age);
    await enrollMyAdultDependentPage.fillInCountry(user.adultDependent.country.abbreviation, {
      state: user.adultDependent.state.abbreviation
    });
    await enrollMyAdultDependentPage.doesDependentHaveCognitiveImpairment().check('Yes', { exactMatch: true });
    await myDashboardPage.next();

    // // On "Consent Form for Adult Dependent" page
    const consentForm = new ConsentFormForAdultDependentPage(page);
    await assertActivityHeader(page, 'Consent Form for Adult Dependent');
    await assertActivityProgress(page, 'Page 1 of 3');
    await consentForm.next();

    await assertActivityHeader(page, 'Consent Form for Adult Dependent');
    await assertActivityProgress(page, 'Page 2 of 3');
    await consentForm.next();

    await assertActivityHeader(page, 'Consent Form for Adult Dependent');
    await assertActivityProgress(page, 'Page 3 of 3');

    await consentForm.dependentFirstName().fill(user.adultDependent.firstName);
    await consentForm.dependentLastName().fill(dependentLastName);
    await consentForm.fillInDateOfBirth(
      user.adultDependent.birthDate.MM,
      user.adultDependent.birthDate.DD,
      user.adultDependent.birthDate.YYYY
    );
    await consentForm.toKnowSecondaryFinding().check('I want to know.');
    await consentForm.selectOneForAdultDependent().check('I have explained the study');
    await consentForm.dependentGuardianSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await consentForm.authorizationSignature().fill(user.patient.lastName);
    await consentForm.agree();

    await assertProgressBar(page);

    // on "About Me" page
    const aboutMyAdultDependentPage = new AboutMyAdultDependentPage(page);
    await aboutMyAdultDependentPage.waitForReady();
    await assertActivityHeader(page, 'About Me');
    await assertProgressCurrentItem(page, 'About Me');

    // Fill out address with fake data
    await aboutMyAdultDependentPage.fillInContactAddress({
      fullName: `${user.adultDependent.firstName} ${dependentLastName}`,
      country: user.adultDependent.country.name,
      state: user.adultDependent.state.name,
      street: user.adultDependent.streetAddress,
      city: user.adultDependent.city,
      zipCode: user.adultDependent.zip,
      telephone: user.adultDependent.phone,
      labels: { phone: 'Telephone Contact Number', country: 'Country', state: 'State', zip: 'Zip Code', city: 'City' }
    });
    await aboutMyAdultDependentPage.next({ waitForNav: true });

    // on "Medical Record Release Form" page
    const medicalRecordReleaseForm = new MedicalRecordReleaseForm(page);
    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 1 of 3');
    await assertProgressCurrentItem(page, 'Medical Release');

    await medicalRecordReleaseForm.unableToProvideMedicalRecords().check();
    await medicalRecordReleaseForm.enterInformationAboutPhysician();
    await medicalRecordReleaseForm.next();

    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 2 of 3');
    await medicalRecordReleaseForm.next();

    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 3 of 3');
    await medicalRecordReleaseForm.patientName().fill(`${user.adultDependent.firstName} ${dependentLastName}`);
    await medicalRecordReleaseForm.dependentParentName().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await medicalRecordReleaseForm.parentSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    await medicalRecordReleaseForm.submit();

    // Medical Record File Upload
    await assertProgressCurrentItem(page, 'Medical Record File Upload');
    await assertActivityHeader(page, 'Medical Record File Upload');
    // Do not need to upload medical record file. Click Next button to continue without upload.
    await medicalRecordReleaseForm.next({ waitForNav: true });

    // Patient Survey
    await assertActivityHeader(page, 'Please complete this survey so that we may learn more about your medical background.');

    const patientSurveyPage = new PatientSurveyPage(page);
    await patientSurveyPage.cityBornIn().fill(user.adultDependent.city);
    await patientSurveyPage.stateBornIn().selectOption(user.adultDependent.state.abbreviation);
    await patientSurveyPage.zipCodeCityBornIn().fill(user.adultDependent.zip);
    await patientSurveyPage.currentZipCode().fill(user.adultDependent.zip);
    await patientSurveyPage.sexAtBirth().check('Prefer not to answer');
    await patientSurveyPage.race().check('White');
    await patientSurveyPage.isHispanic().check('No', { exactMatch: true });
    await patientSurveyPage.selectVentricleDiagnosis().check('Other');
    await patientSurveyPage.selectVentricleDiagnosis().inputByLabel('Please specify (or write Unsure)').fill('Unsure');
    await patientSurveyPage.submit();

    // Assert contents in My Dashboard table
    await myDashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = myDashboardPage.getDashboardTable();
    const headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCell('Title', 'Consent Form for Adult Dependent', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Thank you for signing the consent form -- welcome to Project Singular!');

    const statusCell = await table.findCell('Title', 'Consent Form for Adult Dependent', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toHaveText('Complete');
  });
});
