import { expect } from '@playwright/test';
import { testWithUser2 as test } from 'fixtures/dsm-fixture';
import { DataFilter, CustomizeView, Label } from 'dsm/enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { offsetDaysFromToday } from 'utils/date-utils';
import crypto from 'crypto';

test.describe('Participants List Search with Filtering Condition', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Save Current View @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const defaultViewNumParticipants = await participantsTable.numOfParticipants();
      expect(defaultViewNumParticipants).toBeGreaterThan(1);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.SAMPLE, [Label.MF_CODE]);
      await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.DATE_OF_MAJORITY]);
      await customizeViewPanel.close();

      // Table auto. reloaded with new columns added
      await expect(participantsTable.getHeaderByName(Label.MF_CODE)).toBeVisible();
      await expect(participantsTable.getHeaderByName(Label.DATE_OF_MAJORITY)).toBeVisible();
      const numParticipantsAfter = await participantsTable.numOfParticipants();
      // Number of participants should be same
      expect(numParticipantsAfter).toStrictEqual(defaultViewNumParticipants);

      // Open Customize View panel to add filter conditions: NOT EMPTY and Date Range
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      // Set MF code: NOT EMPTY
      await searchPanel.text(Label.MF_CODE, { additionalFilters: [DataFilter.NOT_EMPTY] });
      // Set Date of Majority: NOT EMPTY and a date range: 10 years ago from today to 10 years after today
      const tenYearsAgo = offsetDaysFromToday(365 * 10, { isAdd: false });
      const TenYearAfter = offsetDaysFromToday(365 * 10, { isAdd: true });
      await searchPanel.dates(Label.DATE_OF_MAJORITY, {
        additionalFilters: [DataFilter.RANGE],
        from: tenYearsAgo,
        to: TenYearAfter
      });
      await searchPanel.search();

      const numParticipantsAfterFilter = await participantsTable.numOfParticipants();
      expect(numParticipantsAfterFilter).toBeGreaterThan(1);
      // Number of participants should be changed
      expect(numParticipantsAfterFilter).not.toStrictEqual(numParticipantsAfter);

      // Save custom view
      const customViewName = `hunter-${crypto.randomUUID().toString().substring(1, 6)}`;
      await participantListPage.saveCurrentView(customViewName);

      // Reload page to change table before open saved custom view
      await page.reload();
      const numOfPartipantsAfterReload = await participantsTable.numOfParticipants();
      expect(numOfPartipantsAfterReload).toStrictEqual(defaultViewNumParticipants);

      // Open saved view
      const savedViewPanel = participantListPage.savedFilters;
      await savedViewPanel.open(customViewName);
      const numOfParticipantOfView = await participantsTable.numOfParticipants();
      expect(numOfParticipantOfView).toBe(numParticipantsAfterFilter);

      // Delete saved custom view
      await savedViewPanel.delete(customViewName);
    });
  }
});
