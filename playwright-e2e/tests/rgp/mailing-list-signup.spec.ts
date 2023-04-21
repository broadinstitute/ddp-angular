import {expect, Page} from '@playwright/test';
import {test} from 'fixtures/rgp-fixture';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
import TellUsYourStoryPage, {WHO} from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';
import {generateEmailAlias} from 'utils/faker-utils';
import {login} from 'authentication/auth-dsm';
import {Study} from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import {WelcomePage} from 'pages/dsm/welcome-page';
import {Navigation} from 'lib/component/dsm/navigation/navigation';
import Table, {SortOrder} from 'lib/component/table';
import {Miscellaneous} from 'lib/component/dsm/navigation/enums/miscellaneousNav.enum';

const RGP_USER_EMAIL = process.env.RGP_USER_EMAIL as string;
const emailAlias = generateEmailAlias(RGP_USER_EMAIL);

test.describe.serial('When an interested participant does NOT meet participation requirements', () => {
  const assertProgressActiveItem = async (page: Page, itemName: string): Promise<void> => {
    const locator = page.locator('li.activity-stepper__step-container button.stepper-btn.stepper-btn--active');
    await expect(locator).toHaveCount(1);
    await expect(locator).toContainText(itemName);
  };

  test('Interested participant can sign up for mailing list @visual @enrollment @rgp',
    async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickGetStarted();

    const howItWorks = new HowItWorksPage(page);
    await howItWorks.startApplication();

    const tellUsYourStoryPage = new TellUsYourStoryPage(page);
    await tellUsYourStoryPage.waitForReady();

    // Check all but one checkbox (i.e. don't check all the boxes so that user fails to meet requirements)
    await tellUsYourStoryPage.who().check(WHO.UnderstandEnglishOrSpanish);
    await tellUsYourStoryPage.who().check(WHO.LivesInUS);
    await tellUsYourStoryPage.who().check(WHO.HasRareGeneticallyUndiagnosedCondition);
    await tellUsYourStoryPage.submit();

    await expect(page.locator('text="Thank you for your interest in joining the Rare Genomes Project"')).toBeVisible();

    //todo: should we have a generic function that takes the selector and snapshot-to-match as parameters?
    expect(await page.locator('p.Paragraph:nth-of-type(1)').screenshot()).toMatchSnapshot('requirement-header-message.png');
    expect(await page.locator('p.Paragraph:nth-of-type(2)').screenshot()).toMatchSnapshot('join-mailing-list-message.png');
    expect(await page.locator('p.Paragraph:nth-of-type(3)').screenshot()).toMatchSnapshot('delete-info-request-message.png');

    expect(await page.locator('.list').screenshot()).toMatchSnapshot('requirement-list.png');

    const emailInput = page.locator('input[type="email"]:visible');
    await emailInput.fill(emailAlias);
    await page.locator('button[type="submit"]:has-text("Join Mailing List")').click();
  });

  test('The email signed up can be found in DSM @visual @enrollment @rgp',
    async ({ page }) => {
      const TABLE_COLUMN_EMAIL = 'Email'
      const TABLE_COLUMN_DATE_SIGNED_UP = 'Date signed up';
      await login(page);

      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(Study.RGP);

      const navigation = new Navigation(page);
      await navigation.selectMiscellaneous(Miscellaneous.MAILING_LIST);

      const table = new Table(page, { cssClassAttribute: '.table'});
      await table.waitForReady()
      await table.sort(TABLE_COLUMN_DATE_SIGNED_UP, SortOrder.DESC);

      await expect(await table.findCell(TABLE_COLUMN_EMAIL, emailAlias, TABLE_COLUMN_EMAIL)).toBeTruthy();
  });
});