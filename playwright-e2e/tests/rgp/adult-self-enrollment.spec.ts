import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import * as user from 'data/fake-user.json';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import Button from 'lib/widget/button';
import DashboardPage from 'pages/rgp/dashboard-page';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
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

  test('Can complete application @functional @enrollment @rgp', async ({ page }) => {
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

    const userEmail = await auth.createAccountWithEmailAlias(page, {
      email: RGP_USER_EMAIL,
      password: RGP_USER_PASSWORD,
      waitForNavigation: false,
      waitForAuth: false
    });

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

    await tellUsAboutYourFamilyPage.patientAge().fill(user.patient.age);
    await tellUsAboutYourFamilyPage.patientAgeAtOnsetCondition().fill(user.patient.age);
    await tellUsAboutYourFamilyPage.patientSex().check(user.patient.sex, { exactMatch: true });
    await tellUsAboutYourFamilyPage.patientRace().toSelect('Select all that apply').selectOption('I prefer not to answer');
    await tellUsAboutYourFamilyPage.patientEthnicity().check('I prefer not to answer');
    await tellUsAboutYourFamilyPage.indicateTypesOfDoctors().toSelect('Select all that apply').selectOption('Pulmonologist');
    await tellUsAboutYourFamilyPage.indicateAnyFollowingTest().check('Karyotype');
    await tellUsAboutYourFamilyPage.indicateAnyFollowingTest().check('Single gene testing');
    await tellUsAboutYourFamilyPage.indicateAnyBiopsiesAvailable().check('Bone Marrow Biopsy');
    await tellUsAboutYourFamilyPage.indicateAnyBiopsiesAvailable().check('Skin Biopsy');
    await tellUsAboutYourFamilyPage.indicateAnyBiopsiesAvailable().check('Muscle Biopsy');
    await tellUsAboutYourFamilyPage.isPatientParticipatingInOtherResearchStudies().check('No');
    await tellUsAboutYourFamilyPage.next();

    await assertProgressActiveItem(page, '3');

    await tellUsAboutYourFamilyPage
      .patientBiologicalMotherRace()
      .toSelect('Select all that apply')
      .selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamilyPage.patientBiologicalMotherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamilyPage.doesMotherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamilyPage.isPatientBiologicalMotherAbleToParticipateStudy().check('No');

    await tellUsAboutYourFamilyPage
      .patientBiologicalFatherRace()
      .toSelect('Select all that apply')
      .selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamilyPage.patientBiologicalFatherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamilyPage.doesFatherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamilyPage.isPatientBiologicalFatherAbleToParticipateStudy().check('No');
    await tellUsAboutYourFamilyPage.doesNotHaveAnySiblings().check();
    await tellUsAboutYourFamilyPage.doesNotHaveAnyChildren().check();
    await tellUsAboutYourFamilyPage.doesNotHaveAnyOtherFamilyMembersAffectedByCondition().check();

    await tellUsAboutYourFamilyPage.iAgreeToMatchToResearchStudy().check();
    await tellUsAboutYourFamilyPage.iAgreeToBeContacted().check();
    await tellUsAboutYourFamilyPage.iUnderstand().check();

    await tellUsAboutYourFamilyPage.submit();

    const dashboard = new DashboardPage(page);
    await dashboard.waitForReady();

    const orderedHeaders = ['Form', 'Summary', 'Status', 'Actions'];
    const table = dashboard.getDashboardTable();
    const headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCell('Form', 'Tell us about your family', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Your application is complete. Thank you for applying!');

    const statusCell = await table.findCell('Form', 'Tell us about your family', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toContainText('Complete');

    const actionsCell = await table.findCell('Form', 'Tell us about your family', 'Actions');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(new Button(page, { root: actionsCell! })).toBeTruthy();

    await page.pause();
  });
});
