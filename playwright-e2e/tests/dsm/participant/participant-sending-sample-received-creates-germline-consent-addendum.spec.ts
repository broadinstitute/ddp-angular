import { APIRequestContext, Page, TestInfo, expect } from '@playwright/test';
import { Navigation, Samples, Study, StudyName } from 'dsm/navigation';
import KitsWithoutLabelPage from 'dsm/pages/kits-without-label-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import * as user from 'data/fake-user.json';
import { KitUploadInfo } from 'dsm/pages/models/kit-upload-model';
import KitsUploadPage from 'dsm/pages/kits-upload-page';
import InitialScanPage from 'dsm/pages/scan/initial-scan-page';
import TrackingScanPage from 'dsm/pages/scan/tracking-scan-page';
import FinalScanPage from 'dsm/pages/scan/final-scan-page';
import { getToday } from 'utils/date-utils';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import ParticipantPage from 'dsm/pages/participant-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import KitsReceivedPage from 'dsm/pages/kits-received-page';
import { CustomizeView, DataFilter, KitType, Label, SM_ID, Tab, TissueType } from 'dsm/enums';
import crypto from 'crypto';
import { logInfo } from 'utils/log-utils';
import { waitForResponse } from 'utils/test-utils';
import KitsWithErrorPage from 'dsm/pages/kits-with-error-page';
import { OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';

test.describe.serial('Sending SAMPLE_RECEIVED event to DSS', () => {
  const studies = [StudyName.OSTEO2]; //Only clinical (pecgs) studies get this event
  const facilityName = user.doctor.hospital;
  const facilityPhoneNumber = user.doctor.phone;
  const facilityFaxNumber = user.doctor.fax;
  const materialsReceivedAmount = 2;
  let navigation;
  let shortID = '';
  let kitLabel = '';
  let participantPage: ParticipantPage;
  let oncHistoryTab;
  let today;
  let randomAccessionNumber = '';
  let smID = '';
  let secondSMID = '';
  let tumorSampleID = '';
  let tumorCollaboratorSampleIDPrefix = '';

  for (const study of studies) {
    test(`${study} - Scenario 1: SALIVA kit received first, TUMOR sample received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Saliva kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitType.SALIVA, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      const lastRow = await oncHistoryTable.getRowsCount() - 1;

      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber, lastRow);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueRequestAt(lastRow);
      await tissueInformationPage.waitForReady();

      /**
       * Create Tumor Sample - the following need to be inputted in Tissue Request page before accessioning a SM-ID / tumor sample:
       * Fax Sent Date (Automatically filled out when clicking Download Request Documents)
       * Tissue Received Date
       * Gender
       * Materials Received amount (either USS [unstained slides] or Scrolls type)
       * SM-IDs (either USS [unstained slides] or Scrolls)
       * Tumor Collaborator Sample ID
       * Date Sent to GP
       */
      const faxSentDate = await tissueInformationPage.getFaxSentDate();
      await tissueInformationPage.fillTissueReceivedDate({ today: true });
      const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();

      await tissueInformationPage.assertFaxSentDatesCount(1);

      today = getToday();
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${today} but received ${tissueReceivedDate}`).
        toBe(today);

      await tissueInformationPage.selectGender('Female');

      const tissue = tissueInformationPage.tissue();
      await tissue.fillField(Label.USS_UNSTAINED, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-12345
      secondSMID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-09876
      const smIDModal = await tissue.fillSMIDs(SM_ID.USS_SM_IDS);
      await smIDModal.fillInputs([smID, secondSMID]);
      await smIDModal.close();

      await tissue.fillField(Label.TISSUE_TYPE, {selection: TissueType.BLOCK});

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(Label.DATE_SENT_TO_GP, { inputValue: today });

      //Receive the saliva kit first
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.waitForReady();
      await kitsReceivedPage.selectKitType(KitType.SALIVA);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Accession the tumor sample second (just receive the sample using the SM-ID)
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE,
        [Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
      await searchPanel.dates(Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED)).trim();
      expect(germlineInfo).toBeTruthy();
    });

    test(`${study} - Scenario 2: BLOOD kit received first, TUMOR sample received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Blood kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitType.BLOOD, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      const lastRow = await oncHistoryTable.getRowsCount() - 1;

      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber, lastRow);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueRequestAt(lastRow);
      await tissueInformationPage.waitForReady();

      /**
       * Create Tumor Sample - the following need to be inputted in Tissue Request page before accessioning a SM-ID / tumor sample:
       * Fax Sent Date (Automatically filled out when clicking Download Request Documents)
       * Tissue Received Date
       * Gender
       * Materials Received amount (either USS [unstained slides] or Scrolls type)
       * SM-IDs (either USS [unstained slides] or Scrolls)
       * Tumor Collaborator Sample ID
       * Date Sent to GP
       */
      const faxSentDate = await tissueInformationPage.getFaxSentDate();
      await tissueInformationPage.fillTissueReceivedDate({ today: true });
      const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();

      await tissueInformationPage.assertFaxSentDatesCount(1);

      today = getToday();
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${today} but received ${tissueReceivedDate}`).
        toBe(today);

      await tissueInformationPage.selectGender('Female');

      const tissue = tissueInformationPage.tissue();
      await tissue.fillField(Label.USS_UNSTAINED, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-12345
      secondSMID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-09876
      const smIDModal = await tissue.fillSMIDs(SM_ID.USS_SM_IDS);
      await smIDModal.fillInputs([smID, secondSMID]);
      await smIDModal.close();

      await tissue.fillField(Label.TISSUE_TYPE, {selection: TissueType.BLOCK});

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(Label.DATE_SENT_TO_GP, { inputValue: today });

      //Receive the blood kit first
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.waitForReady();
      await kitsReceivedPage.selectKitType(KitType.BLOOD);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Accession the tumor sample second (just receive the sample using the SM-ID)
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE,
        [Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
      await searchPanel.dates(Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED)).trim();
      expect(germlineInfo).toBeTruthy();
    });

    test(`${study} - Scenario 3: TUMOR sample received first, SALIVA kit received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Saliva kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitType.SALIVA, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      const lastRow = await oncHistoryTable.getRowsCount() - 1;

      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber, lastRow);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueRequestAt(lastRow);
      await tissueInformationPage.waitForReady();

      /**
       * Create Tumor Sample - the following need to be inputted in Tissue Request page before accessioning a SM-ID / tumor sample:
       * Fax Sent Date (Automatically filled out when clicking Download Request Documents)
       * Tissue Received Date
       * Gender
       * Materials Received amount (either USS [unstained slides] or Scrolls type)
       * SM-IDs (either USS [unstained slides] or Scrolls)
       * Tumor Collaborator Sample ID
       * Date Sent to GP
       */
      const faxSentDate = await tissueInformationPage.getFaxSentDate();
      await tissueInformationPage.fillTissueReceivedDate({ today: true });
      const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();

      await tissueInformationPage.assertFaxSentDatesCount(1);

      today = getToday();
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${today} but received ${tissueReceivedDate}`).
        toBe(today);

      await tissueInformationPage.selectGender('Female');

      const tissue = tissueInformationPage.tissue();
      await tissue.fillField(Label.USS_UNSTAINED, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-12345
      secondSMID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-09876
      const smIDModal = await tissue.fillSMIDs(SM_ID.USS_SM_IDS);
      await smIDModal.fillInputs([smID, secondSMID]);
      await smIDModal.close();

      await tissue.fillField(Label.TISSUE_TYPE, {selection: TissueType.BLOCK});

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(Label.DATE_SENT_TO_GP, { inputValue: today });

      //Accession the tumor sample first (just receive the sample using the SM-ID)
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Receive the saliva kit second
      await kitsReceivedPage.waitForReady();
      await kitsReceivedPage.selectKitType(KitType.SALIVA);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE,
        [Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
      await searchPanel.dates(Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED)).trim();
      expect(germlineInfo).toBeTruthy();
    });

    test(`${study} - Scenario 4: TUMOR sample received first, BLOOD kit received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Blood kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitType.BLOOD, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      const lastRow = await oncHistoryTable.getRowsCount() - 1;

      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber, lastRow);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueRequestAt(lastRow);
      await tissueInformationPage.waitForReady();

      /**
       * Create Tumor Sample - the following need to be inputted in Tissue Request page before accessioning a SM-ID / tumor sample:
       * Fax Sent Date (Automatically filled out when clicking Download Request Documents)
       * Tissue Received Date
       * Gender
       * Materials Received amount (either USS [unstained slides] or Scrolls type)
       * SM-IDs (either USS [unstained slides] or Scrolls)
       * Tumor Collaborator Sample ID
       * Date Sent to GP
       */
      const faxSentDate = await tissueInformationPage.getFaxSentDate();
      await tissueInformationPage.fillTissueReceivedDate({ today: true });
      const tissueReceivedDate = await tissueInformationPage.getTissueReceivedDate();

      await tissueInformationPage.assertFaxSentDatesCount(1);

      today = getToday();
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${today} but received ${tissueReceivedDate}`).
        toBe(today);

      await tissueInformationPage.selectGender('Female');

      const tissue = tissueInformationPage.tissue();
      await tissue.fillField(Label.USS_UNSTAINED, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-12345
      secondSMID = `SM-${crypto.randomUUID().toString().replace('-', '1').substring(0, 5)}`; //e.g. SM-09876
      const smIDModal = await tissue.fillSMIDs(SM_ID.USS_SM_IDS);
      await smIDModal.fillInputs([smID, secondSMID]);
      await smIDModal.close();

      await tissue.fillField(Label.TISSUE_TYPE, {selection: TissueType.BLOCK});

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(Label.DATE_SENT_TO_GP, { inputValue: today });

      //Accession the tumor sample first (just receive the sample using the SM-ID)
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Receive the blood kit second
      await kitsReceivedPage.waitForReady();
      await kitsReceivedPage.selectKitType(KitType.BLOOD);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE,
        [Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED]);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
      await searchPanel.dates(Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED)).trim();
      expect(germlineInfo).toBeTruthy();
    });
  }
});

