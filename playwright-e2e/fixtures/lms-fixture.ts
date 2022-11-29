import { fixtureBase as base } from 'fixtures/fixture-base';
import LmsHomePage from 'pages/lms/home/home-page';
import { fillSitePassword } from 'utils/test-utils';

type Fixtures = {
  homePage: LmsHomePage;
};

// Use this fixture in LMS test
const fixture = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new LmsHomePage(page);
    await homePage.gotoURLPath(`/password`);
    await fillSitePassword(page);
    await homePage.waitForReady();
    await use(homePage);
  }
});

export const test = fixture;
