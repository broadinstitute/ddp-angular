import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { KitsTable } from 'dsm/component/tables/kits-table';
import KitsQueuePage from 'dsm/pages/kitsInfo-pages/kit-queue-page';
import { KitType, Label } from 'dsm/enums';

// don't run in parallel
test.describe.serial('Kit Deactivation', () => {
  const studies = [StudyEnum.LMS, StudyEnum.RGP];

  for (const study of studies) {
    test(`From Queue page @dsm @${study} @kit`, async ({ page, request }) => {
      let shortId: string;
      let shippingId: string;
      let kits: KitType[];

      const welcomePage = new WelcomePage(page);
      const navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);

      let kitsQueuePage: KitsQueuePage;
      let kitsTable: KitsTable;

      await test.step('Deactivate and verify', async () => {
        kitsQueuePage = await navigation.selectFromSamples<KitsQueuePage>(SamplesNavEnum.QUEUE);
        await kitsQueuePage.waitForReady();
        kitsTable = kitsQueuePage.getKitsTable;
        kits = await kitsQueuePage.getStudyKitTypes();

        // Deactivated all kit types for one randomly selected participant
        for (const kit of kits) {
          await kitsQueuePage.reload();
          await kitsQueuePage.waitForReady();

          await kitsQueuePage.selectKitType(kit);
          const rowCount = await kitsTable.getRowsCount();
          logInfo(`${kit} kits table has ${rowCount} rows`);
          if (rowCount > 0) {
            const rowIndex = await kitsTable.getRandomRowIndex();
            [shortId] = await kitsTable.getTextAt(rowIndex, Label.SHORT_ID);

            shippingId = await kitsQueuePage.deactivateKitFor({shortId});

            await kitsQueuePage.reloadKitPage(kit);

            // Deactivated kit should be removed from the table
            const kitsExists = await kitsQueuePage.hasKitRequests();
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
