import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';

test.describe('Participants List', () => {
  const studies = [StudyEnum.LMS, StudyEnum.PANCAN];

  for (const study of studies) {
    test(`Search with empty fields and custom column @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const numParticipants = await participantsTable.numOfParticipants();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      // Adding Medical Record Columns: "Institution Name"
      const institution = 'Institution Name';
      await customizeViewPanel.selectColumns(CustomViewColumns.MEDICAL_RECORD, [institution]);

      // Table automatically reloaded with new column added
      await expect(participantsTable.getHeaderByName(institution)).toBeVisible();

      // Count of participants does not change
      const numParticipantsWithColumn = await participantsTable.numOfParticipants();
      expect(numParticipantsWithColumn).toBe(numParticipants);

      // Hide a column: DDP
      await customizeViewPanel.open();
      await customizeViewPanel.deselectColumns(CustomViewColumns.PARTICIPANT, ['DDP']);
      await expect(participantsTable.getHeaderByName('DDP')).not.toBeVisible();

      // Empty search: fields are cleared
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.clear();
      // Clearing the search does not change the amount of participants seen in participant list
      const numParticipantsAfterClear = await participantsTable.numOfParticipants();
      expect(numParticipantsAfterClear).toBe(numParticipants);
      await searchPanel.search({ uri: '/ui/applyFilter?' });

      // Count of participants does not change
      const numParticipantsUpdated = await participantsTable.numOfParticipants();
      expect(numParticipantsUpdated).toBe(numParticipants);

      // Searching with an empty manual search will not lose Institution Name
      await expect(participantsTable.getHeaderByName(institution)).toBeVisible();
    });
  }
});
