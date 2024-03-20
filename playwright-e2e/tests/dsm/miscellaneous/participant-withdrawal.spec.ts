import { expect } from '@playwright/test';
import { CustomizeView, DataFilter, Label } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import ParticipantWithdrawalPage from 'dsm/pages/participant-withdrawal-page';
import { SortOrder } from 'dss/component/table';
import { test } from 'fixtures/dsm-fixture';
import { assertTableHeaders } from 'utils/assertion-helper';
import { logParticipantWithdrew } from 'utils/log-utils';
import * as user from 'data/fake-user.json';
import { shuffle } from 'utils/test-utils';

test.describe('Participants Withdrawal', () => {
  const studies = [StudyName.LMS];

    for (const study of studies) {
      test(`In @${study} @dsm`, async ({ page, request }) => {
        test.slow();

        const participantListPage = await ParticipantListPage.goto(page, study, request);
        const participantsTable = participantListPage.participantListTable;

        const defaultViewNumParticipants = await participantsTable.numOfParticipants();
        expect(defaultViewNumParticipants).toBeGreaterThan(1);

        // Show Participant ID column
        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.PARTICIPANT_ID, Label.REGISTRATION_DATE]);

        // Search for Status NOT EQUALS TO Exited before/after Enrollment
        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.text(Label.FIRST_NAME,
          { textValue: user.adult.firstName, additionalFilters: [DataFilter.EXACT_MATCH], exactMatch: false });
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.search();

        // At least one participant after search
        const numParticipants = await participantsTable.numOfParticipants();
        expect(numParticipants).toBeGreaterThan(1);

        // Sort Registration Date in ascending order to pick the oldest participant
        await participantsTable.sort(Label.REGISTRATION_DATE, SortOrder.DESC);

        // Randomize selected participant
        const rowCount = await participantsTable.getRowsCount();
        const shuffledRows = shuffle([...Array(rowCount).keys()]);
        const rowIndex = shuffledRows[0];

        // Select record on first row for withdrawal
        const registrationDateColumnIndex = await participantsTable.getHeaderIndex(Label.REGISTRATION_DATE);
        const registrationDate = await participantsTable.cell(rowIndex, registrationDateColumnIndex).innerText();
        const shortIdColumnIndex = await participantsTable.getHeaderIndex(Label.SHORT_ID);
        const shortIdColumnId = await participantsTable.cell(rowIndex, shortIdColumnIndex).innerText();
        const participantIdColumnIndex = await participantsTable.getHeaderIndex(Label.PARTICIPANT_ID);
        const participantId = await participantsTable.cell(rowIndex, participantIdColumnIndex).innerText();

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
        await withdrewTable.assertColumnNotEmpty(Label.PARTICIPANT_ID);

        // Enter Participant ID to withdraw
        await withdrawalPage.withdrawParticipant(participantId);
        logParticipantWithdrew(participantId, shortIdColumnId, registrationDate);

        const navigation = new Navigation(page, request);
        await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        // verify status has changed to withdrawn
        await expect(async () => {
          await participantListPage.reload();
          await participantListPage.filterListByShortId(shortIdColumnId);
          /// Status of participant should update to “Exited after enrollment” or “Exited before enrollment”
          const participantStatus = await participantsTable.findCell(Label.SHORT_ID, shortIdColumnId, Label.STATUS);
          await expect(participantStatus!).toContainText(/Exited (before|after) Enrollment/);
        }).toPass({ timeout: 20 * 60 * 1000 }); //timeout currently changed to ~ 20 mins; previously 5 mins

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
      });
    }
});
