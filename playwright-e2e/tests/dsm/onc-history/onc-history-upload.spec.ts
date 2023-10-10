import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { shuffle } from 'utils/test-utils';
import path from 'path';
import { OsteoOncHistoryUpload } from 'dsm/component/tabs/interfaces/onc-history-inputs-types';
import { getDate } from 'utils/date-utils';

test.describe('Onc history', () => {
  // Upload feature is only available for Leiomyosarcoma and OS PE-CGS studies.
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  const oncHistory: OsteoOncHistoryUpload = {
    ACCESSION: '12983476',
    DATE_PX: getDate(),
    TYPE_PX: 'PX-478',
    LOCATION_PX: 'Pancreatic',
    HISTOLOGY: 'Unknown',
    FACILITY: 'Boston City Memorial Hospital',
    PHONE: '123-456-9990',
    DESTRUCTION: 'indefinitely',
    TUMOR_SIZE: '10 mm',
    VIABLE_TUMOR: 'Unknown',
    NECROSIS: 'Unknown',
    REQUEST_STATUS: 'Request',
    BLOCK_TO_REQUEST: 'No',
    RECORD_ID: ''
  }

  for (const study of studies) {
    test(`Upload @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      await test.step('Search for a participant without onc history', async () => {
        const pxColumn = 'Type of PX';
        const oncHistoryColumn = 'Onc History Created';

        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.ONC_HISTORY, [pxColumn]);
        await customizeViewPanel.selectColumns(CustomViewColumns.DSM_COLUMNS, [oncHistoryColumn]);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.text(pxColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
        await searchPanel.dates(oncHistoryColumn, { additionalFilters: [AdditionalFilter.EMPTY] });

        await searchPanel.search();
      });

      const numOfParticipants = await participantListTable.numOfParticipants();
      expect(numOfParticipants).toBeGreaterThanOrEqual(1);
      const newArray = shuffle([...Array(numOfParticipants).keys()]);
      const rowIndex = newArray[0];
      // RECORD_ID column corresponds to Short ID
      const shortId = await participantListTable.getParticipantDataAt(rowIndex, 'Short ID');
      oncHistory.RECORD_ID = shortId;

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(rowIndex);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;

    });
  }

  function fileForStudy(study: string, outputDir?: string): string {
    const dir = outputDir ? outputDir : __dirname;
    let prefix: string;
    switch (study) {
      case StudyEnum.LMS:
        prefix = 'LMS';
        break;
      case StudyEnum.OSTEO2:
        prefix = 'OSTEO2';
        break;
      default:
        throw new Error(`Study "${study}" is undefined`);
    }
    const file = path.join(dir, `${prefix}-Onc-History-${new Date().getTime()}.txt`);
    return file;
  }
});
