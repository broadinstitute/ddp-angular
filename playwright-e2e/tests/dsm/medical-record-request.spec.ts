import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { assertDateFormat, shuffle } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';

test.describe('Medical Records Request', () => {
  const studies: StudyEnum[] = [StudyEnum.OSTEO2];

  for (const study of studies) {
    let participantListPage: ParticipantListPage;
    let participantListTable: ParticipantListTable;
    let rowIndex: number;

    test(`Check in @dsm @${study}`, async ({ page, request }) => {
      participantListPage = await ParticipantListPage.goto(page, study, request);
      participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;

      await test.step('Find an enrolled adult participant', async () => {
        const institutionNameColumn = 'Institution Name';
        const typeColumn = 'Type';
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.MEDICAL_RECORD, [institutionNameColumn, typeColumn]);

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes(typeColumn, { checkboxValues: ['Physician'] });
        await searchPanel.checkboxes(institutionNameColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
        await searchPanel.search();
        
        const participantsCount = await participantListTable.numOfParticipants();
        expect(participantsCount).toBeGreaterThanOrEqual(1);
        [rowIndex] = shuffle([...Array(participantsCount).keys()]);
        expect(rowIndex).toBeGreaterThanOrEqual(0);
      });

      // Open Participant Medical Record tab
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(rowIndex);

      // Save information for comparison later
      const shortId = await participantPage.getShortId();
      const status = await participantPage.getStatus();
      expect(status).toStrictEqual('Enrolled');
      const dob = await participantPage.getDateOfBirth();
      assertDateFormat(dob);
      const dateOfDiagnosis = await participantPage.getDateOfDiagnosis();
      const consentBlood = await participantPage.getConsentBlood();
      const consentTissue = await participantPage.getConsentTissue();

      const medicalRecordsTab = await participantPage.clickTab<MedicalRecordsTab>(TabEnum.MEDICAL_RECORD);
      const medicalRecordTable = medicalRecordsTab.table;
      expect(await medicalRecordTable.getRowsCount()).toBeGreaterThanOrEqual(1);
      // Open Medical Records - Request Page from clicking first row
      const medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(0);
      
     

      await test.step('Survey Data - Medical Release Form', async () => {
        const surveyData = await participantPage.clickTab<SurveyTab>(TabEnum.SURVEY_DATA);
      });
    });
  }

  async function findRowIndex(participantListTable: ParticipantListTable): Promise<number> {
    let participantsCount = await participantListTable.numOfParticipants();
    expect(participantsCount).toBeGreaterThanOrEqual(1);
      return shuffle([...Array(participantsCount).keys()]);
  }
});
