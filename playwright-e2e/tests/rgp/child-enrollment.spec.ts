import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import * as user from 'data/fake-user.json';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import DashboardPage from 'pages/rgp/dashboard-page';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
import TellUsAboutYourFamilyPage from 'pages/rgp/enrollment/tell-us-about-your-family-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';
import { setAuth0UserEmailVerified } from 'utils/api-utils';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

test.describe('Child (under 18) Enrollment', () => {
  const assertProgressActiveItem = async (page: Page, itemName: string): Promise<void> => {
    const locator = page.locator('li.activity-stepper__step-container button.stepper-btn.stepper-btn--active');
    await expect(locator).toHaveCount(1);
    await expect(locator).toContainText(itemName);
  };

  test('Can complete application for a child @functional @enrollment @rgp @visual', async ({ page }) => {
    const child = user.child;
    const adult = user.adult;

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
    await expect(page.locator('#view__account-verification p:last-child')).toHaveText(
      'If you do not receive an email, contact us at raregenomes@broadinstitute.org.'
    );
    expect(await page.locator('#view__account-verification p:first-child').screenshot()).toMatchSnapshot('account-verification.png');

    // Verify user email by Auth0 API
    await setAuth0UserEmailVerified(APP.RGP, userEmail, { isEmailVerified: true });

    await auth.login(page, { email: userEmail });

    const tellUsAboutYourFamily = new TellUsAboutYourFamilyPage(page);
    await tellUsAboutYourFamily.waitForReady();

    await assertProgressActiveItem(page, '1');
    const content = page.locator('.ddp-content');
    await expect(content).toHaveCount(3);
    expect(await content.first().screenshot()).toMatchSnapshot('content-1.png');
    expect(await content.nth(1).screenshot()).toMatchSnapshot('content-2.png');
    expect(await content.nth(2).screenshot()).toMatchSnapshot('content-3.png');


    await tellUsAboutYourFamily.yourTitle().selectOption(adult.title);
    await tellUsAboutYourFamily.yourFirstName().fill(adult.firstName);
    await tellUsAboutYourFamily.phone().fill(adult.phone);
    await tellUsAboutYourFamily.confirmPhone().fill(adult.phone);
    await tellUsAboutYourFamily.patientRelationship().selectOption('MINOR_CHILD');
    await tellUsAboutYourFamily.state().toSelect().selectOption(adult.state.abbreviation);
    await tellUsAboutYourFamily.website().fill('https://en.wikipedia.org/wiki/Broad_Institute');
    await tellUsAboutYourFamily.describeGeneticCondition().fill('Single-gene disorders');
    await tellUsAboutYourFamily.haveAnyClinicalDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamily.clinicalDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamily.haveAnyGeneticDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamily.geneticDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().checkAndFillInInput('Doctor', { inputText: user.doctor.name });
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().check('Word of mouth');
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().check('Facebook');
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().check('Twitter');
    await tellUsAboutYourFamily.next();

    await assertProgressActiveItem(page, '2');

    await expect(page.locator('text="Please provide information on the patient:"')).toBeVisible();
    await expect(page.locator('ddp-activity-content p.SubHeading')).toHaveText(
        'This study requires that at least one individual in the family affected by the rare condition provide a DNA sample.'
    );
    const activityContent = page.locator('ddp-activity-content');
    await expect(activityContent).toHaveCount(3);
    expect(await activityContent.first().screenshot()).toMatchSnapshot('activity-content-1.png');
    expect(await activityContent.nth(1).screenshot()).toMatchSnapshot('activity-content-2.png');
    expect(await activityContent.nth(2).screenshot()).toMatchSnapshot('activity-content-3.png');


    await tellUsAboutYourFamily.patientAge().fill(child.age);
    await tellUsAboutYourFamily.patientAgeAtOnsetCondition().fill(child.age);
    await tellUsAboutYourFamily.patientSex().check(child.sex, { exactMatch: true });
    await tellUsAboutYourFamily.patientRace().toSelect('Select all that apply').selectOption('I prefer not to answer');
    await tellUsAboutYourFamily.patientEthnicity().check('I prefer not to answer');
    await tellUsAboutYourFamily.indicateTypesOfDoctors().toSelect('Select all that apply').selectOption('Pulmonologist');
    await tellUsAboutYourFamily.indicateAnyFollowingTest().check('Karyotype');
    await tellUsAboutYourFamily.indicateAnyFollowingTest().check('Single gene testing');
    await tellUsAboutYourFamily.indicateAnyBiopsiesAvailable().check('Bone Marrow Biopsy');
    await tellUsAboutYourFamily.indicateAnyBiopsiesAvailable().check('Skin Biopsy');
    await tellUsAboutYourFamily.indicateAnyBiopsiesAvailable().check('Muscle Biopsy');
    await tellUsAboutYourFamily.isPatientParticipatingInOtherResearchStudies().check('No');
    await tellUsAboutYourFamily.next();

    await assertProgressActiveItem(page, '3');
    await expect(page.locator('text="Please provide details on the patient\'s biological family:"')).toBeVisible();

    await tellUsAboutYourFamily.patientBiologicalMotherRace().toSelect('Select all that apply').selectOption('I prefer not to answer');
    await tellUsAboutYourFamily.patientBiologicalMotherEthnicity().check('I prefer not to answer');
    await tellUsAboutYourFamily.doesMotherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalMotherAbleToParticipateStudy().check('No');

    await tellUsAboutYourFamily.patientBiologicalFatherRace().toSelect('Select all that apply').selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamily.patientBiologicalFatherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamily.doesFatherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalFatherAbleToParticipateStudy().check('No');

    await tellUsAboutYourFamily.patientBiologicalSiblingSex().check('Female');
    await tellUsAboutYourFamily.patientBiologicalSiblingAge().fill('2');
    await tellUsAboutYourFamily.patientBiologicalSiblingRace().toSelect('Select all that apply').selectOption('I prefer not to answer');
    await tellUsAboutYourFamily.patientBiologicalSiblingEthnicity().check('I prefer not to answer');
    await tellUsAboutYourFamily.doesSiblingHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalSiblingAbleToParticipateStudy().check('No', { exactMatch: true });

    await tellUsAboutYourFamily.doesNotHaveAnyChildren().check();
    await tellUsAboutYourFamily.doesNotHaveAnyOtherFamilyMembersAffectedByCondition().check();

    await tellUsAboutYourFamily.iAgreeToMatchToResearchStudy().check();
    await tellUsAboutYourFamily.iAgreeToBeContacted().check();
    await tellUsAboutYourFamily.iUnderstand().check();

    await tellUsAboutYourFamily.submit();

    const dashboard = new DashboardPage(page);
    await dashboard.waitForReady();

    const dashboardMessage = page.locator('.infobox p');
    await expect(dashboardMessage).toHaveCount(2);
    expect(await dashboardMessage.nth(0).screenshot()).toMatchSnapshot('dashboard-info-message-1.png');
    expect(await dashboardMessage.nth(1).screenshot()).toMatchSnapshot('dashboard-info-message-2.png');

    const studyForms = page.locator('.user-activities');
    expect(await studyForms.screenshot()).toMatchSnapshot('dashboard-forms.png');

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
    const viewButton = table.findButtonInCell(actionsCell!, { label: 'View' });
    await expect(viewButton).toBeTruthy();
    // Make sure the View button in table cell is working by clicking it and checks page navigation
    await viewButton.click();
    await tellUsAboutYourFamily.waitForReady();
    // fields should be disabled. check one field to verify is disabled
    expect(await tellUsAboutYourFamily.yourTitle().isDisabled()).toEqual(true);
    expect(await tellUsAboutYourFamily.yourTitle().toQuestion().screenshot()).toMatchSnapshot('your-title-field-disabled.png');

    expect(await tellUsAboutYourFamily.yourFirstName().isDisabled()).toEqual(true);
  });
});
