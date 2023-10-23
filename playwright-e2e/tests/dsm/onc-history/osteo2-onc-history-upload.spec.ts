import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import { shuffle } from 'utils/test-utils';
import { OsteoOncHistoryUpload } from 'dsm/component/tabs/interfaces/onc-history-inputs-types';
import { getDate } from 'utils/date-utils';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import OncHistoryUploadPage from 'dsm/pages/onc-history-upload-page';
import { OncHistoryInputColumnsEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { logInfo } from 'utils/log-utils';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';
import { generateAlphaNumeric, generateRandomPhoneNum } from 'utils/faker-utils';

test.describe('Upload Onc History', () => {
  // Upload feature is only available for Leiomyosarcoma and OS PE-CGS studies.
  const study = StudyEnum.OSTEO2;
  let shortId: string;
  // Create unique values to be used in upload file
  const today = getDate();
  const phone = generateRandomPhoneNum();
  const fax = generateRandomPhoneNum();
  const pxType = generateAlphaNumeric(10);
  const assession = generateAlphaNumeric(10);

  const mockOncHistory: OsteoOncHistoryUpload = {
    ACCESSION: assession,
    DATE_PX: today,
    TYPE_PX: pxType,
    LOCATION_PX: 'Pancreatic',
    HISTOLOGY: '',
    FACILITY: 'BostonMemorial',
    PHONE: phone,
    FAX: fax,
    DESTRUCTION: 'indefinitely',
    TUMOR_SIZE: '',
    BLOCKS_WITH_TUMOR: '',
    VIABLE_TUMOR: 'No',
    NECROSIS: '',
    REQUEST_STATUS: 'request', //  Valid values are: [review, no, hold, request, sent, received, returned, unableObtainTissue]
    BLOCK_TO_REQUEST: '',
    DECALCIFICATION: 'EDTA',
    FFPE: 'Unknown',
    LOCAL_CONTROL: 'Yes',
    RECORD_ID: ''
  }

  test(`Upload for study @osteo2 @dsm`, async ({ page, request }, testInfo) => {
    const testResultDir = testInfo.outputDir;
    const navigation = new Navigation(page, request);

    let participantListPage = await ParticipantListPage.goto(page, study, request);
    const participantListTable = participantListPage.participantListTable;

    await test.step('Search for a participant without Onc history', async () => {
      // Find a participant with existing Onc History
      const oncHistoryRequestStatusColumn = 'Request Status';

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomViewColumns.ONC_HISTORY, [oncHistoryRequestStatusColumn]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
      await searchPanel.checkboxes(oncHistoryRequestStatusColumn, { checkboxValues: ['Request'] });
      await searchPanel.search();
    });

    await test.step('Create mocked text file', async () => {
      const rows = await participantListTable.rowsCount;
      expect(rows).toBeGreaterThanOrEqual(1);
      // Pick a random participant Short ID
      const newArray = shuffle([...Array(rows).keys()]);
      const rowIndex = newArray[0];
      // RECORD_ID corresponds to Short ID in upload .txt file
      shortId = await participantListTable.getParticipantDataAt(rowIndex, 'Short ID');
      mockOncHistory.RECORD_ID = shortId;
      logInfo(`Participant Short ID: ${shortId}`);
    });

    await test.step('Upload text file', async () => {
      // From the 'Miscellaneous' menu, choose 'Onc History Upload'.
      await navigation.selectMiscellaneous(MiscellaneousEnum.ONC_HISTORY_UPLOAD);
      const oncHistoryPage = new OncHistoryUploadPage(page);
      await oncHistoryPage.waitForReady();

      // The upload files must be tab separated. Other formats are invalid
      const keys = Object.keys(mockOncHistory).join('\t');
      const values = Object.values(mockOncHistory).join('\t');
      const data = [keys, values].join('\n');

      await oncHistoryPage.uploadFile(study, data, testResultDir);
      await expect(page.locator('.message')).toHaveText(/Upload successful/);
    });

    await test.step('Verify new Onc History', async () => {
      // Confirm Onc history. Duplicate records are valid.
      participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      await participantListPage.filterListByShortId(shortId);
      const participantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable: OncHistoryTable = oncHistoryTab.table;

      const numRows = await oncHistoryTable.getRowsCount();
      expect(numRows).toBeGreaterThanOrEqual(1);

      let rowIndex = -1
      let match = false;
      for (let i = 0; i < numRows; i++) {
        const pxValue = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TYPE_OF_PX, i);
        const dateValue = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.DATE_OF_PX, i);
        const faxValue = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FAX, i);
        const phoneValue = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.PHONE, i);
        if (pxValue === pxType && dateValue === today && faxValue === fax && phoneValue === phone) {
          rowIndex = i;
          match = true;
          break;
        }
      }
      expect(match).toBe(true);

      // Clean up
      await oncHistoryTable.deleteRowAt(rowIndex);
    });
  });
});
