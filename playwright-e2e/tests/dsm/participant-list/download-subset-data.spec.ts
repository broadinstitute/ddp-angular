import { expect } from '@playwright/test';
import { StudyName } from 'dsm/component/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { FileFormatEnum, TextFormatEnum } from 'dsm/pages/participant-page/enums/download-format-enum';
import { test } from 'fixtures/dsm-fixture';
import { assertParticipantListDownloadFileName } from 'utils/test-utils';

test.describe('Participant List Download', () => {
  const studies = [StudyName.OSTEO2, StudyName.BRUGADA];

  test.describe('As human-readable', () => {
    for (const study of studies) {
      // Mix of columns from Participant Columns and Sample Columns
      test(`Subset of data @dsm @${study}`, async ({ page, request }) => {
        const participantListPage = await ParticipantListPage.goto(page, study, request);

        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();

        await customizeViewPanel.selectColumns('Sample Columns', ['Collaborator Participant ID', 'Status', 'Sample Type']);
        await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

        // Export as human-readable, Excel and include all completion of an activity
        const download = await participantListPage.downloadParticipant();
        assertParticipantListDownloadFileName(download, study);

        const downloadedFile = await download.path();
        expect(downloadedFile).toBeTruthy();
      });
    }
  });

  test.describe('As analysis-friendly', () => {
    test('Subset of data in @dsm @prostate',
      async ({ page, request }) => {
        const participantListPage = await ParticipantListPage.goto(page, StudyName.PROSTATE, request);

        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();

        await customizeViewPanel.selectColumns('Sample Columns', ['Collaborator Participant ID']);
        await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

        // Export as analysis-friendly, tab-delimited and include all completion of an activity
        const download = await participantListPage.downloadParticipant({
          fileFormat: FileFormatEnum.TSV,
          textFormat: TextFormatEnum.ANALYSIS_FRIENDLY
        });
        assertParticipantListDownloadFileName(download, StudyName.PROSTATE);

        const downloadedFile = await download.path();
        expect(downloadedFile).toBeTruthy();
      });
  });
})
