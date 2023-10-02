import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { studyShortName } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';

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
 * DSM should show the correct tumor id for the selected pt: [COLLABORATOR_PREFIX]_[HRUID]_*
 */
test.describe('Tumor Collaborator Sample ID', () => {
  // Studies that don't have any participant without status: Enrolled and Tumor Collaborator Sample ID are excluded
  const studies: StudyEnum[] = [StudyEnum.OSTEO2, StudyEnum.OSTEO, StudyEnum.LMS, StudyEnum.PANCAN, StudyEnum.MBC];

  async function findTableRow(study: StudyEnum, table: ParticipantListTable, rowsCount: number): Promise<number> {
    const studyPrefix = studyShortName(study).collaboratorPrefix;
    // Special handling of Study Osteo and Osteo2:
    // Participant List search for only Osteo or Osteo2 study does not work.
    let index = -1;
    switch (study) {
      case StudyEnum.OSTEO:
      case StudyEnum.OSTEO2:
        for (let i = 0; i < rowsCount; i++) {
          const IDs = await table.getTextAt(i, 'Tumor Collaborator Sample ID');
          console.log(`IDs: ${JSON.stringify(IDs)}`);

          const found = IDs.find(id => id.indexOf(studyPrefix!) !== -1);
          if (found) {
            index = i;
            break;
          }
          break;
        }
        break;
      default:
        index = 0; // First row
        break;
    }
    return index;
  }

  for (const study of studies) {
    test(`Search by tumor sample id for non-legacy participant @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      const tumorIdColumn = 'Tumor Collaborator Sample ID';
      await customizeViewPanel.selectColumns(CustomViewColumns.TISSUE, [tumorIdColumn]);

      // Table automatically reloaded with new column added
      await expect(participantsTable.getHeaderByName(tumorIdColumn)).toBeVisible();

      // Search by Sample ID column: NOT EMPTY
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      // await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
      await searchPanel.text(tumorIdColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
      await searchPanel.search();

      // Count participants
      const numParticipants = await participantsTable.numOfParticipants();
      expect(numParticipants).toBeGreaterThanOrEqual(1);

      const rowIndex = await findTableRow(study, participantsTable, numParticipants);
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
