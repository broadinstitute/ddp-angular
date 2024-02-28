import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { assertDateFormat, waitForResponse } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';
import { SortOrder } from 'dss/component/table';
import MedicalRecordsRequestPage, { PDFName } from 'dsm/pages/medical-records/medical-records-request-page';
import Input from 'dss/component/input';
import MedicalRecordsTable from 'dsm/pages/medical-records/medical-records-table';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { assertTableHeaders } from 'utils/assertion-helper';
import path from 'path';

// Tests depends on same participant
test.describe.serial('Medical records request workflow', () => {
  let shortId: string;
  let confirmedInstitution: string;
  let count: number;

  const confirmedInstitutions = [
    'Massachusetts General Hospital',
    'Asante Three Rivers Medical Center',
    'Bothwell Regional Health Center',
    'Adcare Hospital of Worcester Inc',
    'Brigham and Women\'s',
    'Asante Three Rivers Medical Center',
    'Boston Children\'s Hospital'
  ];

  // One Clinical studies
  const studies: StudyEnum[] = [StudyEnum.OSTEO2, StudyEnum.LMS];

  for (const study of studies) {
    test(`Update Institution @dsm @${study}`, async ({ page, request }) => {
      let participantPage: ParticipantPage;
      let medicalRecordsRequestPage: MedicalRecordsRequestPage;
      let rowIndex = -1;

      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      await test.step('Find an enrolled participant', async () => {
        // These are columns displayed in Medical Records table
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.REGISTRATION_DATE]);
        await customizeViewPanel.selectColumns(CustomizeView.MEDICAL_RECORD, [
          Label.INSTITUTION_NAME,
          Label.FOLLOW_UP_REQUIRED,
          Label.MR_REVIEW,
          Label.INITIAL_MR_REQUEST,
          Label.INITIAL_MR_RECEIVED
        ]);

        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: ['Enrolled'] });
        await searchPanel.text(Label.INSTITUTION_NAME, { additionalFilters: [DataFilter.EMPTY] });
        await searchPanel.checkboxes(Label.FOLLOW_UP_REQUIRED, { checkboxValues: ['No'] });
        await searchPanel.checkboxes(Label.MR_REVIEW, { checkboxValues: ['No'] });
        await searchPanel.text(Label.INITIAL_MR_REQUEST, { additionalFilters: [DataFilter.EMPTY] });
        await searchPanel.text(Label.INITIAL_MR_RECEIVED, { additionalFilters: [DataFilter.EMPTY] });
        await searchPanel.search();

        const participantsCount = await participantListTable.numOfParticipants();
        expect(participantsCount).toBeGreaterThanOrEqual(1);
        if (participantsCount >= 50) {
          await participantListTable.changeRowCount(50);
        }

        // Sort by Registration Date: newest first
        await participantListTable.sort(Label.REGISTRATION_DATE, SortOrder.ASC);

        const rowCount = await participantListTable.getRowsCount();
        for (let i = 0; i < rowCount; i++) {
          const [initialMRReceivedDate] = await participantListTable.getTextAt(i, Label.INITIAL_MR_RECEIVED);
          if (initialMRReceivedDate.trim().length === 0) {
            // this participant does not have Initial MR Received date
            rowIndex = i;
            break;
          }
        }
        expect(rowIndex).toBeGreaterThanOrEqual(0);
      });

      await test.step('Assert participant information', async () => {
        participantPage = await participantListTable.openParticipantPageAt(rowIndex);

        shortId = await participantPage.getShortId();
        expect(shortId.length).toStrictEqual(6);
        logInfo(`Participant Short ID: ${shortId}`);

        const status = await participantPage.getStatus();
        expect(status).toStrictEqual('Enrolled');

        const dob = await participantPage.getDateOfBirth();
        assertDateFormat(dob);

        const consentBlood = await participantPage.getConsentBlood();
        expect(consentBlood).toMatch(/Yes|No/);

        const consentTissue = await participantPage.getConsentTissue();
        expect(consentTissue).toMatch(/Yes|No/);
      });

      await test.step('Update institution information', async () => {
        let medicalRecordTable = await openMedicalRecordsTab(participantPage);

        // Fetch information on first row. Additional rows are ignored.
        const [typeValue] = await medicalRecordTable.getTextAt(0, Label.TYPE);
        expect(typeValue).toMatch(/(Physician|Institution|Initial Biopsy)/);

        const [institutionValue] = await medicalRecordTable.getTextAt(0, Label.INSTITUTION);
        expect(institutionValue).toBeTruthy();

        const [mrStatusValue] = await medicalRecordTable.getTextAt(0, Label.MR_STATUS);
        expect(mrStatusValue).toMatch(/(New|Fax Sent|MR Received)/);

        const [mrProblemValue] = await medicalRecordTable.getTextAt(0, Label.MR_PROBLEM);
        expect(mrProblemValue).toMatch(/Yes|No/);

        const [mrRequiresReviewValue] = await medicalRecordTable.getTextAt(0, Label.MR_REQUIRES_REVIEW);
        expect(mrRequiresReviewValue).toMatch(/Yes|No/);

        const [paperCRRequiredValue] = await medicalRecordTable.getTextAt(0, Label.PAPER_CR_REQUIRED);
        expect(paperCRRequiredValue).toMatch(/Yes|No/);

        const [mrFollowUpRequiredValue] = await medicalRecordTable.getTextAt(0, Label.MR_FOLLOWUP_REQUIRED);
        expect(mrFollowUpRequiredValue).toMatch(/Yes|No/);

        // Open Medical Records - Request Page
        medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(0);

        const currentStatus = await medicalRecordsRequestPage.getStaticText(Label.CURRENT_STATUS);
        expect(currentStatus).toStrictEqual(mrStatusValue);
        expect(currentStatus).toMatch(/(New|Fax Sent|MR Received)/);

        const shortIdOnRequestPage = await medicalRecordsRequestPage.getStaticText(Label.SHORT_ID);
        expect(shortIdOnRequestPage).toStrictEqual(shortId);

        assertDateFormat(await medicalRecordsRequestPage.getStaticText(Label.DATE_OF_BIRTH));

        const instInfo = await medicalRecordsRequestPage.getStaticText(Label.INSTITUTION_INFO);
        expect(instInfo).toBeTruthy();
        logInfo(`Participant provided Institution is ${instInfo}`);

        // "No Action Needed" checkbox is displayed and unchecked
        const noActionNeededCheckbox = await medicalRecordsRequestPage.getNoActionNeeded.isVisible();
        expect(noActionNeededCheckbox).toBeTruthy();
        const isChecked = await medicalRecordsRequestPage.getNoActionNeeded.isChecked();
        if (isChecked) {
          await medicalRecordsRequestPage.getNoActionNeeded.uncheck({ callback: async () => await waitForResponse(page, { uri: '/patch' }) });
        }
        expect(await medicalRecordsRequestPage.getNoActionNeeded.isChecked()).toBeFalsy();

        // Pick one confirmed institution that does not match existing institution
        [confirmedInstitution] = confirmedInstitutions.filter(institution => institution !== institutionValue);

        await medicalRecordsRequestPage.fillText(Label.CONFIRMED_INSTITUTION_NAME, confirmedInstitution);
        logInfo(`Confirmed Institution is ${confirmedInstitution}`);

        await medicalRecordsRequestPage.backToPreviousPage();

        await participantPage.backToList();
        await participantListPage.filterListByShortId(shortId);
        await participantListTable.openParticipantPageAt(0);

        medicalRecordTable = await openMedicalRecordsTab(participantPage);
        await assertInstitution(medicalRecordTable, confirmedInstitution);
      });
    });

    test(`Entering Initial MR Request @dsm @${study}`, async ({ page, request }) => {
      // Find same participant used in the previous test
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;

      await participantListPage.filterListByShortId(shortId);
      const participantPage = await participantListTable.openParticipantPageAt(0);
      let medicalRecordTable = await openMedicalRecordsTab(participantPage);

      // Open Medical Request page
      let medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(0);

      // Pre-edit checks: No more than 3 Initial MR Request fields
      const initialMRRequest = medicalRecordsRequestPage.initialMRRequestDateLocator;
      count = await initialMRRequest.count();
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(3);

      // Entering new dates (using today)
      if (count === 1) {
        // Fill in the first date field
        await medicalRecordsRequestPage.fillInitialMRRequestDates({date1: {today: true}});
        await expect(initialMRRequest).toHaveCount(2); // another new date field appears
        // new date field is empth
        expect(await new Input(page, { root: initialMRRequest.nth(1) }).currentValue()).toEqual('');
      } else if (count === 2) {
        // Fill in the second date field
        await medicalRecordsRequestPage.fillInitialMRRequestDates({date2: {today: true}});
        await expect(initialMRRequest).toHaveCount(3); // another new date field appears
        // new date field is empth
        expect(await new Input(page, { root: initialMRRequest.nth(2) }).currentValue()).toEqual('');
      } else {
        // Fill in the third date field
        await medicalRecordsRequestPage.fillInitialMRRequestDates({date3: {today: true}});
        await expect(initialMRRequest).toHaveCount(3); // no more new date field appears. max is 3 date fields.
      }
      await page.waitForTimeout(2000); // Do not delete: DB update speed is flaky

      // Save number of Initial MR Request for later tests
      count = await initialMRRequest.count();

      // Institution table on the Medical Record tab will now show MR Status "Fax Sent"
      await medicalRecordsRequestPage.backToParticipantList();
      await participantListPage.filterListByShortId(shortId);
      await participantListTable.openParticipantPageAt(0);
      medicalRecordTable = await openMedicalRecordsTab(participantPage);
      let foundRow = await assertInstitution(medicalRecordTable, confirmedInstitution, 'Fax Sent');

      // Enter Initial MR Received
      // Open Medical Request page again
      medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(foundRow);
      const initialMRReceived = medicalRecordsRequestPage.initialMRReceivedDateLocator;

      // After entering the Initial MR Received, Initial MR Request field which is not filled out (last empty one) will disappear.
      // Initial MR Request field which is filled out (non-empty one) will not disappear.
      count = await initialMRRequest.count();
      const text = await new Input(page, { root: initialMRRequest.nth(count - 1) }).currentValue()
      const willDisappear = text.length === 0;

      // Initial MR Received date field should be empty to start with
      expect(await new Input(page, { root: initialMRReceived }).currentValue()).toEqual('');
      // Entering today date in Initial MR Received
      await medicalRecordsRequestPage.fillInitialMRReceivedDates({today: true});
      if (willDisappear) {
        await expect(initialMRRequest).toHaveCount(count - 1);
      } else {
        await expect(initialMRRequest).toHaveCount(count);
      }

      await medicalRecordsRequestPage.backToPreviousPage();

      // Iterate all rows to find matching Institution and MR Status
      foundRow = await assertInstitution(medicalRecordTable, confirmedInstitution, 'MR Received');

      // Check the "No Action Needed" checkbox and reload the page. Revisit the same participant, latest action is saved accordingly - The "No Action Needed" checkbox is checked.
      medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(foundRow);
      await medicalRecordsRequestPage.getNoActionNeeded.check({ callback: async () => await waitForResponse(page, { uri: '/patch' }) });

      const startTime = Date.now();
      await expect(async () => {
        logInfo(`Asserting checkbox "No Action Needed" is checked at ${new Date().toLocaleTimeString()}`);
        // reload Participant until timeout or checkbox "No Action Needed" is checked.
        await medicalRecordsRequestPage.backToParticipantList();
        await participantListPage.waitForReady();
        await participantListPage.reload();
        await participantListPage.waitForReady();
        await participantListPage.filterListByShortId(shortId);
        await participantListTable.openParticipantPageAt(0);
        medicalRecordTable = await openMedicalRecordsTab(participantPage);
        medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(foundRow);
        const isChecked = await medicalRecordsRequestPage.getNoActionNeeded.isChecked();
        expect(isChecked).toBeTruthy();
      }).toPass({timeout: 2 * 60 * 1000});
      const endTime = Date.now();
      logInfo(`Elasped time: ${(endTime - startTime) / 1000} seconds.`);

      // reset back to unchecked
      await medicalRecordsRequestPage.getNoActionNeeded.uncheck({ callback: async () => await waitForResponse(page, { uri: '/patch' }) });
    });

    test(`Download PDF on Medical Record Request page @dsm @${study}`, async ({ page, request }, testInfo) => {
      const testLogDir = testInfo.outputDir;

      // Find same participant used in the previous test
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;

      await participantListPage.filterListByShortId(shortId);
      const participantPage = await participantListTable.openParticipantPageAt(0);

      const existsDateOfMajority = await page.locator(participantPage.getMainTextInfoXPath(Label.DATE_OF_MAJORITY)).isVisible();

      // Open Medical Request page
      const medicalRecordTable = await openMedicalRecordsTab(participantPage);
      const medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(0);

      // Download PDF bundle
      const download = await medicalRecordsRequestPage.downloadPDFBundle();
      const saveAsFile = path.join(testLogDir, download.suggestedFilename());
      await download.saveAs(saveAsFile);

      // Download Cover PDF
      let pdf = PDFName.COVER;
      await downloadPdf(medicalRecordsRequestPage, pdf, testLogDir);

      // Download IRB Letter PDF
      pdf = PDFName.IRB_LETTER;
      await downloadPdf(medicalRecordsRequestPage, pdf, testLogDir);

      // Download Somatic Consent Addendum PDF
      pdf = existsDateOfMajority
        ? `${pdfDownloadPrefix(study)} ${PDFName.SOMATIC_CONSENT_ADDENDUM_PEDIATRIC}`
        : `${pdfDownloadPrefix(study)} ${PDFName.SOMATIC_CONSENT_ADDENDUM}`;
      await downloadPdf(medicalRecordsRequestPage, pdf, testLogDir);
    });

    test(`Should load Medical Record Not Requested Yet Quick Filter @dsm @${study}`, async ({ page, request }) => {
      // Note: loaded participants are not checked
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const participantListTable = participantListPage.participantListTable;

      // Quick filter is loaded
      const quickFilters = participantListPage.quickFilters;
      await quickFilters.click(QuickFiltersEnum.MEDICAL_RECORDS_NOT_REQUESTED_YET);

      const numParticipants = await participantListTable.numOfParticipants();
      const rowCount = await participantListTable.rowLocator().count();
      expect(rowCount).toBeGreaterThanOrEqual(1);

      // Verify quick filter table headers
      const orderedHeaderNames = ['DDP', 'Short ID', 'First Name', 'Last Name', 'Initial MR Request'];
      const actualHeaderNames = await participantListTable.getHeaderNames();
      assertTableHeaders(actualHeaderNames, orderedHeaderNames);

      // Add Registration Date column to Quick Filter view
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.REGISTRATION_DATE]);
      await customizeViewPanel.close();

      // Sort by Registration Date: newest first
      await participantListTable.sort(Label.REGISTRATION_DATE, SortOrder.ASC);

      // Number of participants from quick filter should be unchanged with new column
      const numParticipantsAfter = await participantListTable.numOfParticipants();
      expect(numParticipantsAfter).toStrictEqual(numParticipants);
    });
  }

  async function openMedicalRecordsTab(participantPage: ParticipantPage): Promise<MedicalRecordsTable> {
    const medicalRecordsTab = await participantPage.clickTab<MedicalRecordsTab>(Tab.MEDICAL_RECORD);
    const medicalRecordTable = medicalRecordsTab.table;
    expect(await medicalRecordTable.getRowsCount()).toBeGreaterThanOrEqual(1);
    return medicalRecordTable;
  }

  async function assertInstitution(medicalRecordTable: MedicalRecordsTable, institutionName: string, mrStatus?: string): Promise<number> {
    const rowCount = await medicalRecordTable.getRowsCount();
    let foundMatch = false;
    let foundRow = -1;

    for (let i = 0; i < rowCount; i++) {
      const [institutionValue] = await medicalRecordTable.getTextAt(i, Label.INSTITUTION);
      if (institutionName === institutionValue) {
        const [mrStatusValue] = await medicalRecordTable.getTextAt(i, Label.MR_STATUS);
        if (mrStatus) {
          if (mrStatus === mrStatusValue) {
            foundMatch = true;
            foundRow = i;
            break;
          }
        } else {
          foundMatch = true;
          foundRow = i;
          mrStatus = mrStatusValue;
          break;
        }
      }
    }
    expect(foundMatch, `Institution table does not show any institution with MR Status "${mrStatus}"`).toBeTruthy();
    expect(foundRow).toBeGreaterThanOrEqual(0);
    return foundRow;
  }

  function pdfDownloadPrefix(study: string) {
    let name;
    switch (study) {
      case StudyEnum.OSTEO:
      case StudyEnum.OSTEO2:
        name = 'Osteo';
        break;
      case StudyEnum.LMS:
        name = 'LMS';
        break;
      default:
        name = study;
    }
    return name;
  }

  async function downloadPdf(medicalRecordsRequestPage: MedicalRecordsRequestPage, pdf: string, dir: string): Promise<void> {
    const download = await medicalRecordsRequestPage.downloadSinglePDF(pdf);
    const fileName = download.suggestedFilename();
    const saveAsFile = path.join(dir, fileName);
    await download.saveAs(saveAsFile);
  }
});
