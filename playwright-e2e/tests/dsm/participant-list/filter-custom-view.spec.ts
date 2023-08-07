import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { offsetDaysFromToday } from 'utils/date-utils';

// Test is broken until bug is fixed. https://broadworkbench.atlassian.net/browse/PEPPER-1031
test.describe.fixme('Participants list search and filter', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Save Custom View in ${study} @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const defaultViewNumParticipants = await participantsTable.numOfParticipants();
      expect(defaultViewNumParticipants).toBeGreaterThan(1);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      await customizeViewPanel.selectColumns('Sample Columns', ['MF code']);
      await customizeViewPanel.selectColumns('Participant Columns', ['Date of Majority']);

      // Table auto. reloaded with new columns added
      await expect(participantsTable.getHeaderByName('MF Code')).toBeVisible();
      await expect(participantsTable.getHeaderByName('Date of Majority')).toBeVisible();
      const numParticipants1 = await participantsTable.numOfParticipants();
      expect(numParticipants1).toBeGreaterThan(1);

      // Open Customize View panel to add filter conditions: NOT EMPTY and Date Range
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();

      // Set MF code: NOT EMPTY
      await searchPanel.text('MF code', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

      // Set Date of Majority: NOT EMPTY and a date range: 10 years ago from today to 10 years after today
      const tenYearsAgo = offsetDaysFromToday(365 * 10, { isAdd: false });
      const TenYearAfter = offsetDaysFromToday(365 * 10, { isAdd: true });
      await searchPanel.dates('Date of Majority', {
        additionalFilters: [AdditionalFilter.RANGE],
        from: tenYearsAgo,
        to: TenYearAfter
      });

      await searchPanel.search();

      const newViewNumParticipants = await participantsTable.numOfParticipants();
      expect(newViewNumParticipants).toBeGreaterThan(1);

      const mfCodeCellText = await participantsTable.getParticipantDataAt(0, 'MF code');
      const mfCodes: string[] = mfCodeCellText.split(/[\r\n]+/);
      expect(mfCodes).toBeTruthy();
      expect(mfCodes.length).toBeGreaterThanOrEqual(1);

      // Save custom view
      const newViewName = `hunter_${new Date().getTime().toString()}`;
      await participantListPage.saveNewView(newViewName);

      // Reload default view to change table before open saved custom view
      await participantListPage.reloadWithDefaultFilter();
      expect(await participantsTable.numOfParticipants()).toBeGreaterThanOrEqual(defaultViewNumParticipants);

      // Open saved custom view
      const savedViewPanel = participantListPage.savedFilters;
      await savedViewPanel.open(newViewName);
      expect(await participantsTable.numOfParticipants()).toEqual(newViewNumParticipants);

      // Delete saved custom view
      await savedViewPanel.delete(newViewName);
    });
  }
});
