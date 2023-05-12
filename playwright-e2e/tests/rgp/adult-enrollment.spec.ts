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
import { setPatientParticipantGuid } from 'utils/faker-utils';
import dsmHome from 'pages/dsm/home-page';
import * as dsmAuth from 'authentication/auth-dsm';
import Select from 'lib/widget/select';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import ParticipantListPage from 'pages/dsm/participantList-page';
import { StudyNav } from 'lib/component/dsm/navigation/enums/studyNav.enum';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD, DSM_USER_EMAIL, DSM_USER_PASSWORD } = process.env;

test.describe.serial('Adult Self Enrollment', () => {
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
    await expect(viewButton).toBeTruthy();
    // Make sure the View button in table cell is working by clicking it and checks page navigation
    await viewButton.click();
    await tellUsAboutYourFamily.waitForReady();
    // fields should be disabled. check one field to verify is disabled
    expect(await tellUsAboutYourFamily.yourTitle().isDisabled()).toEqual(true);
    expect(await tellUsAboutYourFamily.yourFirstName().isDisabled()).toEqual(true);
  });

  test('Go to DSM to verify the newly created account can be found @functional @rgp', async ({ page }) => {
    //Go to DSM to verify the newly created account can be found there
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);

    await participantListPage.assertPageTitle();

    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
  });

  test('Verify the display and functionality of family account dynamic fields @functional @rgp', async ({ page}) => {
    //Go into DSM
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);

    //Confirm the 'Add Family Member' button is visible
    const addFamilyMemberButton = await page.locator("//span[contains(text(), 'Add Family Member')]/preceding-sibling::button");
    await expect(addFamilyMemberButton).toBeVisible();

    //Confirm 'Family Notes' is present and functional
    await expect(page.getByRole('cell', { name: 'Family Notes' })).toBeVisible();
    const datetime = new Date();
    await page.getByRole('row', { name: 'Family Notes' }).getByRole('textbox').fill(`Random text by playwright test on: '${datetime}'`);

    //Confirm 'Seqr project' is present and functional
    await expect(page.getByRole('cell', { name: 'Seqr project' })).toBeVisible();
    await page.locator("//td[contains(text(), 'Seqr project')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'HMB Genome' }).click();

    //Confirm 'Specialty Project: R21' is present and functional
    await expect(page.getByRole('cell', { name: 'Specialty Project: R21' })).toBeVisible();
    await page.locator("//td[contains(text(), 'Specialty Project: R21')]/following-sibling::td/mat-checkbox").click();

    //Confirm 'Specialty Project: CAGI 2022' is present and functional
    await expect(page.getByRole('cell', { name: 'Specialty Project: CAGI 2022' })).toBeVisible();
    await page.locator("//td[contains(text(), 'Specialty Project: CAGI 2022')]/following-sibling::td/mat-checkbox").click();

    //Confirm 'Specialty Project: CAGI 2023' is present and functional
    await expect(page.getByRole('cell', { name: 'Specialty Project: CAGI 2023' })).toBeVisible();
    await page.locator("//td[contains(text(), 'Specialty Project: CAGI 2023')]/following-sibling::td/mat-checkbox").click();

    //Confirm 'Specialty Project: CZI' is present and functional
    await expect(page.getByRole('cell', { name: 'Specialty Project: CZI' })).toBeVisible();
    await page.locator("//td[contains(text(), 'Specialty Project: CZI')]/following-sibling::td/mat-checkbox").click();

    //Confirm 'Expected # to Sequence' is present and functional
    await expect(page.getByRole('cell', { name: 'Expected # to Sequence' })).toBeVisible();
    await page.locator("//td[contains(text(), 'Expected # to Sequence')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: '5' }).click();
  });

  test('Verify that the proband family member tab can be filled out @functional @rgp', async ({ page }) => {
    //Go into DSM
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);

    //Verify that the proband tab is present (and includes the text RGP and 3 as proband subject ids have the format RGP_{family id}_3)
    const probandTab = page.locator("//li//span[contains(text(), 'RGP') and contains(text(), '3')]");
    await expect(probandTab).toBeVisible();

    //Verify that the dynamic form menu is present
    const jumpToMenuText = page.getByRole('tabpanel').getByText('Jump to:');
    await expect(jumpToMenuText).toBeVisible();

    const participantInfoMenuLink = page.locator("//a[contains(text(), 'Participant Info')]");
    await expect(participantInfoMenuLink).toBeVisible();

    const contactInfoMenuLink = page.locator("//a[contains(text(), 'Contact Info')]");
    await expect(contactInfoMenuLink).toBeVisible();

    const studyStatusLink = page.locator("//a[contains(text(), 'Study Status')]");
    await expect(studyStatusLink).toBeVisible();

    const medicalRecordsLink = page.locator("//a[contains(text(), 'Medical records')]");
    await expect(medicalRecordsLink).toBeVisible();

    const primarySampleLink = page.locator("//a[contains(text(), 'Primary Sample')]");
    await expect(primarySampleLink).toBeVisible();

    const tissueLink = page.locator("//a[text()='Tissue']");
    await expect(tissueLink).toBeVisible();

    const rorLink = page.locator("//a[contains(text(), 'ROR')]");
    await expect(rorLink).toBeVisible();

    const surveyLink = page.locator("//a[text()='Survey']");
    await expect(surveyLink).toBeVisible();

    //Fill out Participant Info section
    await page.locator("//button[contains(text(), 'Participant Info')]").click();

    //Confirm that the same family id is used between proband tab, subject id field, family id field
    const probandSubjectID = page.getByPlaceholder('Subject ID');
    const probandFamilyID = page.getByPlaceholder('Family ID');

    //Confirm that input entered in Important Notes and Process Notes is saved
    await page.getByPlaceholder('Important Notes').fill('Testing notes here - Important Notes');
    await page.getByPlaceholder('Process Notes').fill('Testing notes here - Process Notes');

    const probandFirstName = page.locator("//td[contains(text(), 'First Name')]/following-sibling::td//div/input[@data-placeholder='First Name']");
    await probandFirstName.fill(user.patient.firstName);

    const probandMiddleName = page.locator("//input[@data-placeholder='Middle Name']");
    await probandMiddleName.fill(user.patient.middleName);

    const probandLastName = page.locator("//td[contains(text(), 'Last Name')]/following-sibling::td//div/input[@data-placeholder='Last Name']");
    await probandLastName.fill(user.patient.lastName);

    await page.locator("//input[@data-placeholder='Name Suffix']").fill('junior');

    await page.locator("//td[contains(text(), 'Preferred Language')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'Spanish' }).click();

    await page.locator("//td[contains(text(), 'Sex')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'Female' }).click();

    await page.locator("//td[contains(text(), 'Pronouns')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'they/them' }).click();

    //section for Participant Info -> DOB

    //section for Participant Info -> Age Today; check that the age automatically calculagted and inputted into
    //Age Today field is the the correct age given the age inputted in DOB field

    //The default value for Participant Info -> Alive/Deceased is an Alive status
    const probandIsAliveStatus = page.getByRole('radio', { name: 'Alive' });
    await expect(probandIsAliveStatus).toBeChecked();

    //The default value in the proband tab should be 'Self' (the proband is the main person in the study)
    const relationshipToProband = page.locator("//td[contains(text(), 'Relationship to Proband')]/following-sibling::td/mat-select");
    await expect(relationshipToProband).toHaveText('Self');

    await page.locator("//td[contains(text(), 'Affected Status')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'Uncertain' }).click();

    await page.locator("//td[contains(text(), 'Race')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'Black or African American' }).click();

    await page.locator("//td[contains(text(), 'Ethnicity')]/following-sibling::td/mat-select").click();
    await page.locator("//div[@role='listbox']").locator('//mat-option').filter({ hasText: 'Unknown or Not Reported' }).click();

    await page.getByPlaceholder('Mixed Race Notes').fill('Testing notes here - Mixed Race Notes');

    //Fill out Contact Info section
    await page.locator("//button[contains(text(), 'Contact Info')]").click();

    //Fill out Study Status section
    await page.locator("//button[contains(text(), 'Study Status')]").click();

    //Fill out Medical records section
    await page.locator("//button[contains(text(), 'Medical record')]").click();

    //Fill out Primary Sample section
    await page.locator("//button[contains(text(), 'Primary Sample')]").click();

    //Fill out Tissue section
    await page.locator("//button[contains(text(), 'Tissue')]").click();

    //Fill out ROR section
    await page.locator("//button[contains(text(), 'ROR')]").click();

    //Fill out Survey section
    await page.locator("//button[contains(text(), 'Survey')]").click();
  });
});
