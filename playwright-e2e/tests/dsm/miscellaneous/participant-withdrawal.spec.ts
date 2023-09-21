import { expect } from '@playwright/test';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import ParticipantWithdrawalPage from 'dsm/pages/participant-withdrawal-page';
import { SortOrder } from 'dss/component/table';
import { test } from 'fixtures/dsm-fixture';
import { assertTableHeaders } from 'utils/assertion-helper';
import { logParticipantWithdrew } from 'utils/log-utils';
import * as user from 'data/fake-user.json';

test.describe.fixme('Participants Withdrawal', () => {
  const studies = [StudyEnum.LMS];

    for (const study of studies) {
      test(`In @${study} @dsm`, async ({ page, request }) => {
        const participantListPage = await ParticipantListPage.goto(page, study, request);
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
        await searchPanel.text('First Name',
          { textValue: user.adult.firstName, additionalFilters: [AdditionalFilter.EXACT_MATCH], exactMatch: false });
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled', 'Registered'] });
        await searchPanel.search();

        // At least one participant after search
        const numParticipants = await participantsTable.numOfParticipants();
        expect(numParticipants).toBeGreaterThan(1);

        // Sort Registration Date in ascending order to pick the oldest participant
        await participantsTable.sort('Registration Date', SortOrder.DESC);

        // Select record on first row for withdrawal
        const registrationDateColumnIndex = await participantsTable.getHeaderIndex('Registration Date');
        const registrationDate = await participantsTable.cell(0, registrationDateColumnIndex).innerText();
        // First row Registration Date
        const shortIdColumnIndex = await participantsTable.getHeaderIndex('Short ID');
        const shortIdColumnId = await participantsTable.cell(0, shortIdColumnIndex).innerText();
        // First row Participant ID
        const participantIdColumnIndex = await participantsTable.getHeaderIndex('Participant ID');
        const participantId = await participantsTable.cell(0, participantIdColumnIndex).innerText();

        // Withdraw participant
        // Loading Participant Withdrawal page
        const withdrawalPage = await ParticipantWithdrawalPage.goto(page, request);

        await expect(page.locator('.instructions_list li')).toHaveText([
          // eslint-disable-next-line max-len
          'Enter their Participant ID above (Note: This is their 20 character Internal Participant ID found on their individual participant page, not their 6 character Short ID)',
          'Click the "Withdraw Participant" button'
        ]);

        // Page shows list of previously withdrawn pts
        const withdrewTable = withdrawalPage.withdrewTable();
        const rows = await withdrewTable.getRowsCount();
        expect(rows).toBeGreaterThanOrEqual(1);

        const headers = await withdrewTable.getHeaderNames();
        const expectedHeaders = ['DDP-Realm', 'Short ID', 'Participant ID', 'User', 'Date'];
        assertTableHeaders(headers, expectedHeaders);

        // checks every row to make sure Participant ID is not blank
        await withdrewTable.assertColumnNotEmpty('Participant ID');

        // Enter Participant ID to withdraw
        await withdrawalPage.withdrawParticipant(participantId);
        logParticipantWithdrew(participantId, shortIdColumnId, registrationDate);

        // Reload Participant List page to verify status has changed
        const navigation = new Navigation(page, request);
        await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

        await searchPanel.open();
        await searchPanel.clear();
        await searchPanel.text('Participant ID', { textValue: participantId });
        /// Status of PT should update to “Exited after enrollment” or “Exited before enrollment”
        await expect(async () => {
          await page.waitForTimeout(1000);
          await searchPanel.search();
          const participantStatus = await participantsTable.findCell('Participant ID', participantId, 'Status');
          expect(await participantStatus!.innerText()).toMatch(/Exited (before|after) Enrollment/);
        }).toPass({ timeout: 50000 });

        // At Participant Page, verify few detail
        const participantPage: ParticipantPage = await participantsTable.openParticipantPageAt(0);

        const guid = await participantPage.getGuid();
        expect(guid).toBe(participantId);

        const regDate = await participantPage.getRegistrationDate();
        const formatDate = new Date(regDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        expect(regDate).toContain(formatDate);

        // Participant Page shows a red message on the top stating that the “Participant was withdrawn from the study!”
        await expect(page.locator('h3.Color--warn')).toHaveText('Participant was withdrawn from the study!');

        await participantPage.backToList();

        // Open bug https://broadworkbench.atlassian.net/browse/PEPPER-898
        /*
        // Click Participant Withdrawn button to list withdrawn participants
        await participantListPage.showParticipantWithdrawnButton();
        // At least one withdrawn participant using the button
        const numWithdrawnParticipants = await participantsTable.numOfParticipants();
        expect(numWithdrawnParticipants).toBeGreaterThan(1);
      */
      });
    }
});
