import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';
import { testGPCollectionDate as test } from 'fixtures/dsm-fixture';

test.describe('GP Collection Date Permissions Test', () => {
  const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];
  const email = process.env.DSM_USER2_EMAIL as string;

  for (const study of studies) {
    test(`${study} - GP Collection Date Permissions Test`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);

      await test.step('Create a user or use an existing one that only has kit_shipping permissions in pecgs [study group]', async () => {
        //Select the study (either LMS or OS PE-CGS)
        await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

        //Verify the current user can only see the navigation menu options allowed by the kit_shipping permission (just the Samples menu)

        /*Verify that the current user can see all the following pages in the Samples menu:
        * Unsent Kits Overview, Report, Summary, Kits without Labels, Queue, Error, Initial Scan, Tracking Scan, Final Scan, RGP Final Scan,
        * Sent, Received, Sent/Received Overview, Search, Label Settings, Clinical Orders
        */
      })

      await test.step('Go to Kits Sent page in the Samples menu and select a mf barcode and copy it', async () => {
        //Stuff here
      })

      await test.step(`Go to Kit Search page and select 'Search by mf barcode' and enter the barcode you copied and click on Search`, async () => {
        //Stuff here
      })

      await test.step('Enter a collection date for the kit that shows up and click Submit', async () => {
        //Stuff here
      })
    })
  }
});
