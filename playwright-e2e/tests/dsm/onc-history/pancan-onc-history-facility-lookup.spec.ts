import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { OncHistoryInputColumnsEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { Page, expect } from '@playwright/test';
import { logInfo } from 'utils/log-utils';
import { faker } from '@faker-js/faker';
import Input from 'dss/component/input';
import { waitForResponse } from 'utils/test-utils';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';

test.describe('Facility name', () => {
  const studies = [StudyEnum.PANCAN];

  for (const study of studies) {
    test(`Selectable in the lookup ${study} @dsm`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;
      let shortID: string;

      await test.step('Find a participant', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Medical Record Columns', ['MR Problem']);
        await customizeViewPanel.selectColumns('Participant - DSM Columns', ['Onc History Created']);
        await customizeViewPanel.selectColumns('Research Consent Form Columns', ['Your Mailing Address *']);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes('MR Problem', { checkboxValues: ['No'] });
        await searchPanel.dates('Onc History Created', { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.text('Your Mailing Address *', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

        await searchPanel.search();
        shortID = await participantListPage.findParticipantWithTab(
          { findPediatricParticipant: false, tab: TabEnum.ONC_HISTORY, uriString: 'ui/filterList'}
        );
        logInfo(`Short id: ${shortID}`);
        expect(shortID?.length).toBeTruthy();
      })

      await participantListPage.filterListByShortId(shortID!);
      const participantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      let lastRow = await oncHistoryTable.getRowsCount() - 1;

      // Existing Facility name "Memorial City Hospital" should be avaliable for select in the lookup
      await validateLookup(page, oncHistoryTable, lastRow, 'm', 'Memorial City Hospital');

      // Generate new facility name. Enter new facility name in last row.
      const newFacilityName = `${faker.word.words({count: 3})} ${faker.phone.number()}`;
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: newFacilityName }, lastRow);
      const actualFacilityValue = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FACILITY, lastRow);
      expect(actualFacilityValue).toStrictEqual(newFacilityName);

      // New facility name becomes available for select in lookup
      lastRow = lastRow++;
      const firstWord = newFacilityName.split(' ')[0].substring(0, 1); // first 2 chars in first word
      await validateLookup(page, oncHistoryTable, lastRow, firstWord, newFacilityName);
    })
  }

  async function validateLookup(page: Page, table: OncHistoryTable, row: number, keyword: string, lookupName: string) {
    const cell = await table.checkColumnAndCellValidity(OncHistoryInputColumnsEnum.FACILITY, row);
    const input = new Input(page, { root: cell });

    await Promise.all([
      waitForResponse(page, { uri: '/patch' }),
      input.fillSimple(keyword)
    ]);

    const lookupListCount = await table.lookupList.count();
    expect(lookupListCount).toBeGreaterThanOrEqual(1);
    await expect(table.lookupList.getByText(lookupName).nth(0)).toBeVisible();

    await table.lookupList.getByText(lookupName).first().click();
    const value = await table.getFieldValue(OncHistoryInputColumnsEnum.FACILITY, row);
    expect(value).toContain(lookupName);
  }
});
