import { expect } from '@playwright/test';
import PreScreeningAgeLocationPage from 'pages/pancan/enrollment/pre-screening-age-location-page';
import PreScreeningDiagnosisPage from 'pages/pancan/enrollment/pre-screening-diagnosis-page';
import { test } from 'fixtures/pancan-fixture';
import PreScreeningPage from 'pages/pancan/enrollment/pre-screeening-page';
import * as auth from 'authentication/auth-base';
import { assertActivityHeader, assertActivityStep } from 'utils/assertion-helper';
import ConsentFormPage from 'pages/pancan/enrollment/consent-form-page';
import { generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';
import MedicalReleaseFormPage from 'pages/pancan/enrollment/medical-release-form-page';
import { PatientsData } from 'pages/patient-type';
import SurveyAboutCancerPage from 'pages/pancan/enrollment/survey-about-cancer-page';
import SurveyAboutYouPage from 'pages/pancan/enrollment/survey-about-you.page';
import DashboardPage from 'pages/pancan/dashboard-page';
import HomePage from 'pages/pancan/home-page';

const { PANCAN_USER_EMAIL, PANCAN_USER_PASSWORD } = process.env;

test.describe('Adult self-enroll & child (consent) enrollment', () => {
  // Randomize patient last name
  const lastName = generateUserName(user.adult.lastName);

  /**
   * Participant first go through adult self enrollment, then be taken to the dashboard to continue child’s enrollment
   */
  test('Adult enroll self and a child (non-assent) at same time @enrollment @pancan @functional', async ({ page }) => {
    const pancanHomePage = new HomePage(page);
    await pancanHomePage.join({ waitForNav: true });

    // Step 1
    // On “pre-screening” page, sign up for self and a child.
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.waitForReady();
    await preScreeningPage.whoIsSigningUp().check(PatientsData.adult.whoIsSigningUp);
    await preScreeningPage.whoIsSigningUp().check(PatientsData.child.whoIsSigningUp);
    await preScreeningPage.next();

    await assertActivityHeader(page, 'Lets get started');
    await expect(page.locator('p')).toHaveText('About You');
    await preScreeningPage.next();

    // On Diagnosis page
    const preScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page);
    await preScreeningDiagnosisPage.waitForReady();
    // Add two diagnosed cancers
    await preScreeningDiagnosisPage.cancerDiagnosed().fill(PatientsData.adult.cancerDiagnosed.typeCancer);
    await preScreeningDiagnosisPage.cancerDiagnosed().button('Add another diagnosis').click();
    await preScreeningDiagnosisPage.cancerDiagnosed().input().nth(1).fill('Colon cancer');
    await preScreeningDiagnosisPage.next();

    // On Age and location page
    const preScreeningAgeLocationPage = new PreScreeningAgeLocationPage(page);
    await preScreeningAgeLocationPage.waitForReady();
    await preScreeningAgeLocationPage.enterInformationAboutAgeLocation();

    // Step 2
    // Enter email alias and password to create new account
    await auth.createAccountWithEmailAlias(page, { email: PANCAN_USER_EMAIL, password: PANCAN_USER_PASSWORD });

    // Step 3
    // On "Consent Form" page, Page 1 of 3.
    await assertActivityHeader(page, 'Research Consent Form');
    await assertActivityStep(page, '1');
    const consentFormPage = new ConsentFormPage(page);
    await consentFormPage.next();
    // On "Consent Form" page, Page 2 of 3.
    await assertActivityStep(page, '2');
    await consentFormPage.next();
    // On "Consent Form" page, Page 3 of 3.
    await assertActivityStep(page, '3');
    expect(await consentFormPage.bloodSamples().toLocator().screenshot()).toMatchSnapshot('agree-to-drawn-blood-samples.png');
    await consentFormPage.agreeToBloodSamples();
    expect(await consentFormPage.cancerSamples().toLocator().screenshot()).toMatchSnapshot('agree-to-store-cancer-samples.png');
    await consentFormPage.agreeToStoreCancerSamples();
    await consentFormPage.firstName().fill(user.adult.firstName);
    await consentFormPage.lastName().fill(lastName);
    await consentFormPage.fillInDateOfBirth(user.adult.birthDate.MM, user.adult.birthDate.DD, user.adult.birthDate.YYYY);
    await consentFormPage.signature().fill(`${user.adult.firstName} ${lastName}`);
    await expect(consentFormPage.getSubmitButton()).toBeEnabled();

    await consentFormPage.fillInContactAddress({ fullName: `${user.adult.firstName} ${lastName}`, phoneLabel: 'Phone' });
    await consentFormPage.submit();

    //On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.waitForReady();
    expect(await page.locator('.ddp-content').first().screenshot()).toMatchSnapshot('medical-release-form-content.png');
    expect(await medicalReleaseFormPage.agreeToAllowContactPhysician().toLocator().screenshot()).toMatchSnapshot(
      'agree-to-contact-physician.png'
    );
    await medicalReleaseFormPage.fillInInformationAboutPhysician();
    await medicalReleaseFormPage.agreeToAllowContactPhysician().check();
    await medicalReleaseFormPage.submit();

    // Survey: About Cervical Cancer
    await assertActivityHeader(page, `Survey: About Your ${PatientsData.adult.cancerDiagnosed.typeCancer}`);
    const surveyCervicalCancerPage = new SurveyAboutCancerPage(page);
    await surveyCervicalCancerPage.waitForReady();
    await surveyCervicalCancerPage.diagnosedDate('March', '2015');
    await surveyCervicalCancerPage.fillCancerBodyPlaces('Appendix');
    await surveyCervicalCancerPage.cancerFree().radioButton('Yes').locator('label').click();
    await surveyCervicalCancerPage.fillBodyPlacesEverHadCancer('Appendix');
    await surveyCervicalCancerPage.checkTreatmentsReceived('Radiation');
    await surveyCervicalCancerPage.medicationsList().fill('many others');
    await surveyCervicalCancerPage.submit();

    // Survey: About Colon Cancer
    await assertActivityHeader(page, `Survey: About Your Colon cancer`);
    const surveyColonCancerPage = new SurveyAboutCancerPage(page);
    await surveyColonCancerPage.waitForReady();
    await surveyColonCancerPage.diagnosedDate('May', '2017');
    await surveyColonCancerPage.fillCancerBodyPlaces('Stomach');
    await surveyColonCancerPage.cancerFree().radioButton('No').locator('label').click();
    await surveyColonCancerPage.fillBodyPlacesEverHadCancer('Appendix');
    await surveyColonCancerPage.checkTreatmentsReceived('Radiation');
    await surveyColonCancerPage.checkTreatmentsReceived('Surgery');
    await surveyColonCancerPage.medicationsList().fill('many others');
    await surveyColonCancerPage.submit();

    // Survey: About you
    await assertActivityHeader(page, 'Survey: About You');
    const surveyAboutYou = new SurveyAboutYouPage(page);
    await surveyAboutYou.fillOutSurveyAboutYou();
    await surveyAboutYou.submit();

    // Dashboard
    const participantDashboard = new DashboardPage(page);
    await participantDashboard.waitForReady();
    await expect(page.locator('h1.dashboard-title-section__title span')).toHaveText('Participant Dashboard');
    expect(await page.locator('.dashboard-content .infobox').screenshot()).toMatchSnapshot('dashboard-content-infobox.png');

    const orderedHeaders = ['Form', 'Summary', 'Status', 'Actions'];
    const table = participantDashboard.getDashboardTable();
    await table.waitForReady();
    await expect(table.tableLocator()).toHaveCount(1);

    let headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);
    let researchStatusCell = await table.findCell('Form', 'Research Consent Form', 'Status');
    await expect(await researchStatusCell?.innerText()).toEqual('Complete');
    let medicalReleaseStatusCell = await table.findCell('Form', 'Medical Release Form', 'Status');
    await expect(await medicalReleaseStatusCell?.innerText()).toEqual('Complete');
    const cervicalCancerStatusCell = await table.findCell('Form', 'Survey: Your Cervical cancer', 'Status');
    await expect(await cervicalCancerStatusCell?.innerText()).toEqual('Complete');
    const colonCancerStatusCell = await table.findCell('Form', 'Survey: Your Colon cancer', 'Status');
    await expect(await colonCancerStatusCell?.innerText()).toEqual('Complete');
    const aboutYouStatusCell = await table.findCell('Form', 'Survey: About You', 'Status');
    await expect(await aboutYouStatusCell?.innerText()).toEqual('Complete');
    await table.hide();

    // Click Add Participant button to add child
    await participantDashboard.addParticipant();

    // Enter information about the child (non-assent)
    // On diagnosis page
    const childPreScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page, 'secondChild');
    await childPreScreeningDiagnosisPage.waitForReady();
    await childPreScreeningDiagnosisPage.cancerDiagnosed().fill(PatientsData.secondChild.cancerDiagnosed.typeCancer);
    await childPreScreeningDiagnosisPage.next();

    // On Age/location page
    const childPreScreeningAgeLocationPage = new PreScreeningAgeLocationPage(page, 'secondChild');
    await childPreScreeningAgeLocationPage.waitForReady();
    await childPreScreeningAgeLocationPage.enterInformationAboutAgeLocation({ age: user.secondChild.age });

    // On "Consent Form" page, Page 1 of 3.
    await assertActivityHeader(page, PatientsData.secondChild.researchContentForm);
    await assertActivityStep(page, '1');
    const childConsentFormPage = new ConsentFormPage(page, 'secondChild');
    await childConsentFormPage.next();
    // On "Consent Form" page, Page 2 of 3.
    await assertActivityStep(page, '2');
    await childConsentFormPage.next();
    // On "Consent Form" page, Page 3 of 3.
    await assertActivityStep(page, '3');
    await childConsentFormPage.agreeToBloodSamples();
    await childConsentFormPage.agreeToStoreCancerSamples();
    await childConsentFormPage.firstName().fill(user.secondChild.firstName);
    await childConsentFormPage.lastName().fill(lastName);
    await childConsentFormPage.fillInDateOfBirth(
      user.secondChild.birthDate.MM,
      user.secondChild.birthDate.DD,
      user.secondChild.birthDate.YYYY
    );
    await childConsentFormPage.fillInParentData();
    await childConsentFormPage.fillInContactAddress({
      fullName: user.secondChild.fullName,
      phoneLabel: 'Phone'
    });
    await childConsentFormPage.submit();

    // On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    await medicalReleaseFormPage.waitForReady();
    await medicalReleaseFormPage.fillInInformationAboutPhysician();
    await medicalReleaseFormPage.agreeToAllowContactPhysician().check();
    await medicalReleaseFormPage.submit();

    // Survey: About Your Child's Pancreatic cancer
    await assertActivityHeader(page, "Survey: About Your Child's Pancreatic cancer / Pancreatic ductal adenocarcinoma (PDAC)");
    const surveyAboutCancerPage = new SurveyAboutCancerPage(page);
    await surveyAboutCancerPage.waitForReady();
    await surveyAboutCancerPage.diagnosedDate('March', '2015');
    await surveyAboutCancerPage.fillCancerBodyPlaces('Blood');
    await surveyAboutCancerPage.cancerFree().check('Yes');
    await surveyAboutCancerPage.fillBodyPlacesEverHadCancer('Blood');
    await surveyAboutCancerPage.checkTreatmentsReceived('Radiation');
    await surveyAboutCancerPage.medicationsList().fill('many others');
    await surveyAboutCancerPage.submit();

    // Survey: About your child
    await assertActivityHeader(page, 'Survey: About Your Child');
    await surveyAboutYou.waitForReady();
    await surveyAboutYou.fillOutSurveyAboutYou({ gender: 'Boy' });
    await surveyAboutYou.submit();

    // Two tables: one for enrolled adult and one for enrolled child
    const table2 = participantDashboard.getDashboardTable(1);
    await table2.show();
    // Verify second (child) table contents
    headers = await table2.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);
    researchStatusCell = await table2.findCell('Form', 'Research Consent Form - Parent or Guardian', 'Status');
    await expect(await researchStatusCell?.innerText()).toEqual('Complete');
    medicalReleaseStatusCell = await table2.findCell('Form', 'Medical Release Form', 'Status');
    await expect(await medicalReleaseStatusCell?.innerText()).toEqual('Complete');
    const pancreaticCancerStatusCell = await table2.findCell(
      'Form',
      "Survey: Your Child's Pancreatic cancer / Pancreatic ductal adenocarcinoma (PDAC)",
      'Status'
    );
    await expect(await pancreaticCancerStatusCell?.innerText()).toEqual('Complete');
    const aboutYouChildStatusCell = await table2.findCell('Form', 'Survey: About Your Child', 'Status');
    await expect(await aboutYouChildStatusCell?.innerText()).toEqual('Complete');
  });
});
