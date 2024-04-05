import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import * as user from 'data/fake-user.json';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import DashboardPage from 'dss/pages/rgp/dashboard-page';
import HowItWorksPage from 'dss/pages/rgp/how-it-works-page';
import TellUsAboutYourFamilyPage from 'dss/pages/rgp/enrollment/tell-us-about-your-family-page';
import TellUsYourStoryPage, { WHO } from 'dss/pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'dss/pages/rgp/home-page';
import { setAuth0UserEmailVerified } from 'utils/api-utils';
import { setPatientParticipantGuid } from 'utils/faker-utils';
import { login } from 'authentication/auth-dsm';
import Select from 'dss/component/select';
import { Navigation, Study } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

test.describe.serial('Adult Self Enrollment', () => {
  const assertProgressActiveItem = async (page: Page, itemName: string): Promise<void> => {
    const locator = page.locator('li.activity-stepper__step-container button.stepper-btn.stepper-btn--active');
    await expect(locator).toHaveCount(1);
    await expect(locator).toContainText(itemName);
  };

  test('Can complete application @functional @dss @rgp', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickGetStarted();

    const howItWorks = new HowItWorksPage(page);
    await howItWorks.startApplication();

    const tellUsYourStoryPage = new TellUsYourStoryPage(page);
    await tellUsYourStoryPage.waitForReady();
    // Check all checkboxes
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
    await setAuth0UserEmailVerified(APP.RGP, userEmail, { isEmailVerified: true });

    await auth.login(page, { email: userEmail });

    const tellUsAboutYourFamily = new TellUsAboutYourFamilyPage(page);
    await setPatientParticipantGuid(page);
    await tellUsAboutYourFamily.waitForReady();
    await assertProgressActiveItem(page, '1');

    await tellUsAboutYourFamily.yourTitle().selectOption(user.patient.title);
    await tellUsAboutYourFamily.yourFirstName().fill(user.patient.firstName);
    await tellUsAboutYourFamily.phone().fill(user.patient.phone);
    await tellUsAboutYourFamily.confirmPhone().fill(user.patient.phone);
    await tellUsAboutYourFamily.patientRelationship().selectOption('MYSELF');
    await tellUsAboutYourFamily.state().toSelect().selectOption(user.patient.state.abbreviation);
    await tellUsAboutYourFamily.website().fill('https://en.wikipedia.org/wiki/Broad_Institute');
    await tellUsAboutYourFamily.describeGeneticCondition().fill('Single-gene disorders');
    await tellUsAboutYourFamily.haveAnyClinicalDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamily.clinicalDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamily.haveAnyGeneticDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamily.geneticDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().checkAndFillInInput('Doctor', { inputText: user.doctor.name });
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().check('Twitter');
    await tellUsAboutYourFamily.next();

    await assertProgressActiveItem(page, '2');
    await expect(page.locator('text="Please provide information on the patient:"')).toBeVisible();
    await expect(page.locator('ddp-activity-content p.SubHeading')).toHaveText(
      'This study requires that at least one individual in the family affected by the rare condition provide a DNA sample.'
    );

    await tellUsAboutYourFamily.patientAge().fill(user.patient.age);
    await tellUsAboutYourFamily.patientAgeAtOnsetCondition().fill(user.patient.age);
    await tellUsAboutYourFamily.patientSex().check(user.patient.sex, { exactMatch: true });
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

    await tellUsAboutYourFamily.patientBiologicalMotherRace().toSelect('Select all that apply').selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamily.patientBiologicalMotherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamily.doesMotherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalMotherAbleToParticipateStudy().check('No');

    await tellUsAboutYourFamily.patientBiologicalFatherRace().toSelect('Select all that apply').selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamily.patientBiologicalFatherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamily.doesFatherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalFatherAbleToParticipateStudy().check('No');
    await tellUsAboutYourFamily.doesNotHaveAnySiblings().check();
    await tellUsAboutYourFamily.doesNotHaveAnyChildren().check();
    await tellUsAboutYourFamily.doesNotHaveAnyOtherFamilyMembersAffectedByCondition().check();

    await tellUsAboutYourFamily.iAgreeToMatchToResearchStudy().check();
    await tellUsAboutYourFamily.iAgreeToBeContacted().check();
    await tellUsAboutYourFamily.iUnderstand().check();

    await tellUsAboutYourFamily.submit();

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
    const viewButton = table.findButtonInCell(actionsCell!, { label: 'View' });
    expect(viewButton).toBeTruthy();
    // Make sure the View button in table cell is working by clicking it and checks page navigation
    await viewButton.click();
    await tellUsAboutYourFamily.waitForReady();
    // fields should be disabled. check one field to verify is disabled
    expect(await tellUsAboutYourFamily.yourTitle().isDisabled()).toBe(true);
    expect(await tellUsAboutYourFamily.yourFirstName().isDisabled()).toBe(true);
  });

  test('Go to DSM to verify the newly created account can be found @dss @functional @rgp', async ({ page, request }) => {
    //Go to DSM to verify the newly created account can be found there
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const participantListTable = participantListPage.participantListTable;

    await expect(async () => {
      await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
      //Make sure the newly created participant can be found and it's participant page can be accessed
      const participantListRowCount = await participantListTable.rowsCount;
      expect(participantListRowCount).toBe(1);
    }).toPass({
      intervals: [10_000],
      timeout: 120_000
    });

    await participantListTable.openParticipantPageAt(0);
    await expect(page.getByRole('heading', { name: 'Participant Page' })).toBeVisible();
    await expect(page.getByRole('cell', { name: user.patient.participantGuid })).toBeVisible();
  });
});
