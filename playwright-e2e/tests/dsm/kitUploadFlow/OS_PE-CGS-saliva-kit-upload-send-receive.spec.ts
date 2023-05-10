import {test} from "@playwright/test";
import {WelcomePage} from "pages/dsm/welcome-page";
import HomePage from "pages/dsm/home-page";
import {Navigation} from "lib/component/dsm/navigation/navigation";
import {login} from "authentication/auth-dsm";
import {StudyEnum} from "lib/component/dsm/navigation/enums/selectStudyNav-enum";
import ParticipantListPage from "pages/dsm/participantList-page";
import {StudyNavEnum} from "lib/component/dsm/navigation/enums/studyNav-enum";
import ParticipantPage from "pages/dsm/participant-page/participant-page";
import {KitUploadInfo} from "pages/dsm/kitUpload-page/models/kitUpload-model";
import ContactInformationTab from "lib/component/dsm/tabs/contactInformationTab";
import {TabEnum} from "lib/component/dsm/tabs/enums/tab-enum";
import KitsWithoutLabelPage from "pages/dsm/kitsWithoutLabel-page";
import {SamplesNavEnum} from "lib/component/dsm/navigation/enums/samplesNav-enum";
import {KitTypeEnum} from "lib/component/dsm/kitType/enums/kitType-enum";
import KitUploadPage from "pages/dsm/kitUpload-page/kitUpload-page";
import InitialScanPage from "pages/dsm/initialScan-page";
import FinalScanPage from "pages/dsm/finalScan-page";
import KitsSentPage from "pages/dsm/kitsSentPage";
import crypto from "crypto";
import SampleInformationTab from "lib/component/dsm/tabs/sampleInformationTab";
import {SampleInfoEnum} from "lib/component/dsm/tabs/enums/sampleInfo-enum";
import {SampleStatusEnum} from "lib/component/dsm/tabs/enums/sampleStatus-enum";

/**
 * @TODO
 * 1. cleanup code
 * 2. error texts on assertions
 * 3. make more reusable
 * 4. walk through questions
 */
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

  test.beforeEach(async ({ page }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
  });

  test.beforeEach(async () => {
    await welcomePage.selectStudy(StudyEnum.OSTEO2);
    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle(StudyEnum.OSTEO2);
  });

  test("Should upload a single kit for one participant @visual @dsm @osteo", async ({page}) => {
    // Collects all the necessary data for kit upload
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    const participantListTable = participantListPage.participantListTable;
    const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
    await participantPage.assertPageTitle();
    shortID = await participantPage.getShortId();

    const contactInformationTab = await participantPage.clickTab<ContactInformationTab>(TabEnum.CONTACT_INFORMATION);
    kitUploadInfo = new KitUploadInfo(
      shortID,
      await participantPage.getFirstName(),
      await participantPage.getLastName(),
      await contactInformationTab.getStreet1(),
      '',
      await contactInformationTab.getCity(),
      await contactInformationTab.getZip(),
      await contactInformationTab.getState(),
      await contactInformationTab.getCountry()
    );

    // deactivate all kits for the participant
    const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
    await kitsWithoutLabelPage.assertPageTitle();
    await kitsWithoutLabelPage.selectKitType(kitType);
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    await kitsWithoutLabelPage.assertTableHeader();
    await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

    // Uploads kit
    const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
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
    await kitsWithoutLabelPage.selectKitType(kitType);
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    await kitsWithoutLabelPage.assertTableHeader();
    await kitsWithoutLabelPage.assertPageTitle();
    shippingID = await kitsWithoutLabelPage.shippingId(shortID);

    // final scan
    const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
    await finalScanPage.assertPageTitle();
    await finalScanPage.fillScanPairs([kitLabel, shippingID]);
    await finalScanPage.save();

    // kits sent page
    const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
    await kitsSentPage.assertPageTitle();
    await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitsSentPage.selectKitType(kitType);
    await kitsSentPage.assertReloadKitListBtn();
    await kitsSentPage.assertTableHeader();
    await kitsSentPage.searchByMFCode(kitLabel);
    await kitsSentPage.assertDisplayedRowsCount(1);

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
    await sampleInformationTab
      .assertSampleByMFBarcode(kitLabel, kitType,
        {info: SampleInfoEnum.STATUS, value: SampleStatusEnum.SHIPPED})
  })
})