/**
 * TODO Use an adult study participant after PEPPER-1210 is fixed - currently uses pediatric participants since search works better for them
 * Find an E2E playwright participant who meets the following criteria:
 * Answered 'Yes' in consent
 * Answered 'Yes' in consent addendum
 * Submitted medical release with at least one physician or institution
 * Does not already have a germline consent addendum
 * Does not already have a normal kit (i.e. a blood or saliva kit) sent out (for ease of testing)
 */
async function findParticipantForGermlineConsentCreation(participantListPage: ParticipantListPage, study: StudyName): Promise<string> {
  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
  await searchPanel.search();

  const customizeViewPanel = participantListPage.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, ['CONSENT_BLOOD', 'CONSENT_TISSUE']);
  //await customizeViewPanel.selectColumns('Medical Release Form Columns', ['PHYSICIAN']);
  await customizeViewPanel.selectColumnsByID(CustomizeView.MEDICAL_RELEASE_FORM, [Label.PHYSICIAN], Label.RELEASE_SELF, { nth: 0 });
  await customizeViewPanel.selectColumns(CustomizeView.SAMPLE, [Label.SAMPLE_TYPE, Label.STATUS]);
  await customizeViewPanel.selectColumns(CustomizeView.ONC_HISTORY, [Label.TISSUE_REQUEST_DATE]);
  await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR,
    [Label.SOMATIC_CONSENT_TUMOR]
  );
  await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_DNA_WITH_INVITAE,
    [Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED]
  );

  //Determine last name hint to use to search for Playwright E2E participants only
  const lastnamePrefix = getPlaywrightParticipantLastNamePrefix(study);

  await searchPanel.open();
  await searchPanel.text(Label.LAST_NAME, { textValue: lastnamePrefix, additionalFilters: [DataFilter.EXACT_MATCH], exactMatch: false });
  await searchPanel.checkboxes('CONSENT_BLOOD', { checkboxValues: ['Yes'] });
  await searchPanel.checkboxes('CONSENT_TISSUE', { checkboxValues: ['Yes'] });
  const filterListResponse = await searchPanel.search({ uri: '/ui/filterList' });
  let responseJson = JSON.parse(await filterListResponse.text());

  const participantListTable = participantListPage.participantListTable;
  const resultsPerPage = await participantListTable.rowsCount;
  let shortID = '';
  for (let index = 0; index < resultsPerPage; index++) {
    const consentTissue = (await participantListTable.getParticipantDataAt(index, 'CONSENT_TISSUE')).trim();
    const consentBlood = (await participantListTable.getParticipantDataAt(index, 'CONSENT_BLOOD')).trim();
    const somaticConsentTumor = (await participantListTable.getParticipantDataAt(index, Label.SOMATIC_CONSENT_TUMOR)).trim();
    const physician = (await participantListTable.getParticipantDataAt(index, Label.PHYSICIAN)).trim();
    const germlineInfo = (await participantListTable.getParticipantDataAt(index, Label.GERMLINE_CONSENT_ADDENDUM_SURVEY_CREATED)).trim();
    const tissueRequestDate = (await participantListTable.getParticipantDataAt(index, Label.TISSUE_REQUEST_DATE)).trim();
    const medicalRecord = responseJson.participants[index].medicalRecords[0]; //Checking to make sure participant has onc history tab


    if ((consentTissue === 'Yes') &&
        (consentBlood === 'Yes') &&
        (somaticConsentTumor === 'Yes') &&
        (physician != null) &&
        (germlineInfo === '') &&
        (tissueRequestDate === '') &&
        (medicalRecord != null)
      ) {
        shortID = await participantListTable.getParticipantDataAt(index, Label.SHORT_ID);
        logInfo(`Test participant ${shortID} satisfies criteria for germline test`);
        break;
      }

    if (index === (resultsPerPage - 1)) {
      const hasNextPage = await participantListTable.paginator.hasNext();
      if (hasNextPage) {
        index = -1;
        const [nextPageResponse] = await Promise.all([
          waitForResponse(participantListPage.page, {uri: 'ui/filterList'}),
          participantListTable.nextPage()
        ]);
        responseJson = JSON.parse(await nextPageResponse.text());
      } else {
        throw new Error(`No more valid participants available for use in SAMPLE_RECEIVED test`);
      }
    }
  }

  return shortID;
}

