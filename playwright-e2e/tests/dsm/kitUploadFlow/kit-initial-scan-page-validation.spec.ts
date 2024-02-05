import {expect, test} from '@playwright/test';
import {WelcomePage} from 'dsm/pages/welcome-page';
import {Navigation} from 'dsm/component/navigation/navigation';
import {login} from 'authentication/auth-dsm';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';

// don't run in parallel
test.describe.serial('Initial Scan page', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;

  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Should throw error if Short ID validation fails @functional @dsm @${study}`, async () => {
      await welcomePage.selectStudy(study);

      // Initial Scan page
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
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
      const kitType = KitTypeEnum.SALIVA;

      await welcomePage.selectStudy(study);

      // Kits Received page
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
      await kitsReceivedPage.waitForLoad();
      await kitsReceivedPage.selectKitType(kitType);

      // Save Short ID and MF code
      const kitsTable = kitsReceivedPage.getKitsTable;
      const [shortId] = await kitsTable.getTextAt(0, KitsColumnsEnum.SHORT_ID);
      const [mfCode] = await kitsTable.getTextAt(0, KitsColumnsEnum.MF_CODE);

      // Initial Scan page
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
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
