import { expect } from '@playwright/test';
import { test } from 'fixtures/pancan-fixture';
import DashboardPage from 'pages/pancan/dashboard-page';
import MedicalReleaseFormPage from 'pages/pancan/enrollment/medical-release-form-page';
import SurveyAboutCancerPage from 'pages/pancan/enrollment/survey-about-cancer-page';
import SurveyAboutYouPage from 'pages/pancan/enrollment/survey-about-you.page';
import HomePage from 'pages/pancan/home-page';
import { generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';
import PreScreeningPage from 'pages/pancan/enrollment/pre-screeening-page';
import PreScreeningDiagnosisPage from 'pages/pancan/enrollment/pre-screening-diagnosis-page';
import PreScreeningAgeLocationPage from 'pages/pancan/enrollment/pre-screening-age-location-page';
import { PatientsData } from 'pages/patient-type';
import * as auth from 'authentication/auth-pancan';
import { assertActivityHeader, assertActivityStep } from 'utils/assertion-helper';
import ConsentFormPage from 'pages/pancan/enrollment/consent-form-page';
import { enterMailingAddress } from 'utils/test-utils';
const { PANCAN_USER_EMAIL, PANCAN_USER_PASSWORD } = process.env;

test.describe('Enroll child ', () => {
  const lastName = generateUserName(user.patient.lastName);

  test('can complete child-enrollment @enrollment @pancan @functional', async ({ page }) => {
    const pancanHomePage = new HomePage(page);
    await pancanHomePage.join();

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.waitForReady();
    await preScreeningPage.whoIsSigningUp().check(PatientsData.child.whoIsSigningUp, { exactMatch: true });
    await preScreeningPage.next();
    //diagnosis page
    const preScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page, 'child');
    await preScreeningDiagnosisPage.waitForReady();
    await preScreeningDiagnosisPage.cancerDiagnosed().input().fill(PatientsData.child.cancerDiagnosed.typeCancer);
    await preScreeningDiagnosisPage.getNextButton().waitFor({ state: 'visible' });
    await preScreeningDiagnosisPage.next();
    //age/location page
    const preScreeningAgeLocationPage = new PreScreeningAgeLocationPage(page, 'child');
    await preScreeningAgeLocationPage.waitForReady();
    await preScreeningAgeLocationPage.enterInformationAboutAgeLocation();

    // Step 2
    // Enter email alias and password to create new account
    await auth.createAccountWithEmailAlias(page, { email: PANCAN_USER_EMAIL, password: PANCAN_USER_PASSWORD });

    // Step 3
    // On "Consent Form" page, Page 1 of 3.
    await assertActivityHeader(page, PatientsData.child.researchContentForm);
    await assertActivityStep(page, '1');
    const consentFormPage = new ConsentFormPage(page, 'child');
    await consentFormPage.next();
    // On "Consent Form" page, Page 2 of 3.
    await assertActivityStep(page, '2');
    await consentFormPage.next();
    // On "Consent Form" page, Page 3 of 3.
    await assertActivityStep(page, '3');
    await consentFormPage.bloodSamples();
    await consentFormPage.cancerSamples();
    await consentFormPage.firstName().fill(user.child.firstName);
    await consentFormPage.lastName().fill(lastName);
    await consentFormPage.fillInDateOfBirth(user.child.birthDate.MM, user.child.birthDate.DD, user.child.birthDate.YYYY);
    await consentFormPage.parentData();
    await enterMailingAddress(page, { fullName: `${user.child.firstName} ${lastName}` }, 'Phone');
    await consentFormPage.next();
    await consentFormPage.waitSecondReady();
    await consentFormPage.childSignature().fill(user.child.firstName);
    await consentFormPage.submit();

    // On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.waitForReady();
    await medicalReleaseFormPage.enterPhysicianData();
    await medicalReleaseFormPage.contactPhysician().check();
    await medicalReleaseFormPage.submit();

    // Survey: About Your Child's Leukemia
    await assertActivityHeader(page, "Survey: About Your Child's Leukemia");
    const surveyCervicalCancerPage = new SurveyAboutCancerPage(page);
    await surveyCervicalCancerPage.waitForReady();
    await surveyCervicalCancerPage.diagnosedDate('March', '2015');
    await surveyCervicalCancerPage.fillCancerBodyPlaces('Blood');
    await surveyCervicalCancerPage.cancerFree().check('Yes');
    await surveyCervicalCancerPage.fillBodyPlacesEverHadCancer('Blood');
    await surveyCervicalCancerPage.checkTreatmentsReceived('Radiation');
    await surveyCervicalCancerPage.medicationsList().fill('many others');
    await surveyCervicalCancerPage.submit();

    // Survey: About your child
    await assertActivityHeader(page, 'Survey: About Your Child');
    const surveyAboutYou = new SurveyAboutYouPage(page);
    await surveyAboutYou.waitForReady();
    await surveyAboutYou.sexAssignedAtBirth().radioButton('Male', { exactMatch: true }).locator('label').click();
    await surveyAboutYou.checkGenderIdentity('Boy');
    await surveyAboutYou.checkCategoriesDescribesYou('White');
    await surveyAboutYou.checkCategoriesDescribesYou('English');
    await surveyAboutYou.howDidYouHearAboutProject().check('Social media (Facebook, Twitter, Instagram, etc.)');
    await surveyAboutYou.howDidYouHearAboutProject().check('Facebook', { exactMatch: true });
    await surveyAboutYou.howDidYouHearAboutProject().check('YouTube', { exactMatch: true });
    await surveyAboutYou.submit();

    // Dashboard
    const participantDashboard = new DashboardPage(page);
    await participantDashboard.waitForReady();

    const orderedHeaders = ['Form', 'Summary', 'Status', 'Actions'];
    const table = participantDashboard.getDashboardTable();
    await table.waitForReady();

    const headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const statusResearchCell = await table.findCell('Form', 'Research Consent Form - Parent or Guardian', 'Status');
    await expect(await statusResearchCell?.innerText()).toEqual('Complete');
    const statusMedicalReleaseCell = await table.findCell('Form', 'Medical Release Form', 'Status');
    await expect(await statusMedicalReleaseCell?.innerText()).toEqual('Complete');
    const statusCervicalCancerCell = await table.findCell('Form', "Survey: Your Child's Leukemia", 'Status');
    await expect(await statusCervicalCancerCell?.innerText()).toEqual('Complete');
    const statusAboutYouCell = await table.findCell('Form', 'Survey: About Your Child', 'Status');
    await expect(await statusAboutYouCell?.innerText()).toEqual('Complete');

    await page.pause();
  });
});
