import { Page } from '@playwright/test';
import * as auth from 'authentication/auth-singular';
import { fixtureBase as base } from 'fixtures/fixture-base';
import DashboardPage from 'pages/singular/dashboard-page';
import PreScreeningPage from 'pages/singular/enrollment/pre-screening-page';
import HomePage from 'pages/singular/home/home-page';
import { fillSitePassword } from 'utils/test-utils';

const { SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

// Create a Type for the fixture
type Fixtures = {
  homePage: HomePage;
  dashboardPage: DashboardPage;
};

const launchHomePage = async (page: Page): Promise<HomePage> => {
  const homePage = new HomePage(page);
  await homePage.gotoURLPath('/password');
  await fillSitePassword(page);
  await homePage.waitForReady();
  return homePage;
};

// Use this fixture in Singular tests
const fixture = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = await launchHomePage(page);
    await use(homePage);
  },
  dashboardPage: async ({ page }, use) => {
    const homePage = await launchHomePage(page);
    await homePage.signUp();
    await new PreScreeningPage(page).enterInformationAboutYourself();
    process.env.SINGULAR_USER_EMAIL_ALIAS = await auth.createAccountWithEmailAlias(page, {
      email: SINGULAR_USER_EMAIL,
      password: SINGULAR_USER_PASSWORD
    });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForReady();
    await use(dashboardPage);
  }
});

export const test = fixture;
