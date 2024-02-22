import {expect} from '@playwright/test';
import {test} from 'fixtures/dsm-fixture';
import {WelcomePage} from 'dsm/pages/welcome-page';
import {Navigation, Samples, StudyName} from 'dsm/component/navigation';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import {studyShortName} from 'utils/test-utils';
import KitQueuePage from 'dsm/pages/kitsInfo-pages/kit-queue-page';

test.describe.serial('Sample Kit Queue UI', () => {
  const studies = [
    StudyName.ANGIO, StudyName.BRAIN, StudyName.OSTEO, StudyName.OSTEO2, StudyName.PANCAN,
    StudyName.RGP, StudyName.LMS, StudyName.ESC, StudyName.PROSTATE
  ];

  for (const study of studies) {
    test(`Visual Display Verification @dsm-ui @${study}`, async ({ page, request }) => {
      const { realm: expectedRealm } = studyShortName(study);

      const welcomePage = new WelcomePage(page);
      const navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);

      const kitQueuePage = await navigation.selectFromSamples<KitQueuePage>(Samples.QUEUE);
      await kitQueuePage.waitForReady();

      const expectedKitSelection = await kitQueuePage.getStudyKitTypes(study);

      // All kits are not selected by default
      for (const kitType of expectedKitSelection) {
        expect(await kitQueuePage.getKitCheckbox(kitType).isChecked()).toBeFalsy();
      }

      const kitsTable = kitQueuePage.getKitsTable;
      for (const kitType of expectedKitSelection) {
        const hasKitRequest = await kitQueuePage.selectKitType(kitType); // Check checkbox
        await expect(kitQueuePage.getReloadKitListBtn).toBeEnabled();
        const rows = await kitsTable.getRowsCount();
        rows > 0 ? expect(hasKitRequest).toBeTruthy() : expect(hasKitRequest).toBeFalsy();
        if (rows > 0) {
          for (let i = 0; i < rows; i++) {
            // Kits in different types are not mixed. Kits should be uploaded for the selected type.
            const typeValue = (await kitsTable.getRowText(i, KitsColumnsEnum.TYPE)).trim();
            expect.soft(typeValue).toStrictEqual(kitType);
            const shortId = (await kitsTable.getRowText(i, KitsColumnsEnum.SHORT_ID)).trim();
            expect(shortId?.length).toBeTruthy();
            const shippingId = (await kitsTable.getRowText(i, KitsColumnsEnum.SHIPPING_ID)).trim();
            expect(shippingId?.length).toBeTruthy();
            const realm = (await kitsTable.getRowText(i, KitsColumnsEnum.DDP_REALM)).trim();
            expect(realm).toStrictEqual(expectedRealm);
            await expect(kitsTable.findButtonInRow(i, { label: 'Deactivate' }).toLocator()).toBeEnabled({timeout: 1000});
            await expect(kitsTable.findButtonInRow(i, { label: 'Generate Express Label' }).toLocator()).toBeEnabled({timeout: 1000});
          }
        }
      }

      expect(test.info().errors).toHaveLength(0);
    })
  }
})
