import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Kit } from 'dsm/enums';
import { Navigation, Samples, StudyName } from 'dsm/component/navigation';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { KitsTable } from 'dsm/component/tables/kits-table';

// don't run in parallel
test.describe.serial('Kit Deactivation', () => {
  const studies = [StudyName.LMS, StudyName.RGP];

  for (const study of studies) {
    test(`From Kits Without Label page @dsm @${study} @kit`, async ({ page, request }) => {
      let shortId: string;
      let shippingId: string;
      let kits: Kit[];

      const welcomePage = new WelcomePage(page);
      const navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);

      let kitsWithoutLabelPage: KitsWithoutLabelPage;
      let kitsTable: KitsTable;

      await test.step('Deactivate and verify', async () => {
        kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
        await kitsWithoutLabelPage.waitForReady();
        kitsTable = kitsWithoutLabelPage.getKitsTable;
        kits = await kitsWithoutLabelPage.getStudyKitTypes();

        // Deactivated all kit types for one randomly selected participant
        for (const kit of kits) {
          await kitsWithoutLabelPage.reload();
          await kitsWithoutLabelPage.waitForReady();

          await kitsWithoutLabelPage.selectKitType(kit);
          const rowCount = await kitsTable.getRowsCount();
          logInfo(`${kit} kits table has ${rowCount} rows`);
          if (rowCount > 0) {
            const rowIndex = await kitsTable.getRandomRowIndex();
            [shortId] = await kitsTable.getTextAt(rowIndex, 'Short ID');

            shippingId = await kitsWithoutLabelPage.deactivateKitFor({shortId});

            await kitsWithoutLabelPage.reloadKitPage(kit);

            // Deactivated kit should be removed from the table
            const kitsExists = await kitsWithoutLabelPage.hasKitRequests();
            if (kitsExists) {
              await kitsTable.searchByColumn(KitsColumnsEnum.SHIPPING_ID, shippingId);
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