function getPlaywrightParticipantLastNamePrefix(study: StudyName): string {
  let prefix = '';
  switch (study) {
    case StudyName.BRAIN:
      prefix = 'BR';
      break;
    case StudyName.MBC:
      prefix = 'testLastName';
      break;
    case StudyName.OSTEO2:
      prefix = 'OS';
      break;
    case StudyName.ANGIO:
    case StudyName.AT:
    case StudyName.LMS:
    case StudyName.PANCAN:
      prefix = 'Playwright';
      break;
    default:
      throw new Error(`${study} might not have end-to-end participants created using Playwright`);
  }
  return prefix;
}

/**
 * Uploads and sends the given type of kit e.g. Saliva kit or Blood kit - method is used in order to not repeat
 * similar steps for 4 test scenarios
 * @param shortID the short id of the participant who is having a kit uploaded
 * @param kitType the kit type of the upload
 * @param study the study for which the kit is uploaded
 * @param page
 * @param request
 * @param testInfo
 * @returns the mf code a.k.a the kit label to be used to later mark the kit as sent
 */
async function prepareSentKit(shortID: string,
  kitType: KitType,
  study: StudyName,
  page: Page,
  request: APIRequestContext,
  testInfo: TestInfo): Promise<string> {
  const navigation = new Navigation(page, request);
  const expectedKitTypes = [KitType.SALIVA, KitType.BLOOD]; //Studies used for the current test only have Saliva and Blood kits
  const testResultDirectory = testInfo.outputDir;
  let kitLabel = '';

  //Deactivate existing kits
  const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
  await kitsWithoutLabelPage.waitForReady();
  await kitsWithoutLabelPage.selectKitType(kitType);
  if (await kitsWithoutLabelPage.hasKitRequests()) {
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
  }

  const kitErrorPage = await navigation.selectFromSamples<KitsWithErrorPage>(Samples.ERROR);
  await kitErrorPage.waitForReady();
  await kitErrorPage.selectKitType(kitType);
  await kitErrorPage.deactivateAllKitsFor(shortID);

  //Get first name and last name of the participant - Kit Upload checks that the names match the given short ids
  const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
  await participantListPage.waitForReady();

  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.clear();
  await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
  await searchPanel.search();

  const participantListTable = participantListPage.participantListTable;
  const firstName = (await participantListTable.getParticipantDataAt(0, Label.FIRST_NAME)).trim();
  const lastName = (await participantListTable.getParticipantDataAt(0, Label.LAST_NAME)).trim();

  //Upload saliva or blood kit
  const kitUploadInfo = new KitUploadInfo(shortID, firstName, lastName);
  kitUploadInfo.address.street1 = user.patient.streetAddress;
  kitUploadInfo.address.city = user.patient.city;
  kitUploadInfo.address.postalCode = user.patient.zip;
  kitUploadInfo.address.state = user.patient.state.abbreviation;
  kitUploadInfo.address.country = user.patient.country.abbreviation;

  const kitUploadPage = await navigation.selectFromSamples<KitsUploadPage>(Samples.KIT_UPLOAD);
  await kitUploadPage.waitForReady();
  await kitUploadPage.selectKitType(kitType);
  await kitUploadPage.assertBrowseBtn();
  await kitUploadPage.assertUploadKitsBtn();
  await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);

  //Check for kit in Kits without Label and get the shipping ID
  await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
  await kitsWithoutLabelPage.waitForReady();
  await kitsWithoutLabelPage.selectKitType(kitType);
  await kitsWithoutLabelPage.assertCreateLabelsBtn();
  await kitsWithoutLabelPage.assertReloadKitListBtn();

  await kitsWithoutLabelPage.search(Label.SHORT_ID, shortID);
  const shippingID = (await kitsWithoutLabelPage.getData(Label.SHIPPING_ID)).trim();

  const kitsTable = kitsWithoutLabelPage.getKitsTable;
  await kitsTable.searchByColumn(Label.SHORT_ID, shortID);
  await expect(kitsTable.rowLocator()).toHaveCount(1);

  //Scan saliva and blood kit in Initial Scan
  const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(Samples.INITIAL_SCAN);
  await initialScanPage.assertPageTitle();
  if (kitType === KitType.SALIVA) {
    kitLabel = `${crypto.randomUUID().toString().substring(0, 14)}`; //Clinical Saliva kits just need to be 14 chars
  } else if (kitType === KitType.BLOOD) {
    kitLabel = `PECGS-${crypto.randomUUID().toString().substring(0, 10)}`; //Clinical Blood kits need a PECGS prefix
  }
  await initialScanPage.fillScanPairs([kitLabel, shortID]);
  await initialScanPage.save();

  //Both Saliva and Blood kits will now require a tracking label - see PEPPER-1249
  const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(Samples.TRACKING_SCAN);
  await trackingScanPage.waitForReady();
  const trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
  await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
  await trackingScanPage.save();

  //Scan kit in Final Scan - which marks the kit as sent
  const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(Samples.FINAL_SCAN);
  await finalScanPage.assertPageTitle();
  await finalScanPage.fillScanPairs([kitLabel, shippingID]);
  await finalScanPage.save();

  //Check for the kit in the Kits Sent page
  const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(Samples.SENT);
  await kitsSentPage.waitForReady();
  await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
  await kitsSentPage.selectKitType(kitType);
  await kitsSentPage.assertReloadKitListBtn();
  await kitsSentPage.assertTableHeader();
  await kitsSentPage.search(Label.MF_CODE, kitLabel, { count: 1 });

  const sentDate = await kitsSentPage.getData(Label.SENT);
  expect(sentDate).toStrictEqual(getToday());

  //Return the mf code a.k.a the kit label so that the kit can later be marked as received
  return kitLabel;
}

