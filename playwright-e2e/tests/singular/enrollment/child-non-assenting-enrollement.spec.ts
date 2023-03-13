import { expect } from '@playwright/test';
import { test } from 'fixtures/singular-fixture';
import * as user from 'data/fake-user.json';
import MedicalRecordReleaseForm from 'pages/singular/enrollment/medical-record-release-form';
import AboutMyChildPage from 'pages/singular/enrollment/about-my-child-page';
import ChildSurveyPage from 'pages/singular/enrollment/child-survey-page';
import ConsentFormForMinorPage from 'pages/singular/enrollment/consent-form-for-minor-page';
import { assertActivityHeader, assertActivityProgress } from 'utils/assertion-helper';
import { generateUserName } from 'utils/faker-utils';

/**
 * Enroll a child of age < 7
 */
test.describe('Enroll child', () => {
  // Randomize last name
  const childLastName = generateUserName(user.secondChild.lastName);

  test('Enrolling non-assenting child < 7 @enrollment @singular', async ({ page, dashboardPage }) => {
    // On "My Dashboard" page, click Enroll Mys Child button
    await dashboardPage.enrollMyChild({
      age: user.secondChild.age,
      country: user.secondChild.country.abbreviation,
      state: user.secondChild.state.abbreviation,
      cognitiveImpairment: null
    });
    await dashboardPage.next();

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
    await consentForm.childFirstName().fill(user.secondChild.firstName);
    await consentForm.childLastName().fill(childLastName);
    await consentForm.dateOfBirth(user.secondChild.birthDate.MM, user.secondChild.birthDate.DD, user.secondChild.birthDate.YYYY);
    await consentForm.iHaveExplainedToMyChild().check();
    await consentForm.toKnowSecondaryFinding().check('I want to know.');
    await consentForm.parentGuardianSignature().fill(`${user.patient.firstName} ${user.patient.lastName}`);
    await consentForm.parentFirstName().fill(user.patient.firstName);
    await consentForm.parentLastName().fill(user.patient.lastName);
    await consentForm.relationShipToSubject().check('Parent');
    await consentForm.authorizationSignature().fill(user.patient.lastName);
    await consentForm.agree();

    // on "About My Child" page
    const aboutMyChildPage = new AboutMyChildPage(page);
    await aboutMyChildPage.waitForReady();
    await assertActivityHeader(page, 'About My Child');
    await aboutMyChildPage.fillInContactAddress({
      fullName: `${user.secondChild.firstName} ${childLastName}`,
      country: user.secondChild.country.name,
      state: user.secondChild.state.name,
      street: user.secondChild.streetAddress,
      city: user.secondChild.city,
      zipCode: user.secondChild.zip,
      telephone: user.secondChild.phone,
      labels: { phone: 'Telephone Contact Number', country: 'Country', state: 'State', zip: 'Zip Code', city: 'City' }
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
    await medicalRecordReleaseForm.submit();

    // Medical Record File Upload
    await assertActivityHeader(page, 'Medical Record File Upload');
    await medicalRecordReleaseForm.next({ waitForNav: true });

    await assertActivityHeader(page, "Please complete this survey so that we may learn more about your child's medical background.");

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
    await childSurveyPage.aboutYourChildHealth().check('My child had at least 5 sick visits to the doctor (not routine check-ups)');
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
    await dashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = dashboardPage.getDashboardTable();
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
