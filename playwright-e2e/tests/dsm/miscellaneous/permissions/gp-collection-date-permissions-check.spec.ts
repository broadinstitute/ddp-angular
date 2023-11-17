import { Locator, expect } from '@playwright/test';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { MainMenuEnum } from 'dsm/component/navigation/enums/mainMenu-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import SearchPage, { SearchByField } from 'dsm/pages/samples/search-page';
import Select from 'dss/component/select';
import { testGPCollectionDate as test } from 'fixtures/dsm-fixture';

test.describe('GP Collection Date Permissions Test', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];
  const expectedKitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.SALIVA];
  const expectedAvailableMenuItems = [MainMenuEnum.SELECTED_STUDY, MainMenuEnum.SAMPLES];
  const salivaKitType = KitTypeEnum.SALIVA; //Saliva kits are usually automatically created, so there'll be more of these to use for testing compared to blood kits
  const mfBarcodeIndex = 6;
  const collectionDateIndex = 12;
  let todaysKits: Locator[] = [];
  let mfBarcode = '';

  for (const study of studies) {
    test(`${study} - GP Collection Date Permissions Test`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);

      await test.step('Create a user or use an existing one that only has kit_shipping permissions in pecgs [study group]', async () => {
        //Select the study (either LMS or OS PE-CGS)
        await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

        //Verify the current user can only see the navigation menu options allowed by the kit_shipping permission (just 'Selected study' + 'Samples' menu)
        const availableMenuOptions = await navigation.getDisplayedMainMenu();
        const amountOfMenuOptionsAvailable = availableMenuOptions.length;
        expect(amountOfMenuOptionsAvailable, 'Study admin with only kit_shipping permission should only have 2 menu options').toBe(2);

        expect(
          availableMenuOptions,
          `Displayed menu options do not match those expected of kit_shipping permission. Expected: 'Selected study' & 'Samples' only`).
          toMatchObject(expectedAvailableMenuItems);

        /*Verify that the current user can see all the following pages in the Samples menu:
        * Unsent Kits Overview, Report, Summary, Kits without Labels, Queue, Error, Initial Scan, Tracking Scan, Final Scan, RGP Final Scan,
        * Sent, Received, Sent/Received Overview, Search, Label Settings, Clinical Orders
        */
      })

      await test.step('Go to Kits Sent page in the Samples menu and select a mf barcode and copy it', async () => {
        await navigation.selectFromSamples(SamplesNavEnum.SENT);
        const kitsSentPage = new KitsSentPage(page);
        await kitsSentPage.waitForLoad();
        await kitsSentPage.assertPageTitle();
        await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
        await kitsSentPage.selectKitType(salivaKitType);

        //Get a list of kits that have been sent on the current day (likely due to automated test) and save their mf barcode
      })

      await test.step(`Go to Kit Search page and select 'Search by mf barcode' and enter the barcode you copied and click on Search`, async () => {
        await navigation.selectFromSamples(SamplesNavEnum.SEARCH);
        const kitsSearchPage = new SearchPage(page);
        await kitsSearchPage.waitForReady();
        for (const kits of todaysKits) {
          //Logic to get mf barcode

          //Use the mf barcode and select 'Search by mf barcode'
          const resultTable = kitsSearchPage.searchByField(SearchByField.MANUFACTURE_BARCODE, mfBarcode);
          await Promise.all([
            (await resultTable).waitForReady()
          ]);
        }
      })

      await test.step('Enter a collection date for the kit that shows up and click Submit', async () => {
        //Stuff here
      })
    })
  }
});
