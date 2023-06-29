import { expect } from '@playwright/test';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { test } from 'fixtures/dsm-fixture';
import fs from 'fs';
import { assertParticipantListDownloadFileName } from 'utils/test-utils';

test.describe.parallel('Participant List Download', () => {
  // Chose studies with fewer participants on Dev and Test. Otherwise download all data will take a very long time.
  const studies = [StudyEnum.BRUGADA, StudyEnum.OSTEO];

  for (const study of studies) {
    test(`Select All in ${study} @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);

      // Download with “Select all” selected
      await participantListPage.selectAll();

      // Export as human-readable, Excel and include all completion of an activity
      const download = await participantListPage.downloadParticipant();
      assertParticipantListDownloadFileName(download, study);

      const downloadedFile = await download.path();
      expect(downloadedFile).toBeTruthy();
      expect((await fs.promises.stat(downloadedFile as string)).size).toBeGreaterThan(1000);

      // TODO unzip and check xlsx contents
    });
  }
});
