import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';

test.describe('Participants Search', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`PHI Report Quick Search Filter @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;
      const quickFilters = participantListPage.quickFilters;

      const numOfParticipants = await participantsTable.numOfParticipants();
      expect(numOfParticipants).toBeGreaterThanOrEqual(1);
      // Save table displayed headers
      const actualHeaderNames = await participantsTable.getHeaderNames();

      // PHI Report is only a column change filter
      await quickFilters.click(QuickFiltersEnum.PHI_REPORT);

      const numOfParticipantsAfter = await participantsTable.numOfParticipants();
      const actualHeaderNamesAfter = await participantsTable.getHeaderNames();
      // Same number of participants as in the list should appear
      expect(numOfParticipantsAfter).toStrictEqual(numOfParticipants);
      // Only columns changed
      expect(actualHeaderNamesAfter.length).toBeGreaterThan(actualHeaderNames.length);
    });
  }
});
