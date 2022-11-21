import { expect, test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { study } from 'pages/dsm/navbar';
import Select from 'lib/widget/select';
import ParticipantsPage, { SearchFieldLabel } from 'pages/dsm/participants/participants-page';
import Table from 'lib/widget/table';

test.describe('Tissue SHL block id in DSM', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('search by no MR problem', async ({ page }) => {
    await new Select(page, { label: 'Select study' }).selectOption('PanCan');
    await expect(page.locator('h1')).toHaveText('Welcome to the DDP Study Management System');
    await expect(page.locator('h2')).toHaveText('You have selected the PanCan study.');

    await study(page).selectOption('Participant List', { waitForNav: true });
    await expect(page.locator('h1')).toHaveText('Participant List');

    const participantListPage = new ParticipantsPage(page);
    await participantListPage.customizeView().click();
    await participantListPage.MedicalRecordColumnsDropDown().click();
    const mrProblem = page.locator('#mat-checkbox-61');
    await expect(mrProblem).toBeVisible()
    await mrProblem.click();

    await participantListPage.openSearchButton().click();

    const mrProblemNo = page.locator('#mat-checkbox-673 >> nth=0');// "NO"
    await expect(mrProblemNo).toBeVisible()
    await mrProblemNo.click();

    await participantListPage.search(SearchFieldLabel.mrProblem);
//    // Verify table has one row
//    await expect(table.rowLocator()).toHaveCount(1);
  });
});
