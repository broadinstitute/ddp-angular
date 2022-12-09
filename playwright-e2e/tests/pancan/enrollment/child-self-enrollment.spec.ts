import { test } from '../../../fixtures/pancan-fixture';
import { generateUserName } from '../../../utils/faker-utils';
import * as user from '../../../data/fake-user.json';
import PreScreeningPage from '../../../pages/pancan/enrollment/pre-screeening-page';
import PreScreeningDiagnosisPage from '../../../pages/pancan/enrollment/pre-screening-diagnosis-page';
import PreScreeningAgeLocationPage from '../../../pages/pancan/enrollment/pre-screening-age-location-page';
import { PatientsData } from '../../../pages/pancan/enrollment/utils/PatientType';
import * as auth from '../../../authentication/auth-pancan';
import { assertActivityHeader, assertActivityStep } from '../../../utils/assertion-helper';
import ConsentFormPage from '../../../pages/pancan/enrollment/consent-form-page';
import { enterMailingAddress } from '../../../utils/test-utils';
import MedicalReleaseFormPage from '../../../pages/pancan/enrollment/medical-release-form-page';

test.describe('Enroll child ', () => {
  test('can complete child-enrollment @enrollment @pancan', async ({ context, page, homePage }) => {
    await homePage.join();
    const lastName = generateUserName(user.patient.lastName);

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
    await auth.createAccountWithEmailAlias(page);

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
    await consentFormPage.dateOfBirth(user.child.birthDate.MM, user.child.birthDate.DD, user.child.birthDate.YYYY);
    await consentFormPage.parentData();
    await enterMailingAddress(page, { fullName: `${user.child.firstName} ${lastName}` }, 'Phone');
    await consentFormPage.next();
    await consentFormPage.waitSecondReady();
    await consentFormPage.childSignature().fill(user.child.firstName);
    const medicalReleaseFormPage = new MedicalReleaseFormPage(page);
    await medicalReleaseFormPage.submit();
  });
});
