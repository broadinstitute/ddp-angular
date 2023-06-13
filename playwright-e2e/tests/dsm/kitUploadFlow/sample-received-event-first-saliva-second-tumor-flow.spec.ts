import { Page, test, Locator } from '@playwright/test';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import HomePage from 'dsm/pages/home-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import {login} from 'authentication/auth-dsm';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';

test.describe('PE-CGS Sample Received Event', () => {
    const studies = [StudyEnum.LMS, StudyEnum.OSTEO2];

    let welcomePage: WelcomePage;
    let homePage: HomePage;
    let navigation: Navigation;

    test.beforeEach(async ({ page, request }) => {
        await login(page);
        welcomePage = new WelcomePage(page);
        homePage = new HomePage(page);
        navigation = new Navigation(page, request);
    });

    //For each clinical study, check that the sample received event is working as expected
    for (const study of studies) {
        test(`Scenario 1: Saliva kit is received first; Tumor sample is received second`, async ({ page }) => {
            await welcomePage.selectStudy(study);
            await homePage.assertWelcomeTitle();
            await homePage.assertSelectedStudyTitle(study);

            const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
            await participantListPage.assertPageTitle();

            /**
             * Find a participant that fits the following criteria:
             * 1. Is enrolled
             * 2. Has at least 1 saliva kit uploaded
             * 3. One of the saliva kits has the status 'Waiting for GP' (for ease of testing)
             * 4. Has at least 1 known physician (in order to ensure Onc History tab is/was created)
             * 5. Does not already have a germline consent addendum activity created
             */
            const participant = findValidParticipant(page, participantListPage, KitTypeEnum.SALIVA);
        })
    }
});


async function findValidParticipant(page: Page, participantListPage: ParticipantListPage, kitType: KitTypeEnum): Promise<Locator> {
    //Add the necessary columns needed to check to see if a valid participant exists

    //Do the relevant filtering to find which of the available participants fit the criteria for this test file

    //Pick the first relevant participant that shows up

    //Handle what should happen if no relevant participants can be found - otherwise, return the found participant
}
