import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from 'pages/dsm/home-page';
import ParticipantPage from 'pages/dsm/participant-page';
import CohortTag from 'lib/component/dsm/cohort-tag';
import Select from 'lib/widget/select';
import { StudyNav } from 'lib/component/dsm/navigation/enums/studyNav.enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';

test.describe.parallel('', () => {
  let homePage: HomePage;
  let navigation: Navigation;
  let cohortTag: CohortTag;

  const studyNames = ['Brain', 'PanCan'];

  test.beforeEach(async ({ page }) => {
    await login(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
    cohortTag = new CohortTag(page);
  });

  for (const studyName of studyNames) {
    test(`Ensure cohort tags update and delete properly for ${studyName} @dsm @dsm-search @functional`, async ({ page }) => {
      await new Select(page, { label: 'Select study' }).selectOption(studyName);

      /* Test Values */
      const currentDate = new Date().toLocaleString();
      const cohortTagValue1 = `dsm_rc_${currentDate}_${studyName}`;
      const cohortTagValue2 = `DSM RC ${studyName} ${currentDate}`;
      const cohortTagValue3 = `${studyName} ${currentDate}`;
      const participantNoteValue = `This is a test note - ${currentDate}`;

      /* Step-By-Step navigation through the website and making assertions as needed */
      await homePage.assertWelcomeTitle();
      await homePage.assertSelectedStudyTitle(studyName);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);

      await participantListPage.assertPageTitle();

      await participantListPage.waitForReady();
      await participantListPage.filterMedicalRecordParticipants();
      await participantListPage.waitForReady();

      await participantListPage.assertParticipantsCountGreaterOrEqual(1);

      const participantPage: ParticipantPage = await participantListPage.clickParticipantAt(1);

      await participantPage.assertPageTitle();

      await cohortTag.add(cohortTagValue1);
      await cohortTag.delete(cohortTagValue1);
      await cohortTag.add(cohortTagValue2);
      await cohortTag.add(cohortTagValue3);
      await participantPage.fillParticipantNotes(participantNoteValue);
      await page.reload();

      await participantListPage.assertPageTitle();

      await participantListPage.waitForReady();
      await participantListPage.filterMedicalRecordParticipants();
      await participantListPage.clickParticipantAt(1);

      await participantPage.assertPageTitle();
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue1, 0);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue2, 1);

      await cohortTag.delete(`DSM RC ${studyName} ${currentDate}`);

      await cohortTag.assertCohortTagToHaveCount(`${studyName} ${currentDate}`, 1);

      await cohortTag.add(cohortTagValue3);

      await cohortTag.assertCohortTagToHaveCount('Duplicate tag! Not saved!', 1);

      await participantPage.assertParticipantNotesToHaveCount(`This is a test note - ${currentDate}`);

      await participantPage.backToList();
      await participantListPage.selectParticipant();
      await participantListPage.addBulkCohortTags();
      await cohortTag.add(cohortTagValue3);
      await cohortTag.submitAndExit();
      await participantListPage.clickParticipantAt(1);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.delete(cohortTagValue3);

      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 0);
    });
  }
});