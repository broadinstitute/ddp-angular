import { test } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import Select from 'lib/widget/select';
import ParticipantListPage, { SearchFieldLabel } from 'pages/dsm/participantList-page';
import HomePage from '../../../pages/dsm/home-page';
import { StudyNav } from '../../../lib/component/dsm/navigation/enums/studyNav.enum';
import { Navigation } from '../../../lib/component/dsm/navigation/navigation';

test.describe('Singular Study in DSM', () => {
  let homePage: HomePage;
  let navigation: Navigation;

  test.beforeEach(async ({ page }) => {
    await login(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page);
  });

  test('search by Short ID in Singular study @dsm @dsm-search', async ({ page }) => {
    await new Select(page, { label: 'Select study' }).selectOption('Singular');

    await homePage.assertWelcomeTitle();
    await homePage.assertSelectedStudyTitle('Singular');

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);

    await participantListPage.assertPageTitle();

    await participantListPage.waitForReady();
    await participantListPage.openSearchButton().click();
    const shortId = await participantListPage.getParticipantShortIdAt(2);
    await participantListPage.search(SearchFieldLabel.ShortId, shortId);

    await participantListPage.assertParticipantsCount(1);
  });
});
