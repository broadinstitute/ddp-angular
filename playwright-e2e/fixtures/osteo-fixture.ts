import { fixtureBase as base } from 'fixtures/fixture-base';
import OsteoHomePage from 'pages/osteo/home/home-page';
import { fillSitePassword } from 'utils/test-utils';

type Fixtures = {
  homePage: OsteoHomePage;
};

// Use this fixture in Osteo test
const fixture = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new OsteoHomePage(page);
    await homePage.gotoURLPath(`/password`);
    await fillSitePassword(page);
    await homePage.waitForReady();
    await use(homePage);
  }
});

export const test = fixture;
