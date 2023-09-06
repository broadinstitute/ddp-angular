import {expect, test} from '@playwright/test';
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
import {SampleTypesEnum} from 'dsm/pages/kitsInfo-pages/enums/sampleTypes-enum';

// don't run in parallel
test.describe('Saliva Kits upload flow', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;

  let testResultDir: string;

  const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];
  const kitType = KitTypeEnum.SALIVA;
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Should upload a single kit for one participant @functional @visual @dsm @${study}`, async ({page}, testInfo) => {
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
      const shortID = await participantPage.getShortId();
      const firstName = await participantPage.getFirstName();
      const lastName = await participantPage.getLastName();
      expect(shortID, 'The short ID is empty').toBeTruthy();
      expect(firstName, 'The first name is empty').toBeTruthy();
      expect(lastName, 'The last name is empty').toBeTruthy();
      const isContactInformationTabVisible = await participantPage.isTabVisible(TabEnum.CONTACT_INFORMATION);
      const kitUploadInfo = new KitUploadInfo(
        shortID,
        firstName,
        lastName,
      );

      // collects data from the contact information tab if the tab is available
      if (isContactInformationTabVisible) {
        const contactInformationTab = await participantPage.clickTab<ContactInformationTab>(TabEnum.CONTACT_INFORMATION);
        kitUploadInfo.street1 = (await contactInformationTab.getStreet1()) || kitUploadInfo.street1;
        kitUploadInfo.city = (await contactInformationTab.getCity()) || kitUploadInfo.city;
        kitUploadInfo.postalCode = (await contactInformationTab.getZip()) || kitUploadInfo.postalCode;
        kitUploadInfo.state = (await contactInformationTab.getState()) || kitUploadInfo.state;
        kitUploadInfo.country = (await contactInformationTab.getCountry()) || kitUploadInfo.country;
      }

      // deactivate all kits for the participant
      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForLoad();
      await kitsWithoutLabelPage.assertPageTitle();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

      // Uploads kit
      const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
      await kitUploadPage.waitForLoad();
      await kitUploadPage.assertPageTitle();
      await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitUploadPage.selectKitType(kitType);
      await kitUploadPage.assertBrowseBtn();
      await kitUploadPage.assertUploadKitsBtn();
      await kitUploadPage.assertInstructionSnapshot();
      await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);

      // initial scan
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
      await initialScanPage.assertPageTitle();
      const kitLabel = `kit-${crypto.randomUUID().toString().substring(0, 10)}`;
      await initialScanPage.fillScanPairs([kitLabel, shortID]);
      await initialScanPage.save();

      // Kits without label for extracting a shipping ID
      await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForLoad();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.assertPageTitle();
      await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, shortID);
      const shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

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
      study === StudyEnum.OSTEO2 && await sampleTypeCheck(kitUploadInfo, kitsSentPage);


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
      study === StudyEnum.OSTEO2 && await sampleTypeCheck(kitUploadInfo, kitsReceivedPage);

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
      await sampleInformationTab.assertKitType(kitLabel, kitType)
      await sampleInformationTab
        .assertValue(kitLabel, {info: SampleInfoEnum.STATUS, value: SampleStatusEnum.RECEIVED})
      await sampleInformationTab
        .assertValue(kitLabel, {info: SampleInfoEnum.RECEIVED, value: receivedDate})
    })
  }
})

/**
 *
 * @param kitUploadInfo
 * @param sentOrReceivedPage
 *
 */
async function sampleTypeCheck(kitUploadInfo: KitUploadInfo, sentOrReceivedPage: KitsSentPage | KitsReceivedPage):
  Promise<void > {
  const sampleType = await sentOrReceivedPage.getData(KitsColumnsEnum.SAMPLE_TYPE);
  const {country, state} = kitUploadInfo;
  const isResearchKit = (country === 'US' && state === 'NY') || country === 'CA';
  expect(sampleType.trim()).toBe(isResearchKit ? SampleTypesEnum.RESEARCH : SampleTypesEnum.CLINICAL)
}
