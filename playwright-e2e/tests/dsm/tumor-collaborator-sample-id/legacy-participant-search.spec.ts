import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Filter, Column, Tab } from 'dsm/enums';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { studyShortName } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import ParticipantPage from 'dsm/pages/participant-page';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import { StudyName } from 'dsm/component/navigation';

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
  const studies: StudyName[] = [StudyName.MBC];

  for (const study of studies) {
    test(`Search by tumor sample id for legacy participant @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      await test.step('Search for the right participant', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(Column.TISSUE, ['Tumor Collaborator Sample ID']);
        await customizeViewPanel.selectColumns(Column.PARTICIPANT, ['Legacy Short ID']);
        await customizeViewPanel.deselectColumns(Column.PARTICIPANT, ['DDP', 'Last Name', 'First Name']);
        await customizeViewPanel.selectColumns(Column.DSM_COLUMNS, ['Onc History Created']);
        await customizeViewPanel.selectColumns(Column.MEDICAL_RECORD, ['MR Problem']);

        await expect(participantListTable.getHeaderByName('DDP')).not.toBeVisible();

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes('MR Problem', { checkboxValues: ['No'] });
        await searchPanel.text('Legacy Short ID', { additionalFilters: [Filter.NOT_EMPTY] });
        await searchPanel.text('Onc History Created', { additionalFilters: [Filter.NOT_EMPTY] });
        await searchPanel.search();

        const numParticipants = await participantListTable.numOfParticipants();
        expect(numParticipants).toBeGreaterThanOrEqual(1);
        logInfo(`Number of participants (after search): ${numParticipants}`);
      });

      const rowIndex = 0;
      const [shortID] = await participantListTable.getTextAt(rowIndex, 'Short ID');
      logInfo(`Participant Short ID: ${shortID}`);
      expect(shortID).toBeTruthy();

      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(rowIndex);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(Tab.ONC_HISTORY);
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
