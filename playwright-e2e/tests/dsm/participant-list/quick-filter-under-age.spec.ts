import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { assertTableHeaders } from 'utils/assertion-helper';
import { SortOrder } from 'dss/component/table';
import { getDate } from 'utils/date-utils';
import { shuffle } from 'utils/test-utils';
import { Label } from 'dsm/enums';
import { StudyName } from 'dsm/navigation';

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
      const orderedHeaderNames = [
        Label.DDP,
        Label.SHORT_ID,
        Label.FIRST_NAME,
        Label.LAST_NAME,
        Label.STATUS,
        Label.DATE_OF_BIRTH,
        Label.DATE_OF_MAJORITY,
        Label.STATUS
]; // from Sample Columns
      const actualHeaderNames = await participantsTable.getHeaderNames();
      assertTableHeaders(actualHeaderNames, orderedHeaderNames);

      await participantsTable.sort(Label.DATE_OF_MAJORITY, SortOrder.DESC);

      // Randomize rows
      const rowCount = await participantsTable.getRowsCount();
      const rowIndex = shuffle([...Array(rowCount).keys()])[0];

      const dateOfMajoritySample = await participantsTable.getRowText(rowIndex, Label.DATE_OF_MAJORITY);
      const dateOfMajority = getDate(new Date(dateOfMajoritySample));
      const today = getDate();
      expect(new Date(dateOfMajority) >= new Date(today)).toBeTruthy();
    });
  }
});
