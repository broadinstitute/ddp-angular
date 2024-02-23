import {expect, test} from '@playwright/test';
import {WelcomePage} from 'dsm/pages/welcome-page';
import HomePage from 'dsm/pages/home-page';
import {Navigation, Samples, Study, StudyName} from 'dsm/component/navigation';
import {login} from 'authentication/auth-dsm';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import {KitUploadInfo} from 'dsm/pages/kit-upload/models/kitUpload-model';
import ContactInformationTab from 'dsm/component/tabs/contact-information-tab';
import {Kit, Label, SampleStatus, Tab} from 'dsm/enums';
import KitUploadPage from 'dsm/pages/kit-upload-page';
import KitsInitialScanPage from 'dsm/pages/kits-initial-scan-page';
import KitsFinalScanPage from 'dsm/pages/kits-final-scan-page';
import crypto from 'crypto';
import SampleInformationTab from 'dsm/component/tabs/sample-information-tab';
import KitsWithoutLabelPage from 'dsm/pages/kits-without-label-page';
import {KitsColumnsEnum} from 'dsm/pages/kits-info/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kits-sent-page';
import KitsReceivedPage from 'dsm/pages/kits-received-page';
import KitsTrackingScanPage from 'dsm/pages/kits-tracking-scan-page';
import {getDate} from 'utils/date-utils';
import { logInfo } from 'utils/log-utils';

// don't run in parallel
test.describe.serial('Blood Kits upload flow', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;
  let finalScanPage: KitsFinalScanPage;

  let shortID: string;
  let kitUploadInfo: KitUploadInfo;
  let kitLabel: string;
  let trackingLabel: string;
  let shippingID: string;

  let testResultDir: string;

  const studies = [StudyName.OSTEO2];
  const kitType = Kit.BLOOD;
  const expectedKitTypes = [Kit.SALIVA, Kit.BLOOD];

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

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      // find the right participant
      const testParticipantIndex = await participantListPage.findParticipantForKitUpload({ allowNewYorkerOrCanadian: false });

      // Collects all the necessary data for kit upload
      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(testParticipantIndex);
      shortID = await participantPage.getShortId();
      logInfo(`Participant Short ID: ${shortID}`);

      const isContactInformationTabVisible = await participantPage.isTabVisible(Tab.CONTACT_INFORMATION);
      kitUploadInfo = new KitUploadInfo(
        shortID,
        await participantPage.getFirstName(),
        await participantPage.getLastName(),
      );

      // collects data from the contact information tab if the tab is available
      if (isContactInformationTabVisible) {
        const contactInformationTab = await participantPage.clickTab<ContactInformationTab>(Tab.CONTACT_INFORMATION);
        kitUploadInfo.address.street1 = (await contactInformationTab.getStreet1()) || kitUploadInfo.address.street1;
        kitUploadInfo.address.city = (await contactInformationTab.getCity()) || kitUploadInfo.address.city;
        kitUploadInfo.address.postalCode = (await contactInformationTab.getZip()) || kitUploadInfo.address.postalCode;
        kitUploadInfo.address.state = (await contactInformationTab.getState()) || kitUploadInfo.address.state;
        kitUploadInfo.address.country = (await contactInformationTab.getCountry()) || kitUploadInfo.address.country;
      }

      // deactivate all kits for the participant
      const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.deactivateAllKitsFor(shortID);

      // Uploads kit
      const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(Samples.KIT_UPLOAD);
      await kitUploadPage.waitForReady();
      await kitUploadPage.selectKitType(kitType);
      await kitUploadPage.assertBrowseBtn();
      await kitUploadPage.assertUploadKitsBtn();
      await kitUploadPage.assertInstructionSnapshot();
      await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDir);

      // initial scan
      const initialScanPage = await navigation.selectFromSamples<KitsInitialScanPage>(Samples.INITIAL_SCAN);
      await initialScanPage.assertPageTitle();
      kitLabel = `PECGS-${crypto.randomUUID().toString().substring(0, 10)}`;
      await initialScanPage.fillScanPairs([kitLabel, shortID]);
      await initialScanPage.save();

      // Kits without label for extracting a shipping ID
      await navigation.selectFromSamples<KitsWithoutLabelPage>(Samples.KITS_WITHOUT_LABELS);
      await kitsWithoutLabelPage.waitForReady();
      await kitsWithoutLabelPage.selectKitType(kitType);
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, shortID);
      shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

      // On Final Scan page, if Blood kit was not scanned on the Tracking Scan page before, DSM should show an error
      finalScanPage = await navigation.selectFromSamples<KitsFinalScanPage>(Samples.FINAL_SCAN);
      await finalScanPage.assertPageTitle();
      await finalScanPage.fillScanPairs([kitLabel, shippingID]);
      await finalScanPage.save({ verifySuccess: false });
      await expect(page.locator('//h3[contains(@class, "Color--warn")]')).toHaveText('Error - Failed to save all changes');
      await expect.soft(page.locator('//p[contains(@class, "Color--warn")]'))
        .toHaveText(`Error occurred sending this scan pair!  Kit with DSM Label ${kitLabel} does not have a Tracking Label`);

      // Tracking scan
      const trackingScanPage = await navigation.selectFromSamples<KitsTrackingScanPage>(Samples.TRACKING_SCAN);
      await trackingScanPage.waitForReady();
      trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
      await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
      await trackingScanPage.save();

      // Final scan
      finalScanPage = await navigation.selectFromSamples<KitsFinalScanPage>(Samples.FINAL_SCAN);
      await finalScanPage.assertPageTitle();
      await finalScanPage.fillScanPairs([kitLabel, shippingID]);
      await finalScanPage.save();

      // kits sent page
      const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(Samples.SENT);
      await kitsSentPage.waitForReady();
      await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
      await kitsSentPage.selectKitType(kitType);
      await kitsSentPage.assertReloadKitListBtn();
      await kitsSentPage.assertTableHeader();
      await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel, { count: 1 });

      const sentDate = await kitsSentPage.getData(KitsColumnsEnum.SENT);
      expect(getDate(new Date(sentDate))).toStrictEqual(getDate());

      // kits received page
      const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(Samples.RECEIVED);
      await kitsReceivedPage.kitReceivedRequest({mfCode: kitLabel});
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
      await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', {textValue: shortID});
      await searchPanel.search();
      await participantListTable.openParticipantPageAt(0);
      await participantPage.assertPageTitle();
      const sampleInformationTab = await participantPage.clickTab<SampleInformationTab>(Tab.SAMPLE_INFORMATION);
      await sampleInformationTab.assertKitType(kitLabel, kitType);
      await sampleInformationTab.assertValue(kitLabel, {info: Label.STATUS, value: SampleStatus.RECEIVED});
      await sampleInformationTab.assertValue(kitLabel, {info: Label.RECEIVED, value: receivedDate});

      expect(test.info().errors).toHaveLength(0);
    })
  }
});
