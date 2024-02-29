import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { OncHistoryInputColumnsEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { expect } from '@playwright/test';
import { getDate } from 'utils/date-utils';
import { TissueDynamicFieldsEnum } from 'dsm/pages/tissue/enums/tissue-information-enum';
import { logInfo } from 'utils/log-utils';

test.describe.serial('Tissue Request Flow', () => {
  const studies = [StudyEnum.PANCAN];

  for (const study of studies) {
    test(`Tissue Request Flow for ${study} study @dsm @feature`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;
      let shortID = '';

      await test.step('Search for the right participant', async () => {
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
          { findPediatricParticipant: false, tab: Tab.ONC_HISTORY, uriString: 'ui/filterList'}
        );
        expect(shortID?.length).toStrictEqual(6);
        logInfo(`Short id: ${shortID}`);
      })

      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
      await searchPanel.search();

      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;

      await test.step('Update Onc History data - Facility', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: 'm', lookupSelectIndex: 1 });
      })

      await test.step('Automatically updated Onc History Created date', async () => {
        const expectedDate = getDate();
        await participantPage.backToList();
        await expect(async () => {
          await page.reload();
          await participantListPage.waitForReady();
          await participantListPage.filterListByShortId(shortID);
          await participantListTable.openParticipantPageAt(0);
          const actualOncHistoryCreatedDate = await participantPage.oncHistoryCreatedDate();
          expect(actualOncHistoryCreatedDate, 'Onc History Date has not been updated').toStrictEqual(expectedDate);
        }).toPass({timeout: 60 * 1000});
      })

      await test.step('Update Onc History data - Date of PX', async () => {
        await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
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
      await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
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
