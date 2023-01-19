import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { Page } from '@playwright/test';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from '../../pages/dsm/home-page';
import ParticipantPage from '../../pages/dsm/participant-page';
import CohortTag from '../../lib/component/dsm/cohort-tag';
import Select from '../../lib/widget/select';
import { StudyNav } from '../../lib/component/dsm/navigation/enums/studyNav.enum';
import { Navigation } from '../../lib/component/dsm/navigation/navigation';

test.describe.parallel('', () => {
  let homePage: HomePage;
  let navigation: Navigation;
  let cohortTag: CohortTag;

  const studyNames = ['Brain', 'PanCan'];

  test.beforeEach(async ({ page }) => {
    await login(page);
    homePage = new HomePage(page);
    navigation =  new Navigation(page);
    cohortTag = new CohortTag(page);
  });

  for(let studyName of studyNames) {
    test(
      `Ensure cohort tags update and delete properly for ${studyName} @dsm @dsm-search @functional`,
      async ({ page }) =>
      {
        await new Select(page, { label: 'Select study' }).selectOption(studyName);

        /* Test Values */
        const currentDate = new Date().toLocaleString();
        const cohortTagValue_1 = `dsm_rc_${currentDate}_${studyName}`;
        const cohortTagValue_2 = `DSM RC ${studyName} ${currentDate}`;
        const cohortTagValue_3 = `${studyName} ${currentDate}`;
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


        await cohortTag.add(cohortTagValue_1);
        await cohortTag.delete(cohortTagValue_1);
        await cohortTag.add(cohortTagValue_2);
        await cohortTag.add(cohortTagValue_3);
        await participantPage.fillParticipantNotes(participantNoteValue);
        await page.reload();

        await participantListPage.assertPageTitle();

        await participantListPage.waitForReady();
        await participantListPage.filterMedicalRecordParticipants();
        await participantListPage.clickParticipantAt(1);

        await participantPage.assertPageTitle();
        await cohortTag.assertCohortTagToHaveCount(cohortTagValue_1, 0);
        await cohortTag.assertCohortTagToHaveCount(cohortTagValue_2, 1);

        await cohortTag.delete(`DSM RC ${studyName} ${currentDate}`);

        await cohortTag.assertCohortTagToHaveCount(`${studyName} ${currentDate}`, 1);

        await cohortTag.add(cohortTagValue_3);

        await cohortTag.assertCohortTagToHaveCount('Duplicate tag! Not saved!', 1);

        await participantPage.assertParticipantNotesToHaveCount(`This is a test note - ${currentDate}`);

        await participantPage.backToList();
        await participantListPage.selectParticipant();
        await participantListPage.addBulkCohortTags();
        await cohortTag.add(cohortTagValue_3);
        await cohortTag.submitAndExit();
        await participantListPage.clickParticipantAt(1);

        await cohortTag.assertCohortTagToHaveCount(cohortTagValue_3, 1);

        await cohortTag.delete(cohortTagValue_3);

        await cohortTag.assertCohortTagToHaveCount(cohortTagValue_3, 0);
    });
  }
});
