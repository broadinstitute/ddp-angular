import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { DataFilter, CustomizeView, Tab, Label } from 'dsm/enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { studyShortName } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import OncHistoryTab from 'dsm/pages/tab-pages/onc-history-tab';

/**
  * Collaborator Prefixes per study:
  *   MBC -> MBCProject
*/

/**
 * Lookup of Tumor Collaborator Sample ID for a legacy pt with legacy samples
 *   1) search for a pt with "Legacy Participant ID" not empty and "Normal Collaborator Sample ID" not empty
 *   2) click into Tumor Collaborator Sample ID
 *
 * DSM should show the correct tumor id for the selected pt: [COLLABORATOR_PREFIX]_[SHORT_ID]_*
 */
test.describe('Tumor Collaborator Sample ID', () => {
  const studies: StudyEnum[] = [StudyEnum.MBC];

  for (const study of studies) {
    test(`Search by tumor sample id for legacy participant @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      await test.step('Search for the right participant', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.TISSUE, [Label.TUMOR_COLLABORATOR_SAMPLE_ID]);
        await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.LEGACY_SHORT_ID]);
        await customizeViewPanel.deselectColumns(CustomizeView.PARTICIPANT, [Label.DDP, Label.LAST_NAME, Label.FIRST_NAME]);
        await customizeViewPanel.selectColumns(CustomizeView.DSM_COLUMNS, [Label.ONC_HISTORY_CREATED]);
        await customizeViewPanel.selectColumns(CustomizeView.MEDICAL_RECORD, [Label.MR_PROBLEM]);

        await expect(participantListTable.getHeaderByName(Label.DDP)).not.toBeVisible();

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.checkboxes(Label.MR_PROBLEM, { checkboxValues: [DataFilter.NO] });
        await searchPanel.text(Label.LEGACY_SHORT_ID, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.text(Label.ONC_HISTORY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.search();

        const numParticipants = await participantListTable.numOfParticipants();
        expect(numParticipants).toBeGreaterThanOrEqual(1);
        logInfo(`Number of participants (after search): ${numParticipants}`);
      });

      const rowIndex = 0;
      const [shortID] = await participantListTable.getTextAt(rowIndex, Label.SHORT_ID);
      logInfo(`Participant Short ID: ${shortID}`);
      expect(shortID).toBeTruthy();

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(rowIndex);
      const oncHistoryTab = await participantPage.tab(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;

      await test.step('Check Tumor Collaborator Sample ID on Participant page', async () => {
        const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(rowIndex);
        await tissueInformationPage.fillFaxSentDates({ today: true });
        const tissue = await tissueInformationPage.tissue();
        const suggestedSampleID = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
        logInfo(`Tumor Collaborator Sample ID: ${suggestedSampleID}`);

        // Shows the correct tumor id prefix: [COLLABORATOR_PREFIX]_[LEGACY_SHORT_ID]_*
        const studyPrefix = studyShortName(study).collaboratorPrefix;
        expect(suggestedSampleID).toMatch(new RegExp(`${studyPrefix}_${shortID}_`));
      });
    });
  }
});
