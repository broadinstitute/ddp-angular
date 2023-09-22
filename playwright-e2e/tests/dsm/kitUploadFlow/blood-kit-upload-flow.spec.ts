import { test } from '@playwright/test';
import {WelcomePage} from 'dsm/pages/welcome-page';
import HomePage from 'dsm/pages/home-page';
import {Navigation} from 'dsm/component/navigation/navigation';
import {login} from 'authentication/auth-dsm';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import {StudyNavEnum} from 'dsm/component/navigation/enums/studyNav-enum';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import {KitUploadInfo} from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import ContactInformationTab from 'dsm/component/tabs/contact-information-tab';
import {TabEnum} from 'dsm/component/tabs/enums/tab-enum';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';
import FinalScanPage from 'dsm/pages/scanner-pages/finalScan-page';
import crypto from 'crypto';
import SampleInformationTab from 'dsm/component/tabs/sample-information-tab';
import {SampleInfoEnum} from 'dsm/component/tabs/enums/sampleInfo-enum';
import {SampleStatusEnum} from 'dsm/component/tabs/enums/sampleStatus-enum';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import TrackingScanPage from 'dsm/pages/scanner-pages/trackingScan-page';

// don't run in parallel
test.describe('Blood Kits upload flow', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;

  let shortID: string;
  let kitUploadInfo: KitUploadInfo;
  let kitLabel: string;
  let trackingLabel: string;
  let shippingID: string;

  let testResultDir: string;

  const studies = [StudyEnum.OSTEO2];
  const kitType = KitTypeEnum.BLOOD;
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Should upload a single kit for one participant @functional @dsm @${study}`, async ({page}, testInfo) => {
      testResultDir = testInfo.outputDir;

      await welcomePage.selectStudy(study);
      await homePage.assertWelcomeTitle();
      await homePage.assertSelectedStudyTitle(study);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();

      // find the right participant
      const testParticipantIndex = await participantListPage.findParticipantForKitUpload();

      // Collects all the necessary data for kit upload
      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(testParticipantIndex);
      shortID = await participantPage.getShortId();
      const isContactInformationTabVisible = await participantPage.isTabVisible(TabEnum.CONTACT_INFORMATION);
      kitUploadInfo = new KitUploadInfo(
        shortID,
        await participantPage.getFirstName(),
        await participantPage.getLastName(),
      );

      // collects data from the contact information tab if the tab is available
      if (isContactInformationTabVisible) {
        const contactInformationTab = await participantPage.clickTab<ContactInformationTab>(TabEnum.CONTACT_INFORMATION);
        kitUploadInfo.address.street1 = (await contactInformationTab.getStreet1()) || kitUploadInfo.address.street1;
        kitUploadInfo.address.city = (await contactInformationTab.getCity()) || kitUploadInfo.address.city;
        kitUploadInfo.address.postalCode = (await contactInformationTab.getZip()) || kitUploadInfo.address.postalCode;
        kitUploadInfo.address.state = (await contactInformationTab.getState()) || kitUploadInfo.address.state;
        kitUploadInfo.address.country = (await contactInformationTab.getCountry()) || kitUploadInfo.address.country;
      }

      // deactivate all kits for the participant
      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

      // Uploads kit
      const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
      await kitUploadPage.waitForReady();
      await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitUploadPage.selectKitType(kitType);
      await kitUploadPage.assertBrowseBtn();
      await kitUploadPage.assertUploadKitsBtn();
      await kitUploadPage.assertInstructionSnapshot();
      await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);

      // initial scan
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
      await initialScanPage.assertPageTitle();
      kitLabel = `PECGS-${crypto.randomUUID().toString().substring(0, 10)}`;
      await initialScanPage.fillScanPairs([kitLabel, shortID]);
      await initialScanPage.save();

      // Kits without label for extracting a shipping ID
      await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.assertPageTitle();
      await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, shortID);
      shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

      // tracking scan
      const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(SamplesNavEnum.TRACKING_SCAN);
      await trackingScanPage.assertPageTitle();
      trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
      await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
      await trackingScanPage.save();

      // final scan
      const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
      await finalScanPage.assertPageTitle();
      await finalScanPage.fillScanPairs([kitLabel, shippingID]);
      await finalScanPage.save();

      // kits sent page
      const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
      await kitsSentPage.waitForLoad();
      await kitsSentPage.assertPageTitle();
      await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitsSentPage.selectKitType(kitType);
      await kitsSentPage.assertReloadKitListBtn();
      await kitsSentPage.assertTableHeader();
      await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
      await kitsSentPage.assertDisplayedRowsCount(1);

      // kits received page
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest(kitLabel);
      await kitsReceivedPage.waitForLoad();
      await kitsReceivedPage.selectKitType(kitType);
      await kitsReceivedPage.assertPageTitle();
      await kitsReceivedPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitsReceivedPage.assertReloadKitListBtn();
      await kitsReceivedPage.assertTableHeader();
      await kitsReceivedPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
      await kitsReceivedPage.assertDisplayedRowsCount(1);
      const receivedDate = await kitsReceivedPage.getData(KitsColumnsEnum.RECEIVED);

      // checks if the uploaded kit is displayed on the participant's page, in the sample information tab
      await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.assertPageTitle();

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', {textValue: shortID});
      await searchPanel.search();
      await participantListTable.openParticipantPageAt(0);
      await participantPage.assertPageTitle();
      const sampleInformationTab = await participantPage.clickTab<SampleInformationTab>(TabEnum.SAMPLE_INFORMATION);
      await sampleInformationTab.assertKitType(kitLabel, kitType);
      await sampleInformationTab.assertValue(kitLabel, {info: SampleInfoEnum.STATUS, value: SampleStatusEnum.RECEIVED});
      await sampleInformationTab.assertValue(kitLabel, {info: SampleInfoEnum.RECEIVED, value: receivedDate});
    })
  }
})
