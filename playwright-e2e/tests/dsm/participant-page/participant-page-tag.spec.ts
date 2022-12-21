import { expect, test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { study } from 'pages/dsm/navbar';
import Select from 'lib/widget/select';
import ParticipantsPage from 'pages/dsm/participants/participants-page';
import Table from 'lib/widget/table';
import Checkbox from 'lib/widget/checkbox';
import { Page } from '@playwright/test';


test.describe('Participant Page DSM', () => {
    test.beforeEach(async ({ page }) => {
      await login(page);
    });
      
    test('Ensure cohort tags update and delete properly for Brain @dsm @dsm-search @functional', async ({ page }) => {
      await cohortTagTest("Brain", page)
    });
  
    test('Ensure cohort tags update and delete properly for PanCan @dsm @dsm-search @functional', async ({ page }) => {
      await cohortTagTest("PanCan", page)
    });
  
  });

async function cohortTagTest(studyName: string, page: Page) {
    //Get current date and time to ensure tag is different from others
    const currentdate = new Date(); 
    const dateString = (currentdate.getMonth()+1)+ "/"
                + currentdate.getDate()  + "/" 
                + currentdate.getFullYear() + "@"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    //Go to study
    await new Select(page, { label: 'Select study' }).selectOption(studyName);
    await expect(page.locator('h1')).toHaveText('Welcome to the DDP Study Management System');
    await expect(page.locator('h2')).toHaveText('You have selected the ' + studyName+ ' study.');
 
    await study(page).selectOption('Participant List', { waitForNav: true });
    await expect(page.locator('h1')).toHaveText('Participant List', { timeout: 30 * 1000 });
 
    const participantListPage = new ParticipantsPage(page);
    await participantListPage.waitForReady();
 
    //Filter to only patients with medical records
    await participantListPage.filterMedicalRecordParticipants();
    await participantListPage.waitForReady();
    const table = new Table(page);
    //Make sure we got at least one result and click the first result.
    expect(await table.rowLocator().count()).toBeGreaterThanOrEqual(1);
    const cell = await table.cell(0, 2)
    await cell.click();
    await expect(page.locator('h1')).toHaveText('Participant Page', { timeout: 5 * 1000 });
 
    //Make new tags
    await page.fill('[placeholder="New tag..."]', "dsm_rc_" + dateString + "_" + studyName);
    await page.keyboard.press('Enter');
    //Delete tag
    await page.locator('text=dsm_rc_' + dateString + '_' + studyName).click();
    await page.keyboard.press('Backspace');
    //Make new tag
    await page.fill('[placeholder="New tag..."]', "DSM RC " + studyName + " " + dateString);
    await page.keyboard.press('Enter');
    //Make new tag
    await page.fill('[placeholder="New tag..."]', studyName + " " + dateString);
    await page.keyboard.press('Enter');
    //Make test note
    await page.fill('textarea:right-of(:text("Participant Notes"))', "This is a test note - " + dateString);
    await page.keyboard.press('Tab');
    //Refresh page
    await page.reload();
    await expect(page.locator('h1')).toHaveText('Participant List', { timeout: 30 * 1000 });
    await participantListPage.waitForReady();
    await participantListPage.filterMedicalRecordParticipants();
    await cell.click();
    await expect(page.locator('h1')).toHaveText('Participant List', { timeout: 30 * 1000 });
    //Make sure first tag was deleted
    await expect(page.locator('text=dsm_rc_' + dateString + '_' + studyName)).toHaveCount(0);
 
    //Make sure second tag is still there, then delete it
    await expect(page.locator('text=DSM RC ' + studyName + ' ' + dateString)).toHaveCount(1);
    await page.locator('text=DSM RC ' + studyName + ' ' + dateString).click();
    await page.keyboard.press('Backspace');
 
    //Make sure 3rd tag is still there, ensure no duplicate tags can be added
    await expect(page.locator('text=' + studyName + ' ' + dateString)).toHaveCount(1);
    await page.fill('[placeholder="New tag..."]', studyName + ' ' + dateString);
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Duplicate tag! Not saved!')).toHaveCount(1);
 
    //Make sure the test not is still there
    expect(await page.locator('textarea:right-of(:text("Participant Notes"))').inputValue()).toBe("This is a test note - " + dateString);
    await page.locator("text=<< back to 'List'").click();
 
 
    //Make sure Add bulk cohort tag does not add duplicates.
    await new Checkbox(page, {root: table.cell(0, 0)}).check();
    await page.locator('button:right-of(:text("Initial MR Received"))').nth(17).click();
    await page.fill('[placeholder="New tag..."]', studyName + ' ' + dateString);
    await page.keyboard.press('Enter');
    await page.locator("text=Submit").click();
    await page.waitForTimeout(1000);
    await cell.click();
    await expect(page.locator('text=' + studyName + ' ' + dateString)).toHaveCount(1);
    //Delete tag
    await page.locator('text=' + studyName + ' ' + dateString).click();
    await page.keyboard.press('Backspace');
    await expect(page.locator('text=' + studyName + ' ' + dateString)).toHaveCount(0);
   
 }