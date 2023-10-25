import {expect} from '@playwright/test';
import {test} from 'fixtures/dsm-fixture';
import {WelcomePage} from 'dsm/pages/welcome-page';
import {Navigation} from 'dsm/component/navigation/navigation';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {getExpectedKitSelection} from 'utils/test-utils';

test.describe('Kits Upload UI', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;

  const studies = [StudyEnum.OSTEO2, StudyEnum.PANCAN, StudyEnum.RGP];

  test.beforeEach(({page, request}) => {
    welcomePage = new WelcomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Page verifications @dsm @${study} @kit`, async () => {
      const expectedKitSelection = getExpectedKitSelection(study);
      await welcomePage.selectStudy(study);

      const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
      await kitUploadPage.waitForReady(expectedKitSelection);

      for (const kitType of expectedKitSelection) {
        await expect.soft(kitUploadPage.browseBtn).toBeHidden();
        await kitUploadPage.selectKitType(kitType);
        await expect.soft(kitUploadPage.browseBtn).toBeVisible();
        await kitUploadPage.selectKitType(kitType); // un-check
      }

      expect(test.info().errors).toHaveLength(0);
    })
  }
})
