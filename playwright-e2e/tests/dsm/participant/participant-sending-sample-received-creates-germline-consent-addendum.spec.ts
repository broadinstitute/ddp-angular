import { APIRequestContext, Page, TestInfo, expect } from '@playwright/test';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import * as user from 'data/fake-user.json';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';
import TrackingScanPage from 'dsm/pages/scanner-pages/trackingScan-page';
import FinalScanPage from 'dsm/pages/scanner-pages/finalScan-page';
import { getDate } from 'utils/date-utils';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import { OncHistoryInputColumnsEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { SMIdEnum, TissueDynamicFieldsEnum } from 'dsm/pages/tissue/enums/tissue-information-enum';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import crypto from 'crypto';
import { logInfo } from 'utils/log-utils';
import { login } from 'authentication/auth-angio';
import { waitForResponse } from 'utils/test-utils';
import ErrorPage from 'dsm/pages/samples/error-page';

test.describe.serial('Sending SAMPLE_RECEIVED event to DSS', () => {
  const studies = [StudyEnum.LMS]; //Only clinical (pecgs) studies get this event
  const facilityName = user.doctor.hospital;
  const facilityPhoneNumber = user.doctor.phone;
  const facilityFaxNumber = user.doctor.fax;
  const materialsReceivedAmount = 1;
  let navigation;
  let shortID = '';
  let kitLabel = '';
  let participantPage: ParticipantPage;
  let oncHistoryTab;
  let today;
  let randomAccessionNumber = '';
  let smID = '';
  let tumorSampleID = '';
  let tumorCollaboratorSampleIDPrefix = '';

  for (const study of studies) {
    test(`${study} - Scenario 1: SALIVA kit received first, TUMOR sample received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Saliva kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitTypeEnum.SALIVA, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      today = getDate();
      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(0);
      await tissueInformationPage.assertPageTitle();

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
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${getDate()} but received ${tissueReceivedDate}`).
        toBe(getDate());

      await tissueInformationPage.selectGender('Female');

      const tissue = await tissueInformationPage.tissue();
      await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().substring(0, 5)}`; //e.g. SM-12345
      const smIDModal = await tissue.fillSMIDs(SMIdEnum.USS_SM_IDS);
      await smIDModal.fillInputs([smID]);
      await smIDModal.close();

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, { inputValue: today });

      //Receive the saliva kit first
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
      await kitsReceivedPage.waitForLoad();
      await kitsReceivedPage.assertPageTitle();
      await kitsReceivedPage.selectKitType(KitTypeEnum.SALIVA);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Accession the tumor sample second (just receive the sample using the SM-ID)
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(
      `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
      ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', { textValue: shortID });
      await searchPanel.dates('GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created')).trim();
      expect(germlineInfo).toBeTruthy();
    });

    test(`${study} - Scenario 2: BLOOD kit received first, TUMOR sample received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Blood kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitTypeEnum.BLOOD, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      today = getDate();
      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(0);
      await tissueInformationPage.assertPageTitle();

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
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${getDate()} but received ${tissueReceivedDate}`).
        toBe(getDate());

      await tissueInformationPage.selectGender('Female');

      const tissue = await tissueInformationPage.tissue();
      await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().substring(0, 5)}`; //e.g. SM-12345
      const smIDModal = await tissue.fillSMIDs(SMIdEnum.USS_SM_IDS);
      await smIDModal.fillInputs([smID]);
      await smIDModal.close();

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, { inputValue: today });

      //Receive the blood kit first
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
      await kitsReceivedPage.waitForLoad();
      await kitsReceivedPage.assertPageTitle();
      await kitsReceivedPage.selectKitType(KitTypeEnum.BLOOD);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Accession the tumor sample second (just receive the sample using the SM-ID)
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(
      `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
      ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', { textValue: shortID });
      await searchPanel.dates('GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created')).trim();
      expect(germlineInfo).toBeTruthy();
    });

    test(`${study} - Scenario 3: TUMOR sample received first, SALIVA kit received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Saliva kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitTypeEnum.SALIVA, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      today = getDate();
      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(0);
      await tissueInformationPage.assertPageTitle();

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
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${getDate()} but received ${tissueReceivedDate}`).
        toBe(getDate());

      await tissueInformationPage.selectGender('Female');

      const tissue = await tissueInformationPage.tissue();
      await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().substring(0, 5)}`; //e.g. SM-12345
      const smIDModal = await tissue.fillSMIDs(SMIdEnum.USS_SM_IDS);
      await smIDModal.fillInputs([smID]);
      await smIDModal.close();

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, { inputValue: today });

      //Accession the tumor sample first (just receive the sample using the SM-ID)
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Receive the saliva kit second
      await kitsReceivedPage.waitForLoad();
      await kitsReceivedPage.assertPageTitle();
      await kitsReceivedPage.selectKitType(KitTypeEnum.SALIVA);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(
      `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
      ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', { textValue: shortID });
      await searchPanel.dates('GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created')).trim();
      expect(germlineInfo).toBeTruthy();
    });

    test(`${study} - Scenario 4: TUMOR sample received first, BLOOD kit received second @dsm @functional`, async ({ page, request }, testInfo) => {
      test.slow();
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      //Prep the Blood kit
      shortID = await findParticipantForGermlineConsentCreation(participantListPage, study);
      logInfo(`Chosen short id: ${shortID}`);
      kitLabel = await prepareSentKit(shortID, KitTypeEnum.BLOOD, study, page, request, testInfo);

      //Get the Participant Page of the chosen test participant
      participantPage = await goToTestParticipantPage(shortID, navigation);

      //Fill out an onc history and get back an accession number
      oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      today = getDate();
      randomAccessionNumber = await fillOncHistoryRow(participantPage, oncHistoryTab, facilityName, facilityPhoneNumber, facilityFaxNumber);

      //Navigate to the Tissue Request page
      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(0);
      await tissueInformationPage.assertPageTitle();

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
      expect(faxSentDate.trim(), `Fax Sent Date has unexpected input: expected ${today} but received ${faxSentDate}`).toBe(today);
      expect(tissueReceivedDate.trim(), `Tissue Received Date has unexpected input: expected ${getDate()} but received ${tissueReceivedDate}`).
        toBe(getDate());

      await tissueInformationPage.selectGender('Female');

      const tissue = await tissueInformationPage.tissue();
      await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: materialsReceivedAmount });
      smID = `SM-${crypto.randomUUID().toString().substring(0, 5)}`; //e.g. SM-12345
      const smIDModal = await tissue.fillSMIDs(SMIdEnum.USS_SM_IDS);
      await smIDModal.fillInputs([smID]);
      await smIDModal.close();

      tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
      tumorSampleID = `${tumorCollaboratorSampleIDPrefix}_${crypto.randomUUID().toString().substring(0, 4)}`;
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorSampleID });

      await tissue.fillField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, { inputValue: today });

      //Accession the tumor sample first (just receive the sample using the SM-ID)
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: smID,
        isTumorSample: true,
        accessionNumber: randomAccessionNumber,
        tumorCollaboratorSampleID: tumorSampleID
      });

      //Receive the blood kit second
      await kitsReceivedPage.waitForLoad();
      await kitsReceivedPage.assertPageTitle();
      await kitsReceivedPage.selectKitType(KitTypeEnum.BLOOD);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});

      //Confirm that the germline consent addendum was created - check that the GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created column is not empty
      await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(
      `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
      ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', { textValue: shortID });
      await searchPanel.dates('GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });


      //Occasionally, it will take a couple of seconds (and participant list refreshes) before info about the germline consent activity being created shows up
      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const amountOfParticipants = await participantListTable.rowsCount;
        expect(amountOfParticipants).toBe(1);
      }).toPass({intervals: [10_000], timeout: 60_000});

      const participantListTable = participantListPage.participantListTable;
      const germlineInfo = (await participantListTable.getParticipantDataAt(0, 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created')).trim();
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
async function findParticipantForGermlineConsentCreation(participantListPage: ParticipantListPage, study: StudyEnum): Promise<string> {
  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
  await searchPanel.search();

  const customizeViewPanel = participantListPage.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.selectColumns('Research Consent & Assent Form Columns', ['CONSENT_ASSENT_BLOOD', 'CONSENT_ASSENT_TISSUE']);
  await customizeViewPanel.selectColumns('Medical Release Form Columns', ['PHYSICIAN']);
  await customizeViewPanel.selectColumns('Sample Columns', ['Sample Type', 'Status']);
  await customizeViewPanel.selectColumns('Onc History Columns', ['Tissue Request Date']);
  await customizeViewPanel.selectColumns(
    `Additional Consent & Assent: Learning About Your Child’s Tumor Columns`,
    ['SOMATIC_CONSENT_TUMOR_PEDIATRIC', 'SOMATIC_ASSENT_ADDENDUM']
  );
  await customizeViewPanel.selectColumns(
    `Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`,
    ['GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created']
  );

  //Determine last name hint to use to search for Playwright E2E participants only
  const lastnamePrefix = getPlaywrightParticipantLastNamePrefix(study);

  await searchPanel.open();
  await searchPanel.text('Last Name', { textValue: lastnamePrefix, additionalFilters: [AdditionalFilter.EXACT_MATCH], exactMatch: false });
  await searchPanel.checkboxes('CONSENT_ASSENT_BLOOD', { checkboxValues: ['Yes'] });
  await searchPanel.checkboxes('CONSENT_ASSENT_TISSUE', { checkboxValues: ['Yes'] });
  const filterListResponse = await searchPanel.search({ uri: '/ui/filterList' });
  let responseJson = JSON.parse(await filterListResponse.text());

  const participantListTable = participantListPage.participantListTable;
  const resultsPerPage = await participantListTable.rowsCount;
  let shortID = '';
  for (let index = 0; index < resultsPerPage; index++) {
    const consentAssentTissue = (await participantListTable.getParticipantDataAt(index, 'CONSENT_ASSENT_TISSUE')).trim();
    const consentAssentBlood = (await participantListTable.getParticipantDataAt(index, 'CONSENT_ASSENT_BLOOD')).trim();
    const somaticAssentAddendum = (await participantListTable.getParticipantDataAt(index, 'SOMATIC_ASSENT_ADDENDUM')).trim();
    const somaticConsentTumorPediatric = (await participantListTable.getParticipantDataAt(index, 'SOMATIC_CONSENT_TUMOR_PEDIATRIC')).trim();
    const physician = (await participantListTable.getParticipantDataAt(index, 'PHYSICIAN')).trim();
    const germlineInfo = (await participantListTable.getParticipantDataAt(index, 'GERMLINE_CONSENT_ADDENDUM_PEDIATRIC Survey Created')).trim();
    const tissueRequestDate = (await participantListTable.getParticipantDataAt(index, 'Tissue Request Date')).trim();
    const medicalRecord = responseJson.participants[index].medicalRecords[0]; //Checking to make sure participant has onc history tab

    if ((consentAssentTissue === 'Yes') &&
        (consentAssentBlood === 'Yes') &&
        (somaticAssentAddendum === 'Yes') &&
        (somaticConsentTumorPediatric === 'Yes') &&
        (physician != null) &&
        (germlineInfo === '') &&
        (tissueRequestDate === '') &&
        (medicalRecord != null)
      ) {
        shortID = await participantListTable.getParticipantDataAt(index, 'Short ID');
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

function getPlaywrightParticipantLastNamePrefix(study: StudyEnum): string {
  let prefix = '';
  switch (study) {
    case StudyEnum.BRAIN:
      prefix = 'BR';
      break;
    case StudyEnum.MBC:
      prefix = 'testLastName';
      break;
    case StudyEnum.OSTEO2:
      prefix = 'KidLast';
      break;
    case StudyEnum.ANGIO:
    case StudyEnum.AT:
    case StudyEnum.LMS:
    case StudyEnum.PANCAN:
      prefix = 'Playwright';
      break;
    default:
      throw new Error(`${study} might not have end-to-end participants created using Playwright`);
      break;
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
  kitType: KitTypeEnum,
  study: StudyEnum,
  page: Page,
  request: APIRequestContext,
  testInfo: TestInfo): Promise<string> {
  const navigation = new Navigation(page, request);
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD]; //Studies used for the current test only have Saliva and Blood kits
  const testResultDirectory = testInfo.outputDir;
  let kitLabel = '';
  let trackingLabel = '';

  //Deactivate existing kits
  const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
  await kitsWithoutLabelPage.waitForReady();
  await kitsWithoutLabelPage.selectKitType(kitType);
  if (await kitsWithoutLabelPage.hasKitRequests()) {
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);
  }

  const kitErrorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
  await kitErrorPage.waitForReady();
  await kitErrorPage.selectKitType(kitType);
  await kitErrorPage.deactivateAllKitsFor(shortID);

  //Get first name and last name of the participant - Kit Upload checks that the names match the given short ids
  const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
  await participantListPage.waitForReady();

  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.clear();
  await searchPanel.text('Short ID', { textValue: shortID });
  await searchPanel.search();

  const participantListTable = participantListPage.participantListTable;
  const firstName = (await participantListTable.getParticipantDataAt(0, 'First Name')).trim();
  const lastName = (await participantListTable.getParticipantDataAt(0, 'Last Name')).trim();

  //Upload saliva or blood kit
  const kitUploadInfo = new KitUploadInfo(shortID, firstName, lastName);
  kitUploadInfo.address.street1 = user.patient.streetAddress;
  kitUploadInfo.address.city = user.patient.city;
  kitUploadInfo.address.postalCode = user.patient.zip;
  kitUploadInfo.address.state = user.patient.state.abbreviation;
  kitUploadInfo.address.country = user.patient.country.abbreviation;

  const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
  await kitUploadPage.waitForReady(expectedKitTypes);
  await kitUploadPage.assertPageTitle();
  await kitUploadPage.selectKitType(kitType);
  await kitUploadPage.assertBrowseBtn();
  await kitUploadPage.assertUploadKitsBtn();
  await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);

  //Check for kit in Kits without Label and get the shipping ID
  await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
  await kitsWithoutLabelPage.waitForReady();
  await kitsWithoutLabelPage.selectKitType(kitType);
  await kitsWithoutLabelPage.assertCreateLabelsBtn();
  await kitsWithoutLabelPage.assertReloadKitListBtn();

  await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, shortID);
  const shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

  const kitsTable = kitsWithoutLabelPage.getKitsTable;
  await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
  await expect(kitsTable.rowLocator()).toHaveCount(1);

  //Scan saliva and blood kit in Initial Scan
  const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
  await initialScanPage.assertPageTitle();
  if (kitType === KitTypeEnum.SALIVA) {
    kitLabel = `${crypto.randomUUID().toString().substring(0, 14)}`; //Clinical Saliva kits just need to be 14 chars
  } else if (kitType === KitTypeEnum.BLOOD) {
    kitLabel = `PECGS-${crypto.randomUUID().toString().substring(0, 10)}`; //Clinical Blood kits need a PECGS prefix
  }
  await initialScanPage.fillScanPairs([kitLabel, shortID]);
  await initialScanPage.save();

  //Both Saliva and Blood kits will now require a tracking label - see PEPPER-1249
  const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(SamplesNavEnum.TRACKING_SCAN);
  await trackingScanPage.assertPageTitle();
  trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
  await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
  await trackingScanPage.save();

  //Scan kit in Final Scan - which marks the kit as sent
  const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
  await finalScanPage.assertPageTitle();
  await finalScanPage.fillScanPairs([kitLabel, shippingID]);
  await finalScanPage.save();

  //Check for the kit in the Kits Sent page
  const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
  await kitsSentPage.waitForLoad();
  await kitsSentPage.assertPageTitle();
  await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
  await kitsSentPage.selectKitType(kitType);
  await kitsSentPage.assertReloadKitListBtn();
  await kitsSentPage.assertTableHeader();
  await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
  await kitsSentPage.assertDisplayedRowsCount(1);

  const sentDate = await kitsSentPage.getData(KitsColumnsEnum.SENT);
  expect(getDate(new Date(sentDate))).toStrictEqual(getDate());

  //Return the mf code a.k.a the kit label so that the kit can later be marked as received
  return kitLabel;
}

async function goToTestParticipantPage(shortID: string, navigation: Navigation): Promise<ParticipantPage> {
  const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
  await participantListPage.waitForReady();

  const searchPanel = participantListPage.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.text('Short ID', { textValue: shortID });
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
  facilityFaxNumber: string): Promise<string> {
  const oncHistoryTable = oncHistoryTab.table;
  const randomAccessionNumber = crypto.randomUUID().toString().substring(0, 10);
  await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX, {
    date: {
      date: {
        yyyy: new Date().getFullYear(),
        month: new Date().getMonth(),
        dayOfMonth: new Date().getDate()
      }
    }
  });
  await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.ACCESSION_NUMBER, { value: randomAccessionNumber });
  await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: facilityName });
  await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.PHONE, { value: facilityPhoneNumber });
  await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FAX, { value: facilityFaxNumber });

  //Mark Onc History as 'Request' status
  await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, { select: OncHistorySelectRequestEnum.REQUEST });

  //Click Download Request Documents in order to have the Fax Sent Date automatically filled out for recently inputted onc history
  await oncHistoryTable.assertRowSelectionCheckbox();
  await oncHistoryTable.selectRowAt(0);
  await oncHistoryTab.downloadRequestDocuments();
  return randomAccessionNumber;
}
