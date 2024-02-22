import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyName } from 'dsm/component/navigation';

test.describe('Display of Participants List Filter', () => {
  const cmiClinicalStudies = [StudyName.LMS, StudyName.OSTEO2];
  const cmiResearchStudies = [StudyName.BRAIN, StudyName.PANCAN];
  const cmiResearchStudies2 = [StudyName.ANGIO, StudyName.ESC, StudyName.MBC, StudyName.PROSTATE];

  for (const study of cmiClinicalStudies.concat(cmiResearchStudies).concat(cmiResearchStudies2)) {
    test(`Status is displayed for every participant @${study} @dsm`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();

      expect.soft(await searchPanel.checkboxExists('Status', 'Registered')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Status', 'Exited before Enrollment')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Status', 'Exited after Enrollment')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Status', 'Enrolled')).toBe(true);
      if (!cmiResearchStudies2.includes(study)) {
        // Some CMI Research studies do not have this status
        expect.soft(await searchPanel.checkboxExists('Status', 'Lost to Followup')).toBe(true);
      }
      expect(test.info().errors).toHaveLength(0);
    });
  }
});
