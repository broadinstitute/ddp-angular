import { expect } from '@playwright/test';
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
import { PatientsData } from 'dss/pages/patient-type';
import SurveyAboutCancer from 'dss/pages/pancan/enrollment/survey-about-cancer-page';
import SurveyAboutYou from 'dss/pages/survey-about-you';
import DashboardPage from 'dss/pages/pancan/dashboard-page';
import HomePage from 'dss/pages/pancan/home-page';

const { PANCAN_USER_EMAIL, PANCAN_USER_PASSWORD } = process.env;

test.describe('Adult self-enroll & child (consent) enrollment', () => {
  test.slow();

  // Randomize patient last name
  const lastName = generateUserName(user.adult.lastName);

  async function fillInSurveyAboutYou(survey: SurveyAboutYou, opts: {
    sex?: string; gender?: string; race?: string; howDidYouHearAboutProject?: string
  } = {}): Promise<void> {
    const { sex = 'Male', gender = 'Man', race = 'White', howDidYouHearAboutProject = 'Social media (Facebook, Twitter, Instagram, etc.)' } = opts;
    await survey.sex().radioButton(sex, { exactMatch: true }).locator('label').click();
    await survey.gender().toCheckbox(gender).check();
    await survey.race().toCheckbox(race).check();
    await survey.race().toCheckbox('English').check();
    await survey.howDidYouHearAboutProject().check(howDidYouHearAboutProject);
    await survey.howDidYouHearAboutProject().check('Facebook', { exactMatch: true });
  }

  /**
   * Participant first go through adult self enrollment, then be taken to the dashboard to continue child’s enrollment
   */
  test('Adult enroll self and a child (non-assent) at same time @enrollment @dss @pancan @functional', async ({ page }) => {
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
    await expect(page.locator('p')).toHaveText(
      'We will first ask about your experiences with cancer. ' +
        "Once you arrive at the Dashboard you will be able to add details about your child's experience with cancer."
    );
    await preScreeningPage.next();

    // On Diagnosis page
    const preScreeningDiagnosisPage = new PreScreeningDiagnosisPage(page);
    await preScreeningDiagnosisPage.waitForReady();
    // Add one diagnosed cancer
    await preScreeningDiagnosisPage.cancerDiagnosed().fill(PatientsData.adult.cancerDiagnosed.typeCancer);
    await preScreeningDiagnosisPage.next();

    // On Age and location page
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
    expect(await consentFormPage.bloodSamples().toLocator().screenshot()).toMatchSnapshot('agree-to-drawn-blood-samples.png');
    await consentFormPage.agreeToBloodSamples();
    expect(await consentFormPage.cancerSamples().toLocator().screenshot()).toMatchSnapshot('agree-to-store-cancer-samples.png');
    await consentFormPage.agreeToStoreCancerSamples();
    await consentFormPage.fillInName(user.adult.firstName, lastName);
    await consentFormPage.fillInDateOfBirth(user.adult.birthDate.MM, user.adult.birthDate.DD, user.adult.birthDate.YYYY);
    await consentFormPage.signature().fill(`${user.adult.firstName} ${lastName}`);
    await expect(consentFormPage.getSubmitButton()).toBeEnabled();

    await consentFormPage.fillInContactAddress({
      fullName: `${user.adult.firstName} ${lastName}`,
      labels: { phone: 'Phone', country: 'Country', state: 'State', zip: 'Zip Code', city: 'City' }
    });
    await consentFormPage.submit();

    //On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.waitForReady();
    expect(await page.locator('.ddp-content').first().screenshot()).toMatchSnapshot('medical-release-form-content.png');
    expect(await medicalReleaseFormPage.agreeToAllowContactPhysician().toLocator().screenshot()).toMatchSnapshot('agree-to-contact-physician.png');
    await medicalReleaseFormPage.fillInInPhysicianData();
    await medicalReleaseFormPage.agreeToAllowContactPhysician().check();
    await medicalReleaseFormPage.submit();

    // Survey: About Cervical Cancer
    await assertActivityHeader(page, `Survey: About Your ${PatientsData.adult.cancerDiagnosed.typeCancer}`);
    const surveyCervicalCancerPage = new SurveyAboutCancer(page);
    await surveyCervicalCancerPage.waitForReady();
    await surveyCervicalCancerPage.fillInDiagnosedDate('March', '2015');
    await surveyCervicalCancerPage.initialBodyLocation().fill('Appendix');
    await surveyCervicalCancerPage.cancerFree().radioButton('Yes').locator('label').click();
    await surveyCervicalCancerPage.fillBodyPlacesEverHadCancer('Appendix');
    await surveyCervicalCancerPage.checkTreatmentsReceived('Radiation');
    await surveyCervicalCancerPage.medicationsList().fill('many others');
    await surveyCervicalCancerPage.submit();

    // Survey: About you
    await assertActivityHeader(page, 'Survey: About You');
    const surveyAboutYou = new SurveyAboutYou(page);
    await fillInSurveyAboutYou(surveyAboutYou);
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
    expect(await researchStatusCell?.innerText()).toBe('Complete');
    let medicalReleaseStatusCell = await table.findCell('Form', 'Medical Release Form', 'Status');
    expect(await medicalReleaseStatusCell?.innerText()).toBe('Complete');
    const cervicalCancerStatusCell = await table.findCell('Form', 'Survey: Your Cervical cancer', 'Status');
    expect(await cervicalCancerStatusCell?.innerText()).toBe('Complete');
    const aboutYouStatusCell = await table.findCell('Form', 'Survey: About You', 'Status');
    expect(await aboutYouStatusCell?.innerText()).toBe('Complete');
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
    await childPreScreeningAgeLocationPage.fillInAgeLocation({ age: user.secondChild.age });

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
    await childConsentFormPage.fillInName(user.secondChild.firstName, lastName, {
      firstNameTestId: 'answer:PARENTAL_CHILD_FIRSTNAME',
      lastNameTestId: 'answer:PARENTAL_CHILD_LASTNAME'
    });
    await childConsentFormPage.fillInDateOfBirth(user.secondChild.birthDate.MM, user.secondChild.birthDate.DD, user.secondChild.birthDate.YYYY);
    await childConsentFormPage.fillInParentData();
    await childConsentFormPage.fillInContactAddress({
      fullName: user.secondChild.fullName,
      labels: { phone: 'Phone', country: 'Country', state: 'State', zip: 'Zip Code', city: 'City' }
    });
    await childConsentFormPage.submit();

    // On "Medical Release Form"
    await assertActivityHeader(page, 'Medical Release Form');
    await medicalReleaseFormPage.waitForReady();
    await medicalReleaseFormPage.fillInInPhysicianData();
    await medicalReleaseFormPage.agreeToAllowContactPhysician().check();
    await medicalReleaseFormPage.submit();

    // Survey: About Your Child's Pancreatic cancer
    await assertActivityHeader(page, "Survey: About Your Child's Pancreatic cancer / Pancreatic ductal adenocarcinoma (PDAC)");
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
    await surveyAboutYou.waitForReady();
    await fillInSurveyAboutYou(surveyAboutYou, { gender: 'Boy' });
    await surveyAboutYou.submit();

    // Two tables: one for enrolled adult and one for enrolled child
    const table2 = participantDashboard.getDashboardTable(1);
    await table2.show();
    // Verify second (child) table contents
    headers = await table2.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);
    researchStatusCell = await table2.findCell('Form', 'Research Consent Form - Parent or Guardian', 'Status');
    expect(await researchStatusCell?.innerText()).toEqual('Complete');
    medicalReleaseStatusCell = await table2.findCell('Form', 'Medical Release Form', 'Status');
    expect(await medicalReleaseStatusCell?.innerText()).toEqual('Complete');
    const pancreaticCancerStatusCell = await table2.findCell(
      'Form',
      "Survey: Your Child's Pancreatic cancer / Pancreatic ductal adenocarcinoma (PDAC)",
      'Status'
    );
    expect(await pancreaticCancerStatusCell?.innerText()).toEqual('Complete');
    const aboutYouChildStatusCell = await table2.findCell('Form', 'Survey: About Your Child', 'Status');
    expect(await aboutYouChildStatusCell?.innerText()).toEqual('Complete');
  });
});
