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

test.describe('Samples Received Event - Recieved saliva kit first and then tumor sample', () => {
    const studies = [StudyEnum.OSTEO2, StudyEnum.LMS];
    let welcomePage: WelcomePage;
    let navigation: Navigation;
    let homePage: HomePage;

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

            const shortID = await participantListPage.findParticipantWithoutSentKitType(KitTypeEnum.SALIVA);
            console.log(`Planned test participant: ${shortID}`);

            //Upload a saliva kit for the participant

            //Send out the saliva kit

            //Go to the participant's participant page

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
