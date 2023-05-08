import {test} from '@playwright/test';
import {WelcomePage} from 'pages/dsm/welcome-page';
import HomePage from 'pages/dsm/home-page';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import CohortTag from 'lib/component/dsm/cohort-tag';
import {StudyEnum} from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';
import {login} from 'authentication/auth-dsm';
import ParticipantListPage from "pages/dsm/participantList-page";
import {StudyNavEnum} from "lib/component/dsm/navigation/enums/studyNav-enum";
import {SamplesNavEnum} from "lib/component/dsm/navigation/enums/samplesNav-enum";
import {KitTypeEnum} from "lib/component/dsm/kitType/enums/kitType-enum";
import KitsWithoutLabelPage from "pages/dsm/kitsWithoutLabel-page";
import ParticipantPage from "pages/dsm/participant-page/participant-page";
import {KitUploadInfo} from "models/dsm/kitUpload-model";
import ContactInformationTab from "lib/component/dsm/tabs/contactInformationTab";
import {TabEnum} from "lib/component/dsm/tabs/enums/tab-enum";
import KitUploadPage from "pages/dsm/kitUpload-page/kitUpload-page";
import InitialScanPage from "pages/dsm/initialScan-page";
import FinalScanPage from "pages/dsm/finalScan-page";
import crypto from "crypto";


/**
 * @TODO
 * 1. handle duplicated kits
 * 2. sent page
 * 3. received page
 * 4. make more assertions
 */
test.describe.only('Final Scan Test', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;
  let cohortTag: CohortTag;

  test.beforeEach(async ({ page }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
    cohortTag = new CohortTag(page);
  });

  test.beforeEach(async ({ page }) => {
    await welcomePage.selectStudy(StudyEnum.OSTEO2);
    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle(StudyEnum.OSTEO2);
  });

  test('Should display success message under scan pairs', async ({page}) => {
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    const participantListTable = participantListPage.participantListTable;

    const fromParticipantIndex = 3;
    const toParticipantIndex = 5;
    const kitUploadInfos: KitUploadInfo[] = [];
    const shortIDs: string[] = [];

    for(let p = fromParticipantIndex; p < toParticipantIndex; p++) {
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(p);
      const shortID = await participantPage.getShortId();

      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.selectKitType(KitTypeEnum.SALIVA);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.assertTitle();

      shortIDs.push(shortID);
      await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

      await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      const searchPanel = await participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', {textValue: shortID});
      await searchPanel.search();
      await participantListTable.openParticipantPageAt(0);

      const contactInformationTab = await participantPage.clickTab<ContactInformationTab>(TabEnum.CONTACT_INFORMATION);

       const kitUploadInfo = new KitUploadInfo(
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
       kitUploadInfos.push(kitUploadInfo);

       await participantPage.backToList();
       await participantListPage.filters.reloadWithDefaultFilters();
    }


    const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
    await kitUploadPage.assertDisplayedKitTypes([KitTypeEnum.SALIVA, KitTypeEnum.BLOOD]);
    await kitUploadPage.selectKitType(KitTypeEnum.SALIVA);
    await kitUploadPage.assertBrowseBtn();
    await kitUploadPage.assertUploadKitsBtn();
    await kitUploadPage.assertTitle();
    await kitUploadPage.assertInstructionSnapshot();
    await kitUploadPage.uploadFile(KitTypeEnum.SALIVA, kitUploadInfos, StudyEnum.OSTEO2);

    for(let shortID of shortIDs) {
      const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
      await initialScanPage.assertTitle();
      const kitLabel = `kit-${crypto.randomUUID().toString().substring(0, 10)}`;
      await initialScanPage.fillScanPairs([kitLabel, shortID]);
      await initialScanPage.save();

      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.selectKitType(KitTypeEnum.SALIVA);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.assertTitle();
      const shippingId = await kitsWithoutLabelPage.shippingId(shortID);

      const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
      await finalScanPage.assertTitle();
      await finalScanPage.fillScanPairs([kitLabel, shippingId]);
      await finalScanPage.save();
    }
  })
})
