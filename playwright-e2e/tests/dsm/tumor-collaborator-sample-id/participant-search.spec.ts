import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { studyShortName } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { OncHistoryInputColumnsEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { SortOrder } from 'dss/component/table';

/**
* Collaborator Prefixes per study:
* OS2 -> OSPECGS
* OS1 -> OSProject
* LMS -> PECGSProject
* Prostate -> PCProject
* PanCan -> Project
* ESC -> GECProject
* MBC -> MBCProject
* Brain -> BrainProject
* Angio -> Project Pepper
 */

/**
 * Lookup of Tumor Collaborator Sample ID (Tissue Columns)
 *   1) Add the following to Participant List:
 *        Tissue Columns -> Tumor Collaborator Sample ID
 *   2) Search for a specific tumor collaborator sample ID
 *
 * DSM should show the correct tumor id prefix: [COLLABORATOR_PREFIX]_[HRUID]_*
 */
test.describe.serial('Tumor Collaborator Sample ID', () => {
  // Some studies are excluded due to lack of the suitable paricipants
  const studies: StudyEnum[] = [StudyEnum.OSTEO2, StudyEnum.PANCAN, StudyEnum.MBC, StudyEnum.BRAIN];

  for (const study of studies) {
    test(`Search by tumor sample id for non-legacy participant @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;

      await test.step('Search for the right participant', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.TISSUE, [Label.TUMOR_COLLABORATOR_SAMPLE_ID]);
        await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.REGISTRATION_DATE]);
        await customizeViewPanel.deselectColumns(CustomizeView.PARTICIPANT, [Label.DDP, Label.LAST_NAME, Label.FIRST_NAME]);
        await customizeViewPanel.selectColumns(CustomizeView.DSM_COLUMNS, [Label.ONC_HISTORY_CREATED]);
        await customizeViewPanel.selectColumns(CustomizeView.MEDICAL_RECORD, [Label.MR_PROBLEM]);
        await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, ['CONSENT_BLOOD', 'CONSENT_TISSUE']);

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.checkboxes(Label.MR_PROBLEM, { checkboxValues: [DataFilter.NO] });
        await searchPanel.checkboxes('CONSENT_BLOOD', { checkboxValues: [DataFilter.YES] });
        await searchPanel.checkboxes('CONSENT_TISSUE', { checkboxValues: [DataFilter.YES] });
        await searchPanel.search();

        const numParticipants = await participantListTable.numOfParticipants();
        expect(numParticipants).toBeGreaterThanOrEqual(1);
        logInfo(`Number of participants (after search): ${numParticipants}`);
      });

      // Open Participant page
      await participantListTable.sort(Label.REGISTRATION_DATE, SortOrder.ASC);
      const [row] = await participantListTable.randomizeRows();
      const shortID = await participantListTable.getParticipantDataAt(row, Label.SHORT_ID);
      expect(shortID?.length).toStrictEqual(6);
      logInfo(`Participant Short ID: ${shortID}`);

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(row);
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      const rows = await oncHistoryTable.rowLocator().count(); // append new row
      const rowIndex = rows - 1; // 0th-index

      await test.step('Insert new Onc History data', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: 'm', lookupSelectIndex: 1 }, rowIndex);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX,
          {
            date: {
              date: {
                yyyy: new Date().getFullYear(),
                month: new Date().getMonth(),
                dayOfMonth: new Date().getDate()
              }
            }
          }, rowIndex);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TYPE_OF_PX, { value: 'a', lookupSelectIndex: 4 }, rowIndex);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, { select: OncHistorySelectRequestEnum.REQUEST }, rowIndex);
      });

      await test.step('Check Tumor Collaborator Sample ID on Participant page', async () => {
        const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(rowIndex);
        const faxSentDate1 = await tissueInformationPage.getFaxSentDate();
        if (faxSentDate1.trim().length === 0) {
          await tissueInformationPage.fillFaxSentDates({ today: true });
        }
        const tissue = await tissueInformationPage.tissue();
        const suggestedSampleID = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
        logInfo(`Tumor Collaborator Sample ID: ${suggestedSampleID}`);

        // Shows the correct tumor id prefix: [COLLABORATOR_PREFIX]_[HRUID]_*
        const studyPrefix = studyShortName(study).collaboratorPrefix;
        expect(suggestedSampleID).toMatch(new RegExp(`${studyPrefix}_`));
      });
    });
  }
});
