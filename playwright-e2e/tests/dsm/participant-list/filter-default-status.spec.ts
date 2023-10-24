import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';

test.describe('Participants List Default Search Filters', () => {
  const cmiClinicalStudies = [StudyEnum.LMS, StudyEnum.OSTEO2];
  const cmiResearchStudies = [StudyEnum.ANGIO, StudyEnum.BRAIN, StudyEnum.ESC, StudyEnum.MBC, StudyEnum.PROSTATE, StudyEnum.PANCAN];
  
  for (const study of cmiClinicalStudies) {
    test(`Status filter is displayed for every participant @${study} @dsm`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();

      // Study-specific default search filters contains Status
      expect.soft(await searchPanel.checkboxExists('Status', 'Affected')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Registered')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Exited before Enrollment')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Exited after Enrollment')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Enrolled')).toBe(true);
      expect.soft(await searchPanel.checkboxExists('Acceptance Status**', 'Lost to Followup')).toBe(true);
      expect(test.info().errors).toHaveLength(0);
    });
  }
});
