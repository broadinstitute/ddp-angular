import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { shuffle, studyShortName } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import { OncHistoryInputColumnsEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { SortOrder } from 'dss/component/table';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';

test.describe('Return of Results Letter', () => {
  // Some studies are excluded due to lack of the suitable paricipants
  const studies: StudyEnum[] = [StudyEnum.OSTEO2, StudyEnum.PANCAN, StudyEnum.MBC, StudyEnum.BRAIN];

  for (const study of studies) {
    let participantListPage: ParticipantListPage;
    let participantListTable: ParticipantListTable;
    let rowIndex: number;

    test(`Check in @dsm @${study}`, async ({ page, request }) => {
      participantListPage = await ParticipantListPage.goto(page, study, request);
      participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;

      await test.step('Find an enrolled adult participant that has consented yes to tissue, and yes to receiving tumor shared learning', async () => {
        const consentTissueColumn = 'CONSENT_TISSUE';
        const consentTumorColumn = 'SOMATIC_CONSENT_TUMOR';
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.RESEARCH_CONSENT_FORM, [consentTissueColumn]);
        await customizeViewPanel.selectColumns(CustomViewColumns.ADDITIONAL_CONSENT, [consentTumorColumn]);

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes(consentTissueColumn, { checkboxValues: ['Yes'] });
        // Bug: https://broadworkbench.atlassian.net/browse/PEPPER-1083
        // await searchPanel.checkboxes(consentTumorColumn, { checkboxValues: ['Yes'] });
        await searchPanel.search();
        await participantListTable.changeRowCount(50);
        // bug workaround
        rowIndex = await findRowIndex(participantListTable, consentTumorColumn, 'Yes');
        expect(rowIndex).toBeGreaterThanOrEqual(0);
      });

      // Open Participant page
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(rowIndex);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
     

      await test.step('TODO', async () => {
       //
      });
    });
  }

  async function findRowIndex(participantListTable: ParticipantListTable, columnName: string, value: string): Promise<number> {
    let participantsCount = await participantListTable.numOfParticipants();
    expect(participantsCount).toBeGreaterThanOrEqual(1);
    const endTime = Date.now() + 90 * 1000;
    while (participantsCount > 0 && Date.now() < endTime) {
      let rowIndex = -1;
      // Iterate rows in random order
      const array = shuffle([...Array(participantsCount).keys()]);
      for (const index of array) {
        const columnText = await participantListTable.getTextAt(index, columnName);
        rowIndex = columnText.some(text => text.indexOf(value) !== -1) ? index : -1;
        if (rowIndex !== -1) {
          return rowIndex;
        }
      }
      // Next page in table if needed
      const hasNextPage = await participantListTable.paginator.hasNext();
      if (hasNextPage) {
        await participantListTable.nextPage();
        participantsCount = await participantListTable.rowsCount;
      } else {
        participantsCount = 0;
      }
    }
    return -1;
  }
});
