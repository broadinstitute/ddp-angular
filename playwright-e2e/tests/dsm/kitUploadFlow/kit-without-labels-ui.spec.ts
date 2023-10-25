import {expect} from '@playwright/test';
import {test} from 'fixtures/dsm-fixture';
import {WelcomePage} from 'dsm/pages/welcome-page';
import {Navigation} from 'dsm/component/navigation/navigation';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import {getExpectedKitSelection, studyShortName} from 'utils/test-utils';

test.describe('Kits without Labels UI', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;

  const studies = [StudyEnum.OSTEO2, StudyEnum.PANCAN, StudyEnum.RGP];

  test.beforeEach(({page, request}) => {
    welcomePage = new WelcomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Page verifications @dsm @${study} @kit`, async ({page}) => {
      const expectedKitSelection = getExpectedKitSelection(study);
      const { realm: expectedRealm } = studyShortName(study);
      await welcomePage.selectStudy(study);

      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady(expectedKitSelection);
      const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;

      for (const kitType of expectedKitSelection) {
        await kitsWithoutLabelPage.selectKitType(kitType);
        await expect(page.locator(kitsWithoutLabelPage.reloadKitListBtnXPath)).toBeEnabled();
        const rows = await kitsTable.getRowsCount();
        if (rows > 0) {
          await expect(page.locator(kitsWithoutLabelPage.createLabelsBtnXPath)).toBeDisabled();
          await kitsTable.rowCountButton(50).isVisible() && await kitsTable.changeRowCount(50);
        } else {
          await expect(page.locator('h4')).toHaveText('There are no kit requests');
          expect(await kitsTable.exists()).toBeFalsy();
        }
        for (let i = 0; i < rows; i++) {
          const typeValue = (await kitsTable.getRowText(i, KitsColumnsEnum.TYPE)).trim();
          // Kits in different types are not mixed. Kits should be uploaded for the right type.
          expect.soft(typeValue).toStrictEqual(kitType);
          const shortId = (await kitsTable.getRowText(i, KitsColumnsEnum.SHORT_ID)).trim();
          expect(shortId?.length).toBeTruthy();
          const realm = (await kitsTable.getRowText(i, KitsColumnsEnum.DDP_REALM)).trim();
          expect(realm).toStrictEqual(expectedRealm);
        }
      }

      expect(test.info().errors).toHaveLength(0);
    })
  }
})
