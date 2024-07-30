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
import { totalNumberOfOccurences } from 'utils/test-utils';

test.describe('Cohort tags', () => {
  let shortId: string;

  const studyNames = [StudyName.PANCAN];
  const greetingTag = 'Hi';

  for (const studyName of studyNames) {
    test.beforeEach(async ({page}) => {
      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(studyName);
    });

    test(`Ensure cohort tags update and delete properly for @${studyName} @dsm @functional @cohort-tag`, async ({ page, request }) => {
      // Inspect network requests to find a Playwright test user that does not have any cohort tag
      await page.route('**/*', async (route, request): Promise<void> => {
        const regex = new RegExp(/filterList/i);
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
      await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.REGISTRATION_DATE]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.FIRST_NAME, { textValue: 'E2E' });
      await searchPanel.search();

      // Search participant by Short ID
      logInfo(`Participant Short ID: ${shortId}`);
      await participantListPage.filterListByShortId(shortId);

      const participantListTable = participantListPage.participantListTable;
      let cohortTagName = await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME);
      expect(cohortTagName.length).toBe(0); // No Cohort Tags

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt({ position: 0 });
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
      await participantListTable.openParticipantPageAt({ position: 0 });

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

      await participantListTable.openParticipantPageAt({ position: 0 });
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 1);

      await cohortTag.remove(cohortTagValue2);
      await cohortTag.remove(cohortTagValue3);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue2, 0);
      await cohortTag.assertCohortTagToHaveCount(cohortTagValue3, 0);

      await participantPage.backToList();
      cohortTagName = await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME);
      expect(cohortTagName.length).toBe(0); // No more Cohort Tag

      //Verify that tags cannot be added twice via Bulk Cohort Tag option to more than 1 participant
      await participantListPage.reloadWithDefaultFilter();

      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
      await customizeViewPanel.close();

      await participantListTable.selectCheckboxForParticipantAt(0);
      await participantListTable.selectCheckboxForParticipantAt(1);
      await participantListTable.selectCheckboxForParticipantAt(2);

      //Add tag to above selected participants
      await participantListPage.addBulkCohortTags();
      await cohortTag.add(greetingTag, false);
      await cohortTag.submitAndExit();

      //Check that the new tag has been added once
      let participantOneCohortTags = (await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME)).split(`\n\n`);
      let participantOneTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantOneCohortTags, wordToSearchFor: greetingTag });
      expect(participantOneTagOccurences).toBe(1);

      let participantTwoCohortTags = (await participantListTable.getParticipantDataAt(1, Label.COHORT_TAG_NAME)).split(`\n\n`);
      let participantTwoTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantTwoCohortTags, wordToSearchFor: greetingTag });
      expect(participantTwoTagOccurences).toBe(1);

      let participantThreeCohortTags = (await participantListTable.getParticipantDataAt(2, Label.COHORT_TAG_NAME)).split(`\n\n`);
      let participantThreeTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantThreeCohortTags, wordToSearchFor: greetingTag });
      expect(participantThreeTagOccurences).toBe(1);

      //Attempt to add tag again
      await participantListTable.selectCheckboxForParticipantAt(0);
      await participantListTable.selectCheckboxForParticipantAt(1);
      await participantListTable.selectCheckboxForParticipantAt(2);

      //Attempt to add tag to above selected participants
      await participantListPage.addBulkCohortTags();
      await cohortTag.add(greetingTag, false);
      await cohortTag.submitAndExit();

      //If a duplicate attempt was made, the popup just closes without adding a duplciate instance of the requested tag
      participantOneCohortTags = (await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME)).split(`\n\n`);
      participantOneTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantOneCohortTags, wordToSearchFor: greetingTag });
      expect(participantOneTagOccurences).toBe(1);

      participantTwoCohortTags = (await participantListTable.getParticipantDataAt(1, Label.COHORT_TAG_NAME)).split(`\n\n`);
      participantTwoTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantTwoCohortTags, wordToSearchFor: greetingTag });
      expect(participantTwoTagOccurences).toBe(1);

      participantThreeCohortTags = (await participantListTable.getParticipantDataAt(2, Label.COHORT_TAG_NAME)).split(`\n\n`);
      participantThreeTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantThreeCohortTags, wordToSearchFor: greetingTag });
      expect(participantThreeTagOccurences).toBe(1);

      //Delete the added greeting tag from the above three participants
      await participantListTable.openParticipantPageAt(0);
      await participantPage.waitForReady();
      await cohortTag.remove(greetingTag);
      await participantPage.backToList();

      await participantListTable.openParticipantPageAt(1);
      await participantPage.waitForReady();
      await cohortTag.remove(greetingTag);
      await participantPage.backToList();

      await participantListTable.openParticipantPageAt(2);
      await participantPage.waitForReady();
      await cohortTag.remove(greetingTag);
      await participantPage.backToList();

      //Check that none of the above participants has the greeting/test tag
      participantOneCohortTags = (await participantListTable.getParticipantDataAt(0, Label.COHORT_TAG_NAME)).split(`\n\n`);
      participantOneTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantOneCohortTags, wordToSearchFor: greetingTag });
      expect(participantOneTagOccurences).toBe(0);

      participantTwoCohortTags = (await participantListTable.getParticipantDataAt(1, Label.COHORT_TAG_NAME)).split(`\n\n`);
      participantTwoTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantTwoCohortTags, wordToSearchFor: greetingTag });
      expect(participantTwoTagOccurences).toBe(0);

      participantThreeCohortTags = (await participantListTable.getParticipantDataAt(2, Label.COHORT_TAG_NAME)).split(`\n\n`);
      participantThreeTagOccurences = totalNumberOfOccurences({ arrayToSearch: participantThreeCohortTags, wordToSearchFor: greetingTag });
      expect(participantThreeTagOccurences).toBe(0);
    });
  }
});
