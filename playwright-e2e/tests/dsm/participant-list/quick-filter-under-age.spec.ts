import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { assertTableHeaders } from 'utils/assertion-helper';
import { SortOrder } from 'dss/component/table';
import { getDate } from 'utils/date-utils';
import { shuffle } from 'utils/test-utils';
import { StudyName } from 'dsm/component/navigation';

test.describe.serial('Participants Search', () => {
  const studies = [StudyName.LMS, StudyName.OSTEO2, StudyName.PANCAN];

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

      // Randomize rows
      const rowCount = await participantsTable.getRowsCount();
      const rowIndex = shuffle([...Array(rowCount).keys()])[0];

      const dateOfMajoritySample = await participantsTable.getRowText(rowIndex, 'Date of Majority');
      const dateOfMajority = getDate(new Date(dateOfMajoritySample));
      const today = getDate();
      expect(new Date(dateOfMajority) >= new Date(today)).toBeTruthy();
    });
  }
});
