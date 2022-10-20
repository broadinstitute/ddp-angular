import { expect, test } from '@playwright/test';
import HomePage from 'tests/singular/home/home-page';
import * as nav from 'tests/singular/lib/nav';
import * as auth from 'tests/lib/auth-singular';
import { fillEmailPassword } from 'tests/lib/auth-singular';
import { enterMailingAddress } from 'tests/lib/test-steps';
import MedicalRecordReleaseForm from './medical-record-release-form';
import PatientSurveyPage from './patient-survey-page';
import PreScreeningPage from './pre-screening-page';
import EnrollMyAdultDependentPage from './enroll-my-adult-dependent-page';
import ConsentFormForAdultDependentPage from './consent-form-for-adult-dependent-page';
import { makeEmailAlias } from 'utils/string-utils';
import { assertActivityHeader, assertActivityProgress } from 'utils/assertion-helper';
import AboutMyAdultDependentPage from './about-my-adult-dependent-page';
import MyDashboardPage from '../dashboard/my-dashboard-page';
import { WHO } from 'data/constants';
import * as user from 'data/fake-user.json';

test.describe('Enrol an adult dependent', () => {
  test.beforeEach(async ({ page }) => {
    await nav.goToPath(page, '/password');
    await auth.fillSitePassword(page);
    await new HomePage(page).waitForReady();
  });

  /**
   * Test case: https://docs.google.com/document/d/1vaiSfsYeDzEHeK2XOVO3n_7I1W0Z94Kkqx_82w8-Vpc/edit#heading=h.6snot4x1e1uw
   */
  test('can finish adult-dependent-enrollment @enrollment @singular', async ({ page }) => {
    await nav.signMeUp(page);

    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.enterInformationAboutYourself();

    // Enter email alias and new password in Login popup
    await fillEmailPassword(page, {
      email: makeEmailAlias(process.env.singularUserEmail as string),
      password: process.env.singularUserPassword,
      waitForNavigation: true
    });

    // On "My Dashboard" page
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.enrollMyAdultDependent();

    // On "Enroll my adult dependent" page
    await assertActivityHeader(page, 'Enroll my adult dependent');
    const enrollMyAdultDependentPage = new EnrollMyAdultDependentPage(page);
    await enrollMyAdultDependentPage.whoHasVentricleHeartDefect().check(WHO.TheDependantBeingEnrolled);
    await enrollMyAdultDependentPage.howOldIsYourDependent().fill(user.adultDependent.age);
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
    await consentForm.dependentLastName().fill(user.adultDependent.lastName);
    await consentForm.fillDateOfBirth(12, 20, 1950);
    await consentForm.toKnowSecondaryFinding().check('I want to know.');
    await consentForm.selectOneForAdultDependent().check('I have explained the study');
    await consentForm.dependentGuardianSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await consentForm.authorizationSignature().fill(user.patient.lastName);
    await consentForm.agree();

    // on "About Me" page
    const aboutMyAdultDependentPage = new AboutMyAdultDependentPage(page);
    await aboutMyAdultDependentPage.waitForReady();
    await assertActivityHeader(page, 'About Me');
    // Fill out address with fake data
    await enterMailingAddress(page, {
      fullName: `${user.adultDependent.firstName} ${user.adultDependent.lastName}`,
      country: user.adultDependent.country.name,
      state: user.adultDependent.state.name,
      street: user.adultDependent.streetAddress,
      city: user.adultDependent.city,
      zipCode: user.adultDependent.zip,
      telephone: user.adultDependent.phone
    });
    await aboutMyAdultDependentPage.next();
    // Trigger validation
    await aboutMyAdultDependentPage.suggestedAddress().radioButton('As Entered:').check();
    await aboutMyAdultDependentPage.next({ waitForNav: true });

    // on "Medical Record Release Form" page
    const medicalRecordReleaseForm = new MedicalRecordReleaseForm(page);
    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 1 of 3');
    await medicalRecordReleaseForm.unableToProvideMedicalRecords().check();
    await medicalRecordReleaseForm.enterInformationAboutPhysician();
    await medicalRecordReleaseForm.next();

    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 2 of 3');
    await medicalRecordReleaseForm.next();

    await assertActivityHeader(page, 'Medical Record Release Form');
    await assertActivityProgress(page, 'Page 3 of 3');
    await medicalRecordReleaseForm
      .patientName()
      .fill(`${user.adultDependent.firstName} ${user.adultDependent.lastName}`);
    await medicalRecordReleaseForm.dependentParentName().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await medicalRecordReleaseForm.parentSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    await medicalRecordReleaseForm.submit();

    // Medical Record File Upload
    await assertActivityHeader(page, 'Medical Record File Upload');

    // await medicalRecordReleaseForm.uploadFile(`data/upload/BroadInstitute_Wikipedia.pdf`);
    await medicalRecordReleaseForm.next({ waitForNav: true });

    await assertActivityHeader(
      page,
      'Please complete this survey so that we may learn more about your medical background.'
    );

    // Patient Survey
    const patientSurveyPage = new PatientSurveyPage(page);
    await patientSurveyPage.cityBornIn().fill(user.adultDependent.city);
    await patientSurveyPage.stateBornIn().selectOption(user.adultDependent.state.abbreviation);
    await patientSurveyPage.zipCodeCityBornIn().fill(user.adultDependent.zip);
    await patientSurveyPage.currentZipCode().fill(user.adultDependent.zip);
    await patientSurveyPage.sexAtBirth().check('Prefer not to answer');
    await patientSurveyPage.race().check('White');
    await patientSurveyPage.isHispanic().check(new RegExp('^\\s*No\\s*$'));
    await patientSurveyPage.selectVentricleDiagnosis().check('Other');
    await patientSurveyPage.selectVentricleDiagnosis().inputByLabel('Please specify (or write Unsure)').fill('Unsure');
    await patientSurveyPage.submit();

    // Assert contents in My Dashboard table
    await myDashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = myDashboardPage.getDashboardTable();
    const headers = await table.getColumnNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCellLocator('Title', 'Consent Form for Adult Dependent', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Thank you for signing the consent form -- welcome to Project Singular!');

    const statusCell = await table.findCellLocator('Title', 'Consent Form for Adult Dependent', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toHaveText('Complete');
  });
});
