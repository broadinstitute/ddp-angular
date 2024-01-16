import { expect } from '@playwright/test';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { FileFormatEnum } from 'dsm/pages/participant-page/enums/download-format-enum';
import { test } from 'fixtures/dsm-fixture';
import { assertParticipantListDownloadFileName } from 'utils/test-utils';
import * as XLSX from 'xlsx';
import path from 'path';
import { isNaN } from 'lodash';
import { unzip } from 'utils/file-utils';

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

      const dir = testInfo.outputDir;
      const fileName = download.suggestedFilename();
      const zipFile = path.join(dir, fileName);

      await download.saveAs(zipFile);
      expect(zipFile.endsWith('.zip')).toBeTruthy();
      const targetFilePath = zipFile.split('.zip')[0];

      const unzipFiles: string[] = unzip(zipFile, targetFilePath);
      // Two files in zip
      expect(unzipFiles.length).toStrictEqual(2);
      expect(unzipFiles).toContain('DataDictionary.xlsx');
      const [participantXlsx] = unzipFiles.filter(file => file.startsWith('Participant-') && file.endsWith('.xlsx'));

      // Verify Registration Date format is mm-dd-yyyy in Excel download file
      const xlsxFilePath = path.join(targetFilePath, participantXlsx);
      const xlsxWorkbook = XLSX.readFile(xlsxFilePath);
      const worksheet = xlsxWorkbook.Sheets[xlsxWorkbook.SheetNames[0]]; // First Worksheet

      const json = XLSX.utils.sheet_to_json(worksheet, {range: 1}); // use second row for header
      // Iterate rows to verify format of Registration Date
      json.map((row: any) => {
        const regDate = row['Registration Date'];
        expect(!isNaN(new Date(regDate))).toBeTruthy();
        expect(regDate).toMatch(/^\d\d-\d\d-\d\d\d\d\s/); // mm-dd-yyyy
      });
    });
  }
});
