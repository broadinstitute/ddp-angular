import { expect, test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { study } from 'pages/dsm/navbar';
import Select from 'lib/widget/select';
import ParticipantsPage from 'pages/dsm/participants/participants-page';
import Table from 'lib/widget/table';
import { Page } from '@playwright/test';

test.describe.parallel('Participant Page DSM', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Ensure name field updates properly for Brain @dsm @dsm-search @functional', async ({ page }) => {
    await nameTest('Brain', page);
  });

  test('Ensure name field updates properly for PanCan @dsm @dsm-search @functional', async ({ page }) => {
    await nameTest('PanCan', page);
  });

  test('Ensure name field updates properly for Singular @dsm @dsm-search @functional', async ({ page }) => {
    await nameTest('Singular', page);
  });

  test('Ensure name field updates properly for RGP @dsm @dsm-search @functional', async ({ page }) => {
    await nameTest('RGP', page);
  });
});

async function nameTest(studyName: string, page: Page) {
  const currentdate = new Date();

  await new Select(page, { label: 'Select study' }).selectOption(studyName);
  await expect(page.locator('h1')).toHaveText('Welcome to the DDP Study Management System');
  await expect(page.locator('h2')).toHaveText(`You have selected the ${studyName} study.`);

  await study(page).selectOption('Participant List', { waitForNav: true });
  await expect(page.locator('h1')).toHaveText('Participant List', { timeout: 30 * 1000 });

  const participantListPage = new ParticipantsPage(page);
  await participantListPage.waitForReady();

  //Pick the participant at row 4 and enter their participant page
  const table = new Table(page);
  const cell = await table.cell(3, 2);
  await cell.click();
  await expect(page.locator('h1')).toHaveText('Participant Page', { timeout: 5 * 1000 });
  //Change their first name
  const newName = `${currentdate}-John Wakerman`;
  await page.fill('[placeholder="First Name"]', newName);

  //If the update button is clickable click it, otherwise change the name again
  const updateButtons = await page.locator('button:has-text("Update")');
  const firstNameButton = updateButtons.nth(0);
  await firstNameButton.click();
  //Wait for the update to finish. This sometimes takes a long time, so the timeout could still fail
  const dialogContainer = page.locator('.mat-dialog-container');
  await expect(dialogContainer).toBeVisible({ timeout: 60 * 1000 });
  await expect(dialogContainer).not.toHaveText('Error - Failed to update participant');

  await page.waitForTimeout(1000);

  //Refresh the page twice
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Participant List', { timeout: 30 * 1000 });
  await participantListPage.waitForReady();
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Participant List', { timeout: 30 * 1000 });
  await participantListPage.waitForReady();

  //Verify the name changed
  await cell.click();
  await expect(page.locator('h1')).toHaveText('Participant Page', { timeout: 5 * 1000 });

  expect(await page.locator('[placeholder="First Name"]').inputValue()).toEqual(newName);
}
