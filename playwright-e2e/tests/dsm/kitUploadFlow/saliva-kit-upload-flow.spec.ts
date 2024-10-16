import {expect, test} from '@playwright/test';
import {WelcomePage} from 'dsm/pages/welcome-page';
import HomePage from 'dsm/pages/home-page';
import {Navigation, Samples, Study, StudyName} from 'dsm/navigation';
import {login} from 'authentication/auth-dsm';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import {KitUploadInfo} from 'dsm/pages/models/kit-upload-model';
import ContactInformationTab from 'dsm/pages/tablist/contact-information-tab';
import {KitSampleType, KitType, Label, Tab} from 'dsm/enums';
import KitsUploadPage from 'dsm/pages/kits-upload-page';
import InitialScanPage from 'dsm/pages/scan/initial-scan-page';
import FinalScanPage from 'dsm/pages/scan/final-scan-page';
import crypto from 'crypto';
import SampleInformationTab from 'dsm/pages/tablist/sample-information-tab';
import {SampleInfoEnum} from 'dsm/component/tabs/enums/sampleInfo-enum';
import {SampleStatusEnum} from 'dsm/component/tabs/enums/sampleStatus-enum';
import KitsWithoutLabelPage from 'dsm/pages/kits-without-label-page';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import KitsReceivedPage from 'dsm/pages/kits-received-page';
import {getDate} from 'utils/date-utils';
import {logInfo} from 'utils/log-utils';
import TrackingScanPage from 'dsm/pages/scan/tracking-scan-page';
import KitsWithErrorPage from 'dsm/pages/kits-with-error-page';
import KitsSearchPage from 'dsm/pages/kits-search-page';

