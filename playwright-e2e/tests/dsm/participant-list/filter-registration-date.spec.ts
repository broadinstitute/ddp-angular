import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { SortOrder } from 'dss/component/table';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { getDate, offsetDaysFromToday } from 'utils/date-utils';

test.describe('Participants Search', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Search by Registration Date in ${study} @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Participant Columns', [MainInfoEnum.REGISTRATION_DATE]);
      await customizeViewPanel.close();

      // Participants table automatically reload and displays the Registration Date column as the last column

      // Save Registration Date found on first row for use in search
      const registrationDate = await participantsTable.getParticipantDataAt(0, MainInfoEnum.REGISTRATION_DATE);
      const randomDate = getDate(new Date(registrationDate)); // Returns a formatted date mm/dd/yyyy
      console.log('Search by registration date: ', randomDate);

      // Search by random date
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(MainInfoEnum.REGISTRATION_DATE, { textValue: randomDate }); // search date format is mm/dd/yyyy
      await searchPanel.search();

      const numParticipants1 = await participantsTable.numOfParticipants();
      console.log(`Search by Registration Date ${randomDate} returns ${numParticipants1} participants`);
      expect(numParticipants1).toBeGreaterThanOrEqual(1);


      // Check first row data
      // Verify Registration Date
      const headerIndex = await participantsTable.getHeaderIndex(MainInfoEnum.REGISTRATION_DATE);
      const cellText = await participantsTable.cell(0, headerIndex).innerText();
      expect(getDate(new Date(cellText))).toEqual(randomDate);

      // Verify Status is not empty or null
      const status = await participantsTable.getParticipantDataAt(0, 'Status');
      expect(status).toBeTruthy();
      // Verify First Short ID is not empty or null and length is 6
      const shortId = await participantsTable.getParticipantDataAt(0, 'Short ID');
      expect(shortId).toBeTruthy();
      expect(shortId.length).toEqual(6);

      // Search filter with date range (don't need to open Search panel because it does not close automatically)
      const today = getDate(new Date());
      const thirtyDaysAgo = offsetDaysFromToday(30);
      await searchPanel.dates(MainInfoEnum.REGISTRATION_DATE, { additionalFilters: [AdditionalFilter.RANGE], from: thirtyDaysAgo, to: today});
      await searchPanel.search();

      const numParticipants2 = await participantsTable.numOfParticipants();
      console.log(`Search by Registration Date Range returns ${numParticipants2} participants`);
      expect(numParticipants2).toBeGreaterThan(1);
      expect(numParticipants2).not.toEqual(numParticipants1); // Expect Participants list table has reloaded and changed

      // Use Registration Date column filter to verify date range in table
      await participantsTable.sort(MainInfoEnum.REGISTRATION_DATE, SortOrder.DESC);
      const date1 = await participantsTable.cell(0, headerIndex).innerText();

      await participantsTable.sort(MainInfoEnum.REGISTRATION_DATE, SortOrder.ASC);
      const date2 = await participantsTable.cell(0, headerIndex).innerText();

      expect(getDate(new Date(date1))).not.toEqual(date2);
    });
  }
});
