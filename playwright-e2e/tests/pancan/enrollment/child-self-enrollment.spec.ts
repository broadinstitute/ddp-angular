import { expect } from '@playwright/test';
import { test } from 'fixtures/pancan-fixture';
import DashboardPage from 'dss/pages/pancan/dashboard-page';
import MedicalReleaseFormPage from 'dss/pages/pancan/enrollment/medical-release-form-page';
import SurveyAboutCancer from 'dss/pages/pancan/enrollment/survey-about-cancer-page';
import SurveyAboutYou from 'dss/pages/survey-about-you';
import HomePage from 'dss/pages/pancan/home-page';
import { generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';
import PreScreeningPage from 'dss/pages/pancan/enrollment/pre-screeening-page';
import PreScreeningDiagnosisPage from 'dss/pages/pancan/enrollment/pre-screening-diagnosis-page';
import PreScreeningAgeLocationPage from 'dss/pages/pancan/enrollment/pre-screening-age-location-page';
import { PatientsData } from 'dss/pages/patient-type';
import * as auth from 'authentication/auth-pancan';
import { assertActivityHeader, assertActivityStep } from 'utils/assertion-helper';
import ConsentFormPage from 'dss/pages/pancan/enrollment/consent-form-page';

const { PANCAN_USER_EMAIL, PANCAN_USER_PASSWORD } = process.env;

test.describe('Enroll child ', () => {
  const lastName = generateUserName(user.patient.lastName);

  test('can complete child-enrollment @dss @pancan @functional', async ({ page }) => {
    const pancanHomePage = new HomePage(page);
    await pancanHomePage.join();

    // Step 1
    // On “pre-screening” page, answer all questions about yourself with fake values
    const preScreeningPage = new PreScreeningPage(page);
    await preScreeningPage.waitForReady();
    await preScreeningPage.whoIsSigningUp().check(PatientsData.child.whoIsSigningUp, { exactMatch: true });
    await preScreeningPage.next();
    // On Diagnosis page
    const preScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page, 'child');
    await preScreeningDiagnosisPage.waitForReady();
    await preScreeningDiagnosisPage.cancerDiagnosed().fill(PatientsData.child.cancerDiagnosed.typeCancer);
    await preScreeningDiagnosisPage.next();

    await assertActivityHeader(page, 'Lets get started');
    await preScreeningDiagnosisPage.submit({ waitForNav: false });

    // On Age/location page
    const preScreeningAgeLocationPage = new PreScreeningAgeLocationPage(page, 'child');
    await preScreeningAgeLocationPage.waitForReady();
    await preScreeningAgeLocationPage.fillInAgeLocation();

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
    await consentFormPage.agreeToBloodSamples();
    await consentFormPage.agreeToStoreCancerSamples();
    await consentFormPage.fillInName(user.child.firstName, lastName, {
      firstNameTestId: 'answer:ASSENT_CHILD_FIRSTNAME',
      lastNameTestId: 'answer:ASSENT_CHILD_LASTNAME'
    });
    await consentFormPage.fillInDateOfBirth(user.child.birthDate.MM, user.child.birthDate.DD, user.child.birthDate.YYYY);
    await consentFormPage.fillInParentData();
    await consentFormPage.fillInContactAddress({ fullName: `${user.child.firstName} ${lastName}` });
    await consentFormPage.next();
    await consentFormPage.waitSecondReady();
    await consentFormPage.childSignature().fill(user.child.firstName);
    await consentFormPage.submit();

    // On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.waitForReady();
    await medicalReleaseFormPage.fillInInPhysicianData();
    await medicalReleaseFormPage.agreeToAllowContactPhysician().check();
    await medicalReleaseFormPage.submit();

    // Survey: About Your Child's Leukemia
    await assertActivityHeader(page, "Survey: About Your Child's Leukemia (not otherwise specified)");
    const surveyAboutCancerPage = new SurveyAboutCancer(page);
    await surveyAboutCancerPage.waitForReady();
    await surveyAboutCancerPage.fillInDiagnosedDate('March', '2015');
    await surveyAboutCancerPage.initialBodyLocation().fill('Blood');
    await surveyAboutCancerPage.cancerFree().check('Yes');
    await surveyAboutCancerPage.fillBodyPlacesEverHadCancer('Blood');
    await surveyAboutCancerPage.checkTreatmentsReceived('Radiation');
    await surveyAboutCancerPage.medicationsList().fill('many others');
    await surveyAboutCancerPage.submit();

    // Survey: About your child
    await assertActivityHeader(page, 'Survey: About Your Child');
    const surveyAboutYou = new SurveyAboutYou(page);
    await surveyAboutYou.waitForReady();
    await surveyAboutYou.sex().radioButton('Male', { exactMatch: true }).locator('label').click();
    await surveyAboutYou.gender().toCheckbox('Boy').check();
    await surveyAboutYou.race().toCheckbox('White').check();
    await surveyAboutYou.race().toCheckbox('English').check();
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

    const researchConsentFormStatusCell = await table.findCell('Form', 'Research Consent Form - Parent or Guardian', 'Status');
    expect(await researchConsentFormStatusCell?.innerText()).toBe('Complete');
    const medicalReleaseFormStatusCell = await table.findCell('Form', 'Medical Release Form', 'Status');
    expect(await medicalReleaseFormStatusCell?.innerText()).toBe('Complete');
    const leukemiaCancerStatusCell = await table.findCell('Form', "Survey: Your Child's Leukemia (not otherwise specified)", 'Status');
    expect(await leukemiaCancerStatusCell?.innerText()).toBe('Complete');
    const aboutYourChildFormStatusCell = await table.findCell('Form', 'Survey: About Your Child', 'Status');
    expect(await aboutYourChildFormStatusCell?.innerText()).toBe('Complete');
  });
});
