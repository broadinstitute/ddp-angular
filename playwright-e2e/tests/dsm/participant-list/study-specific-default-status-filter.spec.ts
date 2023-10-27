import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';

test.describe('Display of Participants List Filter', () => {
  const cmiClinicalStudies = [StudyEnum.LMS, StudyEnum.OSTEO2];
  const cmiResearchStudies = [StudyEnum.BRAIN, StudyEnum.PANCAN];
  const cmiResearchStudies2 = [StudyEnum.ANGIO, StudyEnum.ESC, StudyEnum.MBC, StudyEnum.PROSTATE];

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
