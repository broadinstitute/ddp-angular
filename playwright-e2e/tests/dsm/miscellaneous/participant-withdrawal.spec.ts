import { expect } from '@playwright/test';
import { MiscellaneousEnum } from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import ParticipantWithdrawalPage from 'dsm/pages/participant-withdrawal-page';
import { SortOrder } from 'dss/component/table';
import { test } from 'fixtures/dsm-fixture';
import { waitForResponse } from 'utils/test-utils';

test.describe('Participants Withdrawal', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  test(`In Test Boston @dsm @test_boston`, async ({ page, request }) => {
      const participantListPage = await ParticipantListPage.goto(page, StudyEnum.TEST_BOSTON, request);
      const participantsTable = participantListPage.participantListTable;

      const defaultViewNumParticipants = await participantsTable.numOfParticipants();
      expect(defaultViewNumParticipants).toBeGreaterThan(1);

      // Show Participant ID column
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID', 'Registration Date']);

      // Search for Status NOT EQUALS TO Exited before/after Enrollment
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes('Status', {checkboxValues: ['Enrolled', 'Lost to Followup', 'Completed', 'Registered']});
      await searchPanel.search();

      // At least one participant after search
      const numParticipants = await participantsTable.numOfParticipants();
      expect(numParticipants).toBeGreaterThan(1);

      // Sort Registration Date in ascending order to pick the oldest participant
      await participantsTable.sort('Registration Date', SortOrder.ASC);

      // First row Registration Date
      const registrationDateColumnIndex = await participantsTable.getHeaderIndex('Registration Date');
      const registrationDate = await participantsTable.cell(0, registrationDateColumnIndex).innerText();
      // First row Participant ID
      const participantIdColumnIndex = await participantsTable.getHeaderIndex('Participant ID');
      const participantId = await participantsTable.cell(0, participantIdColumnIndex).innerText();

      const withdrawalPage = new ParticipantWithdrawalPage(page);
      await withdrawalPage.goto(request);

      await withdrawalPage.withdrawParticipantId(participantId);




      const mfCodeCellText = await participantsTable.getParticipantDataAt(0, 'MF code');
      const mfCodes: string[] = mfCodeCellText.split(/[\r\n]+/);
      expect(mfCodes).toBeTruthy();
      expect(mfCodes.length).toBeGreaterThanOrEqual(1);

      // Save custom view
      const newViewName = `hunter_${new Date().getTime().toString()}`;
      await participantListPage.saveNewView(newViewName);

      // Reload default view to change table before open saved custom view
      await participantListPage.reloadWithDefaultFilter();
      expect(await participantsTable.numOfParticipants()).toBeGreaterThanOrEqual(defaultViewNumParticipants);

      // Open saved custom view
      const savedViewPanel = participantListPage.savedFilters;
      await savedViewPanel.open(newViewName);
      expect(await participantsTable.numOfParticipants()).toEqual(newViewNumParticipants);

      // Delete saved custom view
      await savedViewPanel.delete(newViewName);
    });
});
