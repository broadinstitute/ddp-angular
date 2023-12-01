import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { KitsTable } from 'dsm/component/tables/kits-table';
import ErrorPage from 'dsm/pages/samples/error-page';

// don't run in parallel
test.describe.serial('Kit Deactivation', () => {
  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`From Error page @dsm @${study} @kit`, async ({ page, request }) => {
      let shortId: string;
      let shippingId: string;
      let kits: KitTypeEnum[];

      const welcomePage = new WelcomePage(page);
      const navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);

      let kitsErrorPage: ErrorPage;
      let kitsTable: KitsTable;

      await test.step('Deactivate and verify', async () => {
        kitsErrorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
        await kitsErrorPage.waitForReady();
        kitsTable = kitsErrorPage.getKitsTable;
        kits = await kitsErrorPage.getStudyKitTypes();

        // Deactivated all kit types for one randomly selected participant
        for (const kit of kits) {
          await page.reload();
          await kitsErrorPage.waitForReady();

          await kitsErrorPage.selectKitType(kit);
          const rowCount = await kitsTable.getRowsCount();
          logInfo(`${kit} kits table has ${rowCount} rows`);
          if (rowCount > 0) {
            const rowIndex = await kitsTable.getRandomRowIndex();
            [shortId] = await kitsTable.getTextAt(rowIndex, 'Short ID');

            shippingId = await kitsErrorPage.deactivateKitFor({ shortId });

            await kitsErrorPage.reloadKitPage(kit);

            // Deactivated kit should be removed from the table
            const kitsExists = await kitsErrorPage.hasKitRequests();
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
