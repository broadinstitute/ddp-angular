import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { Column } from 'dsm/enums';
import { logInfo } from 'utils/log-utils';
import { StudyName } from 'dsm/component/navigation';

test.describe('Pancan study picklist search', () => {
  // CMI research studies
  const studies = [StudyName.PANCAN];
  const cancers = ['Gynecologic cancers', 'Leukemias', 'Sarcomas', 'Small intestine cancer', 'Gastrointestinal cancers'];

  for (const study of studies) {
    test(`@${study} @dsm`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);

      // Select column Diagnosis_Type from Customize View
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(Column.DIAGNOSIS_TYPE, ['DIAGNOSIS_TYPE']);
      await customizeViewPanel.close();

      // In the search menu, select some specific cancers along with some general one
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes('DIAGNOSIS_TYPE', {checkboxValues: cancers});
      await searchPanel.search();

      const participantsTable = participantListPage.participantListTable;
      const numParticipants = await participantsTable.getHeadersCount();
      logInfo(`Number of participants from search [${cancers}]: ${numParticipants}`);

      let participantsCount = await participantsTable.getRowsCount();
      expect(participantsCount).toBeGreaterThan(1);

      let pageCount = 0;
      // Stops when participantsCount <= 0 and gone thru 3 table pages already
      while (participantsCount > 0 && pageCount <= 3) {
        // Verify only participants with at least one diagnosis type that match the above selected cancers are displayed
        for (let i = 0; i < participantsCount; i++) {
          const columnData: string = await participantsTable.getParticipantDataAt(i, 'DIAGNOSIS_TYPE');
          const exists = cancers.some(cancer => columnData.indexOf(cancer) !== -1);
          expect.soft(exists).toBe(true);
        }
        const hasNextPage = await participantsTable.paginator.hasNext();
        if (hasNextPage) {
          await participantsTable.nextPage();
          participantsCount = await participantsTable.getRowsCount();
          pageCount++;
        } else {
          participantsCount = 0
        }
      }
      expect(test.info().errors).toHaveLength(0);
    });
  }
});
