import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { OncHistoryInputColumnsEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { expect } from '@playwright/test';
import { getDate } from 'utils/date-utils';
import { TissueDynamicFieldsEnum } from 'dsm/pages/tissue/enums/tissue-information-enum';
import { logInfo } from 'utils/log-utils';

test.describe('Tissue Request Flow', () => {
  const studies = [StudyEnum.PANCAN];

  for (const study of studies) {
    test(`Tissue Request Flow for ${study} study @dsm @feature`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;
      let shortID = '';

      await test.step('Search for the right participant', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Medical Record Columns', ['MR Problem']);
        await customizeViewPanel.selectColumns('Medical Record Columns', ['Institution Name']);
        await customizeViewPanel.selectColumns('Participant - DSM Columns', ['Onc History Created']);
        await customizeViewPanel.selectColumns('Research Consent Form Columns', ['Your Mailing Address *']);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes('MR Problem', { checkboxValues: ['No'] });
        await searchPanel.dates('Onc History Created', { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.text('Your Mailing Address *', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
        await searchPanel.text('Institution Name', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

        await searchPanel.search();
        shortID = await participantListPage.findParticipantWithTab(
          { findPediatricParticipant: false, tab: TabEnum.ONC_HISTORY, uriString: 'ui/filterList'}
        );
        logInfo(`Short id: ${shortID}`);
        await searchPanel.open();
        await searchPanel.text('Short ID', { textValue: shortID });
        await searchPanel.search();
      })

      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;

      await test.step('Update Onc History data - Facility', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: 'm', lookupSelectIndex: 1 });
      })

      await test.step('Automatically updated Onc History Created date', async () => {
        await participantPage.backToList();
        await participantListTable.openParticipantPageAt(0);

        const oncHistoryCreatedDate = participantPage.oncHistoryCreatedDate();
        expect(oncHistoryCreatedDate, 'Onc History Date has not been updated').toBeTruthy();
      })

      await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);

      await test.step('Update Onc History data - Date of PX', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX,
          {
            date: {
              date: {
                yyyy: new Date().getFullYear(),
                month: new Date().getMonth(),
                dayOfMonth: new Date().getDate()
              }
            }
          });
      })

      await test.step('Update Onc History data - Type of PX', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TYPE_OF_PX, { value: 'a', lookupSelectIndex: 4 });
      })

      await test.step('Update Onc History data - Request', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, { select: OncHistorySelectRequestEnum.REQUEST });
      })

      await test.step('Clicking Download PDF Bundle', async () => {
        await oncHistoryTable.assertRowSelectionCheckbox();
        await oncHistoryTable.selectRowAt(0);
        await oncHistoryTab.downloadPDFBundle();
      })

      await test.step('Select Cover PDF - Download Request Documents', async () => {
        await oncHistoryTable.selectRowAt(0);
        await oncHistoryTab.downloadRequestDocuments();
      })

      await participantPage.backToList();
      await participantListTable.openParticipantPageAt(0);
      await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(0);

      await test.step('Downloading Tissue Request Documents - Updates Fax Sent', async () => {
        const faxSentDate1 = await tissueInformationPage.getFaxSentDate();
        const faxSentDate2 = await tissueInformationPage.getFaxSentDate(1);
        const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();
        expect(faxSentDate1.trim(), 'Fax sent date 1 is not set to today').toEqual(getDate());
        expect(faxSentDate2.trim(), 'Fax sent date 2 is not empty').toBe('');
        expect(tissueReceivedDate.trim(), 'Tissue received date is not empty').toBeFalsy();
      })

      await test.step('Enter Tissue Received', async () => {
        await tissueInformationPage.fillFaxSentDates({ today: true }, { today: true });
        await tissueInformationPage.fillTissueReceivedDate({ today: true });
        await tissueInformationPage.assertFaxSentDatesCount(2);
      })

      await test.step('Add Tissue Note', async () => {
        await tissueInformationPage.fillNotes('Test tissue notes');
      })

      await test.step('Add a destruction policy and click on Apply to All', async () => {
        await tissueInformationPage.fillDestructionPolicy(2233, false, true);
      })

      await test.step('Add Material count', async () => {
        const testValue = 21;
        const tissue = await tissueInformationPage.tissue();
        await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: testValue });
        await tissue.fillField(TissueDynamicFieldsEnum.BLOCK, { inputValue: testValue });
        await tissue.fillField(TissueDynamicFieldsEnum.H_E, { inputValue: testValue });
        await tissue.fillField(TissueDynamicFieldsEnum.SCROLL, { inputValue: testValue });
      })

      await test.step('Deleting OncHistory tab row', async () => {
        await tissueInformationPage.addTissue();
        await tissueInformationPage.deleteTissueAt(1);
      })
    })
  }
});
