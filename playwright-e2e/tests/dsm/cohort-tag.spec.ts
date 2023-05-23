import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import HomePage from 'dsm/pages/home-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import CohortTag from 'dsm/component/cohort-tag';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import * as crypto from 'crypto';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';

test.describe.skip('Cohort tags', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;
  let cohortTag: CohortTag;

  const studyNames = [StudyEnum.BRAIN, StudyEnum.PANCAN];

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page, request);
    cohortTag = new CohortTag(page);
  });

  for (const studyName of studyNames) {
    test(`Ensure cohort tags update and delete properly for ${studyName} @dsm @functional`, async ({ page }) => {
      await welcomePage.selectStudy(studyName);

      /* Test Values */
      const cohortTagValue1 = `1_${studyName}-${crypto.randomUUID().toString().substring(0, 10)}`;
      const cohortTagValue2 = `2_${studyName}-${crypto.randomUUID().toString().substring(0, 10)}`;
      const cohortTagValue3 = `3_${studyName}-${crypto.randomUUID().toString().substring(0, 10)}`;
      const participantNoteValue = `This is a test note_${studyName}-${crypto.randomUUID()}`;

      /* Step-By-Step navigation through the website and making assertions as needed */
      await homePage.assertWelcomeTitle();
      await homePage.assertSelectedStudyTitle(studyName);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;
      const participantListTable = participantListPage.participantListTable;

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

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);

      await participantPage.assertPageTitle();

      await cohortTag.add(cohortTagValue1);
      await cohortTag.remove(cohortTagValue1);
      await cohortTag.add(cohortTagValue2);
      await cohortTag.add(cohortTagValue3);
      await participantPage.fillNotes(participantNoteValue);
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

      await participantListTable.openParticipantPageAt(0);

      await participantPage.assertPageTitle();
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue1, 0);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue2, 1);

      await cohortTag.remove(cohortTagValue2);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.add(cohortTagValue3, false);

      await cohortTag.assertDuplicateCohortTagMessage();

      await participantPage.assertNotesToBe(participantNoteValue);

      await participantPage.backToList();
      await participantListTable.selectCheckboxForParticipantAt(0);
      await participantListPage.addBulkCohortTags();
      await cohortTag.add(cohortTagValue3, false);
      await cohortTag.submitAndExit();
      await participantListTable.openParticipantPageAt(0);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.remove(cohortTagValue3);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 0);
    });
  }
});
