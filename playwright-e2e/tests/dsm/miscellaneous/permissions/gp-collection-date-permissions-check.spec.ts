import { Locator, expect } from '@playwright/test';
import Dropdown from 'dsm/component/dropdown';
import { Kit } from 'dsm/enums';
import { Menu, Navigation, Samples, StudyName } from 'dsm/component/navigation';
import { KitsColumnsEnum } from 'dsm/pages/kits-info/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import KitsSearchPage, { SearchByField } from 'dsm/pages/kits-search-page';
import Select from 'dss/component/select';
import { testGPCollectionDate as test } from 'fixtures/dsm-fixture';
import { getDate, offsetDaysFromDate } from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';

test.describe.serial('GP Collection Date Permissions Test', () => {
  const studies = [StudyName.OSTEO2, StudyName.LMS];
  const expectedKitTypes = [Kit.BLOOD, Kit.SALIVA];
  const expectedAvailableMenuItems = [Menu.SELECTED_STUDY, Menu.SAMPLES];
  const salivaKitType = Kit.SALIVA; //Saliva kits are usually automatically created, so there'll be more of these to use for testing compared to blood kits
  const expectedSampleMenuItems = [Samples.UNSENT_KITS_OVERVIEW, Samples.REPORT,
    Samples.SUMMARY, Samples.KITS_WITHOUT_LABELS, Samples.QUEUE, Samples.ERROR,
    Samples.INITIAL_SCAN, Samples.TRACKING_SCAN, Samples.FINAL_SCAN, Samples.RGP_FINAL_SCAN,
    Samples.SENT, Samples.RECEIVED, Samples.SENT_RECEIVED_OVERVIEW,
    Samples.SEARCH, Samples.LABEL_SETTINGS, Samples.CLINICAL_ORDERS];
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
        const sampleMenu = new Dropdown(page, 'Samples');
        const availableSampleMenuOptions = await sampleMenu.getDisplayedOptions<Samples>();
        const amountOfSampleMenuOptions = availableSampleMenuOptions.length;
        expect(
          amountOfSampleMenuOptions,
          `Expected 16 Sample menu options for a study admin with kit_shipping permission, received ${amountOfSampleMenuOptions} instead`).
          toBe(16);
        expect(availableSampleMenuOptions).toMatchObject(expectedSampleMenuItems);
      })

      await test.step('Go to Kits Sent page in the Samples menu and select a mf barcode and copy it', async () => {
        const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(Samples.SENT);
        await kitsSentPage.waitForReady();
        await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
        await kitsSentPage.selectKitType(salivaKitType);
        await kitsSentPage.rowsPerPage(50);

        //Get the most recent mf barcodes (from within the last week) to be used in Kit Search page
        await kitsSentPage.sortColumnByDate({ columnName: KitsColumnsEnum.SENT, startWithRecentDates: true });
        const today = new Date();
        const aWeekAgo = getDate(offsetDaysFromDate(today, 7, { isAdd: false }));
        todaysKits = await kitsSentPage.getMFBarcodesSince(aWeekAgo, Samples.SENT);
        for (const kits of todaysKits) {
          const mfBarcode = (await kits.innerText()).trim();
          todaysMFBarcodes.push(mfBarcode);
        }
        const numberOfRecentMFBarcodes = todaysMFBarcodes.length;
        expect(numberOfRecentMFBarcodes, 'No mf barcodes from recent kits have been found').toBeGreaterThanOrEqual(1);
      })

      await test.step(`Go to Kit Search page and select 'Search by mf barcode' and enter the barcode you copied and click on Search`, async () => {
        await navigation.selectFromSamples(Samples.SEARCH);
        const kitsSearchPage = new KitsSearchPage(page);
        await kitsSearchPage.waitForReady();

        //Find a kit that does not have a collection date and fill it out
        for (let index = 0; index < todaysMFBarcodes.length; index++) {
          const mfBarcode = todaysMFBarcodes[index];
          logInfo(`MF Barcode: ${mfBarcode}`);
          await kitsSearchPage.searchByField(SearchByField.MANUFACTURE_BARCODE, mfBarcode);
          currentKit = page.locator('//app-field-datepicker//input');
          const collectionDateField = await kitsSearchPage.getKitCollectionDate({ rowIndex: 1 });
          logInfo(`Collection Date Field input: ${collectionDateField}`);
          if (collectionDateField === '') {
            break;
          }
          await kitsSearchPage.reload();
          await kitsSearchPage.waitForReady();
        }
        expect(currentKit, 'No kit has been chosen for the test').toBeTruthy();
      })

      await test.step('Enter a collection date for the kit that shows up and click Submit', async () => {
        const kitsSearchPage = new KitsSearchPage(page);
        await kitsSearchPage.setKitCollectionDate({ dateField: currentKit, useTodayDate: true });
      })
    })
  }
});
