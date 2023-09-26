import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { logInfo } from 'utils/log-utils';

test.describe('Pancan study picklist search', () => {
  // CMI research studies
  const studies = [StudyEnum.PANCAN];
  const cancers = ['Gynecologic cancers', 'Leukemias', 'Sarcomas', 'Small intestine cancer', 'Gastrointestinal cancers'];

  for (const study of studies) {
    test(`@${study} @dsm`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);

      // Select column Diagnosis_Type from Customize View
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CustomViewColumns.DIAGNOSIS_TYPE, ['DIAGNOSIS_TYPE']);
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

      while (participantsCount > 0) {
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
        } else {
          participantsCount = 0
        }
        console.log(`participantsCount: ${participantsCount}`)
      }
      expect(test.info().errors).toHaveLength(0);
    });
  }
});
