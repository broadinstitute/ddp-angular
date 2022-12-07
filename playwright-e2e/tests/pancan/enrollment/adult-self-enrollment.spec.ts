import PreScreeningAgeLocationPage from 'pages/pancan/enrollment/pre-screening-age-location-page';
import PreScreeningDiagnosisPage from 'pages/pancan/enrollment/pre-screening-diagnosis-page';
import { test } from '../../../fixtures/pancan-fixture';
import PreScreeningPage from '../../../pages/pancan/enrollment/pre-screeening-page';
import * as auth from 'authentication/auth-pancan';
import { assertActivityHeader, assertActivityStep } from 'utils/assertion-helper';
import ConsentFormPage from 'pages/pancan/enrollment/consent-form-page';
import { generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';
import { enterMailingAddress } from 'utils/test-utils';
import MedicalReleaseFormPage from 'pages/pancan/enrollment/medical-release-form-page';
import { expect } from '@playwright/test';
import { PatientsData } from '../../../pages/pancan/enrollment/utils/PatientType';
import SurveyCervicalCancerPage from 'pages/pancan/enrollment/survey-cervical-cancer-page';
import SurveyAboutYouPage from 'pages/pancan/enrollment/survey-about-you.page';
import ParticipantDashboardPage from 'pages/pancan/dashboard/participant-dashboard-page';

test.describe('Enroll myself as adult', () => {
  test('can complete self-enrollment @enrollment @pancan', async ({ context, page, homePage }) => {
    await homePage.join();
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
    await preScreeningDiagnosisPage.cancerDiagnosed().input().fill(PatientsData.adult.cancerDiagnosed.cancer);
    await preScreeningDiagnosisPage.getNextButton().waitFor({ state: 'visible' });
    await preScreeningDiagnosisPage.next();
    //age/location page
    const preScreeningAgeLocationPage = new PreScreeningAgeLocationPage(page);
    await preScreeningAgeLocationPage.waitForReady();
    await preScreeningAgeLocationPage.enterInformationAboutAgeLocation();

    // Step 2
    // Enter email alias and password to create new account
    await auth.createAccountWithEmailAlias(page);

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
    await consentFormPage.bloodSamples();
    await consentFormPage.cancerSamples();
    await consentFormPage.firstName().fill(user.patient.firstName);
    await consentFormPage.lastName().fill(lastName);
    await consentFormPage.dateOfBirth(user.patient.birthDate.MM, user.patient.birthDate.DD, user.patient.birthDate.YYYY);
    await consentFormPage.signature().fill(`${user.patient.firstName} ${lastName}`);
    await enterMailingAddress(page, { fullName: `${user.patient.firstName} ${lastName}` }, 'Phone');
    await consentFormPage.submit();
    //On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.waitForReady();
    await medicalReleaseFormPage.enterPhysicianData();
    await medicalReleaseFormPage.contactPhysician().toLocator().click();
    await medicalReleaseFormPage.submit();
    //Survey: About Cervical Cancer
    await assertActivityHeader(page, 'Survey: About Your Cervical cancer');
    const surveCervicalCancerPage = new SurveyCervicalCancerPage(page);
    await surveCervicalCancerPage.waitForReady();
    await surveCervicalCancerPage.cervicalCancerDiagnosedDate('March', '2015');
    await surveCervicalCancerPage.fillCancerBodyPlaces('Appendix');
    await surveCervicalCancerPage.cancerFree().radioButton('Yes').locator('label').click();
    await surveCervicalCancerPage.fillBodyPlacesEverHadCancer('Appendix');
    await surveCervicalCancerPage.checkTreatmentsReceived('Radiation');
    await surveCervicalCancerPage.medicationsList().fill('many others');
    await surveCervicalCancerPage.submit();
    //Survey: About you
    await assertActivityHeader(page, 'Survey: About You');
    const survayAboutYou = new SurveyAboutYouPage(page);
    await survayAboutYou.waitForReady();
    await survayAboutYou.sexAssignedAtBirth().radioButton('Male', {exactMatch: true}).locator('label').click();
    await survayAboutYou.checkGenderIdentity('Man');
    await survayAboutYou.checkCategoriesDecribesYou('White');
    await survayAboutYou.checkCategoriesDecribesYou('English');
    await survayAboutYou.howDidYouHearAboutProject().check('Social media (Facebook, Twitter, Instagram, etc.)');
    await survayAboutYou.howDidYouHearAboutProject().check('Facebook',{exactMatch: true});
    await survayAboutYou.submit();
    //dashboard
    const participantDashborad = new ParticipantDashboardPage(page);
    await participantDashborad.waitForReady();
    const orderedHeaders = ['Form', 'Summary', 'Status', 'Actions'];
    const table = participantDashborad.getDashboardTable();
    let headers = await table.getColumnNames();
    headers=headers.length > 1 ? headers : headers[0].split(/\n/g);
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);


  });
});
