import {expect, test} from '@playwright/test';
import {WelcomePage} from 'dsm/pages/welcome-page';
import {Navigation, Samples, StudyName} from 'dsm/navigation';
import {login} from 'authentication/auth-dsm';
import InitialScanPage from 'dsm/pages/scan/initial-scan-page';
import KitsReceivedPage from 'dsm/pages/kits-received-page';
import { KitType, Label } from 'dsm/enums';

// don't run in parallel
test.describe.serial('Initial Scan page', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;

  const studies = [StudyName.OSTEO2, StudyName.LMS];

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Should throw error if Short ID validation fails @functional @dsm @${study}`, async () => {
      await welcomePage.selectStudy(study);

      // Initial Scan page
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(Samples.INITIAL_SCAN);
      await initialScanPage.waitForReady();

      const kitLabelField = initialScanPage.getInput('Kit Label');
      const shortIdField = initialScanPage.getInput('Short ID');

      await kitLabelField.fill('a');
      await shortIdField.fill('a');

      // If Short ID is less than 6 characters long, should display a hint under the short ID field which says - "Must be 6 characters long"
      await expect(shortIdField.errorMessage()).toHaveText(/Must be 6 characters long/);

      // the "Save Scan Pairs" button should remain disabled
      const saveButton = initialScanPage.saveButtonLocator;
      await expect(saveButton, 'Initial Scan page - Save Scan Pairs button should be disabled').toBeDisabled();
    });

    test(`Should throw error if kit is already received @functional @dsm @${study}`, async ({page}) => {
      const kitType = KitType.SALIVA;

      await welcomePage.selectStudy(study);

      // Kits Received page
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.waitForReady();
      await kitsReceivedPage.selectKitType(kitType);

      // Save Short ID and MF code
      const kitsTable = kitsReceivedPage.getKitsTable;
      const [shortId] = await kitsTable.getTextAt(0, Label.SHORT_ID);
      const [mfCode] = await kitsTable.getTextAt(0, Label.MF_CODE);

      // Initial Scan page
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(Samples.INITIAL_SCAN);
      await initialScanPage.waitForReady();

      const kitLabelField = initialScanPage.getInput('Kit Label');
      const shortIdField = initialScanPage.getInput('Short ID');

      await kitLabelField.fill(mfCode);
      await shortIdField.fill(shortId);
      // Click Save button triggers error
      await initialScanPage.save({ verifySuccess: false });

      await expect(page.locator('//h3[contains(@class, "Color--warn")]')).toHaveText('Error - Failed to save all changes');
      await expect(page.locator('//p[contains(@class, "Color--warn")]')).toHaveText(/Error occurred sending this scan pair!/);
      const msg1 = `Kit for participant with ShortId "${shortId}" was not found.`;
      const msg2 = `Kit Label "${mfCode}" was already scanned.`
      const combined = `(${msg1}|${msg2})`;
      await expect(page.locator('//p[contains(@class, "Color--warn")]')).toHaveText(new RegExp(combined));
    });
  }
})