async function goToTestParticipantPage(shortID: string, navigation: Navigation): Promise<ParticipantPage> {
  const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
  await participantListPage.waitForReady();

  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
  await searchPanel.search();

  const participantListTable = participantListPage.participantListTable;
  return await participantListTable.openParticipantPageAt(0);
}

 /**
 * Input Onc History - the following need to be inputted before accessioning a SM-ID / tumor sample:
 * Date of PX (required)
 * An Accession Number (required)
 * Facility Name (Optional)
 * Facilty Phone Number (Optional)
 * Facility Fax Number (Optional)
 * returns the accession number to be used for checking that accessioning a tumor sample was successful
 */
async function fillOncHistoryRow(participantPage: ParticipantPage,
  oncHistoryTab: OncHistoryTab,
  facilityName: string,
  facilityPhoneNumber: string,
  facilityFaxNumber: string,
  lastRowIndex?: number): Promise<string> {
  const oncHistoryTable = oncHistoryTab.table;
  const rowIndex = lastRowIndex ? lastRowIndex : await oncHistoryTable.getRowsCount() - 1;
  const randomAccessionNumber = crypto.randomUUID().toString().substring(0, 10);
  const today = new Date();

  await oncHistoryTable.fillField(Label.DATE_OF_PX, {
    date: {
      date: {
        yyyy: today.getFullYear(),
        month: today.getMonth(),
        dayOfMonth: today.getDate()
      }
    }
  }, rowIndex);
  await oncHistoryTable.fillField(Label.ACCESSION_NUMBER, { inputValue: randomAccessionNumber }, rowIndex);
  await oncHistoryTable.fillField(Label.FACILITY, { inputValue: facilityName }, rowIndex);
  await oncHistoryTable.fillField(Label.PHONE, { inputValue: facilityPhoneNumber }, rowIndex);
  await oncHistoryTable.fillField(Label.FAX, { inputValue: facilityFaxNumber }, rowIndex);

  //Mark Onc History as 'Request' status
  await oncHistoryTable.fillField(Label.REQUEST, { selection: OncHistorySelectRequestEnum.REQUEST }, rowIndex);

  //Click Download Request Documents in order to have the Fax Sent Date automatically filled out for recently inputted onc history
  await oncHistoryTable.assertRowSelectionCheckbox(rowIndex);
  await oncHistoryTable.selectRowAt(rowIndex);
  await oncHistoryTab.downloadRequestDocuments();
  return randomAccessionNumber;
}
