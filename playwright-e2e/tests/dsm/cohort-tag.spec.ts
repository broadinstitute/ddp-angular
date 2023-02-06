import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from 'pages/dsm/home-page';
import ParticipantPage from 'pages/dsm/participant-page';
import CohortTag from 'lib/component/dsm/cohort-tag';
import { StudyNav } from 'lib/component/dsm/navigation/enums/studyNav.enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import * as crypto from 'crypto';
import { AdditionalFilter } from 'lib/component/dsm/filters/sections/search/search-enums';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { Study } from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';

/**
 * @TODO
 * 1. Reimplement cohort tag functionality
 * 2. Reimplement participant list functionalities
 * 3. refactor code
 * 4. have frequently used filters or other functions made simple
 */
test.describe.parallel('', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;
  let cohortTag: CohortTag;

  const studyNames = [Study.BRAIN, Study.PANCAN];

  test.beforeEach(async ({ page }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
    cohortTag = new CohortTag(page);
  });

  for (const studyName of studyNames) {
    test(`Ensure cohort tags update and delete properly for ${studyName} @dsm @dsm-search @functional`, async ({ page }) => {
      await welcomePage.selectStudy(studyName);

      /* Test Values */
      const cohortTagValue1 = `dsm_1_${studyName}-${crypto.randomUUID()}`;
      const cohortTagValue2 = `dsm_2_${studyName}-${crypto.randomUUID()}`;
      const cohortTagValue3 = `dsm_3_${studyName}-${crypto.randomUUID()}`;
      const participantNoteValue = `This is a test note_${studyName}-${crypto.randomUUID()}`;

      /* Step-By-Step navigation through the website and making assertions as needed */
      await homePage.assertWelcomeTitle();
      await homePage.assertSelectedStudyTitle(studyName);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      await participantListPage.assertPageTitle();

      await participantListPage.waitForReady();

      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Medical Record Columns', ['Initial MR Received']);
      await customizeViewPanel.selectColumns('Participant Columns', ['Status']);

      await searchPanel.open();
      await searchPanel.dates('Initial MR Received', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
      await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
      await searchPanel.search();

      await participantListPage.waitForReady();

      await participantListPage.assertParticipantsCountGreaterOrEqual(1);

      const participantPage: ParticipantPage = await participantListPage.clickParticipantAt(0);

      await participantPage.assertPageTitle();

      await cohortTag.add(cohortTagValue1);
      await cohortTag.remove(cohortTagValue1);
      await cohortTag.add(cohortTagValue2);
      await cohortTag.add(cohortTagValue3);
      await participantPage.fillParticipantNotes(participantNoteValue);
      await page.reload();

      await participantListPage.assertPageTitle();

      await participantListPage.waitForReady();

      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Medical Record Columns', ['Initial MR Received']);
      await customizeViewPanel.selectColumns('Participant Columns', ['Status']);

      await searchPanel.open();
      await searchPanel.dates('Initial MR Received', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
      await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
      await searchPanel.search();

      await participantListPage.clickParticipantAt(0);

      await participantPage.assertPageTitle();
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue1, 0);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue2, 1);

      await cohortTag.remove(cohortTagValue2);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.add(cohortTagValue3);

      await cohortTag.assertDuplicateCohortTagMessage();

      await participantPage.assertParticipantNotesToHaveCount(participantNoteValue);

      await participantPage.backToList();
      await participantListPage.selectParticipant();
      await participantListPage.addBulkCohortTags();
      await cohortTag.add(cohortTagValue3);
      await cohortTag.submitAndExit();
      await participantListPage.clickParticipantAt(0);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.remove(cohortTagValue3);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 0);
    });
  }
});
