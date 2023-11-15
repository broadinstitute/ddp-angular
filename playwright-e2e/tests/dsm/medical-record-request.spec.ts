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
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import { SortOrder } from 'dss/component/table';

test.describe('Medical records request workflow', () => {
  const confirmedInstitutions = [
    'Massachusetts General Hospital',
    'Asante Three Rivers Medical Center',
    'Bothwell Regional Health Center',
    'Adcare Hospital of Worcester Inc',
    'Brigham and Women\'s',
    'Asante Three Rivers Medical Center',
    'Boston Children\'s Hospital'
  ];

  const studies: StudyEnum[] = [StudyEnum.OSTEO2];

  for (const study of studies) {
    let participantListPage: ParticipantListPage;
    let participantListTable: ParticipantListTable;
    let participantPage: ParticipantPage;
    let medicalRecordsTab: MedicalRecordsTab;
    let rowIndex: number;
    let shortId: string;

    test(`Update Institution Information with Confirmed Institution @dsm @${study}`, async ({ page, request }) => {
      participantListPage = await ParticipantListPage.goto(page, study, request);
      participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      await test.step('Find an enrolled participant', async () => {
        const registrationDateColumn = 'Registration Date';
        // table columns displayed in Medical Records table
        const typeColumn = 'Type';
        const institutionNameColumn = 'Institution Name';
        const followUpColumn = 'Follow-Up required';
        const mrReviewColumn = 'MR Review';
        const mrProblemColumn = 'MR Review';

        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.PARTICIPANT, [registrationDateColumn]);
        await customizeViewPanel.selectColumns(CustomViewColumns.MEDICAL_RECORD, [
          institutionNameColumn,
          typeColumn,
          followUpColumn,
          mrReviewColumn,
          mrProblemColumn
        ]);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes(typeColumn, { checkboxValues: ['Physician', 'Institution', 'Initial Biopsy'] });
        await searchPanel.text(institutionNameColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
        await searchPanel.checkboxes(followUpColumn, { checkboxValues: ['No'] });
        await searchPanel.checkboxes(mrReviewColumn, { checkboxValues: ['No'] });
        await searchPanel.checkboxes(mrProblemColumn, { checkboxValues: ['No'] });
        await searchPanel.search();

        const participantsCount = await participantListTable.numOfParticipants();
        expect(participantsCount).toBeGreaterThanOrEqual(1);

        // Sort by Registration Date: newest first
        await participantListTable.sort(registrationDateColumn, SortOrder.ASC);

        const rowCount = await participantListTable.getRowsCount();
        [rowIndex] = shuffle([...Array(rowCount).keys()]);
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
        medicalRecordsTab = await participantPage.clickTab<MedicalRecordsTab>(TabEnum.MEDICAL_RECORD);
        const medicalRecordTable = medicalRecordsTab.table;
        expect(await medicalRecordTable.getRowsCount()).toBeGreaterThanOrEqual(1);

        // Fetch information on first row
        const [typeValue] = await medicalRecordTable.getTextAt(0, 'Type');
        expect(typeValue).toMatch(/(Physician|Institution Initial Biopsy)/);

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
        const medicalRecordsRequestPage = await medicalRecordTable.openRequestPageByRowIndex(0);

        const currentStatus = await medicalRecordsRequestPage.getStaticText(MainInfoEnum.CURRENT_STATUS);
        expect(currentStatus).toStrictEqual(mrStatusValue);
        expect(currentStatus).toMatch(/(New|Fax Sent|MR Received)/);

        const shortIdOnRequestPage = await medicalRecordsRequestPage.getStaticText(MainInfoEnum.SHORT_ID);
        expect(shortIdOnRequestPage).toStrictEqual(shortId);

        assertDateFormat(await medicalRecordsRequestPage.getStaticText(MainInfoEnum.DATE_OF_BIRTH));

        const instInfo = await medicalRecordsRequestPage.getStaticText(MainInfoEnum.INSTITUTION_INFO);
        expect(instInfo).toBeTruthy();
        const instInfoArray = instInfo.split(/\n+/);
        console.log(`instition info: ${instInfoArray}`);
        logInfo(`Participant provided Institution Info: ${instInfo}`);

        const [confirmedInstitution] = confirmedInstitutions.filter(institution => institution !== institutionValue);
        await medicalRecordsRequestPage.fillText(MainInfoEnum.CONFIRMED_INSTITUTION_NAME, confirmedInstitution);
        await medicalRecordsRequestPage.backToPreviousPage();
        await participantPage.waitForReady();

        // Institution table will show updated institution name
        const [changedInstitution] = await medicalRecordTable.getTextAt(0, 'Institution');
        expect(changedInstitution).toStrictEqual(confirmedInstitution);

        await participantPage.backToList();
        await participantListPage.filterListByShortId(shortId);
        await participantListTable.openParticipantPageAt(0);
        medicalRecordsTab = await participantPage.clickTab<MedicalRecordsTab>(TabEnum.MEDICAL_RECORD);
        expect(await medicalRecordTable.getRowsCount()).toBeGreaterThanOrEqual(1);
        const rowCount = await medicalRecordTable.getRowsCount();
        let foundMatch = false;
        for (let i = 0; i < rowCount; i++) {
          const [cellValue] = await medicalRecordTable.getTextAt(i, 'Institution');
          if (confirmedInstitution === cellValue) {
            foundMatch = true;
            break;
          }
        }
        expect(foundMatch).toBeTruthy();
      });


      await test.step('Survey Data - Medical Release Form', async () => {
        //const surveyData = await participantPage.clickTab<SurveyTab>(TabEnum.SURVEY_DATA);
      });
    });
  }
});
