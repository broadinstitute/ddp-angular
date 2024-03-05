import { expect } from '@playwright/test';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import CohortTag from 'dsm/component/cohort-tag';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import * as crypto from 'crypto';
import { logInfo } from 'utils/log-utils';
import { CustomizeView, Label } from 'dsm/enums';

test.describe('Cohort tags', () => {
  let shortId: string;

  const studyNames = [StudyName.PANCAN];

  for (const studyName of studyNames) {
    test.beforeEach(async ({page}) => {
      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(studyName);
    });

    test(`Ensure cohort tags update and delete properly for @${studyName} @dsm @functional @cohort-tag`, async ({ page, request }) => {
      // Inspect network requests to find a Playwright test user that does not have any cohort tag
      await page.route('**/*', async (route, request): Promise<void> => {
        const regex = new RegExp(/applyFilter\?realm=.*&userId=.*&parent=participantList/i);
        if (request && !shortId && request.url().match(regex)) {
          logInfo(`Intercepting API request ${request.url()} for a E2E participant`);
          const response = await route.fetch({ timeout: 50000 });
          const json = JSON.parse(await response.text());

          for (const i in json.participants) {
            const participant = json.participants[i];
            const profile = participant.esData.profile;
            const participantShortId = profile.hruid;
            const dsmData = participant.esData.dsm;
            const cohortTag: string[] = dsmData?.cohortTag;

            if (!profile.firstName?.includes('E2E')) {
              continue;
            }
            if (cohortTag && Object.keys(cohortTag).length > 0) {
              continue; // cohort tags already exists
            }
            if (participantShortId) {
              shortId = participantShortId;
              break; // finished searching
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

      const participantListPage = await new Navigation(page, request).selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      // Apply filter in search for the right participant on Participant List page
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);

      // Search participant by Short ID
      logInfo(`Participant Short ID: ${shortId}`);
      await participantListPage.filterListByShortId(shortId);

      const participantListTable = participantListPage.participantListTable;
      let cohortTagName = await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME);
      expect(cohortTagName.length).toBe(0); // No Cohort Tags

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      await participantPage.assertPageTitle();

      const cohortTag = new CohortTag(page);
      await cohortTag.add(cohortTagValue1);
      await cohortTag.remove(cohortTagValue1);
      await cohortTag.add(cohortTagValue2);
      await cohortTag.add(cohortTagValue3);
      await participantPage.backToList();

      await participantListPage.waitForReady();

      // Open participant again to verify cohort tags
      await participantListPage.filterListByShortId(shortId);
      cohortTagName = await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME);
      expect(cohortTagName.length).toBeGreaterThan(1); // Cohort Tags exist
      await participantListTable.openParticipantPageAt(0);

      // Verify tags existence
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
      cohortTagName = await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME);
      expect(cohortTagName.length).toBe(0); // No more Cohort Tag
    });
  }
});
