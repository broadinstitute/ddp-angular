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
import MedicalReleaseFormPage from 'pages/pancan/enrollment/medical-release-form';
import { expect } from '@playwright/test';
import { PatientsData } from '../../../pages/pancan/enrollment/utils/PatientType';

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

    /*  await auth.createAccountWithEmailAlias(page);
        const myDashboardPage = new MyDashboardPage(page);
        await myDashboardPage.enrollMyself();

        // Step 4
        // On "Enroll myself" page, check "Me" checkbox
        await assertActivityHeader(page, 'Enroll myself');
        const enrollMyselfPage = new EnrollMyselfPage(page);
        await enrollMyselfPage.whoHasVentricleHeartDefect().check(WHO.Me, { exactMatch: true });
        await enrollMyselfPage.next({ waitForNav: true });

        // On "Consent Form" page, Page 1 of 3.
        // Check to see if I can download the Consent form PDF
        await assertActivityHeader(page, 'Your Consent Form');
        await assertActivityProgress(page, 'Page 1 of 3');
        const consentForm = new ConsentFormPage(page);
        await downloadConsentPdf(context, page.locator('a.consent-download__link'));
        await consentForm.next();
        // On "Consent Form" page, Page 2 of 3.
        await assertActivityHeader(page, 'Your Consent Form');
        await assertActivityProgress(page, 'Page 2 of 3');
        await consentForm.next();

        // On "Consent Form" page, Page 3 of 3.
        await assertActivityHeader(page, 'Your Consent Form');
        await assertActivityProgress(page, 'Page 3 of 3');
        await consentForm.firstName().fill(user.patient.firstName);
        await consentForm.lastName().fill(lastName);

        await consentForm.dateOfBirth(user.patient.birthDate.MM, user.patient.birthDate.DD, user.patient.birthDate.YYYY);
        await consentForm.toKnowSecondaryFinding().check('I want to know.');
        await consentForm.signature().fill(`${user.patient.firstName} ${lastName}`);
        await consentForm.authorizationSignature().fill(`${user.patient.firstName} ${lastName}`);
        await consentForm.agree();

        // on "About Me" page
        const aboutMePage = new AboutMePage(page);
        await aboutMePage.waitForReady();
        await assertActivityHeader(page, 'About Me');
        await enterMailingAddress(page, { fullName: `${user.patient.firstName} ${lastName}` });
        // Clicking of Next button Triggered address validation
        await aboutMePage.next();
        // Because address is all fake, an error message is expected
        await expect(page.locator('.ErrorMessage')).toBeVisible();
        await expect(page.locator('.ErrorMessage')).toHaveText(/We could not find the entered address/);
        await aboutMePage.useAddressAsEntered().check();
        await aboutMePage.next({ waitForNav: true });

        // on "Medical Record Release Form" page, page 1 of 3.
        await assertActivityHeader(page, 'Medical Record Release Form');
        await assertActivityProgress(page, 'Page 1 of 3');
        const medicalRecordReleaseForm = new MedicalRecordReleaseForm(page);
        await medicalRecordReleaseForm.unableToProvideMedicalRecords().check();
        await medicalRecordReleaseForm.enterInformationAboutPhysician();
        await medicalRecordReleaseForm.next();

        await assertActivityHeader(page, 'Medical Record Release Form');
        await assertActivityProgress(page, 'Page 2 of 3');
        await medicalRecordReleaseForm.next();

        await assertActivityHeader(page, 'Medical Record Release Form');
        await assertActivityProgress(page, 'Page 3 of 3');
        await medicalRecordReleaseForm.name().fill(`${user.patient.firstName} ${lastName}`);
        await medicalRecordReleaseForm.signature().fill(`${user.patient.firstName} ${lastName}`);
        await page.waitForResponse((resp) => resp.url().includes('/answers') && resp.status() === 200);
        await medicalRecordReleaseForm.submit();

        // Medical Record File Upload
        await assertActivityHeader(page, 'Medical Record File Upload');
        await medicalRecordReleaseForm.uploadFile(`data/upload/BroadInstitute_Wikipedia.jpg`);
        await medicalRecordReleaseForm.next({ waitForNav: true });

        await assertActivityHeader(
            page,
            'Please complete this survey so that we may learn more about your medical background.'
        );

        // Patient Survey
        const patientSurveyPage = new PatientSurveyPage(page);
        await patientSurveyPage.cityBornIn().fill(user.patient.city);
        await patientSurveyPage.stateBornIn().selectOption(user.patient.state.abbreviation);
        await patientSurveyPage.zipCodeCityBornIn().fill(user.patient.zip);
        await patientSurveyPage.currentZipCode().fill(user.patient.zip);
        await patientSurveyPage.sexAtBirth().check('Prefer not to answer');
        await patientSurveyPage.race().check('White');
        await patientSurveyPage.isHispanic().check(new RegExp('^\\s*No\\s*$'));
        await patientSurveyPage.selectVentricleDiagnosis().check('Ebstein');
        await patientSurveyPage.submit();

        // Assert contents in My Dashboard table
        await myDashboardPage.waitForReady();
        const orderedHeaders = ['Title', 'Summary', 'Status', 'Action'];
        const table = myDashboardPage.getDashboardTable();
        const headers = await table.getColumnNames();
        expect(headers).toHaveLength(4); // Four columns in table
        expect(headers).toEqual(orderedHeaders);

        const summaryCell = await table.findCellLocator('Title', 'Consent', 'Summary');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await expect(summaryCell!).toHaveText('Thank you for signing the consent form -- welcome to Project Singular!');

        const statusCell = await table.findCellLocator('Title', 'Consent', 'Status');
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await expect(statusCell!).toHaveText('Complete'); */
  });
});
