import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { assertTableHeaders } from 'utils/assertion-helper';
import { SortOrder } from 'dss/component/table';

test.describe('Participants Search', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2, StudyEnum.PANCAN];

  for (const study of studies) {
    test(`Under Age Quick Search Filter @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;
      const quickFilters = participantListPage.quickFilters;
      await quickFilters.click(QuickFiltersEnum.UNDER_AGE);

      expect(await participantsTable.rowLocator().count()).toBeGreaterThanOrEqual(1);

      // Verify table displayed headers
      const orderedHeaderNames = ['DDP', 'Short ID', 'First Name', 'Last Name', 'Status', 'Date of Birth', 'Date of Majority', 'Status']; // from Sample Columns
      const actualHeaderNames = await participantsTable.getHeaderNames();
      assertTableHeaders(actualHeaderNames, orderedHeaderNames);

      await participantsTable.sort('Date of Majority', SortOrder.DESC);
      const dateOfMajoritySample = await participantsTable.getRowText(0, 'Date of Majority');
      const dateOfMajority = new Date(dateOfMajoritySample);
      const today = new Date();
      expect(dateOfMajority > today, `Date of Majority "${dateOfMajority}" is not greater than today's date "${today}"`).toBeTruthy();
    });
  }
});
