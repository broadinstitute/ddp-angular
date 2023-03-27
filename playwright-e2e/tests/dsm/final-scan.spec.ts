import {test} from '@playwright/test';
import {WelcomePage} from 'pages/dsm/welcome-page';
import HomePage from 'pages/dsm/home-page';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import CohortTag from 'lib/component/dsm/cohort-tag';
import {Study} from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import {login} from 'authentication/auth-dsm';
import KitsWithoutLabelPage from 'pages/dsm/kitsWithoutLabel-page';
import {SamplesNav} from 'lib/component/dsm/navigation/enums/samplesNav';
import {Kit} from 'lib/component/dsm/kitType/kit-enum';
import ParticipantListPage from 'pages/dsm/participantList-page';
import {StudyNav} from 'lib/component/dsm/navigation/enums/studyNav.enum';
import crypto from 'crypto';
import InitialScanPage from 'pages/dsm/initialScan-page';
import FinalScanPage from 'pages/dsm/finalScan-page';

test.describe('Final Scan Test', () => {
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
    await welcomePage.selectStudy(Study.PANCAN);
    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle(Study.PANCAN);
  });

  test('Should display success message under scan pairs', async ({page}) => {
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
    const participantListTable = participantListPage.participantListTable;
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    const searchPanel = participantListPage.filters.searchPanel;

    await customizeViewPanel.open();
    await customizeViewPanel.deselectColumns('Participant Columns', ['Status']);
    await customizeViewPanel.selectColumns('Sample Columns', ['Status']);

    await searchPanel.open();
    await searchPanel.radioBtn('Status', {radioButtonValue: 'Waiting on GP'});
    await searchPanel.search();
    await participantListPage.waitForReady();

    const participantShortId = await participantListTable.getParticipantDataAt(1, 'Short ID');

    const kitsWithoutLabelPage = await navigation.selectFromSamples<KitsWithoutLabelPage>(SamplesNav.KITS_WITHOUT_LABELS);
    await kitsWithoutLabelPage.assertTitle();
    await kitsWithoutLabelPage.selectKitType(Kit.SALIVA);
    const shippingId = await kitsWithoutLabelPage.shippingId(participantShortId);

    const initialScanPage = await navigation.selectFromSamples<InitialScanPage>(SamplesNav.INITIAL_SCAN);
    await initialScanPage.assertTitle();
    const kitLabel = crypto.randomBytes(14).toString('hex').slice(0, 14);
    await initialScanPage.fillScanPairs([kitLabel, participantShortId]);
    await initialScanPage.save();

    const finalScanPage = await navigation.selectFromSamples<FinalScanPage>(SamplesNav.FINAL_SCAN);
    await finalScanPage.assertTitle();
    await finalScanPage.fillScanPairs([kitLabel, shippingId]);
    await finalScanPage.save();
  })
})
