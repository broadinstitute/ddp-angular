import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { CustomizeView, Label } from 'dsm/enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';

test.describe('Participants List Manual Search', () => {
  const studies = [StudyEnum.LMS, StudyEnum.PANCAN];

  for (const study of studies) {
    test(`With custom columns @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;
      const numParticipants = await participantsTable.numOfParticipants(); // number of participants

      // Studies have lots of participants. Change number of rows in paginated table
      const counts = [25, 50];
      for (const count of counts) {
        // Change numbers of rows displayed to count
        await participantsTable.changeRowCount(count);
        const actualRowsCount = await participantsTable.getRowsCount(); // number of table rows displayd
        if (numParticipants >= count) {
          expect(actualRowsCount).toStrictEqual(count);
        } else {
          expect(actualRowsCount).toStrictEqual(numParticipants);
        }
      }
      // Change back to 10 rows
      await participantsTable.changeRowCount(10);
      const defaultRowsCount = await participantsTable.getRowsCount();
      expect(defaultRowsCount).toStrictEqual(10);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.SAMPLE,
        [Label.COLLABORATOR_PARTICIPANT_ID, Label.NORMAL_COLLABORATOR_SAMPLE_ID, Label.SAMPLE_SENT, Label.SAMPLE_RECEIVED]);
      await customizeViewPanel.selectColumns(CustomizeView.MEDICAL_RECORD,
        [Label.INSTITUTION_NAME, Label.INITIAL_MR_RECEIVED, Label.NO_ACTION_NEEDED]);

      // await customizeViewPanel.deselectColumns(CustomViewColumns.PARTICIPANT, [MainInfoEnum.DDP]);
      await customizeViewPanel.close();

      // Table automatically reloaded with new column added. Random check few columns
      await expect(participantsTable.getHeaderByName(Label.NORMAL_COLLABORATOR_SAMPLE_ID)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.INSTITUTION_NAME)).toBeVisible();

      // Count of participants does not change with new columns added.
      const numParticipantsWithColumn = await participantsTable.numOfParticipants();
      expect(numParticipantsWithColumn).toStrictEqual(numParticipants);

      // Should be able to hide any column
      await customizeViewPanel.open();
      await customizeViewPanel.deselectColumns(CustomizeView.PARTICIPANT, ['DDP']);
      await expect(participantsTable.getHeaderByName('DDP')).not.toBeVisible();

      // Clear search fields
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.clear();

      // Clearing search does not change rows count
      const rowsCountAfterClear = await participantsTable.getRowsCount();
      expect(rowsCountAfterClear).toStrictEqual(defaultRowsCount);

      // Clearing search does not change the amount of participants seen in participant list
      const numParticipantsAfterClear = await participantsTable.numOfParticipants();
      expect(numParticipantsAfterClear).toStrictEqual(numParticipants);
      await searchPanel.search({ uri: '/ui/applyFilter?' });

      // Clearing search does not change count of participants
      const numParticipantsUpdated = await participantsTable.numOfParticipants();
      expect(numParticipantsUpdated).toBe(numParticipants);


      // Empty manual search
      await searchPanel.open();
      await searchPanel.clear();
      await searchPanel.search({ uri: '/ui/applyFilter?' });

      // Empty manual search will not lose added columns
      await expect(participantsTable.getHeaderByName(Label.COLLABORATOR_PARTICIPANT_ID)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.NORMAL_COLLABORATOR_SAMPLE_ID)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.SAMPLE_SENT)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.SAMPLE_RECEIVED)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.INSTITUTION_NAME)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.INITIAL_MR_RECEIVED)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.NO_ACTION_NEEDED)).toBeVisible();

      // Empty manual search will not change PT count
      let numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toStrictEqual(numParticipants);

      // Filter by 'No Action Needed' with 'Yes' and 'No'
      await searchPanel.open();

      // Search with No checkbox
      await searchPanel.checkboxes(Label.NO_ACTION_NEEDED, { checkboxValues: ['No'] });
      // Check No will uncheck Yes automatically
      expect(await searchPanel.isFilterCheckboxChecked(Label.NO_ACTION_NEEDED, 'Yes')).toBe(false);
      await searchPanel.search();

      // Search will change PT count
      numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toBeLessThan(numParticipants);

      // Column cell value should be No
      let rowIndex = await participantsTable.randomizeRows();
      let value = await participantsTable.getParticipantDataAt(rowIndex[0], Label.NO_ACTION_NEEDED);
      expect(value).toContain('No');

      // Search with Yes checkbox
      await searchPanel.open();
      await searchPanel.checkboxes(Label.NO_ACTION_NEEDED, { checkboxValues: ['Yes'] });
      // Check Yes will uncheck No automatically
      expect(await searchPanel.isFilterCheckboxChecked(Label.NO_ACTION_NEEDED, 'No')).toBe(false);
      await searchPanel.search();

      // Search will again change PT count
      numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toBeLessThan(numParticipants);

      // Column cell value should be Yes
      rowIndex = await participantsTable.randomizeRows();
      value = await participantsTable.getParticipantDataAt(rowIndex[0], Label.NO_ACTION_NEEDED);
      expect(value).toContain('Yes');
    });
  }
});
