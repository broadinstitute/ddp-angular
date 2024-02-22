import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Column } from 'dsm/enums';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyName } from 'dsm/component/navigation';

test.describe('Participants List Manual Search', () => {
  const studies = [StudyName.LMS, StudyName.PANCAN];

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

      // Adding Sample Columns
      const collaboratorPtIdColumn = 'Collaborator Participant ID';
      const normalCollaboratorSampleIdColumn = 'Normal Collaborator Sample ID';
      const sampleSentColumn = 'Sample Sent';
      const sampleReceivedColumn = 'Sample Received';

      // Adding Medical Record Columns
      const institutionNameColumn = 'Institution Name';
      const initialMRReceivedColumn = 'Initial MR Received';
      const noActionNeededColumn = 'No Action Needed';

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(Column.SAMPLE,
        [collaboratorPtIdColumn, normalCollaboratorSampleIdColumn, sampleSentColumn, sampleReceivedColumn]);
      await customizeViewPanel.selectColumns(Column.MEDICAL_RECORD,
        [institutionNameColumn, initialMRReceivedColumn, noActionNeededColumn]);

      // await customizeViewPanel.deselectColumns(CustomViewColumns.PARTICIPANT, [MainInfoEnum.DDP]);
      await customizeViewPanel.close();

      // Table automatically reloaded with new column added. Random check few columns
      await expect(participantsTable.getHeaderByName(normalCollaboratorSampleIdColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(institutionNameColumn)).toBeVisible();

      // Count of participants does not change with new columns added.
      const numParticipantsWithColumn = await participantsTable.numOfParticipants();
      expect(numParticipantsWithColumn).toStrictEqual(numParticipants);

      // Should be able to hide any column
      await customizeViewPanel.open();
      await customizeViewPanel.deselectColumns(Column.PARTICIPANT, ['DDP']);
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
      await expect(participantsTable.getHeaderByName(collaboratorPtIdColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(normalCollaboratorSampleIdColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(sampleSentColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(sampleReceivedColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(institutionNameColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(initialMRReceivedColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(noActionNeededColumn)).toBeVisible();

      // Empty manual search will not change PT count
      let numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toStrictEqual(numParticipants);

      // Filter by 'No Action Needed' with 'Yes' and 'No'
      await searchPanel.open();

      // Search with No checkbox
      await searchPanel.checkboxes(noActionNeededColumn, { checkboxValues: ['No'] });
      // Check No will uncheck Yes automatically
      expect(await searchPanel.isFilterCheckboxChecked(noActionNeededColumn, 'Yes')).toBe(false);
      await searchPanel.search();

      // Search will change PT count
      numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toBeLessThan(numParticipants);

      // Column cell value should be No
      let rowIndex = await participantsTable.randomizeRows();
      let value = await participantsTable.getParticipantDataAt(rowIndex[0], noActionNeededColumn);
      expect(value).toContain('No');

      // Search with Yes checkbox
      await searchPanel.open();
      await searchPanel.checkboxes(noActionNeededColumn, { checkboxValues: ['Yes'] });
      // Check Yes will uncheck No automatically
      expect(await searchPanel.isFilterCheckboxChecked(noActionNeededColumn, 'No')).toBe(false);
      await searchPanel.search();

      // Search will again change PT count
      numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toBeLessThan(numParticipants);

      // Column cell value should be Yes
      rowIndex = await participantsTable.randomizeRows();
      value = await participantsTable.getParticipantDataAt(rowIndex[0], noActionNeededColumn);
      expect(value).toContain('Yes');
    });
  }
});
