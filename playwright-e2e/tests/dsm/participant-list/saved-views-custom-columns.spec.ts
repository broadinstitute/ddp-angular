import { expect } from '@playwright/test';
import { testWithUser2 as test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, Label } from 'dsm/enums';
import crypto from 'crypto';
import { StudyName } from 'dsm/navigation';

test.describe('Participant List Search without Filtering Condition', () => {
  const studies = [StudyName.LMS, StudyName.OSTEO2, StudyName.PANCAN];

  for (const study of studies) {
    test(`Save and retrieve Views @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;
      const numOfParticipants = await participantsTable.numOfParticipants();
      expect(numOfParticipants).toBeGreaterThanOrEqual(1);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.PARTICIPANT_ID]);
      await customizeViewPanel.deselectColumns(CustomizeView.PARTICIPANT, [Label.DDP]);
      await customizeViewPanel.close();

      const searchPanel = participantListPage.filters.searchPanel;
      // Don’t add any filtering conditions
      await searchPanel.open();
      await searchPanel.search({ uri: '/ui/applyFilter?' });

      await expect(participantsTable.getHeaderByName(Label.DDP)).toBeHidden();
      await expect(participantsTable.getHeaderByName(Label.PARTICIPANT_ID)).toBeVisible();

      const numOfParticipantsAfter = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfter).toStrictEqual(numOfParticipants);

      const actualHeaderNames = await participantsTable.getHeaderNames();

      // Save current View
      const newViewName = `hunter-${crypto.randomUUID().toString().substring(1, 5)}`;
      await participantListPage.saveCurrentView(newViewName);

      // Reload with default filter to reset before open saved view
      await participantListPage.reloadWithDefaultFilter();

      // Open saved view
      const savedViewPanel = participantListPage.savedFilters;
      await savedViewPanel.open(newViewName);

      // Same number of participants should appear as it did before, with the selected columns.
      const numOfParticipantsAfterOpen = await participantsTable.numOfParticipants();
      expect(numOfParticipantsAfterOpen).toStrictEqual(numOfParticipantsAfter);

      const actualHeaderNamesAfter = await participantsTable.getHeaderNames();
      expect(actualHeaderNamesAfter).toEqual(actualHeaderNames);

      // Delete view
      await savedViewPanel.delete(newViewName);
    });
  }
});
