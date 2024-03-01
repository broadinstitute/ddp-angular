import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import {StudyNavEnum} from 'dsm/component/navigation/enums/studyNav-enum';
import * as user from 'data/fake-user.json';
import crypto from 'crypto';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import FamilyMemberTab from 'dsm/pages/tablist/rgp-family-member-tab';
import { FamilyMember } from 'dsm/component/tabs/enums/familyMember-enum';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import KitsSentPage from 'dsm/pages/kitsInfo-pages/kitsSentPage';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import TrackingScanPage from 'dsm/pages/scanner-pages/trackingScan-page';
import RgpFinalScanPage from 'dsm/pages/scanner-pages/rgpFinalScan-page'
import { simplifyShortID } from 'utils/faker-utils';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import KitsQueuePage from 'dsm/pages/kitsInfo-pages/kit-queue-page';
import ErrorPage from 'dsm/pages/samples/error-page';
import { CustomizeView, KitType, Label } from 'dsm/enums';

test.describe('Blood & RNA Kit Upload', () => {
  test('Verify that a blood & rna kit can be uploaded @dsm @rgp @functional @upload', async ({ page, request}, testInfo) => {
    test.slow();

    const testResultDirectory = testInfo.outputDir;

    const study = StudyEnum.RGP;
    const kitType = KitType.BLOOD_AND_RNA;
    const expectedKitTypes = [KitType.BLOOD, KitType.BLOOD_AND_RNA]; //Later will be just Blood & RNA kit type for RGP
    let kitTable;
    let amountOfKits;
    let kitErrorPage;
    let kitQueueShippingID;
    let kitErrorShippingID;

    //Go into DSM
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption(study);

    //Go to recently created playwright test participant to get their short id
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = new ParticipantListTable(page);
    const participantShortID = await participantListPage.findParticipantWithTab({ findPediatricParticipant: false, rgpProbandTab: true });

    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomizeView.PARTICIPANT, [Label.SHORT_ID]);

    await participantListPage.filterListByShortId(participantShortID);
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
    await kitsWithoutLabelPage.selectKitType(kitType);
    if (await kitsWithoutLabelPage.hasKitRequests()) {
      await kitsWithoutLabelPage.assertCreateLabelsBtn();
      await kitsWithoutLabelPage.assertReloadKitListBtn();
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
    await kitUploadPage.waitForReady();
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

    await kitsWithoutLabelPage.search(Label.SHORT_ID, simpleShortId);
    const shippingID = (await kitsWithoutLabelPage.getData(Label.SHIPPING_ID)).trim();

    const kitsTable = kitsWithoutLabelPage.getKitsTable;
    await kitsTable.searchByColumn(Label.SHORT_ID, simpleShortId);
    await expect(kitsTable.rowLocator()).toHaveCount(1);

    //Search for the kit and get its label created
    await kitsTable.selectSingleRowByIndex();
    await kitsWithoutLabelPage.clickCreateLabels();

    //Kit Queue or Kit Error page (depending on where easypost sends the kit - easypost tends to send the kit to error in non-prod envs)
    const kitQueuePage = await navigation.selectFromSamples<KitsQueuePage>(SamplesNavEnum.QUEUE);
    await kitQueuePage.waitForReady();
    await kitQueuePage.selectKitType(KitType.BLOOD_AND_RNA);
    const kitQueuePageHasExistingKitRequests = await kitQueuePage.hasKitRequests();
    if (kitQueuePageHasExistingKitRequests) {
      //Search for the test kit using the shipping id
      kitTable = kitQueuePage.getKitsTable;
      await kitTable.searchBy(Label.SHIPPING_ID, shippingID);
      amountOfKits = await kitTable.getRowsCount();
      if (amountOfKits === 0) {
        //If the kit is not found in Kit Queue -> go to Kit Error page and search for it there
        kitErrorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
        await kitErrorPage.waitForReady();
        await kitErrorPage.selectKitType(KitType.BLOOD_AND_RNA);
        kitTable = kitErrorPage.getKitsTable;
        await kitTable.searchBy(Label.SHIPPING_ID, shippingID);
        amountOfKits = await kitTable.getRowsCount();
        expect(amountOfKits, `Kit with shipping id ${shippingID} was not found in either Kit Queue or Kit Error`).toBe(1);
        kitErrorShippingID = (await kitTable.getData(Label.SHIPPING_ID)).trim();
        expect(kitErrorShippingID).toBe(shippingID);
      } else {
        //A kit with the relevant shipping id was found
        kitQueueShippingID = (await kitTable.getData(Label.SHIPPING_ID)).trim();
        expect(kitQueueShippingID).toBe(shippingID);
      }
    } else if (!kitQueuePageHasExistingKitRequests) {
      kitErrorPage = await navigation.selectFromSamples<ErrorPage>(SamplesNavEnum.ERROR);
      await kitErrorPage.waitForReady();
      await kitErrorPage.selectKitType(KitType.BLOOD_AND_RNA);
      kitTable = kitErrorPage.getKitsTable;
      await kitTable.searchBy(Label.SHIPPING_ID, shippingID);
      amountOfKits = await kitTable.getRowsCount();
      expect(amountOfKits, `Kit with shipping id ${shippingID} was not found in either Kit Queue or Kit Error`).toBe(1);
      kitErrorShippingID = (await kitTable.getData(Label.SHIPPING_ID)).trim();
      expect(kitErrorShippingID).toBe(shippingID);
    }

    //Tracking scan
    const labelNumber = crypto.randomUUID().toString().substring(0, 10);
    const kitLabel = `RGP_${labelNumber}`;
    const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(SamplesNavEnum.TRACKING_SCAN);
    await trackingScanPage.waitForReady();
    const trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
    await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
    await trackingScanPage.save();

    //RGP final scan page - RNA labels must have the prefix 'RNA' (all caps)
    const finalScanPage = await navigation.selectFromSamples<RgpFinalScanPage>(SamplesNavEnum.RGP_FINAL_SCAN);
    const rnaNumber = crypto.randomUUID().toString().substring(0, 10);

    await finalScanPage.assertPageTitle();

    // No error should be visible
    const pageError = page.locator('mat-error');
    await expect(pageError).not.toBeVisible();

    // An error is shown that the RNA label should start with "RNA"
    const rnaInvalidLabel = `MA${rnaNumber}`;
    await finalScanPage.fillScanTrio(kitLabel, rnaInvalidLabel, shippingID, 1);
    // Check error text
    await expect(pageError).toBeVisible();
    expect(await pageError.innerText()).toStrictEqual('This barcode does not contain the “RNA” prefix');

    const rnaLabel = `RNA${rnaNumber}`;
    await finalScanPage.fillScanTrio(kitLabel, rnaLabel, shippingID, 1);
    await finalScanPage.save();

    //Kits Sent Page
    const kitsSentPage = await navigation.selectFromSamples<KitsSentPage>(SamplesNavEnum.SENT);
    await kitsSentPage.waitForReady();
    await kitsSentPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitsSentPage.selectKitType(kitType);

    //Check for the sent blood kit
    await kitsSentPage.search(Label.MF_CODE, kitLabel, { count: 1 });

    //Check for the sent RNA kit
    await kitsSentPage.search(Label.MF_CODE, rnaLabel, { count: 1 });

    //Kits Received Page
    const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
    await kitsReceivedPage.waitForReady();
    await kitsReceivedPage.kitReceivedRequestForRGPKits(kitLabel, shortID); //Mark the blood & rna kit as received
    await kitsReceivedPage.kitReceivedRequestForRGPKits(rnaLabel, shortID); //Mark the kit with the rna label as received
    await kitsReceivedPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitsReceivedPage.selectKitType(kitType);

    //Check for the received blood and rna kit
    await kitsReceivedPage.search(Label.MF_CODE, kitLabel);
    await kitsReceivedPage.assertDisplayedRowsCount(1);
  });
});
