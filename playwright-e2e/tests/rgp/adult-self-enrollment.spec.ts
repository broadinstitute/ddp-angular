import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import * as user from 'data/fake-user.json';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import HowItWorksPage from 'pages/rgp/enrollment/how-it-works-page';
import TellUsAboutYourFamilyPage from 'pages/rgp/enrollment/tell-us-about-your-family-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';
import { setAuth0UserEmailVerified } from 'utils/api-utils';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

/** UNFINISHED **/

test.describe('Adult Self Enrollment', () => {
  const assertProgressActiveItem = async (page: Page, itemName: string): Promise<void> => {
    const locator = page.locator('li.activity-stepper__step-container button.stepper-btn.stepper-btn--active');
    await expect(locator).toHaveCount(1);
    await expect(locator).toContainText(itemName);
  };

  test.fixme('Can complete application @functional @enrollment @rgp', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickGetStarted();

    const howItWorks = new HowItWorksPage(page);
    await howItWorks.startApplication();

    const tellUsYourStoryPage = new TellUsYourStoryPage(page);
    await tellUsYourStoryPage.waitForReady();
    // Check all checkboxes
    await tellUsYourStoryPage.who().check(WHO.UnderstandEnglishOrSpanish);
    await tellUsYourStoryPage.who().check(WHO.LivesInUS);
    await tellUsYourStoryPage.who().check(WHO.HasRareGeneticallyUndiagnosedCondition);
    await tellUsYourStoryPage.who().check(WHO.IsUnderCare);
    await tellUsYourStoryPage.submit();

    const userEmail = await auth.createAccountWithEmailAlias(page, { email: RGP_USER_EMAIL, password: RGP_USER_PASSWORD });

    await expect(page.locator('text="Account Verification"')).toBeVisible();
    await expect(page.locator('#view__account-verification p:first-child')).toHaveText(
      'An email has been sent to the address that you provided. ' +
        'Please check your inbox, ' +
        'open the email and click "Verify my account and complete questionnaire" ' +
        'to move forward in the submission process.'
    );
    await expect(page.locator('#view__account-verification p:last-child')).toHaveText(
      'If you do not receive an email, contact us at raregenomes@broadinstitute.org.'
    );

    // Verify user email by Auth0 API
    await setAuth0UserEmailVerified(APP.RPG, userEmail, { isEmailVerified: true });

    await auth.login(page, { email: userEmail });

    const tellUsAboutYourFamilyPage = new TellUsAboutYourFamilyPage(page);
    await tellUsAboutYourFamilyPage.waitForReady();
    await assertProgressActiveItem(page, '1');

    await tellUsAboutYourFamilyPage.yourTitle().selectOption(user.patient.title);
    await tellUsAboutYourFamilyPage.yourFirstName().fill(user.patient.firstName);
    await tellUsAboutYourFamilyPage.phone().fill(user.patient.phone);
    await tellUsAboutYourFamilyPage.confirmPhone().fill(user.patient.phone);
    await tellUsAboutYourFamilyPage.patientRelationship().selectOption('MYSELF');
    await tellUsAboutYourFamilyPage.state().selectOption(user.patient.state.abbreviation);
    await tellUsAboutYourFamilyPage.website().fill('https://en.wikipedia.org/wiki/Broad_Institute');
    await tellUsAboutYourFamilyPage.describeGeneticCondition().fill('Single-gene disorders');
    await tellUsAboutYourFamilyPage.haveAnyClinicalDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamilyPage.clinicalDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamilyPage.haveAnyGeneticDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamilyPage.geneticDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamilyPage
      .howDidYouFindOutAboutThisProject()
      .checkAndFillInInput('Doctor', { inputText: user.doctor.name });
    await tellUsAboutYourFamilyPage.howDidYouFindOutAboutThisProject().check('Twitter');
    await tellUsAboutYourFamilyPage.next();

    await assertProgressActiveItem(page, '2');
    await expect(page.locator('text="Please provide information on the patient:"')).toBeVisible();
    await expect(page.locator('ddp-activity-content p.SubHeading')).toHaveText(
      'This study requires that at least one individual in the family affected by the rare condition provide a DNA sample.'
    );

    /*

    await tellUsAboutYourFamilyPage.patientAge().fill(user.patient.age);
    await tellUsAboutYourFamilyPage.patientAgeAtOnsetCondition().fill(user.patient.age);
    await tellUsAboutYourFamilyPage.patientSex().check(user.patient.sex, { exactMatch: true });
    // TODO Select is not Working
    // await tellUsAboutYourFamilyPage.patientRace().select('I prefer not to answer');
    await tellUsAboutYourFamilyPage.patientEthnicity().check('I prefer not to answer');
    // TODO Select is not Working
    // await tellUsAboutYourFamilyPage.indicateTypesOfDoctors().selectOption('Pulmonologist');
    await tellUsAboutYourFamilyPage.indicatePatientHadFollowingTest().check('Karyotype');
    await tellUsAboutYourFamilyPage.indicatePatientHadFollowingTest().check('Single gene testing');
    await tellUsAboutYourFamilyPage.indicateAnyPatientBiopsiesAvailable().check('Bone Marrow Biopsy');
    await tellUsAboutYourFamilyPage.indicateAnyPatientBiopsiesAvailable().check('Skin Biopsy');
    await tellUsAboutYourFamilyPage.indicateAnyPatientBiopsiesAvailable().check('Muscle Biopsy');
    await tellUsAboutYourFamilyPage.isPatientParticipatingInResearchStudies().check('No');
    await tellUsAboutYourFamilyPage.next();

    await assertProgressActiveItem(page, '3');

    */
  });
});
