import { test } from 'fixtures/dsm-fixture';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { Navigation } from 'dsm/component/navigation/navigation';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import { expect } from '@playwright/test';
import * as mock from 'data/mock-address.json';
import { waitForResponse } from 'utils/test-utils';

// don't run in parallel
test.describe('Kit Upload', () => {
  let welcomePage: WelcomePage;
  let navigation: Navigation;

  let kitUploadInfo: KitUploadInfo;
  let kitLabel: string;
  let trackingLabel: string;

  const studies = [StudyEnum.LMS];
  const kitType = KitTypeEnum.BLOOD;
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  const mockedCanadaAddress = {
    street1: mock.canada.street,
    street2: mock.canada.street2,
    city: mock.canada.city,
    postalCode: mock.canada.zip,
    state: mock.canada.state.abbreviation,
    country: mock.canada.country.abbreviation,
  }

  const mockedNewYorkAddress = {
    street1: mock.newyork.street,
    street2: mock.newyork.street2,
    city: mock.newyork.city,
    postalCode: mock.newyork.zip,
    state: mock.newyork.state.abbreviation,
    country: mock.newyork.country.abbreviation,
  }

  for (const [index, study] of studies.entries()) {
    test.beforeEach(async ({ page, request }) => {
      welcomePage = new WelcomePage(page);
      navigation = new Navigation(page, request);
      await welcomePage.selectStudy(study);
    });

    test(`CMI Research kit type check @functional @pecgs @cmi-lms @dsm @${study} @kit`, async ({ page }, testInfo) => {
      const testResultDir = testInfo.outputDir;
      console.log(testResultDir);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      // find the right participant
      const testParticipantIndex = await participantListPage.findParticipantForKitUpload();
      expect(testParticipantIndex).not.toBeUndefined();

      // Collects all the necessary data for kit upload
      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(testParticipantIndex);

      const shortID = await participantPage.getShortId();
      const firstName = await participantPage.getFirstName();
      const lastName = await participantPage.getLastName();
      expect(shortID).toBeTruthy();
      expect(firstName).toBeTruthy();
      expect(lastName).toBeTruthy();

      kitUploadInfo = new KitUploadInfo(
        shortID,
        firstName,
        lastName,
        index % 2 === 0 ? mockedCanadaAddress : mockedNewYorkAddress // each study will be assigned a different address
      );

      // deactivate all existing kits for this participant
      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForLoad();
      await kitsWithoutLabelPage.assertPageTitle();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

      // Uploads new kit
      const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
      await kitUploadPage.waitForLoad();
      await kitUploadPage.assertPageTitle();
      await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitUploadPage.selectKitType(kitType);
      await kitUploadPage.skipAddressValidation(true); // This is requires because mocked address is different from participant's address
      await kitUploadPage.assertBrowseBtn();
      await kitUploadPage.assertUploadKitsBtn();
      await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);

      // Kits without label for extracting a shipping ID
      await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForLoad();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.assertPageTitle();

      // Trigger label creation on Kits Without Labels page
      const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;
      await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortID);
      await expect(kitsTable.rowLocator()).toHaveCount(1);
      const shippingID = (await kitsTable.getRowText(0, KitsColumnsEnum.SHIPPING_ID)).trim();
      await kitsTable.selectRowByRowIndex();
      await Promise.all([
        waitForResponse(page, {uri: '/ui/kitLabel?'}),
        kitsWithoutLabelPage.createLabelsButton.click()
      ]);
      expect(await page.locator('h3').textContent()).toEqual('Triggered label creation');

      await page.pause();
      /*
      // initial scan
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
      await initialScanPage.assertPageTitle();
      kitLabel = `PECGS-${crypto.randomUUID().toString().substring(0, 10)}`;
      await initialScanPage.fillScanPairs([kitLabel, shortID]);
      await initialScanPage.save(); */
    });
  }
})
