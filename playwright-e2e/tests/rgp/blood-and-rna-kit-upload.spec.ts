import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { login } from 'authentication/auth-dsm';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import {WelcomePage} from 'dsm/pages/welcome-page';
import HomePage from 'dsm/pages/home-page';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import {StudyNavEnum} from 'dsm/component/navigation/enums/studyNav-enum';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import * as user from 'data/fake-user.json';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import FamilyMemberTab from 'dsm/pages/participant-page/rgp/family-member-tab';
import { FamilyMember } from 'dsm/component/tabs/enums/familyMember-enum';

test.describe('Blood & RNA Kit Upload', () => {
test('Verify that a blood rna kit can be uploaded @upload @rgp @functional', async ({ page, request}, testInfo) => {
    const testResultDirectory = testInfo.outputDir;
    console.log(`Directory: ${testResultDirectory}`);

    const study = StudyEnum.RGP;
    const kitType = KitTypeEnum.BLOOD_AND_RNA;
    const expectedKitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA]; //Later will be just Blood & RNA kit type for RGP

    //Go into DSM
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Go to recently created playwright test participant to get their short id
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();

    const participantGuid = await participantListPage.getGuidOfMostRecentAutomatedParticipant(true);
    await participantListPage.filterListByParticipantGUID(participantGuid);
    await participantListPage.selectParticipant(participantGuid);

    //For RGP, the short id needed for the kit upload is the family member's subject id
    const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);
    proband.relationshipID = user.patient.relationshipID;

    const probandTab = proband.getFamilyMemberTab();
    await expect(probandTab).toBeVisible();
    await probandTab.click();
    await expect(probandTab).toHaveClass('nav-link active');//Make sure the tab is in view and selected

    const participantInfoSection = proband.getParticipantInfoSection();
    await participantInfoSection.click();

    const probandSubjectID = proband.getSubjectID();
    await expect(probandSubjectID).not.toBeEmpty();
    const shortID = await probandSubjectID.inputValue();
    console.log(`Proband's subject ID: ${shortID}`);

    //The rest of the kit upload information - RGP kits are by family member instead of by account - using the proband's info to make a kit
    const kitUploadInfo = new KitUploadInfo(shortID, user.patient.firstName, user.patient.lastName);
    kitUploadInfo.street1 = user.patient.streetAddress;
    kitUploadInfo.city = user.patient.city;
    kitUploadInfo.postalCode = user.patient.zip;
    kitUploadInfo.state = user.patient.state.abbreviation;
    kitUploadInfo.country = user.patient.country.abbreviation;

    //Note: no blood kits are automatically created for RGP - so there's no need for preliminary deactivation of existing kits
    //Upload a Blood & RNA kit
    const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
    await kitUploadPage.waitForLoad();
    await kitUploadPage.assertPageTitle();
    await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitUploadPage.selectKitType(kitType);
    await kitUploadPage.assertBrowseBtn();
    await kitUploadPage.assertUploadKitsBtn();
    //await kitUploadPage.assertInstructionSnapshot();
    await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);

    //Go to Kits w/o :abel to extract a shipping ID
    const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
    await kitsWithoutLabelPage.waitForLoad();
    await kitsWithoutLabelPage.selectKitType(kitType);
    await kitsWithoutLabelPage.assertCreateLabelsBtn();
    await kitsWithoutLabelPage.assertReloadKitListBtn();
    await kitsWithoutLabelPage.assertTableHeader();
    await kitsWithoutLabelPage.assertPageTitle();
    const simpleShortId = simplifyShortID(shortID, 'RGP');
    await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, simpleShortId);
    const shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();
    console.log(`Shipping ID/DSM Label: ${shippingID}`);

    // tracking scan
    const labelNumber = crypto.randomUUID().toString().substring(0, 10);
    const kitLabel = `RGP_${labelNumber}`;
    const trackingScanPage = await navigation.selectFromSamples<TrackingScanPage>(SamplesNavEnum.TRACKING_SCAN);
    await trackingScanPage.assertPageTitle();
    const trackingLabel = `tracking-${crypto.randomUUID().toString().substring(0, 10)}`;
    await trackingScanPage.fillScanPairs([trackingLabel, kitLabel]);
    await trackingScanPage.save();

    //RGP final scan page
    const finalScanPage = await navigation.selectFromSamples<RgpFinalScanPage>(SamplesNavEnum.RGP_FINAL_SCAN);
    const rnaNumber = crypto.randomUUID().toString().substring(0, 10);
    const rnaLabel = `RNA${rnaNumber}`;
    //await finalScanPage.assertPageTitle();
    await finalScanPage.fillScanTrio(kitLabel, rnaLabel, shippingID, 1);
    await finalScanPage.save();
    });
});
