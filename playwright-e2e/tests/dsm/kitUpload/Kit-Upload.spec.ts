/*
import { expect, FileChooser, test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { sample } from 'pages/dsm/navbar';
import { Page } from '@playwright/test';
import Select from 'lib/widget/select';

test.describe('Ensures Pancan, RGP, and Darwin can Upload Kits succesfully.', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Dawrin Kit Upload', async ({ page }) => {
    await GoToUploadPage(page, 'Darwin\'s Ark');

    await page.setInputFiles('input[type="file"]', './tests/dsm/kitUpload/darwin-test.txt');
    await page.locator('text=Upload Kits').click();
    await expect(page.locator('h3')).toHaveText('All participants were uploaded.');
  })

 test('PanCan Kit Upload', async ({ page }) => {
  await GoToUploadPage(page, 'PanCan');

  // Check the checkbox
  await page.locator("text=Saliva").check();
  await page.setInputFiles('input[type="file"]', './tests/dsm/kitUpload/pancan-test.txt');
  await page.locator('text=Upload Kits').click();
  await expect(page.locator('h3')).toHaveText('All participants were uploaded.');
  })

  test('RGP Kit Upload', async ({ page }) => {
    await GoToUploadPage(page, 'RGP');
  
    // Check the checkbox
    await page.locator("text=Saliva").check();
    await page.setInputFiles('input[type="file"]', './tests/dsm/kitUpload/RGP-test-1.txt');
    await page.locator('text=Upload Kits').click();
    await expect(page.locator('h3')).toHaveText('All participants were uploaded.');
    await page.setInputFiles('input[type="file"]', './tests/dsm/kitUpload/RGP-test-2.txt');
    await page.locator('text=Upload Kits').click();
    await expect(page.locator('h3')).toHaveText('All participants were uploaded.');
    })
});

async function GoToUploadPage(page: Page, studyName: string){
  await new Select(page, { label: 'Select study' }).selectOption(studyName);
  await expect(page.locator('h1')).toHaveText('Welcome to the DDP Study Management System');
  await expect(page.locator('h2')).toHaveText(`You have selected the ${studyName} study.`);

  await sample(page).selectOption('Kit Upload', { waitForNav: true });
  await expect(page.locator('h1')).toHaveText('Kit Upload');
}
*/