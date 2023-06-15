import { expect } from '@playwright/test';
import * as user from 'data/fake-user.json';
import { Search } from 'dsm/component/filters/sections/search/search';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import Tab from 'dsm/component/tabs/tab';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { SortOrder } from 'dss/component/table';
import { test } from 'fixtures/dsm-fixture';
import { generateRandomNum, generateUserName } from 'utils/faker-utils';

test.describe('DSM RGP Add Family Member', () => {
  let participantListPage: ParticipantListPage;
  let participantPage: ParticipantPage;
  let participantListTable: ParticipantListTable;

  let searchPanel: Search;
  let familyId: string;
  let subjectId: string;

  test.beforeEach(async ({ page, request }) => {
    participantListPage = await ParticipantListPage.goto(page, StudyEnum.RGP, request);
  });

  test.skip('Copy proband info @rgp @dsm', async ({ page, request }) => {
    await findParticipant();

    const tabset = new Tab(page);
    await expect(tabset.tabLocator('Survey Data')).toBeVisible();
    await expect(tabset.tabLocator(`E2E - ${subjectId}`)).toBeVisible(); // tab name pattern: first name - subject id

    /*
    const memberFirstName = generateUserName(user.adult.firstName);
    const memberLastName = generateUserName(user.adult.lastName);
    const relation = await participantPage.addFamilyMemberDialog.fillInfo({
      firstName: memberFirstName,
      lastName: memberLastName,
      relationshipId: generateRandomNum(4, 9),
    });
    console.log('relation: ', relation)

    // Go back to Participant List page
    await participantPage.backToList();

    // Verify new family entry in table
    participantListTable.rowLocator()

    await page.pause();

    await searchPanel.open();
    await searchPanel.text('Family ID', { textValue: familyId });
    await searchPanel.search();

     */
  });

  test.skip("Don't copy proband info @rgp @dsm", async ({ page, request }) => {
    const memberFirstName = generateUserName(user.adult.firstName);
    const memberLastName = generateUserName(user.adult.lastName);

  });

  async function findParticipant(): Promise<void> {
    // Show Registration Date column
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', ['Registration Date']);

    // Search by First Name equals "E2E" (users created by automation tests)
    searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.text('First Name', { textValue: 'E2E' });
    await searchPanel.checkboxes('Relationship to Proband', { checkboxValues: ['undefined', 'Self'] });
    await searchPanel.search();

    const participantsTable = participantListPage.participantListTable;

    // At least one participant after search
    const numParticipants = await participantsTable.numOfParticipants();
    expect(numParticipants).toBeGreaterThanOrEqual(1);

    // Sort Registration Date in ascending order to pick the oldest participant
    await participantsTable.sort('Registration Date', SortOrder.DESC);

    // Use participant on first row. Save Family ID and Subject ID.
    const familyIdValue = await participantsTable.getParticipantDataAt(0, 'Family ID', { listIndex: 0 })
    subjectId = familyIdValue.split(':')[0].trim();
    familyId = familyIdValue.split(':')[1].trim();
    console.log('Family ID: ', familyId);
    console.log('subject ID: ', subjectId);

    // Open participant on first row
    participantPage = await participantsTable.openParticipantPageAt(0);
  }
});
