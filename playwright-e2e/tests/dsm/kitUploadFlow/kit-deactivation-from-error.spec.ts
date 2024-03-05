import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Navigation, Samples, StudyName } from 'dsm/navigation';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { KitsTable } from 'dsm/component/tables/kits-table';
import KitsWithErrorPage from 'dsm/pages/kits-with-error-page';
import { KitType, Label } from 'dsm/enums';

// don't run in parallel
test.describe.serial('Kit Deactivation', () => {
  const studies = [StudyName.LMS, StudyName.OSTEO2];

  for (const study of studies) {
    test(`From Error page @dsm @${study} @kit`, async ({ page, request }) => {
      let shortId: string;
      let shippingId: string;
      let kits: KitType[];

      const welcomePage = new WelcomePage(page);
      const navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);

      let kitsErrorPage: KitsWithErrorPage;
      let kitsTable: KitsTable;

      await test.step('Deactivate and verify', async () => {
        kitsErrorPage = await navigation.selectFromSamples<KitsWithErrorPage>(Samples.ERROR);
        await kitsErrorPage.waitForReady();
        kitsTable = kitsErrorPage.getKitsTable;
        kits = await kitsErrorPage.getStudyKitTypes();

        // Deactivated all kit types for one randomly selected participant
        for (const kit of kits) {
          await kitsErrorPage.reload();
          await kitsErrorPage.waitForReady();

          await kitsErrorPage.selectKitType(kit);
          const rowCount = await kitsTable.getRowsCount();
          logInfo(`${kit} kits table has ${rowCount} rows`);
          if (rowCount > 0) {
            const rowIndex = await kitsTable.getRandomRowIndex();
            [shortId] = await kitsTable.getTextAt(rowIndex, Label.SHORT_ID);

            shippingId = await kitsErrorPage.deactivateKitFor({ shortId });

            await kitsErrorPage.reloadKitPage(kit);

            // Deactivated kit should be removed from the table
            const kitsExists = await kitsErrorPage.hasKitRequests();
            if (kitsExists) {
              await kitsTable.searchByColumn(Label.SHIPPING_ID, shippingId);
              await expect(kitsTable.rowLocator()).toHaveCount(0);
            }
          } else {
            logInfo(`${kit} kits table is empty. No kit to deactivate.`);
          }
        }
      });
    });
  }
})
