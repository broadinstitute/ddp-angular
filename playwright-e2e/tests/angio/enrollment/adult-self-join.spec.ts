import { expect } from '@playwright/test';
import { test } from 'fixtures/angio-fixture';
import MedicalReleaseForm from 'pages/angio/enrollment/medical-release-form';
import HomePage from 'pages/angio/home/home-page';
import CountMeInPage, { DESCRIBE_SELF } from 'pages/angio/enrollment/count-me-in-page';
import * as user from 'data/fake-user.json';
import { generateUserName } from 'utils/faker-utils';
import * as auth from 'authentication/auth-angio';
import AboutYouPage from 'pages/angio/enrollment/about-you-page';
import { MONTH } from 'data/constants';
import ResearchConsentPage from 'pages/angio/enrollment/research-consent-page';

test.describe('Adult Enrollment', () => {
  // Randomize last name
  const lastName = generateUserName(user.patient.lastName);

  test('Join for self @functional @join @angio', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.countMeIn();

    // Step 1:
    // Tell Us About Yourself
    const countMeInPage = new CountMeInPage(page);
    await countMeInPage.waitForReady();
    await countMeInPage.firstName().fill(user.patient.firstName);
    await countMeInPage.lastName().fill(lastName);
    await countMeInPage.diagnosedWithAngiosarcoma(DESCRIBE_SELF.HaveBeenDiagnosedWithAngiosarcoma).check();
    await countMeInPage.submit();

    // Step 2:
    // Create account with an email alias
    console.log('email alias: ', await auth.createAccountWithEmailAlias(page));

    // Step 3:
    // Answers questions about yourself
    // Question 1
    const aboutYou = new AboutYouPage(page);
    await aboutYou.whenDiagnosedWithAngiosarcoma(MONTH.AUG, '1950');
    // Question 2
    await aboutYou.whereFoundInBody(['Scalp', 'Liver', 'Lung']);
    // Question 3
    await aboutYou.whereHadInBody(['Abdominal Area'], ['waist']);
    await aboutYou.whereHadInBody(['Other', 'Other'], ['toe']);
    // Question 4
    await aboutYou.whereCurrentlyHaveInBody(['Head/Face/Neck (not scalp)']);
    // Question 5
    await aboutYou.hadSurgeryToRemoveAngiosarcoma(new RegExp('^No'));
    // Question 6
    await aboutYou.hadRadiationTreatmentForAngiosarcoma(new RegExp('^No'));
    // Question 8
    await aboutYou.beingTreatedCurrentlyForAngiosarcoma(new RegExp('^No'));
    // Question 9
    await aboutYou.diagnosedWithOtherCancer(new RegExp('^No'));
    // Question 11
    await aboutYou.howDidYouHearAbout('Friends and family');
    // Question 15
    await aboutYou.yearBorn(user.patient.birthDate.YYYY);
    // Question 16
    const [selectedValue] = await aboutYou.country(user.patient.country.abbreviation);
    expect(selectedValue).toEqual('US');
    await aboutYou.submit();

    // Step 4:
    // Research Consent Form
    const researchConsentPage = new ResearchConsentPage(page);
    await researchConsentPage.next();
    await researchConsentPage.next();
    await researchConsentPage.agreeToArrangeSampleBloodDrawn('Yes');
    await researchConsentPage.canRequestMyStoredTissueSamples('Yes');
    await researchConsentPage.fullName(`${user.patient.firstName} ${user.patient.lastName}`);
    await researchConsentPage.dateOfBirth(user.patient.birthDate.MM, user.patient.birthDate.DD, user.patient.birthDate.YYYY);
    await researchConsentPage.submit();

    // Step 5
    // Medical Release Form
    const medicalReleaseForm = new MedicalReleaseForm(page);
    await medicalReleaseForm.yourContactInformation().input('Full Name').fill(user.patient.fullName);
    // prettier-ignore
    await medicalReleaseForm.yourContactInformation().select('Country/Territory').selectOption(user.patient.country.name);
    await medicalReleaseForm.yourContactInformation().select('State').selectOption(user.patient.state.name);
    await medicalReleaseForm.yourContactInformation().input('Street Address').fill(user.patient.streetAddress);
    await medicalReleaseForm.yourContactInformation().input('City').fill(user.patient.city);
    await medicalReleaseForm.yourContactInformation().input('Zip Code').fill(user.patient.zip);

    //await page.pause();
  });
});
