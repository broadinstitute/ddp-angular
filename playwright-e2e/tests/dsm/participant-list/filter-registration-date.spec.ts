import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { SortOrder } from 'dss/component/table';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { getDate, offsetDaysFromDate, offsetDaysFromToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';

test.describe('Participants Search', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Search by Registration Date @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Participant Columns', [MainInfoEnum.REGISTRATION_DATE]);
      await customizeViewPanel.close();

      // Participants table automatically reload and displays the Registration Date column as the last column

      // Save Registration Date found on first row for use in search
      const registrationDate = await participantsTable.getParticipantDataAt(0, MainInfoEnum.REGISTRATION_DATE);
      const formatRegistrationDate = getDate(new Date(registrationDate)); // Returns a formatted date mm/dd/yyyy
      logInfo(`Found Registration Date: ${registrationDate}. Formatted to: ${formatRegistrationDate}`);

      // Search by random date
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.clear();
      await searchPanel.text(MainInfoEnum.REGISTRATION_DATE, { textValue: formatRegistrationDate }); // search date format is mm/dd/yyyy
      await searchPanel.search();

      const numParticipants1 = await participantsTable.numOfParticipants();
      expect(numParticipants1, `Registration Date: ${formatRegistrationDate} failed to find participants`).toBeGreaterThanOrEqual(1);

      // Check first row data
      // Verify Registration Date
      const headerIndex = await participantsTable.getHeaderIndex(MainInfoEnum.REGISTRATION_DATE);
      const actualRegistrationDate = await participantsTable.cell(0, headerIndex).innerText();

      // Date filtering is problematic. Add +/- 1 day to assertion
      const date = new Date(registrationDate);
      const dateRanges = [
        getDate(offsetDaysFromDate(date, 1)),
        getDate(offsetDaysFromDate(date, 1, { isAdd: true })),
        getDate(date)
      ];
      expect(dateRanges).toEqual(expect.arrayContaining([getDate(new Date(actualRegistrationDate))]));

      // Verify Status is not empty or null
      const status = await participantsTable.getParticipantDataAt(0, 'Status');
      expect(status).toBeTruthy();
      // Verify First Short ID is not empty or null and length is 6
      const shortId = await participantsTable.getParticipantDataAt(0, 'Short ID');
      expect(shortId).toBeTruthy();
      expect(shortId.length).toBe(6);

      // Search filter with date range (don't need to open Search panel because it does not close automatically)
      const today = getDate(new Date());
      const yearAgo = offsetDaysFromToday(365);
      await searchPanel.dates(MainInfoEnum.REGISTRATION_DATE, { additionalFilters: [AdditionalFilter.RANGE], from: yearAgo, to: today});
      await searchPanel.search();

      const rowsCount = await participantsTable.getRowsCount();
      const numParticipants2 = await participantsTable.numOfParticipants();
      logInfo(`Search by Registration Date Range (from: ${yearAgo}, to: ${today}) returns ${numParticipants2} participants`);
      expect(numParticipants2).toBeGreaterThan(1);
      expect(numParticipants2).not.toBe(numParticipants1); // Expect Participants list table has reloaded and changed

      // Sort Registration Date column filter to verify date range in table
      await participantsTable.sort(MainInfoEnum.REGISTRATION_DATE, SortOrder.DESC);
      const descFirstRowDate = await participantsTable.cell(0, headerIndex).innerText();
      const descLastRowDate = await participantsTable.cell(rowsCount - 1, headerIndex).innerText();
      // ascending
      expect(new Date(descFirstRowDate) < new Date(descLastRowDate),
        `descFirstRowDate: ${descFirstRowDate}, descLastRowDate: ${descLastRowDate}`)
        .toBeTruthy();

      // Sort in opposite order
      await participantsTable.sort(MainInfoEnum.REGISTRATION_DATE, SortOrder.ASC);
      const ascFirstRowDate = await participantsTable.cell(0, headerIndex).innerText();
      const ascLastRowDate = await participantsTable.cell(rowsCount - 1, headerIndex).innerText();
      // descending
      expect(new Date(ascFirstRowDate) > new Date(ascLastRowDate),
        `ascFirstRowDate: ${ascFirstRowDate}, ascLastRowDate: ${ascLastRowDate}`)
        .toBeTruthy();

      expect(getDate(new Date(descFirstRowDate))).not.toEqual(ascFirstRowDate);
    });
  }
});
