import { expect } from '@playwright/test';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import CohortTag from 'dsm/component/cohort-tag';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import * as crypto from 'crypto';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';

test.describe('Cohort tags', () => {
  let shortId: string;

  const studyNames = [StudyEnum.PANCAN];

  for (const studyName of studyNames) {
    test.beforeEach(async ({page}) => {
      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(studyName);
    });

    test(`Ensure cohort tags update and delete properly for ${studyName} @dsm @functional`, async ({ page, request }) => {
      // Inspect network requests to find a Playwright test user that does not have any cohort tag and notes
      await page.route('**/*', async (route, request): Promise<void> => {
        if (!shortId) {
          // only search for shortId one time to avoid duplicated searching
          let participantShortId;
          const regex = new RegExp(/(applyFilter|filterList)\?realm=.*&parent=participantList/i);
          if (request.url().match(regex)) {
            const response = await route.fetch();
            const json = JSON.parse(await response.text());
            for (const i in json.participants) {
              const profile = json.participants[i].esData.profile;
              if (!profile.firstName.includes('E2E')) {
                continue;
              }
              participantShortId = profile.hruid;
              const dsmData = json.participants[i].esData.dsm;
              if (dsmData['cohortTag']?.length > 0) {
                participantShortId = null; // cohort tags already exists
              }
              if (dsmData.participant['notes']?.length > 0) {
                participantShortId = null; // notes already exists
              }
              if (participantShortId) {
                shortId = participantShortId;
                break; // finished searching
              }
            }
          }
        }
        return route.continue();
      });

      /* Test Values */
      const uuid = crypto.randomUUID().toString().replace('-', '').substring(0, 6);
      const cohortTagValue1 = `tag1-${uuid}`;
      const cohortTagValue2 = `tag2-${uuid}`;
      const cohortTagValue3 = `tag3-${uuid}`;
      const notes = `Test note ${studyName}-${uuid}`;

      const participantListPage = await new Navigation(page, request).selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      // Apply filter in search for the right participant on Participant List page
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Cohort Tags Columns', ['Cohort Tag Name']);

      // Search participant by Short ID
      // console.log(`Participant Short ID: ${shortId}`);
      await participantListPage.filterListByShortId(shortId);

      const participantListTable = participantListPage.participantListTable;
      let cohortTagColumn = await participantListTable.getParticipantDataAt(0, 'Cohort Tag Name');
      expect(cohortTagColumn.length).toBe(0); // No Cohort Tags

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      await participantPage.assertPageTitle();

      const cohortTag = new CohortTag(page);
      await cohortTag.add(cohortTagValue1);
      await cohortTag.remove(cohortTagValue1);
      await cohortTag.add(cohortTagValue2);
      await cohortTag.add(cohortTagValue3);
      await participantPage.fillNotes(notes);
      await participantPage.backToList();

      await participantListPage.assertPageTitle();
      await participantListPage.waitForReady();

      // Open participant again to verify cohort tags
      await participantListPage.filterListByShortId(shortId);
      cohortTagColumn = await participantListTable.getParticipantDataAt(0, 'Cohort Tag Name');
      expect(cohortTagColumn.length).toBeGreaterThan(1); // Cohort Tags exist
      await participantListTable.openParticipantPageAt(0);

      // Verify tags and note existence
      await participantPage.assertNotesToBe(notes);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue1, 0);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue2, 1);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      // Cannot add new tag which already exist
      await cohortTag.add(cohortTagValue3, false);
      await cohortTag.assertDuplicateCohortTagMessage();

      await participantPage.backToList();
      await participantListTable.selectCheckboxForParticipantAt(0);
      await participantListPage.addBulkCohortTags();
      await cohortTag.add(cohortTagValue3, false);
      await cohortTag.submitAndExit();

      await participantListTable.openParticipantPageAt(0);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.remove(cohortTagValue2);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue2, 0);

      await cohortTag.remove(cohortTagValue3);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 0);

      await participantPage.backToList();
      cohortTagColumn = await participantListTable.getParticipantDataAt(0, 'Cohort Tag Name');
      expect(cohortTagColumn.length).toBe(0); // No more Cohort Tag
    });
  }
});
