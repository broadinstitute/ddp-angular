import {test} from '@playwright/test';
import {login} from 'authentication/auth-dsm';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from 'pages/dsm/home-page';
import {StudyNav} from 'lib/component/dsm/navigation/enums/studyNav.enum';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import {WelcomePage} from "pages/dsm/welcome-page";

test.describe('Singular Study in DSM', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;

  test.beforeEach(async ({ page }) => {
    await login(page);
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
  });

  test('search by Short ID in Singular study @dsm @dsm-search', async ({ page }) => {
    await welcomePage.selectStudy('Singular');

    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle('Singular');

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);

    await participantListPage.assertPageTitle();

    await participantListPage.waitForReady();

    const shortId = await participantListPage.getParticipantShortIdAt(0);

    const searchPanel = participantListPage.filters.searchPanel;

    await searchPanel.open();
    await searchPanel.text('Short ID', { textValue: shortId });
    await searchPanel.search();

    await participantListPage.assertParticipantsCount(1);
  });
});
