import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { getDate } from 'utils/date-utils';
import { Miscellaneous, Navigation, Study, StudyName } from 'dsm/navigation';
import OncHistoryUploadPage from 'dsm/pages/onc-history-upload-page';
import { logInfo } from 'utils/log-utils';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';
import { generateAlphaNumeric, generateRandomPhoneNum } from 'utils/faker-utils';
import { studyShortName } from 'utils/test-utils';
import { OsteoOncHistoryUpload } from 'dsm/component/models/onc-history-upload-interface';

test.describe('Upload Onc History', () => {
  // Upload feature is only available for Leiomyosarcoma and OS PE-CGS studies.
  const study = StudyName.OSTEO2;
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
    await participantListTable.changeRowCount(50);

    await test.step('Search for a participant without Onc history', async () => {
      // Find a participant with existing Onc History
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.ONC_HISTORY, [Label.REQUEST_STATUS]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
      await searchPanel.checkboxes(Label.REQUEST_STATUS, { checkboxValues: [DataFilter.REQUEST, DataFilter.RECEIVED] });

      const rows = await participantListTable.rowsCount;
      expect(rows).toBeGreaterThanOrEqual(1);

      // Find the first participant that has DSM and ES Participant ID.
      const basicStudyInfo = studyShortName(StudyName.OSTEO2);
      const playwrightTestUserPrefix = basicStudyInfo.playwrightPrefixAdult as string;
      shortId = await participantListPage.findParticipantWithTab({
        tab: Tab.ONC_HISTORY,
        uri: 'filterList',
        prefix: playwrightTestUserPrefix
      });
      expect(shortId).toBeTruthy();
      logInfo(`Participant Short ID: ${shortId}`);

      // RECORD_ID corresponds to Short ID in upload .txt file
      mockOncHistory.RECORD_ID = shortId;
    });

    await test.step('Upload text file', async () => {
      // From the 'Miscellaneous' menu, choose 'Onc History Upload'.
      await navigation.selectFromMiscellaneous(Miscellaneous.ONC_HISTORY_UPLOAD);
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
      participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      await participantListPage.filterListByShortId(shortId);
      const participantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable: OncHistoryTable = oncHistoryTab.table;

      const numRows = await oncHistoryTable.getRowsCount();
      expect(numRows).toBeGreaterThanOrEqual(1);

      let rowIndex = -1
      let match = false;
      for (let i = 0; i < numRows; i++) {
        const pxValue = await oncHistoryTable.getFieldValue(Label.TYPE_OF_PX, i);
        const dateValue = await oncHistoryTable.getFieldValue(Label.DATE_OF_PX, i);
        const faxValue = await oncHistoryTable.getFieldValue(Label.FAX, i);
        const phoneValue = await oncHistoryTable.getFieldValue(Label.PHONE, i);
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
