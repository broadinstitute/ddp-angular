import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import {StudyNavEnum} from 'dsm/component/navigation/enums/studyNav-enum';
import * as user from 'data/fake-user.json';
import crypto from 'crypto';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import FamilyMemberTab from 'dsm/pages/participant-page/rgp/family-member-tab';
import { FamilyMember } from 'dsm/component/tabs/enums/familyMember-enum';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import TrackingScanPage from 'dsm/pages/scanner-pages/trackingScan-page';
import RgpFinalScanPage from 'dsm/pages/scanner-pages/rgpFinalScan-page'
import { simplifyShortID } from 'utils/faker-utils';
import { saveParticipantGuid } from 'utils/faker-utils';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { waitForResponse } from 'utils/test-utils';
import KitsQueuePage from 'dsm/pages/kitsInfo-pages/kit-queue-page';

test.describe('Blood & RNA Kit Upload', () => {
  test('Verify that a blood & rna kit can be uploaded @dsm @rgp @functional @upload', async ({ page, request}, testInfo) => {
    const testResultDirectory = testInfo.outputDir;

    const study = StudyEnum.RGP;
    const kitType = KitTypeEnum.BLOOD_AND_RNA;
    const expectedKitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA]; //Later will be just Blood & RNA kit type for RGP

    //Go into DSM
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Go to recently created playwright test participant to get their short id
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();

    const participantListTable = new ParticipantListTable(page);
    const participantGuid = await participantListTable.getGuidOfMostRecentAutomatedParticipant(user.patient.firstName, true);
    saveParticipantGuid(participantGuid);

    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListTable.openParticipantPageAt(0);

    //For RGP, the short id needed for the kit upload is the family member's subject id
    const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);
    proband.relationshipID = user.patient.relationshipID;

    const probandTab = await proband.getFamilyMemberTab();
    await expect(probandTab, 'RGP Proband tab is not visible').toBeVisible();
    await probandTab.click();
    await expect(probandTab).toHaveClass('nav-link active');//Make sure the tab is in view and selected

    const participantInfoSection = proband.getParticipantInfoSection();
    await participantInfoSection.click();

    const probandSubjectID = proband.getSubjectID();
    await expect(probandSubjectID).not.toBeEmpty();
    const shortID = await probandSubjectID.inputValue();
    const simpleShortId = simplifyShortID(shortID, 'RGP');

    //Deactivate existing kits for participant
    //Note: no blood kits are automatically created for RGP - preliminary deactivation of existing kits is done in case of prior test run
    const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
    await kitsWithoutLabelPage.waitForReady();
    await kitsWithoutLabelPage.assertPageTitle();
    await kitsWithoutLabelPage.selectKitType(kitType);
    if (await kitsWithoutLabelPage.hasExistingKitRequests()) {
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
      await kitsWithoutLabelPage.assertTableHeader();
      await kitsWithoutLabelPage.deactivateAllKitsFor(simpleShortId);
    }

    //The rest of the kit upload information - RGP kits are by family member instead of by account - using the proband's info to make a kit
    const kitUploadInfo = new KitUploadInfo(shortID, user.patient.firstName, user.patient.lastName);
    kitUploadInfo.address.street1 = user.patient.streetAddress;
    kitUploadInfo.address.city = user.patient.city;
    kitUploadInfo.address.postalCode = user.patient.zip;
    kitUploadInfo.address.state = user.patient.state.abbreviation;
    kitUploadInfo.address.country = user.patient.country.abbreviation;

    //Upload a Blood & RNA kit
    const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
    await kitUploadPage.waitForReady(expectedKitTypes);
    await kitUploadPage.assertPageTitle();
    await kitUploadPage.selectKitType(kitType);
    await kitUploadPage.assertBrowseBtn();
    await kitUploadPage.assertUploadKitsBtn();
    //await kitUploadPage.assertInstructionSnapshot();
    await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);

    //Go to Kits w/o Label to extract a shipping ID
    await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
    await kitsWithoutLabelPage.waitForReady();
    await kitsWithoutLabelPage.selectKitType(kitType);
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    //await kitsWithoutLabelPage.assertTableHeader(); Preferred Language column needs to be added to RGP DSM Test
    await kitsWithoutLabelPage.assertPageTitle();

    await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, simpleShortId);
    const shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

    const kitsTable = kitsWithoutLabelPage.kitsWithoutLabelTable;
    await kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, simpleShortId);
    await expect(kitsTable.rowLocator()).toHaveCount(1);

    //Search for the kit and get its label created
    await kitsTable.selectSingleRowByIndex();
    await Promise.all([
      waitForResponse(page, { uri: '/kitLabel' }),
      kitsWithoutLabelPage.createLabelsButton.click()
    ]);
    await Promise.all([
      expect(page.locator('[data-icon="cog"]')).toBeVisible(),
      expect(page.locator('h3')).toHaveText(/Triggered label creation/i)
    ]);
    await kitsWithoutLabelPage.waitUntilAllKitLabelCreationRequestsAreProcessed();

    //Kit Queue
    const kitQueuePage = await navigation.selectFromSamples<KitsQueuePage>(SamplesNavEnum.QUEUE);
    await kitQueuePage.waitForLoad();
    await kitQueuePage.assertPageTitle();
    await kitQueuePage.assertDisplayedKitTypes([KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA]);
    await kitQueuePage.selectKitType(KitTypeEnum.BLOOD_AND_RNA);
    await kitQueuePage.assertReloadKitListBtn();
    if (!await kitQueuePage.hasExistingKitRequests()) {
      
    } else {
      //When there are kits in Kit Queue
    }

    //Tracking scan
    const labelNumber = crypto.randomUUID().toString().substring(0, 10);
    const kitLabel = `RGP_${labelNumber}`;
    const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(SamplesNavEnum.TRACKING_SCAN);
    await trackingScanPage.assertPageTitle();
    const trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
    await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
    await trackingScanPage.save();

    //RGP final scan page - RNA labels must have the prefix 'RNA' (all caps)
    const finalScanPage = await navigation.selectFromSamples<RgpFinalScanPage>(SamplesNavEnum.RGP_FINAL_SCAN);
    const rnaNumber = crypto.randomUUID().toString().substring(0, 10);
    const rnaLabel = `RNA${rnaNumber}`;
    await finalScanPage.assertPageTitle();
    await finalScanPage.fillScanTrio(kitLabel, rnaLabel, shippingID, 1);
    await finalScanPage.save();

    //Kits Sent Page
    const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
    await kitsSentPage.waitForLoad();
    await kitsSentPage.assertPageTitle();
    await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitsSentPage.selectKitType(kitType);

    //Check for the sent blood kit
    await kitsSentPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
    await kitsSentPage.assertDisplayedRowsCount(1);

    //Check for the sent RNA kit
    await kitsSentPage.search(KitsColumnsEnum.MF_CODE, rnaLabel);
    await kitsSentPage.assertDisplayedRowsCount(1);

    //Kits Received Page
    const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
    await kitsReceivedPage.waitForLoad();
    await kitsReceivedPage.assertPageTitle();
    console.log(`MF Code used for receiving kit request: ${kitLabel}`);
    await kitsReceivedPage.kitReceivedRequestForRGPKits(kitLabel, shortID); //Mark the blood & rna kit as received
    await kitsReceivedPage.kitReceivedRequestForRGPKits(rnaLabel, shortID); //Mark the kit with the rna label as received
    await kitsReceivedPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitsReceivedPage.selectKitType(kitType);

    //Check for the received blood and rna kit
    await kitsReceivedPage.search(KitsColumnsEnum.MF_CODE, kitLabel);
    await kitsReceivedPage.assertDisplayedRowsCount(1);
  });
});
