import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, DataFilter, FileFormat, Label, SM_ID, Tab, TissueType } from 'dsm/enums';
import ParticipantPage from 'dsm/pages/participant-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { expect } from '@playwright/test';
import { getDate, getDateinISOFormat, getToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';
import { OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { StudyName } from 'dsm/navigation';
import { SequencingResultsEnum as SequencingResults, TumorTypesEnum as TumorTypes } from 'dsm/component/tissue';
import { DateFields } from 'dsm/component/models/tissue-inputs-interface';
import { assertParticipantListDownloadFileName, studyShortName } from 'utils/test-utils';
import * as XLSX from 'xlsx';
import path from 'path';
import { unzip } from 'utils/file-utils';

// TODO Enable until bug PEPPER-1322 is fixed
test.describe('Tissue Request Flow', () => {
  const studies = [StudyName.PANCAN, StudyName.LMS, StudyName.OSTEO2];
  const researchStudies = [StudyName.PANCAN];
  const clinicalStudies = [StudyName.LMS, StudyName.OSTEO2];
  const destructionPolicy = 2233;
  const expectedBlockIDToSHL = `ABCDE12345`;
  const testParticipantGender = 'Female';
  const testMaterialsReceivedValue = '21';
  const tissueTypeBlock = TissueType.BLOCK;
  const tumorTypePrimary = TumorTypes.PRIMARY;
  const tissueSiteNotes = 'unknown tissue site';
  const pathologyReportYes = 'Yes';
  const shlWorkNumber = 'not random work number 123';
  const tumorPercentageReportedBySHL = '28%';
  const firstSMID = 'the_USS_SMID';
  const blockID = 'someBlockID';
  const sequencingResults = SequencingResults.SUCCESS_CLINICAL;
  const sequencingResultsDownloadName = 'successClinicalTumor';
  let testParticipantResidence: Label;
  let tissue;
  let today: string;
  let todayInISOFormat: string;
  let testRequestNotes: string;
  let tissueTestNotes: string;
  let ussSMIDOne: string;
  let ussSMIDTwo: string; //Two sm-ids for USS
  let scrollsSMIDOne: string;
  let scrollsSMIDTwo: string; //Two sm-ids for Scrolls
  let heSMIDOne: string;
  let heSMIDTwo: string; //Two sm-ids for H&E
  let isClinicalStudy: boolean;
  let isResearchStudy: boolean;
  let rowID: string;
  let trackingNumber: string;
  let tumorCollaboratorSampleID: string;
  let skID: string;
  let smidForHE: string;
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
      today = getToday();
      todayInISOFormat = getDateinISOFormat(today);

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
          expect(actualOncHistoryCreatedDate, 'Onc History Date has not been updated').toStrictEqual(today);
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
        //TODO Investigate why the 2nd fax sent date seems to get filled out later in the test (seems to be only when automated test interacts with page)
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
        await tissueInformationPage.fillDestructionPolicy(destructionPolicy, false, true);
      });

      await test.step('Add gender', async () => {
        await tissueInformationPage.selectGender(testParticipantGender);
      });

      await test.step('Add Material count', async () => {
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

        const ussSMIDModal = await tissue.getSMIDModal(SM_ID.USS_SM_IDS);
        await ussSMIDModal.fillInputs([ussSMIDOne, ussSMIDTwo]);
        await ussSMIDModal.close();

        const scrollsSMIDModal = await tissue.getSMIDModal(SM_ID.SCROLLS_SM_IDS);
        await scrollsSMIDModal.fillInputs([scrollsSMIDOne, scrollsSMIDTwo]);
        await scrollsSMIDModal.close();

        const heSMIDModal = await tissue.getSMIDModal(SM_ID.H_E_SM_IDS);
        await heSMIDModal.fillInputs([heSMIDOne, heSMIDTwo]);
        await heSMIDModal.close();
      });

      await test.step(`Add tissue information that is possessed by all studies`, async () => {
        tissue = tissueInformationPage.tissue();
        //Add tissue notes
        tissueTestNotes = `Note created by Playwright on ${getToday()}`;
        await tissue.fillField(Label.NOTES, { inputValue: tissueTestNotes });

        //Add Tissue Type -> select 'Block'
        await tissue.fillField(Label.TISSUE_TYPE, { selection: tissueTypeBlock });

        //Add Expected Return Date
        await tissue.fillField(Label.EXPECTED_RETURN_DATE, { date: { today: true } });

        //Add Return Date
        await tissue.fillField(Label.RETURN_DATE, { date: { today: true } });

        //Add Pathology Report
        await tissue.fillField(Label.PATHOLOGY_REPORT, { selection: pathologyReportYes });

        //Add the Tumor Collaborator Sample ID
        const suggestedValue = await tissue.getTumorCollaboratorSampleIDSuggestedValue(); //Usually seems to return the short id
        tumorCollaboratorSampleID = `${suggestedValue}_PlaywrightID_${crypto.randomUUID().toString().substring(0, 5)}`;
        await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorCollaboratorSampleID });

        //Add Tumor Type
        await tissue.fillField(Label.TUMOR_TYPE, { selection: tumorTypePrimary });

        //Add Tissue Site
        await tissue.fillField(Label.TISSUE_SITE, { inputValue: tissueSiteNotes });

        //Add Block to SHL
        await tissue.fillField(Label.BLOCK_TO_SHL, { date: { today: true } });

        //Add Block ID to SHL - has a 10 character limit - should allow alpha-numerical characters
        const blockIDToSHL = 'ABCDE123456'; //11 characters for testing purposes
        await tissue.fillField(Label.BLOCK_ID_TO_SHL, { inputValue: blockIDToSHL }); //TODO validate that only 10 characters were inputted

        //Add SHL Work Number
        await tissue.fillField(Label.SHL_WORK_NUMBER, { inputValue: shlWorkNumber });

        //Add Scrolls back from SHL
        await tissue.fillField(Label.SCROLLS_BACK_FROM_SHL, { date: { today: true } });

        //Add Tumor Percentage as reproted by SHL
        await tissue.fillField(Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL, { inputValue: tumorPercentageReportedBySHL });

        //Add SK ID
        skID = `random_${crypto.randomUUID().toString().substring(0, 4)}`;
        await tissue.fillField(Label.SK_ID, { inputValue: skID });

        //Add First SM ID
        await tissue.fillField(Label.FIRST_SM_ID, { inputValue: firstSMID });

        //Add SM ID for H&E
        smidForHE = `HE_${crypto.randomUUID().toString().substring(0, 5)}`;
        await tissue.fillField(Label.SM_ID_FOR_H_E, { inputValue: smidForHE });

        //Add Block ID
        await tissue.fillField(Label.BLOCK_ID, { inputValue: blockID });

        //Add Date Sent to GP
        await tissue.fillField(Label.DATE_SENT_TO_GP, { date: {today: true} });
      });

      if (isClinicalStudy) {
        await test.step('Add External Path Review information', async () => {
          tissue = tissueInformationPage.tissue();
          await tissue.fillField(Label.DATE_SENT_FOR_EXTERNAL_PATH_REVIEW, { date: {today: true} });
          await tissue.fillField(Label.DATE_RECEIVED_FROM_EXTERNAL_PATH_REVIEW, { date: {today: true} });
        });

        await test.step('Add Sequencing Results', async () => {
          //Only clinical studies should be allow to input sequencing results - dropdown appears in research studies - known bug - tracked by PEPPER-1246
          tissue = tissueInformationPage.tissue();
          await tissue.fillField(Label.SEQUENCING_RESULTS, { selection: sequencingResults });
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
        const faxSentDate = await tissueInformationPage.getFaxSentDate(0);
        expect(faxSentDate).toBe(today);

        const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();
        expect(tissueReceivedDate).toBe(today);

        const tissueReqestNotes = await tissueInformationPage.getNotes();
        expect(tissueReqestNotes).toBe(testRequestNotes);

        const inputtedDestructionPolicy = await tissueInformationPage.getDestructionPolicy();
        expect(inputtedDestructionPolicy).toBe(destructionPolicy);

        const selectedGender = await tissueInformationPage.getSelectedGender();
        expect(selectedGender).toBe(testParticipantGender);

        //Check the input for the tissue block
        tissue = tissueInformationPage.tissue();

        //Tissue notes field
        const tissueNotes = await tissue.getFieldValue(Label.NOTES);
        expect(tissueNotes).toBe(tissueTestNotes);

        /* Materials Received Section Verification */
        const ussUnstainedValue = await tissue.getFieldValue(Label.USS_UNSTAINED);
        expect(ussUnstainedValue).toBe(testMaterialsReceivedValue);

        const blockValue = await tissue.getFieldValue(Label.BLOCK);
        expect(blockValue).toBe(testMaterialsReceivedValue);

        const heValue = await tissue.getFieldValue(Label.H_E_PLURAL);
        expect(heValue).toBe(testMaterialsReceivedValue);

        const scrollValue = await tissue.getFieldValue(Label.SCROLL);
        expect(scrollValue).toBe(testMaterialsReceivedValue);

        /* SM-IDs Verification */
        //Check for the 2 previously inputted USS SM-IDs
        const ussSMIDModal = await tissue.getSMIDModal(SM_ID.USS_SM_IDS);
        const retreivedUSSOne = await ussSMIDModal.getValueAt(0);
        const retrievedUSSTwo = await ussSMIDModal.getValueAt(1);
        expect(retreivedUSSOne).toBe(ussSMIDOne);
        expect(retrievedUSSTwo).toBe(ussSMIDTwo);
        await ussSMIDModal.close();

        //Check for the 2 previously inputted Scrolls SM-IDs
        const scrollsSMIDModal = await tissue.getSMIDModal(SM_ID.SCROLLS_SM_IDS);
        const retrievedScrollsOne = await scrollsSMIDModal.getValueAt(0);
        const retreivedScrollsTwo = await scrollsSMIDModal.getValueAt(1);
        expect(retrievedScrollsOne).toBe(scrollsSMIDOne);
        expect(retreivedScrollsTwo).toBe(scrollsSMIDTwo);
        await scrollsSMIDModal.close();

        //Check for the 2 previously inputted H&E SM-IDs
        const heSMIDModal = await tissue.getSMIDModal(SM_ID.H_E_SM_IDS);
        const retrievedHEOne = await heSMIDModal.getValueAt(0);
        const retrievedHETwo = await heSMIDModal.getValueAt(1);
        expect(retrievedHEOne).toBe(heSMIDOne);
        expect(retrievedHETwo).toBe(heSMIDTwo);
        await heSMIDModal.close();

        /* Return Dates Verification */
        const expectedReturnDate = await tissue.getFieldValue(Label.EXPECTED_RETURN_DATE);
        expect(expectedReturnDate).toBe(today);

        const returnDate = await tissue.getFieldValue(Label.RETURN_DATE);
        expect(returnDate).toBe(today);

        /* Tissue Type, Tumor Type, Tissue Site Verification*/
        const inputtedTissueType = await tissue.getFieldValue(Label.TISSUE_TYPE);
        expect(inputtedTissueType).toBe(tissueTypeBlock);

        const inputtedTumorType = await tissue.getFieldValue(Label.TUMOR_TYPE);
        expect(inputtedTumorType).toBe(tumorTypePrimary);

        const inputtedTissueSiteNotes = await tissue.getFieldValue(Label.TISSUE_SITE);
        expect(inputtedTissueSiteNotes).toBe(tissueSiteNotes);

        /* Tracking Number Input */
        //Tracking Number field seems to display after revisiting the Tissue Request page
        trackingNumber = `Playwright_${crypto.randomUUID().toString().substring(0, 7)}`;
        await tissue.fillField(Label.TRACKING_NUMBER, { inputValue: trackingNumber });

        /* Pathology Report, Tumor Collaborator Sample ID Verification */
        const inputtedPathologyReportValue = await tissue.getFieldValue(Label.PATHOLOGY_REPORT);
        expect(inputtedPathologyReportValue).toBe(pathologyReportYes);

        const inputtedSampleID = await tissue.getFieldValue(Label.TUMOR_COLLABORATOR_SAMPLE_ID);
        expect(inputtedSampleID).toBe(tumorCollaboratorSampleID);

        /* Block to SHL, Block ID to SHL, SHL Work Number, Scrolls back from SHL date, Tumor Percentage as Reported By SHL Verification */
        const inputtedBlockToSHLDate = await tissue.getFieldValue(Label.BLOCK_TO_SHL);
        expect(inputtedBlockToSHLDate).toBe(today);

        //Previously inputted 11 chars, expecting only the first 10 chars to have been saved
        const retreivedBlockIDToSHL = await tissue.getFieldValue(Label.BLOCK_ID_TO_SHL);
        expect(retreivedBlockIDToSHL).toBe(expectedBlockIDToSHL);
        expect(retreivedBlockIDToSHL.length).toBe(10);

        const inputtedSHLWorkNumber = await tissue.getFieldValue(Label.SHL_WORK_NUMBER);
        expect(inputtedSHLWorkNumber).toBe(shlWorkNumber);

        const inputtedScrollsBackFromSHLDate = await tissue.getFieldValue(Label.SCROLLS_BACK_FROM_SHL);
        expect(inputtedScrollsBackFromSHLDate).toBe(today);

        const inputtedTumorPercentageReportedBySHL = await tissue.getFieldValue(Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL);
        expect(inputtedTumorPercentageReportedBySHL).toBe(tumorPercentageReportedBySHL);

        /* SK ID, First SM ID, SM ID for H&E Verification */
        const inputtedSKID = await tissue.getFieldValue(Label.SK_ID);
        expect(inputtedSKID).toBe(skID);

        const inputtedFirstSMID = await tissue.getFieldValue(Label.FIRST_SM_ID);
        expect(inputtedFirstSMID).toBe(firstSMID);

        const inputtedSMIDForHE = await tissue.getFieldValue(Label.SM_ID_FOR_H_E);
        expect(inputtedSMIDForHE).toBe(smidForHE);

        /* Block ID Verification */
        const inputtedBlockID = await tissue.getFieldValue(Label.BLOCK_ID);
        expect(inputtedBlockID).toBe(blockID);

        /* Date Sent to GP Verification */
        const inputtedDateSentToGP = await tissue.getFieldValue(Label.DATE_SENT_TO_GP);
        expect(inputtedDateSentToGP).toBe(today);

        /* External Path Review, Sequencing Results Verification */
        if (isClinicalStudy) {
          //External Path Review
          const dateSentForExternalPathReview = await tissue.getFieldValue(Label.DATE_SENT_FOR_EXTERNAL_PATH_REVIEW);
          expect(dateSentForExternalPathReview).toBe(today);

          const dateReceivedFromExternalPathReview = await tissue.getFieldValue(Label.DATE_RECEIVED_FROM_EXTERNAL_PATH_REVIEW);
          expect(dateReceivedFromExternalPathReview).toBe(today);

          //Sequencing Results
          const inputtedSequencingResults = await tissue.getFieldValue(Label.SEQUENCING_RESULTS);
          expect(inputtedSequencingResults).toBe(sequencingResults);
        }
      });

      await test.step('Go back to participant list to add External Path Review dates and confirm they appear in Ptp List Download', async () => {
        //Go back to Pariticpant List
        await tissueInformationPage.backToParticipantList();
        await participantListPage.waitForReady();

        //Add the following columns to the Participant List: Date Sent For External Path Review, Date Received From External Path Review
        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(
          'Tissue Columns',
          [
            Label.BLOCK_ID,
            Label.BLOCK_ID_TO_SHL,
            Label.BLOCK_TO_SHL,
            Label.BLOCK,
            Label.DATE_SENT_TO_GP,
            Label.EXPECTED_RETURN_DATE,
            Label.FIRST_SM_ID,
            Label.H_E_PLURAL,
            Label.PATHOLOGY_REPORT,
            Label.RETURN_DATE,
            Label.SCROLL,
            Label.SCROLLS_BACK_FROM_SHL,
            Label.SHL_WORK_NUMBER,
            Label.SK_ID,
            Label.SM_ID_FOR_H_E,
            Label.SM_ID_VALUE,
            Label.TISSUE_NOTES,
            Label.TISSUE_TYPE,
            Label.TISSUE_SITE,
            Label.TRACKING_NUMBER,
            Label.TUMOR_COLLABORATOR_SAMPLE_ID,
            Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL,
            Label.TUMOR_TYPE,
            Label.USS_UNSTAINED
          ]
        );
        if (isClinicalStudy) {
          await customizeViewPanel.selectColumns(
            'Tissue Columns',
            [
              Label.DATE_SENT_FOR_EXTERNAL_PATH_REVIEW,
              Label.DATE_RECEIVED_FROM_EXTERNAL_PATH_REVIEW,
              Label.SEQUENCING_RESULTS,
            ]
          );
        }
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

        // Verify previously inputted Tissue Request input in Excel download file
        const xlsxFilePath = path.join(targetFilePath, participantXlsx);
        const xlsxWorkbook = XLSX.readFile(xlsxFilePath);
        const worksheet = xlsxWorkbook.Sheets[xlsxWorkbook.SheetNames[0]]; // First Worksheet

        const json = XLSX.utils.sheet_to_json(worksheet, {range: 1}); // use second row for header
        // Iterate rows to verify that the Tissue Request input is able to be exported
        json.map((columnHeaderInRow: any) => {
          const downloadedBlockID = columnHeaderInRow['Block Id'].trim();
          logInfo(`Analyzing Block Id -> Value: ${downloadedBlockID}`);
          expect(downloadedBlockID).toBe(blockID);

          const downloadedBlockIDToSHL = columnHeaderInRow['Block ID to SHL'].trim();
          logInfo(`Analyzing Block ID to SHL -> Value: ${downloadedBlockIDToSHL}`);
          expect(downloadedBlockIDToSHL).toBe(expectedBlockIDToSHL);

          const downloadedBlockToSHL = columnHeaderInRow['Block to SHL'].trim();
          logInfo(`Analyzing Block to SHL -> Value: ${downloadedBlockToSHL}`);
          expect(downloadedBlockToSHL).toBe(todayInISOFormat);

          const downloadedMaterialsReceivedForBlocks = columnHeaderInRow['Block(s)'].trim();
          logInfo(`Analyzing Materials Received for Blocks -> Value: ${downloadedMaterialsReceivedForBlocks}`);
          expect(downloadedMaterialsReceivedForBlocks).toBe(testMaterialsReceivedValue);

          const downloadedDateSentToGP = columnHeaderInRow['Date sent to GP'].trim();
          logInfo(`Analyzing Date Sent to GP -> Value: ${downloadedDateSentToGP}`);
          expect(downloadedDateSentToGP).toBe(todayInISOFormat);

          const downloadedExpectedReturnDate = columnHeaderInRow['Expected Return Date'].trim();
          logInfo(`Analyzing Expected Return Date -> Value: ${downloadedExpectedReturnDate}`);
          expect(downloadedExpectedReturnDate).toBe(todayInISOFormat);

          const downloadedFirstSMID = columnHeaderInRow['First SM ID'].trim();
          logInfo(`Analyzing First SM ID -> Value: ${downloadedFirstSMID}`);
          expect(downloadedFirstSMID).toBe(firstSMID);

          const downloadedMaterialsReceivedForHE = columnHeaderInRow['H&E(s)'].trim();
          logInfo(`Analyzing Materials Received for H&E -> Value: ${downloadedMaterialsReceivedForHE}`);
          expect(downloadedMaterialsReceivedForHE).toBe(testMaterialsReceivedValue);

          const downloadedPathologyReportResponse = columnHeaderInRow['Pathology Report'].trim();
          logInfo(`Analyzing Pathology Report -> Value: ${downloadedPathologyReportResponse}`);
          expect(downloadedPathologyReportResponse).toBe(pathologyReportYes.toLowerCase());

          const downloadedReturnDate = columnHeaderInRow['Return Date'].trim();
          logInfo(`Analyzing Return Date -> Value: ${downloadedReturnDate}`);
          expect(downloadedReturnDate).toBe(todayInISOFormat);

          const downloadedMaterialsReceivedForScrolls = columnHeaderInRow['Scroll(s)'].trim();
          logInfo(`Analyzing Materials Received for Scroll(s) -> Value: ${downloadedMaterialsReceivedForScrolls}`);
          expect(downloadedMaterialsReceivedForScrolls).toBe(testMaterialsReceivedValue);

          const downloadedScrollsBackFromSHL = columnHeaderInRow['Scrolls back from SHL'].trim();
          logInfo(`Analyzing Scrolls back from SHL -> Value: ${downloadedScrollsBackFromSHL}`);
          expect(downloadedScrollsBackFromSHL).toBe(todayInISOFormat);

          const downloadedSHLWorkNumber = columnHeaderInRow['SHL Work Number'].trim();
          logInfo(`Analyzing SHL Work Number -> Value: ${downloadedSHLWorkNumber}`);
          expect(downloadedSHLWorkNumber).toBe(shlWorkNumber);

          const downloadedSKID = columnHeaderInRow['SK ID'].trim();
          logInfo(`Analyzing SK ID-> Value: ${downloadedSKID}`);
          expect(downloadedSKID).toBe(skID);

          const downloadedSMIDForHE = columnHeaderInRow['SM ID for H&E'].trim();
          logInfo(`Analyzing SM ID for H&E -> Value: ${downloadedSMIDForHE}`);
          expect(downloadedSMIDForHE).toBe(smidForHE);

          const downloadedTissueNotes = columnHeaderInRow['Tissue Notes'].trim();
          logInfo(`Analyzing Tissue Notes -> Value: ${downloadedTissueNotes}`);
          expect(downloadedTissueNotes).toBe(tissueTestNotes);

          const downloadedTissueSite = columnHeaderInRow['Tissue Site'].trim();
          logInfo(`Analyzing Tissue Site -> Value: ${downloadedTissueSite}`);
          expect(downloadedTissueSite).toBe(tissueSiteNotes);

          const downloadedTissueType = columnHeaderInRow['Tissue Type'].trim();
          logInfo(`Analyzing Tissue Type -> Value: ${downloadedTissueType}`);
          expect(downloadedTissueType).toBe(tissueTypeBlock.toLowerCase());

          const downloadedTrackingNumber = columnHeaderInRow['Tracking Number'].trim();
          logInfo(`Analyzing Tracking Number -> Value: ${downloadedTrackingNumber}`);
          expect(downloadedTrackingNumber).toBe(trackingNumber);

          const downloadedSampleID = columnHeaderInRow['Tumor Collaborator Sample ID'].trim();
          logInfo(`Analyzing Tumor Collaborator Sample ID -> Value: ${downloadedSampleID}`);
          expect(downloadedSampleID).toBe(tumorCollaboratorSampleID);

          const downloadedTumorPercentage = columnHeaderInRow['Tumor Percentage as reported by SHL'].trim();
          logInfo(`Analyzing Tumor Percentage as reported by SHL -> Value: ${downloadedTumorPercentage}`);
          expect(downloadedTumorPercentage).toBe(tumorPercentageReportedBySHL);

          const downloadedTumorType = columnHeaderInRow['Tumor Type'].trim();
          logInfo(`Analyzing Tumor Type -> Value: ${downloadedTumorType}`);
          expect(downloadedTumorType).toBe(tumorTypePrimary.toLowerCase());

          const downloadedMaterialsReceivedForUSS = columnHeaderInRow['USS (unstained slides)'].trim();
          logInfo(`Analyzing Materials Received for USS (unstained slides) -> Value: ${downloadedMaterialsReceivedForUSS}`);
          expect(downloadedMaterialsReceivedForUSS).toBe(testMaterialsReceivedValue);

          const allSMIDsUsed = [ussSMIDOne, ussSMIDTwo, scrollsSMIDOne, scrollsSMIDTwo, heSMIDOne, heSMIDTwo];
          const testSMIDHeaderArray = getSMIDHeaderValues(allSMIDsUsed);
          for (let index = 0; index < testSMIDHeaderArray.length; index++) {
            const currentSMIDHeaderName = testSMIDHeaderArray[index];
            const downloadedSMIDValue = columnHeaderInRow[currentSMIDHeaderName];
            logInfo(`Analyzing SM-ID ${index + 1} -> Value: ${downloadedSMIDValue}`);
            expect(allSMIDsUsed.includes(downloadedSMIDValue)).toBeTruthy();
          }

          if (isClinicalStudy) {
            /* External Path Review Dates Verification in Download */
            const externalPathReviewSentDate = columnHeaderInRow['Date Sent for External Path Review'].trim();
            const externalPathReviewReceivedDate = columnHeaderInRow['Date Received from External Path Review'].trim();
            logInfo(`Analyzing External Path Review -> Sent Date: ${externalPathReviewSentDate}`);
            logInfo(`Analyzing External Path Review -> Received Date: ${externalPathReviewReceivedDate}`);
            expect(externalPathReviewSentDate).toBe(todayInISOFormat);
            expect(externalPathReviewReceivedDate).toBe(todayInISOFormat);

            /* Sequencing Results Verification in Download */
            const sequencedResults = columnHeaderInRow['Sequencing Results'].trim();
            logInfo(`Analyzing Sequencing Results -> result: ${sequencedResults}`);
            expect(sequencedResults).toBe(sequencingResultsDownloadName);
          }
        });
      });

      //TODO Add back/uncomment when PEPPER-1322 is fixed
      /*await test.step('Deleting OncHistory tab row', async () => {
        const tissue = await tissueInformationPage.addTissue();
        await tissue.delete();
      });*/
    })
  }
});

function getSMIDHeaderValues(allSMIDsUsed: string[]): string[] {
  const baseSMIDHeader = 'SM-ID value';
  const expectedHeaders: string[] = [];
  for (let index = 0; index < allSMIDsUsed.length; index++) {
    if (index === 0 && allSMIDsUsed[index] != null) {
      expectedHeaders.push(baseSMIDHeader);
      continue;
    } else if (index > 0 && allSMIDsUsed[index] != null) {
      const incrementedSMIDHeader = `${baseSMIDHeader}_${index}`;
      expectedHeaders.push(incrementedSMIDHeader);
    }
  }
  return expectedHeaders;
}
