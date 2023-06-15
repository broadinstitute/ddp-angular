import { expect, Page } from '@playwright/test';
import * as user from 'data/fake-user.json';
import { Search } from 'dsm/component/filters/sections/search/search';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { test } from 'fixtures/dsm-fixture';
import { generateUserName } from 'utils/faker-utils';

test.describe('DSM RGP Add Family Member', () => {
  let participantListPage: ParticipantListPage;
  let participantPage: ParticipantPage;
  let participantListTable: ParticipantListTable;
  let searchPanel: Search;
  let familyId: string;
  let subjectId: string;

  test.beforeEach(async ({ page, request }) => {
    participantListPage = await ParticipantListPage.goto(page, StudyEnum.RGP, request);

    // Search by First Name equals "E2E" (automation tests created users)
    searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.text('First Name', { textValue: 'E2E' });
    await searchPanel.checkboxes('Relationship to Proband', { checkboxValues: ['Self'] });
    await searchPanel.search();

    // Use participant on first row. Save Family ID and Subject ID.
    const participantListTable = participantListPage.participantListTable;
    const familyIdValue = await participantListTable.getParticipantDataAt(0, 'Family ID')
    subjectId = familyIdValue.split(':')[0].trim();
    familyId = familyIdValue.split(':')[1].trim();
    console.log('Family ID: ', familyId);
    console.log('subject ID: ', subjectId);

    // Open participant on first row
    participantPage = await participantListTable.openParticipantPageAt(0);
  });

  test('Copy proband info @rgp @dsm', async ({ page, request }) => {
    const memberFirstName = generateUserName(user.adult.firstName);
    const memberLastName = generateUserName(user.adult.lastName);
    await participantPage.addFamilyMember.fillInfo({
      firstName: memberFirstName,
      lastName: memberLastName,
      relationshipId: 8,
      relation: 'Father'
    });
    await assertAddSuccessful(page);

    // Back to Participant List page
    await participantPage.backToList();

    // Verify new family entry in table
    participantListTable.rowLocator()

    await page.pause();

    await searchPanel.open();
    await searchPanel.text('Family ID', { textValue: familyId });
    await searchPanel.search();

    await page.pause();
  });

  test.skip("Don't copy proband info @rgp @dsm", async ({ page, request }) => {
    const memberFirstName = generateUserName(user.adult.firstName);
    const memberLastName = generateUserName(user.adult.lastName);

  });

  async function assertAddSuccessful(page: Page): Promise<void> {
    await expect(page.locator('[role="dialog"]')).toHaveText('Successfully added family member');
    await page.locator('[role="dialog"]').click(); // close dialog
  }
});
