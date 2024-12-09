import { test } from 'fixtures/dsm-fixture';
import { expect } from '@playwright/test';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, CustomizeViewID, DataFilter, Label } from 'dsm/enums';
import { updateAuth0UserPassword } from 'utils/api-utils';
import { APP } from 'data/constants';
import HomePage from 'dss/pages/osteo/home-page';
import { fillSitePassword } from 'utils/test-utils';
import { login } from 'authentication/auth-osteo';
import ResearchConsentFormPage from 'dss/pages/osteo/research-consent-page';
import * as user from 'data/fake-user.json';
import ConsentAddendumPage from 'dss/pages/osteo/consent-addendump-page';
import SurveyAboutOsteoPage from 'dss/pages/osteo/survey-about-osteo-page';
import { generateUserName } from 'utils/faker-utils';
import SurveyAboutYou from 'dss/pages/osteo/survey-about-you';
import DashboardPage, { DashboardActivity } from 'dss/pages/dashboard-page';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import { ActivityVersion, SurveyName } from 'dsm/component/tabs/enums/survey-data-enum';

test.describe.serial(`Reconsent an OS1 participant into OS2`, () => {
  const PARTICIPANT_PASSWORD = process.env.OSTEO_USER_PASSWORD as string;
  const OSTEO_BASE_URL = process.env.OSTEO_BASE_URL as string;

  let navigation: Navigation;
  let shortID: string;
  let participantEmail: string;

  test(`OS1: Re-consent workflow`, async ({ page, request }) => {
    await test.step('Choose an OS1 participant to re-consent', async () => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();
      shortID = await findOS1ParticipantWhoHasNotReconsented(participantListPage);

      const participantListTable = participantListPage.participantListTable;
      const participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
      await participantPage.waitForReady();
      participantEmail = await participantPage.getEmail();
      expect(participantEmail).toBeTruthy();
      console.log(`Participant email is: ${participantEmail}`);
      console.log(`Participant password is: ${PARTICIPANT_PASSWORD}\n`);
    });

    await test.step('Update their passsword so that they can be logged into', async () => {
      await updateAuth0UserPassword(APP.CMI, participantEmail, PARTICIPANT_PASSWORD);
    });

    await test.step('Re-consent to OS2 / OS PE-CGS', async () => {
      //Playwright general participant test info
      const firstName = generateUserName('OS1-to-OS2');
      const lastName = user.patient.lastName;
      const participantFullName = user.patient.fullName;
      const birthMonth = user.patient.birthDate.MM;
      const birthDate = user.patient.birthDate.DD;
      const birthYear = user.patient.birthDate.YYYY;

      await page.goto(OSTEO_BASE_URL);
      await fillSitePassword(page);

      const homePage = new HomePage(page);
      await homePage.waitForReady();
      await login(page, { email: participantEmail, password: PARTICIPANT_PASSWORD });

      const researchConsentPage = new ResearchConsentFormPage(page, 'adult');
      await researchConsentPage.waitForReady(); //Currently in 1. Key Points
      await researchConsentPage.next(); //Currently in 2. Full Form
      await researchConsentPage.next(); //Currently in 3. Sign Consent
      await researchConsentPage.assertCurrentResearchConsentSection('3. Sign Consent');
      await researchConsentPage.agreeToDrawBloodSamples();
      await researchConsentPage.requestStoredSamples();
      await researchConsentPage.fillInName(firstName, lastName);
      await researchConsentPage.fillInDateOfBirth(birthMonth, birthDate, birthYear);
      await researchConsentPage.fillInContactAddress({ fullName: participantFullName });
      await researchConsentPage.submit();

      const consentAddendumPage = new ConsentAddendumPage(page);
      await consentAddendumPage.waitForReady();
      await consentAddendumPage.clickAgreeToShareAvailableResults({ response: 'Yes' });
      await consentAddendumPage.signature().fill(participantFullName);
      await consentAddendumPage.submit();

      //TODO - update so that when the fix for PEPPER-242 is done, it is also taken into account
      const aboutYourOsteoPage = new SurveyAboutOsteoPage(page);
      await aboutYourOsteoPage.next();
      await aboutYourOsteoPage.fillInDiagnosedDate('January', '1989');
      await aboutYourOsteoPage.chooseTimeframe('0-6 months before diagnosis');
      await aboutYourOsteoPage.initialBodyLocation().check('Upper arm (humerus)');
      await aboutYourOsteoPage.currentBodyLocation().check('Upper arm (humerus)');
      await aboutYourOsteoPage.hadRadiationAsTreatment().check('Yes');
      await aboutYourOsteoPage.hadReceivedTherapies().check('Sorafenib');
      await aboutYourOsteoPage.hasEverRelapsed().check('No', { exactMatch: true });
      await aboutYourOsteoPage.isCurrentlyBeingTreated().check('No', { exactMatch: true });
      await aboutYourOsteoPage.haveOtherCancer().check('No', { exactMatch: true });
      await aboutYourOsteoPage.submit();

      const aboutYouPage = new SurveyAboutYou(page);
      await aboutYouPage.sexAssignedAtBirth().check('Female');
      await aboutYouPage.genderIdentity().check('Woman');
      await aboutYouPage.raceQuestion().check('Prefer not to answer');
      await aboutYouPage.tellUsAboutYourselfOrYourCancer().fill('Test notes here');
      await aboutYouPage.howDidYouHearAboutProject().check('Social media');
      await aboutYouPage.howOftenHelpReceivedForHospitalMaterials().check('Some of the time');
      await aboutYouPage.howOftenDifficultyUnderstandingMedicalCondition().check('A little of the time');
      await aboutYouPage.howConfidentCompletingForms().check('Always');
      await aboutYouPage.highestLevelOfSchoolingCompleted().check('College graduate');
      await aboutYouPage.langaugeSpokenAtHome().check('English');
      await aboutYouPage.submit();
    });

    await test.step('Verify that the participant now has 2 consents in the DSS dashabord', async () => {
      const dashboardPage = new DashboardPage(page);
      const researchConsentButtons = dashboardPage.getActivity(DashboardActivity.RESEARCH_CONSENT);
      await expect(researchConsentButtons).toHaveCount(2);
    });
  });

  test(`DSM -> OS2: Verify the participant has an OS1 consent and an OS2 consent`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    await participantListPage.filterListByShortId(shortID);

    const participantListTable = participantListPage.participantListTable;
    const numberOfRows = await participantListTable.rowsCount;
    expect(numberOfRows).toBe(1);

    const participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
    await participantPage.waitForReady();

    const surveyDataTab = new SurveyDataTab(page);

    /**
     * Note: os1-to-os2-display-verification.spec.ts already checks the re-consented ptps do not have OS2 activities in DSM -> OS1
     * Checking below for the expected DSM -> OS2 consent-related activties displayed in Participant Page
     */

    const initialConsentActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.RESEARCH_CONSENT_FORM,
      activityVersion: ActivityVersion.ONE
    });
    await initialConsentActivity.scrollIntoViewIfNeeded();
    await expect(initialConsentActivity).toBeVisible();

    const reConsentActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.RESEARCH_CONSENT_FORM,
      activityVersion: ActivityVersion.THREE
    });
    await reConsentActivity.scrollIntoViewIfNeeded();
    await expect(reConsentActivity).toBeVisible();

    const consentAddendumActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.CONSENT_ADDENDUM,
      activityVersion: ActivityVersion.THREE
    });
    await consentAddendumActivity.scrollIntoViewIfNeeded();
    await expect(consentAddendumActivity).toBeVisible();
  });
});

