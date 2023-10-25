import {expect} from '@playwright/test';
import {test} from 'fixtures/dsm-fixture';
import {WelcomePage} from 'dsm/pages/welcome-page';
import {Navigation} from 'dsm/component/navigation/navigation';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';

// don't run in parallel
test.describe.serial('Blood Kits upload flow', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;

  const studies = [StudyEnum.OSTEO2, StudyEnum.PANCAN, StudyEnum.RGP];

  test.beforeEach(({page, request}) => {
    welcomePage = new WelcomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Kit Upload page ui @dsm @${study} @kit`, async ({page}) => {
      const expectedKitSelection = getExpectedKitSelection(study);
      await welcomePage.selectStudy(study);

      // Kit Upload page
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

  function getExpectedKitSelection(study: StudyEnum): KitTypeEnum[] {
    let types = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];
    switch (study) {
      case StudyEnum.PANCAN:
        types = types.concat([KitTypeEnum.STOOL]);
      break;
      case StudyEnum.RGP:
        types = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA];
        break;
    }
    return types;
  }
})
