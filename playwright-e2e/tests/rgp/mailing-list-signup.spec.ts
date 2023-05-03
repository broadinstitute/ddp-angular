import { expect } from '@playwright/test';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import * as lodash from 'lodash';
import MailingListPage, { COLUMN } from 'pages/dsm/mailing-list-page';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';
import { assertTableHeaders } from 'utils/assertion-helper';
import { getDate, getMailingListDownloadedFileDate, mailingListCreatedDate } from 'utils/date-utils';
import { login } from 'authentication/auth-dsm';
import { Study } from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { SortOrder } from 'lib/component/table';
import { Miscellaneous } from 'lib/component/dsm/navigation/enums/miscellaneousNav.enum';
import { generateEmailAlias } from 'utils/faker-utils';
import { MailListCSV, readMailListCSVFile } from 'utils/file-utils';


const RGP_USER_EMAIL = process.env.RGP_USER_EMAIL as string;
const newEmail = generateEmailAlias(RGP_USER_EMAIL);

test.describe.serial('When an interested participant does NOT meet participation requirements', () => {
  test('Interested participant can sign up for mailing list @visual @enrollment @rgp', async ({ page }) => {
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

    const paragraphLocator = page.locator('.Paragraph');
    await expect(paragraphLocator).toHaveCount(3);

    expect(await paragraphLocator.nth(0).screenshot()).toMatchSnapshot('requirement-header-message.png');
    expect(await paragraphLocator.nth(1).screenshot()).toMatchSnapshot('join-mailing-list-message.png');
    expect(await paragraphLocator.nth(2).screenshot()).toMatchSnapshot('delete-info-request-message.png');

    expect(await page.locator('.list').screenshot()).toMatchSnapshot('requirement-list.png');

    const emailInput = page.locator('input[type="email"]:visible');
    await emailInput.fill(newEmail);
    await page.locator('button[type="submit"]:has-text("Join Mailing List")').click();
  });

  test('Email can be found in DSM Mailing List @visual @enrollment @rgp',
    async ({ page }) => {
      await login(page);

      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(Study.RGP);

      const navigation = new Navigation(page);
      const [mailListResponse] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/ui/mailingList/RGP') && response.status() === 200),
        navigation.selectMiscellaneous(Miscellaneous.MAILING_LIST)
      ]);
      const respJson: MailListCSV[] = JSON.parse(await mailListResponse.text());
      expect(respJson.length).toBeGreaterThan(1); // response should contains at least one emails

      const mailingListPage = new MailingListPage(page, APP.RGP);
      await mailingListPage.waitForReady();

      // Downloading mailing list
      const download = await mailingListPage.download();
      const actualFileName = download.suggestedFilename();
      const expectedFileName = `MailingList ${APP.RGP} ${getMailingListDownloadedFileDate()}.csv`;
      expect(actualFileName).toBe(expectedFileName);

      const file = await download.path();
      if (file == null) {
        throw Error('Mailing list file path not found');
      }
      const rows = await readMailListCSVFile(file)
      .catch((error) => {
        console.error(error);
        throw error;
      });

      // Verify csv file: Assert every user from API response body can also be found inside the downloaded csv file
      lodash.forEach(respJson, item => {
        const dateInJson = getDate(new Date(parseInt(item.dateCreated) * 1000)); // Transform to dd/mm/yyyy
        const emailInJson = item.email;
        const finding = lodash.filter(rows, row => row.email === emailInJson && row.dateCreated === dateInJson);
        expect(finding.length,
          `Matching record for email: "${emailInJson}" and dateCreated: "${dateInJson}" in downloaded csv file.`)
        .toEqual(1);
      });

      // Verify Mailing List table: Assert email of new RGP participant can be found inside the Mailing List table
      const table = await mailingListPage.getMailingListTable();
      const orderedHeaders = [COLUMN.EMAIL, COLUMN.DATE_SIGNED_UP];
      const actualHeaders = await table.getHeaderNames();
      assertTableHeaders(actualHeaders, orderedHeaders);


      await table.sort(COLUMN.DATE_SIGNED_UP, SortOrder.DESC);
      await expect(await table.findCell(COLUMN.EMAIL, newEmail, COLUMN.EMAIL)).toBeTruthy();
      const tableCell = await table.findCell(COLUMN.EMAIL, newEmail, COLUMN.DATE_SIGNED_UP, { exactMatch: false });
      if (tableCell == null) {
        throw Error(`Did not find row which contains Email: ${newEmail} in Mailing List table`);
      }
      const dateInTableCell = new Date(await tableCell.innerText());

      // Retrieve new RGP user Date Signed Up from API response body
      const user: MailListCSV[] = lodash.filter(respJson, row => row.email === newEmail);
      const newEmailCreateDate = new Date(parseInt(user[0].dateCreated) * 1000);
      expect(mailingListCreatedDate(dateInTableCell), `Matching new RGP user "Email" and "Date signed up"`)
      .toEqual(mailingListCreatedDate(newEmailCreateDate));
    });
});
