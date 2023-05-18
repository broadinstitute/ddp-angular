import {test} from '@playwright/test';
import {WelcomePage} from 'pages/dsm/welcome-page';
import HomePage from 'pages/dsm/home-page';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import {login} from 'authentication/auth-dsm';
import {StudyEnum} from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'pages/dsm/participantList-page';
import {StudyNavEnum} from 'lib/component/dsm/navigation/enums/studyNav-enum';
import ParticipantPage from 'pages/dsm/participant-page/participant-page';
import {KitUploadInfo} from 'pages/dsm/kitUpload-page/models/kitUpload-model';
import ContactInformationTab from 'lib/component/dsm/tabs/contactInformationTab';
import {TabEnum} from 'lib/component/dsm/tabs/enums/tab-enum';
import {SamplesNavEnum} from 'lib/component/dsm/navigation/enums/samplesNav-enum';
import {KitTypeEnum} from 'lib/component/dsm/kitType/enums/kitType-enum';
import KitUploadPage from 'pages/dsm/kitUpload-page/kitUpload-page';
import InitialScanPage from 'pages/dsm/initialScan-page';
import FinalScanPage from 'pages/dsm/finalScan-page';
import crypto from 'crypto';
import SampleInformationTab from 'lib/component/dsm/tabs/sampleInformationTab';
import {SampleInfoEnum} from 'lib/component/dsm/tabs/enums/sampleInfo-enum';
import {SampleStatusEnum} from 'lib/component/dsm/tabs/enums/sampleStatus-enum';
import KitsWithoutLabelPage from 'pages/dsm/kitsInfo-pages/kitsWithoutLabel-page';
import {KitsColumnsEnum} from 'pages/dsm/kitsInfo-pages/enums/kitsColumns-enum';
import KitsSentPage from 'pages/dsm/kitsInfo-pages/kitsSentPage';
import KitsReceivedPage from 'pages/dsm/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';


test.describe('Saliva Kits upload flow (OC PE-CGS)', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;

  let shortID: string;
  let kitUploadInfo: KitUploadInfo;
  let kitLabel: string;
  let shippingID: string;

  const kitType = KitTypeEnum.SALIVA;
  const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page, request);
  });

  test.beforeEach(async () => {
    await welcomePage.selectStudy(StudyEnum.OSTEO2);
    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle(StudyEnum.OSTEO2);
  });

  test('Should upload a single kit for one participant @functional @visual @dsm @osteo', async ({page}) => {
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();

    // find the participant that has not more than 14 samples
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    const participantListTable = participantListPage.participantListTable;
    const normalCollaboratorSampleID = 'Normal Collaborator Sample ID';
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Sample Columns', [normalCollaboratorSampleID]);

    let testParticipantIndex = 0;
    for (let count = 0; count < 10; count++) {
      const textData = await participantListTable.getParticipantDataAt(count, normalCollaboratorSampleID);
      if (textData.split('\n').length < 28) {
        testParticipantIndex = count;
        break;
      }
    }

    // Collects all the necessary data for kit upload
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
      kitUploadInfo.street1 = await contactInformationTab.getStreet1();
      kitUploadInfo.city = await contactInformationTab.getCity();
      kitUploadInfo.postalCode = await contactInformationTab.getZip();
      kitUploadInfo.state = await contactInformationTab.getState();
      kitUploadInfo.country = await contactInformationTab.getCountry();
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
    await kitUploadPage.uploadFile(kitType, [kitUploadInfo], StudyEnum.OSTEO2);

    // initial scan
    const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
    await initialScanPage.assertPageTitle();
    kitLabel = `kit-${crypto.randomUUID().toString().substring(0, 10)}`;
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
    shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

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
    const searchPanel = await participantListPage.filters.searchPanel;
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
})
