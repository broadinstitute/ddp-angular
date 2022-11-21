import { fixtureBase as base } from 'fixtures/fixture-base';
import SingularHomePage from 'pages/singular/home/home-page';
import { fillSitePassword } from 'utils/test-utils';

// Create a Type for the fixture
type Fixtures = {
  homePage: SingularHomePage;
};

// Use this fixture in Singular tests
const fixture = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new SingularHomePage(page);
    await homePage.gotoURLPath('/password');
    await fillSitePassword(page);
    await homePage.waitForReady();
    await use(homePage);
  }
});

export const test = fixture;
