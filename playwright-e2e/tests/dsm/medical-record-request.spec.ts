import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { assertDateFormat, waitForResponse } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import { SortOrder } from 'dss/component/table';
import MedicalRecordsRequestPage from 'dsm/pages/medical-records/medical-records-request-page';
import { FieldsEnum } from 'dsm/pages/medical-records/medical-records-enums';
import Input from 'dss/component/input';
import MedicalRecordsTable from 'dsm/pages/medical-records/medical-records-table';

test.describe.serial('Medical records request workflow', () => {
  let shortId: string;
  let confirmedInstitution: string;

  const confirmedInstitutions = [
    'Massachusetts General Hospital',
    'Asante Three Rivers Medical Center',
    'Bothwell Regional Health Center',
    'Adcare Hospital of Worcester Inc',
    'Brigham and Women\'s',
    'Asante Three Rivers Medical Center',
    'Boston Children\'s Hospital'
  ];

  // Two CMI Clinical and two CMI Research studies
  const studies: StudyEnum[] = [StudyEnum.OSTEO2, StudyEnum.LMS, StudyEnum.PANCAN, StudyEnum.BRAIN];

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
        const registrationDateColumn = 'Registration Date';
        // These are columns displayed in Medical Records table
        const institutionNameColumn = 'Institution Name';
        const followUpColumn = 'Follow-Up required';
        const mrReviewColumn = 'MR Review';
        const initialMRRequestColumn = 'Initial MR Request';
        const initialMRReceivedColumn = 'Initial MR Received';

        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.PARTICIPANT, [registrationDateColumn]);
        await customizeViewPanel.selectColumns(CustomViewColumns.MEDICAL_RECORD, [
          institutionNameColumn,
          followUpColumn,
          mrReviewColumn,
          initialMRRequestColumn,
          initialMRReceivedColumn
        ]);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.text(institutionNameColumn, { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.checkboxes(followUpColumn, { checkboxValues: ['No'] });
        await searchPanel.checkboxes(mrReviewColumn, { checkboxValues: ['No'] });
        await searchPanel.text(initialMRRequestColumn, { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.text(initialMRReceivedColumn, { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.search();

        const participantsCount = await participantListTable.numOfParticipants();
        expect(participantsCount).toBeGreaterThanOrEqual(1);

        // Sort by Registration Date: newest first
        await participantListTable.sort(registrationDateColumn, SortOrder.ASC);

        const rowCount = await participantListTable.getRowsCount();
        for (let i = 0; i < rowCount; i++) {
          const initialMRReceivedDate = await participantListTable.getRowText(i, initialMRReceivedColumn);
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

        // Fetch information on first row
        const [typeValue] = await medicalRecordTable.getTextAt(0, 'Type');
        expect(typeValue).toMatch(/(Physician|Institution|Initial Biopsy)/);

        const [institutionValue] = await medicalRecordTable.getTextAt(0, 'Institution');
        expect(institutionValue).toBeTruthy();

        const [mrStatusValue] = await medicalRecordTable.getTextAt(0, 'MR Status');
        expect(mrStatusValue).toMatch(/(New|Fax Sent|MR Received)/);

        const [mrProblemValue] = await medicalRecordTable.getTextAt(0, 'MR Problem');
        expect(mrProblemValue).toMatch(/Yes|No/);

        const [mrRequiresReviewValue] = await medicalRecordTable.getTextAt(0, 'MR Requires Review');
        expect(mrRequiresReviewValue).toMatch(/Yes|No/);

        const [paperCRRequiredValue] = await medicalRecordTable.getTextAt(0, 'Paper C/R Required');
        expect(paperCRRequiredValue).toMatch(/Yes|No/);

        const [mrFollowUpRequiredValue] = await medicalRecordTable.getTextAt(0, 'MR Follow-Up Required');
        expect(mrFollowUpRequiredValue).toMatch(/Yes|No/);

        // Open Medical Records - Request Page
        medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(0);

        const currentStatus = await medicalRecordsRequestPage.getStaticText(MainInfoEnum.CURRENT_STATUS);
        expect(currentStatus).toStrictEqual(mrStatusValue);
        expect(currentStatus).toMatch(/(New|Fax Sent|MR Received)/);

        const shortIdOnRequestPage = await medicalRecordsRequestPage.getStaticText(MainInfoEnum.SHORT_ID);
        expect(shortIdOnRequestPage).toStrictEqual(shortId);

        assertDateFormat(await medicalRecordsRequestPage.getStaticText(MainInfoEnum.DATE_OF_BIRTH));

        const instInfo = await medicalRecordsRequestPage.getStaticText(FieldsEnum.INSTITUTION_INFO);
        expect(instInfo).toBeTruthy();
        logInfo(`Participant provided Institution Info: ${instInfo}`);

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

        await medicalRecordsRequestPage.fillText(FieldsEnum.CONFIRMED_INSTITUTION_NAME, confirmedInstitution);
        await medicalRecordsRequestPage.backToPreviousPage();
        await participantPage.waitForReady();

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
      let count = await initialMRRequest.count();
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

      // Institution table on the Medical Record tab will now show MR Status "Fax Sent"
      await medicalRecordsRequestPage.backToParticipantList();
      await participantListPage.filterListByShortId(shortId);
      await participantListTable.openParticipantPageAt(0);
      medicalRecordTable = await openMedicalRecordsTab(participantPage);
      let foundRow = await assertInstitution(medicalRecordTable, confirmedInstitution);

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
      await medicalRecordsRequestPage.backToParticipantList();
      await participantListPage.filterListByShortId(shortId);
      await participantListTable.openParticipantPageAt(0);
      medicalRecordTable = await openMedicalRecordsTab(participantPage);
      medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(foundRow);
      const isChecked = await medicalRecordsRequestPage.getNoActionNeeded.isChecked();
      expect(isChecked).toBeTruthy();
      // reset back to unchecked
      await medicalRecordsRequestPage.getNoActionNeeded.uncheck({ callback: async () => await waitForResponse(page, { uri: '/patch' }) });
    });
  }

  async function openMedicalRecordsTab(participantPage: ParticipantPage): Promise<MedicalRecordsTable> {
    const medicalRecordsTab = await participantPage.clickTab<MedicalRecordsTab>(TabEnum.MEDICAL_RECORD);
    const medicalRecordTable = medicalRecordsTab.table;
    expect(await medicalRecordTable.getRowsCount()).toBeGreaterThanOrEqual(1);
    return medicalRecordTable;
  }

  async function assertInstitution(medicalRecordTable: MedicalRecordsTable, institutionName: string, mrStatus?: string): Promise<number> {
    const rowCount = await medicalRecordTable.getRowsCount();
    let foundMatch = false;
    let foundRow = -1;

    for (let i = 0; i < rowCount; i++) {
      const [institutionValue] = await medicalRecordTable.getTextAt(i, 'Institution');
      if (institutionName === institutionValue) {
        if (mrStatus) {
          const [mrStatusValue] = await medicalRecordTable.getTextAt(i, 'MR Status');
          if (mrStatus === mrStatusValue) {
            foundMatch = true;
            foundRow = i;
            break;
          }
        } else {
          foundMatch = true;
          foundRow = i;
          break;
        }
      }
    }
    expect(foundMatch, `Institution table does not show any institution with MR Status "Fax Sent"`).toBeTruthy();
    expect(foundRow).toBeGreaterThanOrEqual(0);
    return foundRow;
  }
});
