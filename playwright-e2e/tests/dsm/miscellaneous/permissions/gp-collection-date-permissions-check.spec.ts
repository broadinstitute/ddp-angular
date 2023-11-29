import { Locator, expect } from '@playwright/test';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { MainMenuEnum } from 'dsm/component/navigation/enums/mainMenu-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import SearchPage, { SearchByField } from 'dsm/pages/samples/search-page';
import Select from 'dss/component/select';
import { testGPCollectionDate as test } from 'fixtures/dsm-fixture';

test.describe.serial('GP Collection Date Permissions Test', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];
  const expectedKitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.SALIVA];
  const expectedAvailableMenuItems = [MainMenuEnum.SELECTED_STUDY, MainMenuEnum.SAMPLES];
  const salivaKitType = KitTypeEnum.SALIVA; //Saliva kits are usually automatically created, so there'll be more of these to use for testing compared to blood kits
  const expectedSampleMenuItems = [SamplesNavEnum.UNSENT_KITS_OVERVIEW, SamplesNavEnum.REPORT,
    SamplesNavEnum.SUMMARY, SamplesNavEnum.KITS_WITHOUT_LABELS, SamplesNavEnum.QUEUE, SamplesNavEnum.ERROR,
    SamplesNavEnum.INITIAL_SCAN, SamplesNavEnum.TRACKING_SCAN, SamplesNavEnum.FINAL_SCAN, SamplesNavEnum.RGP_FINAL_SCAN,
    SamplesNavEnum.SENT, SamplesNavEnum.RECEIVED, SamplesNavEnum.SENT_RECEIVED_OVERVIEW,
    SamplesNavEnum.SEARCH, SamplesNavEnum.LABEL_SETTINGS, SamplesNavEnum.CLINICAL_ORDERS];
  let todaysKits: Locator[] = [];

  for (const study of studies) {
    test(`${study} - GP Collection Date Permissions Test`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);
      const todaysMFBarcodes: string[] = [];
      let currentKit: Locator;

      await test.step('Create a user or use an existing one that only has kit_shipping permissions in pecgs [study group]', async () => {
        //Select the study (either LMS or OS PE-CGS)
        await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

        //Verify the current user can only see the navigation menu options allowed by the kit_shipping permission (just 'Selected study' + 'Samples' menu)
        const availableNavigationMenuOptions = await navigation.getDisplayedMainMenu();
        const amountOfMenuOptionsAvailable = availableNavigationMenuOptions.length;
        expect(amountOfMenuOptionsAvailable, 'Study admin with only kit_shipping permission should only have 2 menu options').toBe(2);

        expect(
          availableNavigationMenuOptions,
          `Displayed menu options do not match those expected of kit_shipping permission.`).
          toMatchObject(expectedAvailableMenuItems);

        /*Verify that the current user can see all the following pages in the Samples menu:
        * Unsent Kits Overview, Report, Summary, Kits without Labels, Queue, Error, Initial Scan, Tracking Scan, Final Scan, RGP Final Scan,
        * Sent, Received, Sent/Received Overview, Search, Label Settings, Clinical Orders
        */
        const availableSampleMenuOptions = await navigation.getDisplayedSamplesMenuOptions();
        const amountOfSampleMenuOptions = availableSampleMenuOptions.length;
        expect(
          amountOfSampleMenuOptions,
          `Expected 16 Sample menu options for a study admin with kit_shipping permission, received ${amountOfSampleMenuOptions} instead`).
          toBe(16);
        expect(availableSampleMenuOptions).toMatchObject(expectedSampleMenuItems);
      })

      await test.step('Go to Kits Sent page in the Samples menu and select a mf barcode and copy it', async () => {
        await navigation.selectFromSamples(SamplesNavEnum.SENT);
        const kitsSentPage = new KitsSentPage(page);
        await kitsSentPage.waitForLoad();
        await kitsSentPage.assertPageTitle();
        await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
        await kitsSentPage.selectKitType(salivaKitType);
        await kitsSentPage.rowsPerPage(50);

        //Get the most recent mf barcodes (from within the last week) to be used in Kit Search page
        await kitsSentPage.sortColumn({ columnName: KitsColumnsEnum.SENT, startWithRecentDates: true });
        todaysKits = await kitsSentPage.getMFBarcodesSince('11/20/2023');
        for (const kits of todaysKits) {
          const mfBarcode = (await kits.innerText()).trim();
          todaysMFBarcodes.push(mfBarcode);
        }
      })

      await test.step(`Go to Kit Search page and select 'Search by mf barcode' and enter the barcode you copied and click on Search`, async () => {
        await navigation.selectFromSamples(SamplesNavEnum.SEARCH);
        const kitsSearchPage = new SearchPage(page);
        await kitsSearchPage.waitForReady();

        //Find a kit that does not have a collection date and fill it out
        for (let index = 0; index < todaysMFBarcodes.length; index++) {
          const mfBarcode = todaysMFBarcodes[index];
          console.log(`MF Barcode: ${mfBarcode}`);
          await kitsSearchPage.searchByField(SearchByField.MANUFACTURE_BARCODE, mfBarcode);
          currentKit = page.locator('//app-field-datepicker//input');
          const collectionDateField = await kitsSearchPage.getKitCollectionDate({ rowIndex: 1 });
          console.log(`Collection Date Field input: ${collectionDateField}`);
          if (collectionDateField === '') {
            break;
          }
          await page.reload();
        }
      })

      await test.step('Enter a collection date for the kit that shows up and click Submit', async () => {
        //Stuff here
        const kitsSearchPage = new SearchPage(page);
        await kitsSearchPage.inputCollectionDate({ dateField: currentKit, useTodayDate: true });
      })
    })
  }
});
