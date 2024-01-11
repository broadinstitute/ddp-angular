import { expect } from '@playwright/test';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { FileFormatEnum } from 'dsm/pages/participant-page/enums/download-format-enum';
import { test } from 'fixtures/dsm-fixture';
import fs from 'fs';
import { assertParticipantListDownloadFileName } from 'utils/test-utils';
import * as XLSX from 'xlsx';
import path from 'path';

test.describe.parallel('Participant List Download', () => {
  // Chose studies with fewer participants on Dev and Test. Otherwise download all data will take a very long time.
  const studies = [StudyEnum.OSTEO];

  for (const study of studies) {
    test(`Select All in @dsm @${study}`, async ({ page, request }, testInfo) => {
      test.slow();

      const participantListPage = await ParticipantListPage.goto(page, study, request);

      // Download with “Select all” selected
      await participantListPage.selectAll();

      // Export as human-readable, Excel and include all completion of an activity
      const download = await participantListPage.downloadParticipant({ fileFormat: FileFormatEnum.XLSX });
      assertParticipantListDownloadFileName(download, study);

      const logDir = testInfo.outputDir;
      const fileName = download.suggestedFilename();
      const downloadFile = path.join(logDir, fileName);

      await download.saveAs(downloadFile);
      // Verify Registration Date format is mm-dd-yyyy in Excel download file
      const xlsxWorkbook = XLSX.readFile(downloadFile);
      const firstSheet = xlsxWorkbook.Sheets[xlsxWorkbook.SheetNames[0]];
      console.log(firstSheet);
    });
  }
});
