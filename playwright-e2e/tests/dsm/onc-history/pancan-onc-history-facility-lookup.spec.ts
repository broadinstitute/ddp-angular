import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { Filter, Tab } from 'dsm/enums';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { OncHistoryInputColumnsEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { Page, expect } from '@playwright/test';
import { logInfo } from 'utils/log-utils';
import { faker } from '@faker-js/faker';
import Input from 'dss/component/input';
import { waitForResponse } from 'utils/test-utils';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';
import { StudyName } from 'dsm/component/navigation';

test.describe.serial('Onc History', () => {
  const studies = [StudyName.PANCAN];

  let shortID: string;

  for (const study of studies) {
    test(`New Facility is visible and selectable in lookup ${study} @dsm`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      // Find a participant
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Medical Record Columns', ['MR Problem']);
      await customizeViewPanel.selectColumns('Participant - DSM Columns', ['Onc History Created']);
      await customizeViewPanel.selectColumns('Research Consent Form Columns', ['Your Mailing Address *']);

      await searchPanel.open();
      await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
      await searchPanel.checkboxes('MR Problem', { checkboxValues: ['No'] });
      await searchPanel.dates('Onc History Created', { additionalFilters: [Filter.EMPTY] });
      await searchPanel.text('Your Mailing Address *', { additionalFilters: [Filter.NOT_EMPTY] });

      await searchPanel.search();
      shortID = await participantListPage.findParticipantWithTab(
        { findPediatricParticipant: false, tab: Tab.ONC_HISTORY, uriString: 'ui/filterList'}
      );
      logInfo(`Short id: ${shortID}`);
      expect(shortID?.length).toBeTruthy();

      // Open Onc History tab
      await participantListPage.filterListByShortId(shortID);
      const participantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(Tab.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      let lastRow = await oncHistoryTable.getRowsCount() - 1;

      // Existing Facility name "Memorial City Hospital" should be avaliable for select in the lookup
      await validateLookup(page, oncHistoryTable, lastRow, 'm', 'Memorial City Hospital');

      // Generate new facility name. Enter new facility name in last row.
      const newFacilityName = `${faker.word.words({count: 3})} ${faker.phone.number()}`;
      logInfo(`Onc History new Facility name: ${newFacilityName}`);

      // In new row, enter new facility name
      lastRow = ++lastRow;
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX,
          {
            date: {
              date: {
                yyyy: new Date().getFullYear(),
                month: new Date().getMonth(),
                dayOfMonth: new Date().getDate()
              }
            }
          }, lastRow);
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: newFacilityName, lookupSelectIndex: -1 }, lastRow);
      const actualFacilityValue = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FACILITY, lastRow);
      expect(actualFacilityValue).toStrictEqual(newFacilityName);

      // New facility name becomes available for select in new lookup
      lastRow = ++lastRow;
      const firstWord = newFacilityName.split(' ')[0].substring(0, 1); // first 2 chars in first word
      await validateLookup(page, oncHistoryTable, lastRow, firstWord, newFacilityName);

      // clean up: delete two added rows
      await oncHistoryTable.deleteRowAt(lastRow);
      await oncHistoryTable.deleteRowAt(lastRow - 1);
    });
  }

  async function validateLookup(page: Page, table: OncHistoryTable, row: number, keyword: string, lookupName: string) {
    const cell = await table.checkColumnAndCellValidity(OncHistoryInputColumnsEnum.FACILITY, row);
    const input = new Input(page, { root: cell });
    const inputLocator = input.toLocator();

    await Promise.all([
      waitForResponse(page, { uri: '/patch' }), // this /patch requeset invokes lookup
      input.fillSimple(keyword)
    ]);

    const lookupListCount = await table.lookupList(inputLocator).count();
    expect(lookupListCount).toBeGreaterThanOrEqual(1);
    await expect(table.lookupList(inputLocator).getByText(lookupName).nth(0)).toBeVisible();

    await Promise.all([
      waitForResponse(page, { uri: '/patch' }), // this /patch request happens after select facility in lookup
      table.lookupList(inputLocator).getByText(lookupName).first().click()
    ]);

    const value = await table.getFieldValue(OncHistoryInputColumnsEnum.FACILITY, row);
    expect(value).toContain(lookupName);
  }
});
