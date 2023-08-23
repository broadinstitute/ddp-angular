import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import HomePage from 'dsm/pages/home-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { test } from 'fixtures/dsm-fixture';
import {login} from 'authentication/auth-dsm';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import KitsWithoutLabelPage from 'dsm/pages/kitsInfo-pages/kitsWithoutLabel-page';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import { expect } from '@playwright/test';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import InitialScanPage from 'dsm/pages/scanner-pages/initialScan-page';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import FinalScanPage from 'dsm/pages/scanner-pages/finalScan-page';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';

test.describe('Samples Received Event - Recieved saliva kit first and then tumor sample', () => {
    const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];
    let welcomePage: WelcomePage;
    let navigation: Navigation;
    let homePage: HomePage;
    let kitUploadInfo: KitUploadInfo;

    const kitType = KitTypeEnum.SALIVA;
    const expectedKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

    test.beforeEach(async ({ page, request }) => {
        navigation = new Navigation(page, request);
        welcomePage = new WelcomePage(page);
        homePage = new HomePage(page);
    });

    for (const study of studies) {
        test(`${study} - Verify SAMPLES_RECEIVED occurs if the saliva kit is received before the tumor sample`, async ({ page }, testInfo) => {
            const testResultDirectory = testInfo.outputDir;

            //Select the study
            await new Select(page, { label: 'Select study' }).selectOption(`${study}`);

            //Find a participant who does not have any sent or received saliva or blood kits - who also has at least 1 physician's information in medical release
            const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
            await participantListPage.assertPageTitle();
            await participantListPage.waitForReady();

            const participantShortID = await participantListPage.findParticipantWithoutSentKitType(KitTypeEnum.SALIVA);
            console.log(`Planned test participant: ${participantShortID}`);

            //Get the participant information that is needed to do a kit upload
            await participantListPage.reloadWithDefaultFilter();
            await participantListPage.filterListByShortId(participantShortID);

            const participantListTable = new ParticipantListTable(page);
            const amountOfParticipants = await participantListTable.rowsCount;
            expect(amountOfParticipants).toBe(1); //Placement of the participant in the participant list after filtering

            const participantPage = await participantListTable.openParticipantPageAt(amountOfParticipants - 1); //Count starts from zero
            kitUploadInfo = await participantPage.getContactInformation(participantShortID);

            //Deactivate existing saliva kit(s)
            const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
            await kitsWithoutLabelPage.waitForLoad();
            await kitsWithoutLabelPage.assertPageTitle();
            await kitsWithoutLabelPage.selectKitType(kitType);
            await kitsWithoutLabelPage.assertCreateLabelsBtn();
            await kitsWithoutLabelPage.assertReloadKitListBtn();
            await kitsWithoutLabelPage.assertTableHeader();
            await kitsWithoutLabelPage.deactivateAllKitsFor(participantShortID);

            //Upload a saliva kit for the participant
            const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
            await kitUploadPage.waitForLoad();
            await kitUploadPage.assertPageTitle();
            await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
            await kitUploadPage.selectKitType(kitType);
            await kitUploadPage.assertBrowseBtn();
            await kitUploadPage.assertUploadKitsBtn();
            await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);

            //Go to Kits w/o Label in order to get the Shipping ID a.k.a DSM Label
            await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNavEnum.KITS_WITHOUT_LABELS);
            await kitsWithoutLabelPage.waitForLoad();
            await kitsWithoutLabelPage.selectKitType(kitType);
            await kitsWithoutLabelPage.search(KitsColumnsEnum.SHORT_ID, participantShortID);
            const shippingID = (await kitsWithoutLabelPage.getData(KitsColumnsEnum.SHIPPING_ID)).trim();

            //Send out the saliva kit - Note: PE-CGS saliva kit flow is: Kit Upload -> Kits w/o Label -> Initial Scan -> Final Scan
            const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNavEnum.INITIAL_SCAN);
            await initialScanPage.assertPageTitle();
            const kitLabel = `kit-${crypto.randomUUID().toString().substring(0, 10)}`; //Saliva PE-CGS kit labels must be 14 chars
            await initialScanPage.fillScanPairs([kitLabel, participantShortID]);
            await initialScanPage.save();

            const finalScan = await navigation.selectFromSamples<FinalScanPage>(SamplesNavEnum.FINAL_SCAN);
            await finalScan.assertPageTitle();
            await finalScan.fillScanPairs([kitLabel, shippingID]);
            await finalScan.save();

            //Go to the participant's participant page
            await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
            await participantListPage.filterListByShortId(participantShortID);
            await participantListTable.openParticipantPageAt(0);

            //Go into their Onc History tab


            //Input a new row of onc history data, where at least the following is added: Date of PX + Accession Number; Afterwards change request status to 'Request'

            //Verify the Request checkbox appears

            //Verify that Download Request Documents button is interactable and can be used

            //Go into Onc History Detail a.k.a Tissue Information a.k.a Tissue Request page

            //Verify the onc history's Request Status is 'Sent'

            //Make sure the following details are added:
            //Fax Sent, Tissue Received, Gender, Materials Received (note: only use USS or Scrolls), SM-IDs, Tumor Collaborator Sample ID, Date sent to GP

            //Receive the saliva kit

            //Receive the tumor sample

            //Verify the Germline Consent Addendum activity has been created for the participant
        });
    }
});
