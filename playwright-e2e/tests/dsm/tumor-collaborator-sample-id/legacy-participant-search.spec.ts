import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { studyShortName } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';

/**
* Collaborator Prefixes per study:
* ESC -> GECProject
 */

/**
 * Lookup of Tumor Collaborator Sample ID for a legacy pt with legacy samples
 *   1) search for a pt with "Legacy Participant ID" not empty and "Normal Collaborator Sample ID" not empty
 *   2) click into Tumor Collaborator Sample ID
 *
 * DSM should show the correct tumor id for the selected pt: [COLLABORATOR_PREFIX]_[LEGACY SHORT ID]_*
 */
test.describe('Tumor Collaborator Sample ID', () => {
  const studies: StudyEnum[] = [StudyEnum.MBC];

  for (const study of studies) {
    test(`Search by tumor sample id for legacy participant @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      const tumorIdColumn = 'Tumor Collaborator Sample ID';
      const legacyParticipantColumn = 'Legacy Participant ID';
      await customizeViewPanel.selectColumns(CustomViewColumns.TISSUE, [tumorIdColumn]);
      await customizeViewPanel.selectColumns(CustomViewColumns.PARTICIPANT, [legacyParticipantColumn]);

      // Table automatically reloaded with new column added
      await expect(participantsTable.getHeaderByName(tumorIdColumn)).toBeVisible();
      await expect(participantsTable.getHeaderByName(legacyParticipantColumn)).toBeVisible();

      // Search by Sample ID column: NOT EMPTY
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      // await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
      await searchPanel.text(tumorIdColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
      await searchPanel.text(legacyParticipantColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
      await searchPanel.search();

      // Count participants
      const numParticipants = await participantsTable.numOfParticipants();
      expect(numParticipants).toBeGreaterThanOrEqual(1);

      const rowIndex = 0;
      const [shortID] = await participantsTable.getTextAt(rowIndex, 'Short ID');
      const sampleIDs = await participantsTable.getTextAt(rowIndex, tumorIdColumn);
      const [sampleID] = sampleIDs.filter(id => id.length > 0); // Grep first ID. It could be more than 1.
      logInfo(`Participant Short ID: ${shortID}, Tumor Collaborator Sample ID: ${sampleID}`);

      // show the correct tumor id: [COLLABORATOR_PREFIX]_[HRUID]_*
      const studyPrefix = studyShortName(study).collaboratorPrefix;
      expect(sampleID).toMatch(new RegExp(`${studyPrefix}_${shortID}_`));

      await searchPanel.open();
      await searchPanel.clear();
      await searchPanel.search({ uri: '/ui/applyFilter?' });

      // Searching with an empty manual search will not lose custom column
      await expect(participantsTable.getHeaderByName(tumorIdColumn)).toBeVisible();

      // Search for a specific tumor collaborator sample ID
      await searchPanel.text(tumorIdColumn, { textValue: sampleID });
      await searchPanel.search();

      const count = await participantsTable.numOfParticipants();
      expect(count).toBe(1);

      expect(await participantsTable.getTextAt(0, tumorIdColumn)).toContain(sampleID);
      expect(await participantsTable.getTextAt(0, 'Short ID')).toStrictEqual([shortID]);
    });
  }
});