// don't run in parallel
test.describe.serial('Saliva Kits upload flow', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;

  let testResultDir: string;

  const studies = [StudyName.LMS, StudyName.OSTEO2, StudyName.PANCAN];
  const clinicalStudies = [StudyName.LMS, StudyName.OSTEO2];
  const studiesWithContactInformationColumn = [StudyName.LMS, StudyName.OSTEO2, StudyName.PANCAN];
  const kitType = KitType.SALIVA;
  const expectedKitTypes = [KitType.SALIVA, KitType.BLOOD];
  //Clinical studies have slight differences that are apparent when doing a kit upload, viewing kit-related pages, etc.
  let isClinicalStudy;
  let hasValidatedContactInformation = false;
  let nextKitCollaboratorSampleID = '';

  test.beforeEach(async ({ page, request }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test(`Should upload a single kit for one participant @functional @dsm @${study}`, async ({page}, testInfo) => {
      testResultDir = testInfo.outputDir;
      if (clinicalStudies.includes(study)) {
        isClinicalStudy = true;
      } else {
        isClinicalStudy = false;
      }

      if (studiesWithContactInformationColumn.includes(study)) {
        hasValidatedContactInformation = true;
      }

      await welcomePage.selectStudy(study);
      await homePage.assertWelcomeTitle();
      await homePage.assertSelectedStudyTitle(study);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      // find the right participant
      const testParticipantIndex = await participantListPage.findParticipantForKitUpload({
        allowNewYorkerOrCanadian: false,
        hasContactInfomationColumn: hasValidatedContactInformation
      });

      // Collects all the necessary data for kit upload
      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt({ position: testParticipantIndex });
      const shortID = await participantPage.getShortId();
      const firstName = await participantPage.getFirstName();
      const lastName = await participantPage.getLastName();

      logInfo(`Participant Short ID: ${shortID}`);
      expect(shortID, 'The short ID is empty').toBeTruthy();
      expect(firstName, 'The first name is empty').toBeTruthy();
      expect(lastName, 'The last name is empty').toBeTruthy();
      const isContactInformationTabVisible = await participantPage.tablist(Tab.CONTACT_INFORMATION).isVisible();
      const kitUploadInfo = new KitUploadInfo(
        shortID,
        firstName,
        lastName,
      );

      // collects data from the contact information tab if the tab is available
      if (isContactInformationTabVisible) {
        const contactInformationTab = await participantPage.tablist(Tab.CONTACT_INFORMATION).click<ContactInformationTab>();
        kitUploadInfo.address.street1 = (await contactInformationTab.getStreet1()) || kitUploadInfo.address.street1;
        kitUploadInfo.address.city = (await contactInformationTab.getCity()) || kitUploadInfo.address.city;
        kitUploadInfo.address.postalCode = (await contactInformationTab.getZip()) || kitUploadInfo.address.postalCode;
        kitUploadInfo.address.state = (await contactInformationTab.getState()) || kitUploadInfo.address.state;
        kitUploadInfo.address.country = (await contactInformationTab.getCountry()) || kitUploadInfo.address.country;
      }

      //estimate the next kit's sample collaborator id if currently checking a research kit - since that's the best way to verify it later
      if (!clinicalStudies.includes(study)) {
        const searchPage = await navigation.selectFromSamples<KitsSearchPage>(Samples.SEARCH);
        nextKitCollaboratorSampleID = await searchPage.estimateNextKitCollaboratorSampleID({
          participantShortID: shortID,
          kitType: KitType.SALIVA,
          studyName: study
        });
        logInfo(`Estimated collaborator sample id for ${study} participant ${shortID}: ${nextKitCollaboratorSampleID}`);
      }

      // deactivate all kits for the participant (in both Kits w/o Label and Kit Error page)
      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

      const kitErrorPage = await navigation.selectFromSamples<KitsWithErrorPage>(Samples.ERROR);
      await kitErrorPage.waitForReady();
      await kitErrorPage.selectKitType(kitType);
      await kitErrorPage.deactivateAllKitsFor(shortID);

      // Uploads kit
      const kitUploadPage = await navigation.selectFromSamples<KitsUploadPage>(Samples.KIT_UPLOAD);
      await kitUploadPage.waitForReady();
      await kitUploadPage.selectKitType(kitType);
      await kitUploadPage.assertBrowseBtn();
      await kitUploadPage.assertUploadKitsBtn();
      await kitUploadPage.assertInstructionSnapshot();
      await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);

      //Create Kit Label - saliva kit labels should be exactly 14 characters
      const kitLabel = `kit-${crypto.randomUUID().toString().substring(0, 10)}`;

      // Initial Scan
      if (isClinicalStudy) {
        const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(Samples.INITIAL_SCAN);
        await initialScanPage.assertPageTitle();
        await initialScanPage.fillScanPairs([kitLabel, shortID]);
        await initialScanPage.save();
      }

      // Kits without label for extracting a shipping ID
      await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();

      await kitsWithoutLabelPage.search(Label.SHORT_ID, shortID);
      const shippingID = (await kitsWithoutLabelPage.getData(Label.SHIPPING_ID)).trim();

      //Tracking Scan
      const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(Samples.TRACKING_SCAN);
      await trackingScanPage.waitForReady();
      const trackingLabel = `trackingLabel-${crypto.randomUUID().toString().substring(0, 10)}`;
      await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
      await trackingScanPage.save();

      // Final scan
      const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(Samples.FINAL_SCAN);
      await finalScanPage.assertPageTitle();

      // On Final Scan page, Kit Label for Saliva kit should be 14 char long and throws error
      const kitLabelInvalid = crypto.randomUUID().toString().substring(0, 13);
      await finalScanPage.fillScanPairs([kitLabelInvalid, shippingID]);
      await finalScanPage.save({ verifySuccess: false });
      await expect(page.locator('//h3[contains(@class, "Color--warn")]')).toHaveText('Error - Failed to save all changes');

      // Entering a valid Kit Label (14 char)
      await finalScanPage.fillScanPairs([kitLabel, shippingID]);
      await finalScanPage.save();

      // kits sent page
      const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(Samples.SENT);
      await kitsSentPage.waitForReady();
      await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitsSentPage.selectKitType(kitType);
      await kitsSentPage.assertReloadKitListBtn();
      await kitsSentPage.assertTableHeader({ isClinicalKit: isClinicalStudy });
      await kitsSentPage.search(Label.MF_CODE, kitLabel, { count: 1 });
      study === StudyName.OSTEO2 && await sampleTypeCheck(kitUploadInfo, kitsSentPage);

      const sentDate = await kitsSentPage.getData(Label.SENT);
      expect(getDate(new Date(sentDate))).toStrictEqual(getDate());

      // kits received page
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest({
        mfCode: kitLabel,
        isClinicalKit: isClinicalStudy,
        estimatedCollaboratorSampleID: nextKitCollaboratorSampleID
      });
      await kitsReceivedPage.waitForReady();
      await kitsReceivedPage.selectKitType(kitType);
      await kitsReceivedPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitsReceivedPage.assertReloadKitListBtn();
      await kitsReceivedPage.assertTableHeader({ isClinicalKit: isClinicalStudy });
      await kitsReceivedPage.search(Label.MF_CODE, kitLabel);
      await kitsReceivedPage.assertDisplayedRowsCount(1);

      const receivedDate = await kitsReceivedPage.getData(Label.RECEIVED);
      study === StudyName.OSTEO2 && await sampleTypeCheck(kitUploadInfo, kitsReceivedPage);

      // checks if the uploaded kit is displayed on the participant's page, in the sample information tab
      await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, {textValue: shortID});
      await searchPanel.search();
      await participantListTable.openParticipantPageAt({ position: 0 });
      await participantPage.assertPageTitle();
      const sampleInformationTab = await participantPage.tablist(Tab.SAMPLE_INFORMATION).click<SampleInformationTab>();
      await sampleInformationTab.assertKitType(kitLabel, kitType)
      await sampleInformationTab.assertValue(kitLabel, {info: SampleInfoEnum.STATUS, value: SampleStatusEnum.RECEIVED});
      await sampleInformationTab.assertValue(kitLabel, {info: SampleInfoEnum.RECEIVED, value: receivedDate});
      await sampleInformationTab.assertValue(kitLabel, {info: SampleInfoEnum.SENT, value: sentDate});
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
  const sampleType = await sentOrReceivedPage.getData(Label.SAMPLE_TYPE);
  const {address} = kitUploadInfo;
  const isResearchKit = (address.country === 'US' && address.state === 'NY') || address.country === 'CA';
  expect(sampleType.trim()).toBe(isResearchKit ? KitSampleType.RESEARCH : KitSampleType.CLINICAL)
}
