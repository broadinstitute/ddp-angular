import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, DataFilter, FileFormat, Label, SM_ID, Tab, TissueType } from 'dsm/enums';
import ParticipantPage from 'dsm/pages/participant-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { expect } from '@playwright/test';
import { getDate, getToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';
import { OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { StudyName } from 'dsm/navigation';
import { SequencingResultsEnum, TumorTypesEnum } from 'dsm/component/tissue';
import { DateFields } from 'dsm/component/models/tissue-inputs-interface';
import { assertParticipantListDownloadFileName, studyShortName } from 'utils/test-utils';
import * as XLSX from 'xlsx';
import path from 'path';
import { isNaN } from 'lodash';
import { unzip } from 'utils/file-utils';

// TODO Enable until bug PEPPER-1322 is fixed
test.describe('Tissue Request Flow', () => {
  const studies = [StudyName.PANCAN, StudyName.LMS, StudyName.OSTEO2];
  const researchStudies = [StudyName.PANCAN];
  const clinicalStudies = [StudyName.LMS, StudyName.OSTEO2];
  let testParticipantResidence: Label;
  let tissue;
  let testMaterialsReceivedValue: string;
  let today;
  let testRequestNotes: string;
  let ussSMIDOne;
  let ussSMIDTwo; //Two sm-ids for USS
  let scrollsSMIDOne;
  let scrollsSMIDTwo; //Two sm-ids for Scrolls
  let heSMIDOne;
  let heSMIDTwo; //Two sm-ids for H&E
  let isClinicalStudy: boolean;
  let isResearchStudy: boolean;
  let rowID: string;
  const dateOfPX: DateFields = {
    yyyy: new Date().getFullYear(),
    month: new Date().getMonth(),
    dayOfMonth: new Date().getDate()
  };

  for (const study of studies) {
    test(`Tissue Request Flow for ${study} study @dsm @feature`, async ({ page, request }, testInfo) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;
      let shortID = '';
      isClinicalStudy = clinicalStudies.includes(study);
      isResearchStudy = researchStudies.includes(study);

      await test.step('Search for the right participant', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.MEDICAL_RECORD, [Label.MR_PROBLEM]);
        await customizeViewPanel.selectColumns(CustomizeView.DSM_COLUMNS, [Label.ONC_HISTORY_CREATED]);
        testParticipantResidence = isResearchStudy ? Label.MAILING_ADDRESS : Label.YOUR_CONTACT_INFORMATION; //PE-CGS studies use the latter
        await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, [testParticipantResidence]);

        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.checkboxes(Label.MR_PROBLEM, { checkboxValues: [DataFilter.NO] });
        await searchPanel.dates(Label.ONC_HISTORY_CREATED, { additionalFilters: [DataFilter.EMPTY] });
        await searchPanel.text(testParticipantResidence, { additionalFilters: [DataFilter.NOT_EMPTY] });

        await searchPanel.search();
        const studyInfo = studyShortName(study);
        const prefixInfo = studyInfo.playwrightPrefixAdult as string;
        shortID = await participantListPage.findParticipantWithTab(
          { tab: Tab.ONC_HISTORY, uri: 'ui/filterList', prefix: prefixInfo}
        );
        expect(shortID?.length).toStrictEqual(6);
        logInfo(`Short id: ${shortID}`);
      });

      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
      await searchPanel.search();

      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;

      await test.step('Update Onc History data - Facility', async () => {
        await oncHistoryTable.fillField(Label.FACILITY, { inputValue: 'm', lookupIndex: 1 });
      });

      rowID = await oncHistoryTable.getRowID(Label.FACILITY, 0);

      await test.step('Automatically updated Onc History Created date', async () => {
        await participantPage.backToList();
        await expect(async () => {
          await page.reload();
          await participantListPage.waitForReady();
          await participantListPage.filterListByShortId(shortID);
          await participantListTable.openParticipantPageAt(0);
          const actualOncHistoryCreatedDate = await participantPage.oncHistoryCreatedDate(); // automatically calculated
          expect(actualOncHistoryCreatedDate, 'Onc History Date has not been updated').toStrictEqual(getToday());
        }).toPass({timeout: 60 * 1000});
      });

      await test.step('Update Onc History data - Date of PX', async () => {
        await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
        await oncHistoryTable.fillField(Label.DATE_OF_PX,
          {
            date: {
              date: dateOfPX
            }
          });
      });

      await test.step('Update Onc History data - Type of PX', async () => {
        await oncHistoryTable.fillField(Label.TYPE_OF_PX, { inputValue: 'a', lookupIndex: 4 });
      });

      await test.step('Update Onc History data - Request', async () => {
        await oncHistoryTable.fillField(Label.REQUEST, { selection: OncHistorySelectRequestEnum.REQUEST });
      });

      await test.step('Clicking Download PDF Bundle', async () => {
        await oncHistoryTable.assertRowSelectionCheckbox();
        await oncHistoryTable.selectRowAt(0);
        await oncHistoryTab.downloadPDFBundle();
      });

      await test.step('Select Cover PDF - Download Request Documents', async () => {
        await oncHistoryTable.selectRowAt(0);
        await oncHistoryTab.downloadRequestDocuments();
      });

      await participantPage.backToList();
      await participantListTable.openParticipantPageAt(0);
      await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const tissueInformationPage = await oncHistoryTable.openTissueRequestAt(0);

      await test.step('Downloading Tissue Request Documents - Updates Fax Sent', async () => {
        const faxSentDate1 = await tissueInformationPage.getFaxSentDate();
        const faxSentDate2 = await tissueInformationPage.getFaxSentDate(1);
        const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();
        expect(faxSentDate1.trim(), 'Fax sent date 1 is not set to today').toEqual(getToday());
        expect(faxSentDate2.trim(), 'Fax sent date 2 is not empty').toBe('');
        expect(tissueReceivedDate.trim(), 'Tissue received date is not empty').toBeFalsy();
      });

      await test.step('Enter Tissue Received', async () => {
        await tissueInformationPage.fillFaxSentDates({ today: true }, { today: true });
        await tissueInformationPage.fillTissueReceivedDate({ today: true });
        await tissueInformationPage.assertFaxSentDatesCount(2);
      });

      await test.step('Add Tissue Note', async () => {
        testRequestNotes = 'Test tissue notes';
        await tissueInformationPage.fillNotes(testRequestNotes);
      });

      await test.step('Add a destruction policy and click on Apply to All', async () => {
        await tissueInformationPage.fillDestructionPolicy(2233, false, true);
      });

      await test.step('Add Material count', async () => {
        testMaterialsReceivedValue = '21';
        tissue = tissueInformationPage.tissue();
        await tissue.fillField(Label.USS_UNSTAINED, { inputValue: testMaterialsReceivedValue });
        await tissue.fillField(Label.BLOCK, { inputValue: testMaterialsReceivedValue });
        await tissue.fillField(Label.H_E_PLURAL, { inputValue: testMaterialsReceivedValue });
        await tissue.fillField(Label.SCROLL, { inputValue: testMaterialsReceivedValue });
      });

      await test.step('Input SM-IDs for USS, Scrolls, and H&E', async () => {
        tissue = tissueInformationPage.tissue();

        //Setup 6 SM-IDs (must be unique) - use 2 for USS, 2 for Scrolls, 2 for H&E
        ussSMIDOne = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 6)}`;
        ussSMIDTwo = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 6)}`;

        scrollsSMIDOne = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 6)}`;
        scrollsSMIDTwo = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 6)}`;

        heSMIDOne = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 6)}`;
        heSMIDTwo = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 6)}`;

        const ussSMIDModal = await tissue.fillSMIDs(SM_ID.USS_SM_IDS);
        await ussSMIDModal.fillInputs([ussSMIDOne, ussSMIDTwo]);
        await ussSMIDModal.close();

        const scrollsSMIDModal = await tissue.fillSMIDs(SM_ID.SCROLLS_SM_IDS);
        await scrollsSMIDModal.fillInputs([scrollsSMIDOne, scrollsSMIDTwo]);
        await scrollsSMIDModal.close();

        const heSMIDModal = await tissue.fillSMIDs(SM_ID.H_E_SM_IDS);
        await heSMIDModal.fillInputs([heSMIDOne, heSMIDTwo]);
        await heSMIDModal.close();
      });

      await test.step(`Add tissue information that is possessed by all studies`, async () => {
        tissue = tissueInformationPage.tissue();
        //Add tissue notes
        await tissue.fillField(Label.NOTES, { inputValue: `Note created by Playwright on ${getToday()}` });

        //Add Tissue Type -> select 'Block'
        await tissue.fillField(Label.TISSUE_TYPE, { selection: TissueType.BLOCK });

        //Add Expected Return Date
        await tissue.fillField(Label.EXPECTED_RETURN_DATE, { date: { today: true } });

        //Add Return Date
        await tissue.fillField(Label.RETURN_DATE, { date: { today: true } });

        //Add Pathology Report
        await tissue.fillField(Label.PATHOLOGY_REPORT, { selection: 'Yes' });

        //Add the Tumor Collaborator Sample ID
        const suggestedValue = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
        console.log(`Suggested value: ${suggestedValue}`);
        const randomSampleID = `${suggestedValue}_PlaywrightID_${crypto.randomUUID().toString().substring(0, 5)}`;
        await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: randomSampleID });

        //Add Tumor Type
        await tissue.fillField(Label.TUMOR_TYPE, { selection: TumorTypesEnum.PRIMARY });

        //Add Tissue Site
        await tissue.fillField(Label.TISSUE_SITE, { inputValue: 'unknown tissue site' });

        //Add Block to SHL
        await tissue.fillField(Label.BLOCK_TO_SHL, { date: { today: true } });

        //Add Block ID to SHL - has a 10 character limit - should allow alpha-numerical characters
        const blockID = 'ABCDE123456'; //11 characters for testing purposes
        const expectedBlockID = `ABCDE12345`;
        await tissue.fillField(Label.BLOCK_ID_TO_SHL, { inputValue: blockID }); //TODO validate that only 10 characters were inputted

        //Add SHL Work Number
        await tissue.fillField(Label.SHL_WORK_NUMBER, { inputValue: `random work number` });

        //Add Scrolls back from SHL
        await tissue.fillField(Label.SCROLLS_BACK_FROM_SHL, { date: { today: true } });

        //Add Tumor Percentage as reproted by SHL
        await tissue.fillField(Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL, { inputValue: `28%` });

        //Add SK ID
        await tissue.fillField(Label.SK_ID, { inputValue: `random_${crypto.randomUUID().toString().substring(0, 4)}` });

        //Add First SM ID
        await tissue.fillField(Label.FIRST_SM_ID, { inputValue: `the_USS_SMID` });

        //Add SM ID for H&E
        await tissue.fillField(Label.SM_ID_FOR_H_E, { inputValue: `HE_${crypto.randomUUID().toString().substring(0, 5)}` });

        //Add Block ID
        await tissue.fillField(Label.BLOCK_ID, { inputValue: `someBlockID` });

        //Add Date Sent to GP
        await tissue.fillField(Label.DATE_SENT_TO_GP, { date: {today: true} });

        //Add Sequencing Results
        await tissue.fillField(Label.SEQUENCING_RESULTS, { selection: SequencingResultsEnum.EXTERNAL_PATH_REVIEW_FAILED });
      });

      if (isClinicalStudy) {
        await test.step('Add External Path Review information', async () => {
          tissue = tissueInformationPage.tissue();
          await tissue.fillField(Label.DATE_SENT_FOR_EXTERNAL_PATH_REVIEW, { date: {today: true} });
          await tissue.fillField(Label.DATE_RECEIVED_FROM_EXTERNAL_PATH_REVIEW, { date: {today: true} });
        });
      }

      await test.step('Go back to participant list to refresh and check if inputted information was saved', async () => {
        await tissueInformationPage.backToParticipantList();

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.search({ uri: 'filterList' });

        await participantListTable.openParticipantPageAt(0);
        await participantPage.waitForReady();

        await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
        const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
        const oncHistoryTable = oncHistoryTab.table;
        const tissueInformationButton = oncHistoryTable.getTissueInformationButtion(rowID);
        await tissueInformationButton.click();

        //Now in Tissue Request page - check the input for the main Tissue Request Section
        today = getToday();

        const faxSentDate = await tissueInformationPage.getFaxSentDate(0);
        expect(faxSentDate).toBe(today);

        const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();
        expect(tissueReceivedDate).toBe(today);

        const tissueReqestNotes = await tissueInformationPage.getNotes();
        expect(tissueReqestNotes).toBe(testRequestNotes);

        //Check the input for the tissue block
        tissue = tissueInformationPage.tissue();

        const ussUnstainedValue = await tissue.getFieldValue(Label.USS_UNSTAINED);
        expect(ussUnstainedValue).toBe(testMaterialsReceivedValue);

        const blockValue = await tissue.getFieldValue(Label.BLOCK);
        expect(blockValue).toBe(testMaterialsReceivedValue);

        const heValue = await tissue.getFieldValue(Label.H_E_PLURAL);
        expect(heValue).toBe(testMaterialsReceivedValue);

        const scrollValue = await tissue.getFieldValue(Label.SCROLL);
        expect(scrollValue).toBe(testMaterialsReceivedValue);

        //TODO check that the SMIDs have been saved

        const expectedReturnDate = await tissue.getFieldValue(Label.EXPECTED_RETURN_DATE);
        expect(expectedReturnDate).toBe(today);

        const returnDate = await tissue.getFieldValue(Label.RETURN_DATE);
        expect(returnDate).toBe(today);

        if (isClinicalStudy) {
          const dateSentForExternalPathReview = await tissue.getFieldValue(Label.DATE_SENT_FOR_EXTERNAL_PATH_REVIEW);
          expect(dateSentForExternalPathReview).toBe(today);

          const dateReceivedFromExternalPathReview = await tissue.getFieldValue(Label.DATE_RECEIVED_FROM_EXTERNAL_PATH_REVIEW);
          expect(dateReceivedFromExternalPathReview).toBe(today);
        }
      });

      await test.step('Go back to participant list to add External Path Review dates and confirm they appear in Ptp List Download', async () => {
        if (isClinicalStudy) {
          //Go back to Pariticpant List
          await tissueInformationPage.backToParticipantList();
          await participantListPage.waitForReady();

          //Add the following columns to the Participant List: Date Sent For External Path Review, Date Received From External Path Review
          const customizeViewPanel = participantListPage.filters.customizeViewPanel;
          await customizeViewPanel.open();
          await customizeViewPanel.selectColumns(
            'Tissue Columns',
            [Label.DATE_SENT_FOR_EXTERNAL_PATH_REVIEW, Label.DATE_RECEIVED_FROM_EXTERNAL_PATH_REVIEW]
          );
          await customizeViewPanel.close();

          //Download the Participant List
          const download = await participantListPage.downloadParticipant({ fileFormat: FileFormat.XLSX });
          assertParticipantListDownloadFileName(download, study);

          const dir = testInfo.outputDir;
          const fileName = download.suggestedFilename();
          const zipFile = path.join(dir, fileName);

          await download.saveAs(zipFile);
          expect(zipFile.endsWith('.zip')).toBeTruthy();
          const targetFilePath = zipFile.split('.zip')[0];

          const unzipFiles: string[] = unzip(zipFile, targetFilePath);
          // Two files in zip
          expect(unzipFiles.length).toStrictEqual(2);
          expect(unzipFiles).toContain('DataDictionary.xlsx');
          const [participantXlsx] = unzipFiles.filter(file => file.startsWith('Participant-') && file.endsWith('.xlsx'));

          // Verify External Path Review dates in Excel download file
          const xlsxFilePath = path.join(targetFilePath, participantXlsx);
          const xlsxWorkbook = XLSX.readFile(xlsxFilePath);
          const worksheet = xlsxWorkbook.Sheets[xlsxWorkbook.SheetNames[0]]; // First Worksheet

          const json = XLSX.utils.sheet_to_json(worksheet, {range: 1}); // use second row for header
          // Iterate rows to verify format of Registration Date
          json.map((row: any) => {
            const sentDate = row['Date Sent for External Path Review'].trim();
            const receivedDate = row['Date Received from External Path Review'].trim();
            console.log(`Analyzing External Path Review -> Sent Date: ${sentDate}`);
            console.log(`Analyzing External Path Review -> Received Date: ${receivedDate}`);
      });
        }
      });

      //TODO Add back/uncomment when PEPPER-1322 is fixed
      /*await test.step('Deleting OncHistory tab row', async () => {
        const tissue = await tissueInformationPage.addTissue();
        await tissue.delete();
      });*/
    })
  }
});