async function findOS1ParticipantWhoHasNotReconsented(participantList: ParticipantListPage): Promise<string> {
  //Find OS1 participants that do not have the 'OS PE-CGS' cohort tag -> use Playwright-created OS1 participants, who all have status of Registered
  const customizeViewPanel = participantList.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.openColumnGroup({ columnSection: CustomizeView.COHORT_TAGS, stableID: CustomizeViewID.COHORT_TAG });
  await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
  await customizeViewPanel.closeColumnGroup({ columnSection: CustomizeView.COHORT_TAGS, stableID: CustomizeViewID.COHORT_TAG });
  await customizeViewPanel.close();

  const searchPanel = participantList.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.text(Label.FIRST_NAME, { textValue: 'OS1', additionalFilters: [DataFilter.EXACT_MATCH], exactMatch: false });
  await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.REGISTERED] });
  await searchPanel.search({ uri: 'filterList' });

  const participantListTable = participantList.participantListTable;
  const numberOfReturnedParticipants = await participantListTable.rowsCount;
  expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);
  console.log(`Current page shows ${numberOfReturnedParticipants} participants`);
  await participantListTable.changeRowCount(50);

  const shortID = await participantListTable.getCellDataForColumn(Label.SHORT_ID, 1);
  const participantCohortTags = await participantListTable.getCellDataForColumn(Label.COHORT_TAG_NAME, 1);
  expect(participantCohortTags).not.toContain(`OS PE-CGS`);
  expect(participantCohortTags).toContain(`OS`);
  console.log(`Chosen short id: ${shortID}`);

  //Return the participant
  return shortID;
}
