import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from 'pages/dsm/home-page';
import { StudyNavEnum } from 'lib/component/dsm/navigation/enums/studyNav-enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { StudyEnum } from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';

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

  test('search by Short ID in Singular study @dsm', async ({ page }) => {
    await welcomePage.selectStudy(StudyEnum.SINGULAR);

    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle('Singular');

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    const participantListTable = participantListPage.participantListTable;

    await participantListPage.assertPageTitle();

    await participantListPage.waitForReady();

    const shortId = await participantListTable.getParticipantDataAt(0, 'Short ID');

    const searchPanel = participantListPage.filters.searchPanel;

    await searchPanel.open();
    await searchPanel.text('Short ID', { textValue: shortId });
    await searchPanel.search();

    await participantListPage.assertParticipantsCount(1);
  });
});
