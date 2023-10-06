import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { offsetDaysFromToday } from 'utils/date-utils';

test.describe('Onc history', () => {
  // Upload feature is only available for Leiomyosarcoma and OS PE-CGS studies.
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Upload @dsm @${study}`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantsTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      await test.step('Search for a participant without onc history', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.MEDICAL_RECORD, ['MR Problem']);
        await customizeViewPanel.selectColumns(CustomViewColumns.DSM_COLUMNS, ['Onc History Created']);
        await customizeViewPanel.selectColumns(CustomViewColumns.RESEARCH_CONSENT_FORM, ['Your Mailing Address *']);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes('MR Problem', { checkboxValues: ['No'] });
        await searchPanel.dates('Onc History Created', { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.text('Your Mailing Address *', { additionalFilters: [AdditionalFilter.NOT_EMPTY] });

        await searchPanel.search();
      })
    });
  }
});
