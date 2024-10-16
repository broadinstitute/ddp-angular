import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { Page, expect } from '@playwright/test';
import { logInfo } from 'utils/log-utils';
import { faker } from '@faker-js/faker';
import Input from 'dss/component/input';
import { waitForResponse } from 'utils/test-utils';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';
import { StudyName } from 'dsm/navigation';

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
      await customizeViewPanel.selectColumns(CustomizeView.MEDICAL_RECORD, [Label.MR_PROBLEM]);
      await customizeViewPanel.selectColumns(CustomizeView.DSM_COLUMNS, [Label.ONC_HISTORY_CREATED]);
      await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, [Label.MAILING_ADDRESS]);

      await searchPanel.open();
      await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
      await searchPanel.checkboxes(Label.MR_PROBLEM, { checkboxValues: [DataFilter.NO] });
      await searchPanel.dates(Label.ONC_HISTORY_CREATED, { additionalFilters: [DataFilter.EMPTY] });
      await searchPanel.text(Label.MAILING_ADDRESS, { additionalFilters: [DataFilter.NOT_EMPTY] });

      await searchPanel.search();
      shortID = await participantListPage.findParticipantWithTab(
        { tab: Tab.ONC_HISTORY, uri: 'ui/filterList'}
      );
      logInfo(`Short id: ${shortID}`);
      expect(shortID?.length).toBeTruthy();

      // Open Onc History tab
      await participantListPage.filterListByShortId(shortID);
      const participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      let lastRow = await oncHistoryTable.getRowsCount() - 1;

      // Existing Facility name "Memorial City Hospital" should be avaliable for select in the lookup
      await validateLookup(page, oncHistoryTable, lastRow, 'm', 'Memorial City Hospital');

      // Generate new facility name. Enter new facility name in last row.
      const newFacilityName = `${faker.word.words({count: 3})} ${faker.phone.number()}`;
      logInfo(`Onc History new Facility name: ${newFacilityName}`);

      // In new row, enter new facility name
      lastRow = ++lastRow;
      await oncHistoryTable.fillField(Label.DATE_OF_PX,
          {
            date: {
              date: {
                yyyy: new Date().getFullYear(),
                month: new Date().getMonth(),
                dayOfMonth: new Date().getDate()
              }
            }
          }, lastRow);
      await oncHistoryTable.fillField(Label.FACILITY, { inputValue: newFacilityName, lookupIndex: -1 }, lastRow);
      const actualFacilityValue = await oncHistoryTable.getFieldValue(Label.FACILITY, lastRow);
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
    const cell = await table.checkColumnAndCellValidity(Label.FACILITY, row);
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

    const value = await table.getFieldValue(Label.FACILITY, row);
    expect(value).toContain(lookupName);
  }
});
