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
import { expect } from '@playwright/test';
import { PatientsData } from 'pages/patient-type';
import SurveyAboutCancerPage from 'pages/pancan/enrollment/survey-about-cancer-page';
import SurveyAboutYouPage from 'pages/pancan/enrollment/survey-about-you.page';
import DashboardPage from 'pages/pancan/dashboard-page';
import HomePage from 'pages/pancan/home-page';

const { PANCAN_USER_EMAIL, PANCAN_USER_PASSWORD } = process.env;

test.describe('Enroll myself as adult', () => {
  test('can complete self-enrollment @enrollment @pancan @functional', async ({ page }) => {
    const pancanHomePage = new HomePage(page);
    await pancanHomePage.join({ waitForNav: true });
    // Randomize last name
    const lastName = generateUserName(user.patient.lastName);

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.waitForReady();
    await preScreeningPage.whoIsSigningUp().check(PatientsData.adult.whoIsSigningUp, { exactMatch: true });
    await preScreeningPage.next();
    //diagnosis page
    const preScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page);
    await preScreeningDiagnosisPage.waitForReady();
    await preScreeningDiagnosisPage.cancerDiagnosed().fill(PatientsData.adult.cancerDiagnosed.typeCancer);
    await preScreeningDiagnosisPage.next();
    //age/location page
    const preScreeningAgeLocationPage = new PreScreeningAgeLocationPage(page);
    await preScreeningAgeLocationPage.waitForReady();
    await preScreeningAgeLocationPage.fillInAgeLocation();

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
    await consentFormPage.agreeToBloodSamples();
    await consentFormPage.agreeToStoreCancerSamples();
    await consentFormPage.firstName().fill(user.patient.firstName);
    await consentFormPage.lastName().fill(lastName);
    await consentFormPage.fillInDateOfBirth(user.patient.birthDate.MM, user.patient.birthDate.DD, user.patient.birthDate.YYYY);
    await consentFormPage.signature().fill(`${user.patient.firstName} ${lastName}`);
    await expect(consentFormPage.getSubmitButton()).toBeEnabled();

    await consentFormPage.fillInContactAddress({ fullName: `${user.patient.firstName} ${lastName}`, phoneLabel: 'Phone' });
    await consentFormPage.submit();

    //On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.waitForReady();
    await medicalReleaseFormPage.fillInInPhysicianData();
    await medicalReleaseFormPage.agreeToAllowContactPhysician().check();
    await medicalReleaseFormPage.submit();

    //Survey: About Cervical Cancer
    await assertActivityHeader(page, 'Survey: About Your Cervical cancer');
    const surveyCervicalCancerPage = new SurveyAboutCancerPage(page);
    await surveyCervicalCancerPage.waitForReady();
    await surveyCervicalCancerPage.diagnosedDate('March', '2015');
    await surveyCervicalCancerPage.fillCancerBodyPlaces('Appendix');
    await surveyCervicalCancerPage.cancerFree().radioButton('Yes').locator('label').click();
    await surveyCervicalCancerPage.fillBodyPlacesEverHadCancer('Appendix');
    await surveyCervicalCancerPage.checkTreatmentsReceived('Radiation');
    await surveyCervicalCancerPage.medicationsList().fill('many others');
    await surveyCervicalCancerPage.submit();

    //Survey: About you
    await assertActivityHeader(page, 'Survey: About You');
    const surveyAboutYou = new SurveyAboutYouPage(page);
    await surveyAboutYou.waitForReady();
    await surveyAboutYou.sexAssignedAtBirth().radioButton('Male', { exactMatch: true }).locator('label').click();
    await surveyAboutYou.checkGenderIdentity('Man');
    await surveyAboutYou.checkRaceCategoriesDescribesYou('White');
    await surveyAboutYou.checkRaceCategoriesDescribesYou('English');
    await surveyAboutYou.howDidYouHearAboutProject().check('Social media (Facebook, Twitter, Instagram, etc.)');
    await surveyAboutYou.howDidYouHearAboutProject().check('Facebook', { exactMatch: true });
    await surveyAboutYou.submit();

    //Dashboard
    const participantDashboard = new DashboardPage(page);
    await participantDashboard.waitForReady();
    const orderedHeaders = ['Form', 'Summary', 'Status', 'Actions'];
    const table = participantDashboard.getDashboardTable();
    await table.waitForReady();
    const headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);
    const statusResearchCell = await table.findCell('Form', 'Research Consent Form', 'Status');
    await expect(await statusResearchCell?.innerText()).toEqual('Complete');
    const statusMedicalReleaseCell = await table.findCell('Form', 'Medical Release Form', 'Status');
    await expect(await statusMedicalReleaseCell?.innerText()).toEqual('Complete');
    const statusCervicalCancerCell = await table.findCell('Form', 'Survey: Your Cervical cancer', 'Status');
    await expect(await statusCervicalCancerCell?.innerText()).toEqual('Complete');
    const statusAboutYouCell = await table.findCell('Form', 'Survey: About You', 'Status');
    await expect(await statusAboutYouCell?.innerText()).toEqual('Complete');
  });
});
