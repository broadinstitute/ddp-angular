import {test} from '@playwright/test';
import {WelcomePage} from 'pages/dsm/welcome-page';
import HomePage from 'pages/dsm/home-page';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import CohortTag from 'lib/component/dsm/cohort-tag';
import {StudyEnum} from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';
import {login} from 'authentication/auth-dsm';
import ParticipantListPage from "pages/dsm/participantList-page";
import {StudyNavEnum} from "lib/component/dsm/navigation/enums/studyNav-enum";
import ParticipantPage from "pages/dsm/participant-page/participant-page";
import {KitUploadInfo} from "models/dsm/kitUpload-model";
import {TabEnum} from "lib/component/dsm/tabs/enums/tab-enum";
import SampleInformationTab from "../../lib/component/dsm/tabs/sampleInformationTab";
import {KitTypeEnum} from "../../lib/component/dsm/kitType/enums/kitType-enum";


/**
 * @TODO
 * 1. handle sampleInfo case when there are multiple samples
 * 2. sent page
 * 3. received page
 * 4. make more assertions
 */
test.describe.only('Final Scan Test', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;
  let cohortTag: CohortTag;

  test.beforeEach(async ({page}) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
    cohortTag = new CohortTag(page);
  });

  test.beforeEach(async ({page}) => {
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

    const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
    const sampleInfo = await participantPage.clickTab<SampleInformationTab>(TabEnum.SAMPLE_INFORMATION);

    console.log(await sampleInfo.getStatus(KitTypeEnum.SALIVA))
    console.log(await sampleInfo.getKitUploadType(KitTypeEnum.SALIVA))
    console.log(await sampleInfo.getNormalCollaboratorSampleId(KitTypeEnum.SALIVA))
    console.log(await sampleInfo.getMFBarcode(KitTypeEnum.SALIVA))
    console.log(await sampleInfo.getSent(KitTypeEnum.SALIVA))
    console.log(await sampleInfo.getReceived(KitTypeEnum.SALIVA))
    console.log(await sampleInfo.getDeactivated(KitTypeEnum.SALIVA))

  })
})
