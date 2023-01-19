import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { Page } from '@playwright/test';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from '../../../pages/dsm/home-page';
import ParticipantPage from '../../../pages/dsm/participant-page';
import CohortTag from '../../../lib/component/dsm/cohort-tag';
import Select from '../../../lib/widget/select';
import { StudyNav } from '../../../lib/component/dsm/navigation/enums/studyNav.enum';
import { Navigation } from '../../../lib/component/dsm/navigation/navigation';

test.describe.parallel('Participant Page DSM', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Ensure cohort tags update and delete properly for Brain @dsm @dsm-search @functional', async ({ page }) => {
    await cohortTagTest('Brain', page);
  });

  test('Ensure cohort tags update and delete properly for PanCan @dsm @dsm-search @functional', async ({ page }) => {
    await cohortTagTest('PanCan', page);
  });
});

async function cohortTagTest(studyName: string, page: Page) {
  const currentDate = new Date().toLocaleString();

  await new Select(page, { label: 'Select study' }).selectOption(studyName);
  const navigation = new Navigation(page);
  const homePage = new HomePage(page);
  const cohortTag = new CohortTag(page);

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

  await cohortTag.add(`dsm_rc_${currentDate}_${studyName}`);
  await cohortTag.delete(`text=dsm_rc_${currentDate}_${studyName}`);
  await cohortTag.add(`DSM RC ${studyName} ${currentDate}`);
  await cohortTag.add(`${studyName} ${currentDate}`);
  await participantPage.fillParticipantNotes(`This is a test note - ${currentDate}`);

  await page.reload();

  await participantListPage.assertPageTitle();
  await participantListPage.waitForReady();
  await participantListPage.filterMedicalRecordParticipants();
  await participantListPage.clickParticipantAt(1);

  await participantPage.assertPageTitle();

  await cohortTag.assertCohortTagToHaveCount(`text=dsm_rc_${currentDate}_${studyName}`, 0);
  await cohortTag.assertCohortTagToHaveCount(`text=DSM RC ${studyName} ${currentDate}`, 1);
  await cohortTag.delete(`text=DSM RC ${studyName} ${currentDate}`);

  await cohortTag.assertCohortTagToHaveCount(`text=${studyName} ${currentDate}`, 1);

  await cohortTag.add(`${studyName} ${currentDate}`);

  await cohortTag.assertCohortTagToHaveCount('text=Duplicate tag! Not saved!', 1);

  await participantPage.assertParticipantNotesToHaveCount(`This is a test note - ${currentDate}`);
  await participantPage.backToList();

  await participantListPage.selectParticipant();
  await participantListPage.addBulkCohortTags();

  await cohortTag.add(`${studyName} ${currentDate}`);
  await cohortTag.submitAndExit();

  await participantListPage.clickParticipantAt(1);

  await cohortTag.assertCohortTagToHaveCount(`text=${studyName} ${currentDate}`, 1);

  await cohortTag.delete(`text=${studyName} ${currentDate}`);

  await cohortTag.assertCohortTagToHaveCount(`text=${studyName} ${currentDate}`, 0);
}
