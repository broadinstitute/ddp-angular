import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, DataFilter, Label, SM_ID, Tab, TissueType } from 'dsm/enums';
import ParticipantPage from 'dsm/pages/participant-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { expect } from '@playwright/test';
import { getDate, getToday } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';
import { OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { StudyName } from 'dsm/navigation';
import { SequencingResultsEnum, TumorTypesEnum } from 'dsm/component/tissue';
import { DateFields } from 'dsm/component/models/tissue-inputs-interface';

// TODO Enable until bug PEPPER-1322 is fixed
test.describe('Tissue Request Flow', () => {
  const studies = [StudyName.PANCAN, StudyName.LMS, StudyName.OSTEO2];
  const researchStudies = [StudyName.PANCAN];
  const clinicalStudies = [StudyName.LMS, StudyName.OSTEO2];
  let testParticipantResidence: Label;
  let tissue;
  let today;
  let ussSMIDOne;
  let ussSMIDTwo; //Two sm-ids for USS
  let scrollsSMIDOne;
  let scrollsSMIDTwo; //Two sm-ids for Scrolls
  let heSMIDOne;
  let heSMIDTwo; //Two sm-ids for H&E
  let isClinicalStudy: boolean;
  let isResearchStudy: boolean;
  const dateOfPX: DateFields = {
    yyyy: new Date().getFullYear(),
    month: new Date().getMonth(),
    dayOfMonth: new Date().getDate()
  };

  for (const study of studies) {
    test(`Tissue Request Flow for ${study} study @dsm @feature`, async ({ page, request }) => {
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
        shortID = await participantListPage.findParticipantWithTab(
          { tab: Tab.ONC_HISTORY, uri: 'ui/filterList'}
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
        await tissueInformationPage.fillNotes('Test tissue notes');
      });

      await test.step('Add a destruction policy and click on Apply to All', async () => {
        await tissueInformationPage.fillDestructionPolicy(2233, false, true);
      });

      await test.step('Add Material count', async () => {
        const testValue = 21;
        tissue = tissueInformationPage.tissue();
        await tissue.fillField(Label.USS_UNSTAINED, { inputValue: testValue });
        await tissue.fillField(Label.BLOCK, { inputValue: testValue });
        await tissue.fillField(Label.H_E_PLURAL, { inputValue: testValue });
        await tissue.fillField(Label.SCROLL, { inputValue: testValue });
      });

      await test.step('Input SM-IDs for USS, Scrolls, and H&E', async () => {
        tissue = tissueInformationPage.tissue();

        //Setup 6 SM-IDs (must be unique) - use 2 for USS, 2 for Scrolls, 2 for H&E
        ussSMIDOne = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`;
        ussSMIDTwo = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`;

        scrollsSMIDOne = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`;
        scrollsSMIDTwo = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`;

        heSMIDOne = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`;
        heSMIDTwo = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`;

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
        const year = dateOfPX.yyyy ?? 1234;
        const month = dateOfPX.month ?? 56;
        const day = dateOfPX.dayOfMonth ?? 78;
        const previouslyEnteredDateOfPX = `${month + 1}/${day}/${year}`;
        const elusiveInput = page.getByPlaceholder('mm/dd/yyyy').getByText(previouslyEnteredDateOfPX);
        const tissueInfoButton = elusiveInput.locator(`//ancestor::tr//button[@tooltip='Tissue information']`);
        await tissueInfoButton.click();
      });

      //TODO Add back/uncomment when PEPPER-1322 is fixed
      /*await test.step('Deleting OncHistory tab row', async () => {
        const tissue = await tissueInformationPage.addTissue();
        await tissue.delete();
      });*/
    })
  }
});
