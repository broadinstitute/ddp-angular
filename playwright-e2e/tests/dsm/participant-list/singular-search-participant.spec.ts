import { expect, test } from '@playwright/test';
import { login } from 'tests/lib/auth-dsm';
import { selectStudy } from 'tests/dsm/lib/widget/navbar';
import Select from 'tests/lib/widget/select';
import ParticipantListPage, { SearchFieldLabel } from 'tests/dsm/participant-list/participant-list-page';
import Table from 'tests/dsm/lib/widget/table';

test.describe('Singular Study in DSM', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, { email: process.env.userEmail as string, password: process.env.userPassword as string });
  });

  test('search by Short ID in Singular study @dsm', async ({ page }) => {
    await new Select(page, 'Select study').select('Singular');
    await expect(page.locator('h1')).toHaveText('Welcome to the DDP Study Management System');
    await expect(page.locator('h2')).toHaveText('You have selected the Singular study.');

    await selectStudy(page, 'Participant List');
    await expect(page.locator('h1')).toHaveText('Participant List');

    const participantListPage = new ParticipantListPage(page);
    await participantListPage.openSearchButton().click();

    // Grab one random Short ID from table rwo index: 3 and column index: 3 and use value in the search
    const table = new Table(page);
    const shortId = await table.getCellLocator(3, 3).innerText();

    // Start search by Short ID
    await participantListPage.search(SearchFieldLabel.ShortId, shortId);
    // Verify table has one row
    await expect(table.getRows()).toHaveCount(1);
  });
});
