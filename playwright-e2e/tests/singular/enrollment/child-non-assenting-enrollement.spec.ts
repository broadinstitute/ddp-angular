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
import { assertActivityHeader, assertActivityProgress } from 'utils/assertion-helper';

test.describe('Enroll my child', () => {
  test('enrolling non assenting child < 7 @enrollment @singular', async ({ page, homePage }) => {
    await homePage.signUp();

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.enterInformationAboutYourself();

    // Step 2
    // Enter email alias and password to create new account
    await auth.createAccountWithEmailAlias(page);

    // Step 3
    // On "My Dashboard" page, click Enroll Mys Child button
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.enrollMyChild();

    // On "Enroll mys child" page
    await assertActivityHeader(page, 'Enroll my child');
    const enrollMyChildPage = new EnrollMyChildPage(page);
    await enrollMyChildPage.whoInChildFamilyHasVentricleHeartDefect().check(WHO.TheChildBeingEnrolled);
    await enrollMyChildPage.howOldIsYourChild().fill(user.secondChild.age);
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
    await consentForm.childFirstName().fill(user.secondChild.firstName);
    await consentForm.childLastName().fill(user.secondChild.lastName);
    await consentForm.dateOfBirth(
      user.secondChild.birthDate.MM,
      user.secondChild.birthDate.DD,
      user.secondChild.birthDate.YYYY
    );
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
    await enterMailingAddress(page, {
      fullName: `${user.secondChild.firstName} Junior ${user.secondChild.lastName}`,
      country: user.secondChild.country.name,
      state: user.secondChild.state.name,
      street: user.secondChild.streetAddress,
      city: user.secondChild.city,
      zipCode: user.secondChild.zip,
      telephone: user.secondChild.phone
    }); // Fill out address with fake data
    await aboutMyChildPage.next();
    // Triggered validation
    await aboutMyChildPage.suggestedAddress().radioButton('As Entered:').check();
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
    await childSurveyPage
      .aboutYourChildHealth()
      .check('My child has missed 7 days or more from work or school due to illness');
    await childSurveyPage.describePhysicalHealth().check('Somewhat healthy');
    await childSurveyPage.familyDescribePhysicalHealth().check('Somewhat healthy');
    await childSurveyPage.hasAnyConditions().check('Eating disorder');
    await childSurveyPage.hasAnyConditions().check('Depression');
    await childSurveyPage.hadNeurodevelopmentalNeurocognitiveEvaluation().check('Yes');
    await childSurveyPage.hasDiagnosedWithAnyFollowings().check("I don't know");
    await childSurveyPage.hasReceivedEducationSupportThroughSchool().check('IEP');
    await childSurveyPage
      .hasReceivedSupportOrTreatmentForBehavioralNeurodevelopmentalPsychologicalProblem()
      .check('Yes');
    await childSurveyPage.submit();

    // Assert contents in My Dashboard table
    await myDashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = myDashboardPage.getDashboardTable();
    const headers = await table.getColumnNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCellLocator('Title', 'Consent Form for Minor Dependent', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Thank you for signing the consent form -- welcome to Project Singular!');

    const statusCell = await table.findCellLocator('Title', 'Consent Form for Minor Dependent', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toHaveText('Complete');

    await expect(page.locator('.enrollmentStatusCompleteText')).toHaveText('Fully Enrolled');
  });

  test('enrolling non assenting child > 7 not capable of consent @enrollment @singular', async ({ page, homePage }) => {
    await homePage.signUp();

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.enterInformationAboutYourself();

    // Step 2
    // Enter email alias and password to create new account
    await auth.createAccountWithEmailAlias(page);

    // Step 3
    // On "My Dashboard" page, click Enroll Mys Child button
    const myDashboardPage = new MyDashboardPage(page);
    await myDashboardPage.enrollMyChild();

    // On "Enroll mys child" page
    await assertActivityHeader(page, 'Enroll my child');
    const enrollMyChildPage = new EnrollMyChildPage(page);
    await enrollMyChildPage.whoInChildFamilyHasVentricleHeartDefect().check(WHO.TheChildBeingEnrolled);
    await enrollMyChildPage.howOldIsYourChild().fill(user.thirdChild.age);
    await enrollMyChildPage.doesChildHaveCognitiveImpairment().check('yes');
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
    await consentForm.childFirstName().fill(user.thirdChild.firstName);
    await consentForm.childLastName().fill(user.thirdChild.lastName);
    await consentForm.dateOfBirth(
      user.thirdChild.birthDate.MM,
      user.thirdChild.birthDate.DD,
      user.thirdChild.birthDate.YYYY
    );
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
    await enterMailingAddress(page, {
      fullName: `${user.secondChild.firstName} Junior ${user.secondChild.lastName}`,
      country: user.secondChild.country.name,
      state: user.secondChild.state.name,
      street: user.secondChild.streetAddress,
      city: user.secondChild.city,
      zipCode: user.secondChild.zip,
      telephone: user.secondChild.phone
    }); // Fill out address with fake data
    await aboutMyChildPage.next();
    // Triggered validation
    await aboutMyChildPage.suggestedAddress().radioButton('As Entered:').check();
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
    //await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
    await medicalRecordReleaseForm.submit();

    // Medical Record File Upload
    await assertActivityHeader(page, 'Medical Record File Upload');
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
    await childSurveyPage
      .aboutYourChildHealth()
      .check('My child has missed 7 days or more from work or school due to illness');
    await childSurveyPage.describePhysicalHealth().check('Somewhat healthy');
    await childSurveyPage.familyDescribePhysicalHealth().check('Somewhat healthy');
    await childSurveyPage.hasAnyConditions().check('Eating disorder');
    await childSurveyPage.hasAnyConditions().check('Depression');
    await childSurveyPage.hadNeurodevelopmentalNeurocognitiveEvaluation().check('Yes');
    await childSurveyPage.hasDiagnosedWithAnyFollowings().check("I don't know");
    await childSurveyPage.hasReceivedEducationSupportThroughSchool().check('IEP');
    await childSurveyPage
      .hasReceivedSupportOrTreatmentForBehavioralNeurodevelopmentalPsychologicalProblem()
      .check('Yes');
    await childSurveyPage.submit();

    // Assert contents in My Dashboard table
    await myDashboardPage.waitForReady();
    const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
    const table = myDashboardPage.getDashboardTable();
    const headers = await table.getColumnNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCellLocator('Title', 'Consent Form for Minor Dependent', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Thank you for signing the consent form -- welcome to Project Singular!');

    const statusCell = await table.findCellLocator('Title', 'Consent Form for Minor Dependent', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toHaveText('Complete');

    await expect(page.locator('.enrollmentStatusCompleteText')).toHaveText('Fully Enrolled');
  });
});
