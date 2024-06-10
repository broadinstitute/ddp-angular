import PreScreeningAgeLocationPage from 'dss/pages/pancan/enrollment/pre-screening-age-location-page';
import PreScreeningDiagnosisPage from 'dss/pages/pancan/enrollment/pre-screening-diagnosis-page';
import { test } from 'fixtures/pancan-fixture';
import PreScreeningPage from 'dss/pages/pancan/enrollment/pre-screeening-page';
import * as auth from 'authentication/auth-base';
import { assertActivityHeader, assertActivityStep } from 'utils/assertion-helper';
import ConsentFormPage from 'dss/pages/pancan/enrollment/consent-form-page';
import { generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';
import MedicalReleaseFormPage from 'dss/pages/pancan/enrollment/medical-release-form-page';
import { expect } from '@playwright/test';
import { PatientsData } from 'dss/pages/patient-type';
import SurveyAboutCancer from 'dss/pages/pancan/enrollment/survey-about-cancer-page';
import SurveyAboutYou from 'dss/pages/survey-about-you';
import DashboardPage from 'dss/pages/pancan/dashboard-page';
import HomePage from 'dss/pages/pancan/home-page';

const { PANCAN_USER_EMAIL, PANCAN_USER_PASSWORD } = process.env;

//Skipping until new family history addition to workflow is automated - will be taken cared of by ticket PEPPER-1475
test.describe.skip('Enroll myself as adult', () => {
  test('can complete self-enrollment @dss @pancan @functional', async ({ page }) => {
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
    await consentFormPage.fillInName(user.patient.firstName, lastName);
    await consentFormPage.fillInDateOfBirth(user.patient.birthDate.MM, user.patient.birthDate.DD, user.patient.birthDate.YYYY);
    await consentFormPage.signature().fill(`${user.patient.firstName} ${lastName}`);
    await expect(consentFormPage.getSubmitButton()).toBeEnabled();

    await consentFormPage.fillInContactAddress({ fullName: `${user.patient.firstName} ${lastName}` });
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
    const surveyCervicalCancerPage = new SurveyAboutCancer(page);
    await surveyCervicalCancerPage.waitForReady();
    await surveyCervicalCancerPage.fillInDiagnosedDate('March', '2015');
    await surveyCervicalCancerPage.initialBodyLocation().fill('Appendix');
    await surveyCervicalCancerPage.cancerFree().radioButton('Yes').locator('label').click();
    await surveyCervicalCancerPage.fillBodyPlacesEverHadCancer('Appendix');
    await surveyCervicalCancerPage.checkTreatmentsReceived('Radiation');
    await surveyCervicalCancerPage.medicationsList().fill('many others');
    await surveyCervicalCancerPage.submit();

    //Survey: About you
    await assertActivityHeader(page, 'Survey: About You');
    const surveyAboutYou = new SurveyAboutYou(page);
    await surveyAboutYou.waitForReady();
    await surveyAboutYou.sex().radioButton('Male', { exactMatch: true }).locator('label').click();
    await surveyAboutYou.gender().toCheckbox('Man').check();
    await surveyAboutYou.race().toCheckbox('White').check();
    await surveyAboutYou.race().toCheckbox('English').check();
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
    expect(await statusResearchCell?.innerText()).toBe('Complete');
    const statusMedicalReleaseCell = await table.findCell('Form', 'Medical Release Form', 'Status');
    expect(await statusMedicalReleaseCell?.innerText()).toBe('Complete');
    const statusCervicalCancerCell = await table.findCell('Form', 'Survey: Your Cervical cancer', 'Status');
    expect(await statusCervicalCancerCell?.innerText()).toBe('Complete');
    const statusAboutYouCell = await table.findCell('Form', 'Survey: About You', 'Status');
    expect(await statusAboutYouCell?.innerText()).toBe('Complete');
  });
});
