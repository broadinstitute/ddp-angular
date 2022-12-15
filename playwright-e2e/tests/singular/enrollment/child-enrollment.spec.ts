import { expect } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import * as user from 'data/fake-user.json';
import * as auth from 'authentication/auth-singular';
import { WHO } from 'data/constants';
import MyDashboardPage from 'pages/singular/dashboard/my-dashboard-page';
import MedicalRecordReleaseForm from 'pages/singular/enrollment/medical-record-release-form';
import AboutMyChildPage from 'pages/singular/enrollment/about-my-child-page';
import ChildSurveyPage from 'pages/singular/enrollment/child-survey-page';
import PreScreeningPage from 'pages/singular/enrollment/pre-screening-page';
import EnrollMyChildPage from 'pages/singular/enrollment/enroll-my-child-page';
import ConsentFormForMinorPage from 'pages/singular/enrollment/consent-form-for-minor-page';
import { enterMailingAddress } from 'utils/test-utils';
import AssentFormPage from 'pages/singular/enrollment/assent-form-page';
import { assertActivityHeader, assertActivityProgress } from 'utils/assertion-helper';
import { generateUserName } from 'utils/faker-utils';

const { SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

test.describe('Enroll my child', () => {
  // Randomize last name
  const childLastName = generateUserName(user.child.lastName);

  /**
   * Assenting rules:
   * Ages 0-6: Need parental consent from parent
   * Ages 7-age of majority: child needs to give assent in addition to parent’s consent
   */
  test('enrolling an assenting child @enrollment @singular', async ({ page, homePage }) => {
    await homePage.clickSignMeUp();

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.enterInformationAboutYourself();

    // Step 2
    // Enter email alias and password to create new account
    await auth.createAccountWithEmailAlias(page, { email: SINGULAR_USER_EMAIL, password: SINGULAR_USER_PASSWORD });

    // Step 3
    // On "My Dashboard" page, click Enroll Mys Child button
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.enrollMyChild();

    // On "Enroll mys child" page
    await assertActivityHeader(page, 'Enroll my child');
    const enrollMyChildPage = new EnrollMyChildPage(page);
    await enrollMyChildPage.whoInChildFamilyHasVentricleHeartDefect().check(WHO.TheChildBeingEnrolled);
    await enrollMyChildPage.howOldIsYourChild().fill(user.child.age);
    await myDashboardPage.next();
    await assertActivityHeader(page, 'Enroll my child');
    await expect(enrollMyChildPage.getNextButton()).toBeDisabled();
    // Triggered one extra question
    await expect(enrollMyChildPage.getNextButton()).toBeEnabled();
    await assertActivityHeader(page, 'Enroll my child');
    await enrollMyChildPage.doesChildHaveCognitiveImpairment().check('No', { exactMatch: true });
    await myDashboardPage.next();

    // On "Consent Form for Minor Dependent" page
    const consentForm = new ConsentFormForMinorPage(page);
    await assertActivityHeader(page, 'Consent Form for Minor Dependent');
    await assertActivityProgress(page, 'Page 1 of 3');
    await consentForm.next();

    await assertActivityHeader(page, 'Consent Form for Minor Dependent');
    await assertActivityProgress(page, 'Page 2 of 3');
    await consentForm.next();

    await assertActivityHeader(page, 'Consent Form for Minor Dependent');
    await assertActivityProgress(page, 'Page 3 of 3');
    await consentForm.childFirstName().fill(user.child.firstName);
    await consentForm.childLastName().fill(childLastName);
    await consentForm.dateOfBirth(user.child.birthDate.MM, user.child.birthDate.DD, user.child.birthDate.YYYY);
    await consentForm.iHaveExplainedToMyChild().check();
    await consentForm.toKnowSecondaryFinding().check('I want to know.');
    await consentForm.parentGuardianSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await consentForm.parentFirstName().fill(user.patient.firstName);
    await consentForm.parentLastName().fill(user.patient.lastName);
    await consentForm.relationShipToSubject().check('Parent');
    await consentForm.authorizationSignature().fill(user.patient.lastName);
    await consentForm.agree();

    // On Assent Form because child is >= 12 years old
    await assertActivityHeader(page, new RegExp(/Assent Form/));
    await assertActivityProgress(page, 'Page 1 of 1');
    const assentForm = new AssentFormPage(page);
    await assentForm.next();
    await assentForm.fullName().fill(`${user.child.firstName} ${user.child.middleName} ${childLastName}`);
    await assentForm.hasAgreedToBeInStudy().check();
    await assentForm.sign().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await assentForm.next({ waitForNav: true });

    // on "About My Child" page
    const aboutMyChildPage = new AboutMyChildPage(page);
    await aboutMyChildPage.waitForReady();
    await assertActivityHeader(page, 'About My Child');
    await enterMailingAddress(page, {
      fullName: `${user.child.firstName} ${childLastName}`,
      country: user.child.country.name,
      state: user.child.state.name,
      street: user.child.streetAddress,
      city: user.child.city,
      zipCode: user.child.zip,
      telephone: user.child.phone
    });
    await aboutMyChildPage.next({ waitForNav: true });

    // on "Parental Medical Record Release Form" page
    const medicalRecordReleaseForm = new MedicalRecordReleaseForm(page);
    await assertActivityHeader(page, 'Parental Medical Record Release Form');
    await assertActivityProgress(page, 'Page 1 of 3');
    await medicalRecordReleaseForm.unableToProvideMedicalRecords().check();
    await medicalRecordReleaseForm.enterInformationAboutPhysician();
    await medicalRecordReleaseForm.next();

    await assertActivityHeader(page, 'Parental Medical Record Release Form');
    await assertActivityProgress(page, 'Page 2 of 3');
    await medicalRecordReleaseForm.next();

    await assertActivityHeader(page, 'Parental Medical Record Release Form');
    await assertActivityProgress(page, 'Page 3 of 3');
    await medicalRecordReleaseForm.parentName().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await medicalRecordReleaseForm.parentSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    await medicalRecordReleaseForm.submit();

    // Medical Record File Upload
    await assertActivityHeader(page, 'Medical Record File Upload');
    await medicalRecordReleaseForm.uploadFile(`data/upload/fake-clinical-note.jpg`);
    await medicalRecordReleaseForm.next({ waitForNav: true });

    await assertActivityHeader(
      page,
      "Please complete this survey so that we may learn more about your child's medical background."
    );

    // Answers to the Child Survey
    const childSurveyPage = new ChildSurveyPage(page);
    await childSurveyPage.cityBornIn().fill(user.child.city);
    await childSurveyPage.stateBornIn().selectOption(user.child.state.abbreviation);
    await childSurveyPage.zipCodeCityBornIn().fill(user.child.zip);
    await childSurveyPage.currentZipCode().fill(user.child.zip);
    await childSurveyPage.sexAtBirth().check('Female');
    await childSurveyPage.race().check('White');
    await childSurveyPage.isHispanic().check('No', { exactMatch: true });
    await childSurveyPage.selectVentricleDiagnosis().check('Tricuspid Atresia');
    await childSurveyPage.heightInFeet().fill('3');
    await childSurveyPage.weightInPounds().fill('80');
    await childSurveyPage.listedComplicationRelatedToHeartDisease().check('Liver Cancer (hepatocellular carcinoma)');
    await childSurveyPage.listedComplicationRelatedToHeartDisease().check('Cardiac Arrest');
    await childSurveyPage.hadArrhythmiaComplications().check('Did not require medical treatment');
    await childSurveyPage.onEcmo().check('No');
    await childSurveyPage.hadVad().check('No');
    await childSurveyPage.hasReceivedHeartTransplant().check('No');
    await childSurveyPage.hasReceivedLiverTransplant().check('No');
    await childSurveyPage
      .aboutYourChildHealth()
      .check('My child had at least 5 sick visits to the doctor (not routine check-ups)');
    await childSurveyPage.aboutYourChildHealth().check('My child has missed 7 days or more from work or school due to illness');
    await childSurveyPage.describePhysicalHealth().check('Somewhat healthy');
    await childSurveyPage.familyDescribePhysicalHealth().check('Somewhat healthy');
    await childSurveyPage.hasAnyConditions().check('Eating disorder');
    await childSurveyPage.hasAnyConditions().check('Depression');
    await childSurveyPage.hadNeurodevelopmentalNeurocognitiveEvaluation().check('Yes');
    await childSurveyPage.hasDiagnosedWithAnyFollowings().check("I don't know");
    await childSurveyPage.hasReceivedEducationSupportThroughSchool().check('IEP');
    await childSurveyPage.hasReceivedSupportOrTreatmentForBehavioralNeurodevelopmentalPsychologicalProblem().check('Yes');
    await childSurveyPage.submit();

    // Assert contents in My Dashboard table
    await myDashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = myDashboardPage.getDashboardTable();
    const headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCell('Title', 'Consent Form for Minor Dependent', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Thank you for signing the consent form -- welcome to Project Singular!');

    const statusCell = await table.findCell('Title', 'Consent Form for Minor Dependent', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toHaveText('Complete');

    await expect(page.locator('.enrollmentStatusCompleteText')).toHaveText('Fully Enrolled');
  });
});
