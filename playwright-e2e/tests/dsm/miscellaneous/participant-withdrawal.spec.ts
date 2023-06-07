import { expect } from '@playwright/test';
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

test.describe('Participants Withdrawal', () => {
  const studies = [StudyEnum.LMS];

    for (const study of studies) {
      test(`In ${study} @dsm`, async ({ page, request }) => {
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
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled', 'Lost to Followup', 'Registered'] });
        await searchPanel.search();

        // At least one participant after search
        const numParticipants = await participantsTable.numOfParticipants();
        expect(numParticipants).toBeGreaterThan(1);

        // Sort Registration Date in ascending order to pick the oldest participant
        await participantsTable.sort('Registration Date', SortOrder.ASC);

        // Select record on first row for withdrawal
        // First row Registration Date
        const shortIdColumnIndex = await participantsTable.getHeaderIndex('Short ID');
        const shortIdColumnId = await participantsTable.cell(0, shortIdColumnIndex).innerText();
        // First row Participant ID
        const participantIdColumnIndex = await participantsTable.getHeaderIndex('Participant ID');
        const participantId = await participantsTable.cell(0, participantIdColumnIndex).innerText();

        const withdrawalPage = await ParticipantWithdrawalPage.goto(page, request);
        await withdrawalPage.withdrawParticipant(participantId);
        logParticipantWithdrew(participantId, shortIdColumnId);

        const table = withdrawalPage.withdrewTable();
        const headers = await table.getHeaderNames();
        const orderedHeaders = ['DDP-Realm', 'Short ID', 'Participant ID', 'User', 'Date'];
        assertTableHeaders(headers, orderedHeaders);

        // Go back to Participant List page
        const navigation = new Navigation(page, request);
        await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

        await searchPanel.open();
        await expect(async () => {
            await searchPanel.clear();
            await searchPanel.text('Participant ID', { textValue: participantId });
            await searchPanel.search();
            await expect(participantsTable.rowLocator()).toHaveCount(1);
            const participantStatus = await participantsTable.findCell('Participant ID', participantId, 'Status');
            await expect(participantStatus!).toHaveText(/Exited (before|after) Enrollment/);
        }).toPass();

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
        await expect(page.locator('h3.Color--warn')).toHaveText('Participant was withdrawn from the study!');
      });
    }
});
