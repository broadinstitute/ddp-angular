import { expect } from '@playwright/test';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage, { FileFormatEnum, TextFormatEnum } from 'dsm/pages/participant-list-page';
import { test } from 'fixtures/dsm-fixture';
import { assertParticipantListDownloadFileName } from 'utils/test-utils';

test.describe('Participant List Download', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.BRUGADA];

  test.describe('As human-readable', () => {
    for (const study of studies) {
      // Mix of columns from Participant Columns and Sample Columns
      test(`Subset of data in ${study} @dsm`, async ({ page, request }) => {
        const participantListPage = await ParticipantListPage.goto(page, study, request);

        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();

        await customizeViewPanel.selectColumns('Sample Columns', ['Collaborator Participant ID', 'Status', 'Sample Type']);
        await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

        // Export as human-readable, Excel and include all completion of an activity
        const download = await participantListPage.downloadParticipantList();
        assertParticipantListDownloadFileName(download, study);

        const downloadedFile = await download.path();
        expect(downloadedFile).toBeTruthy();
      });
    }
  })

  test.describe('As analysis-friendly', () => {
    test('Subset of data in Prostate @dsm @prostate',
      async ({ page, request }) => {
        const participantListPage = await ParticipantListPage.goto(page, StudyEnum.PROSTATE, request);

        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();

        await customizeViewPanel.selectColumns('Sample Columns', ['Collaborator Participant ID']);
        await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

        // Export as analysis-friendly, tab-delimited and include all completion of an activity
        const download = await participantListPage.downloadParticipantList({
          fileFormat: FileFormatEnum.TSV,
          textFormat: TextFormatEnum.ANALYSIS_FRIENDLY
        });
        assertParticipantListDownloadFileName(download, StudyEnum.PROSTATE);

        const downloadedFile = await download.path();
        expect(downloadedFile).toBeTruthy();
      });
  })
});
