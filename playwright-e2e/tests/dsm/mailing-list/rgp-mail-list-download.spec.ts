import { expect } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import { MiscellaneousEnum } from 'lib/component/dsm/navigation/enums/miscellaneousNav-enum';
import { StudyEnum } from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { SortOrder } from 'lib/component/table';
import * as lodash from 'lodash';
import MailingListPage, { COLUMN } from 'pages/dsm/mailing-list-page';
import { WelcomePage } from 'pages/dsm/welcome-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
import { assertTableHeaders } from 'utils/assertion-helper';
import { getDate, getMailingListDownloadedFileDate, mailingListCreatedDate } from 'utils/date-utils';
import { generateEmailAlias } from 'utils/faker-utils';
import { MailListCSV, readMailListCSVFile } from 'utils/file-utils';


const RGP_USER_EMAIL = process.env.RGP_USER_EMAIL as string;
const newEmail = generateEmailAlias(RGP_USER_EMAIL);

test.describe.serial('When an interested participant does NOT meet participation requirements', () => {
  test('Join Mail List @visual @dsm @rgp', async ({ page }) => {
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

  test('DSM download Mail List @visual @dsm @rgp', async ({ page }) => {
    await login(page);

    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(StudyEnum.RGP);

    const navigation = new Navigation(page);
    const [mailListResponse] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/ui/mailingList/RGP') && response.status() === 200),
      navigation.selectMiscellaneous(MiscellaneousEnum.MAILING_LIST)
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
    const rows = await readMailListCSVFile(file)
      .catch((error) => {
        console.error(error);
        throw error;
    });

    // Verify CSV file: Assert every user from API response body can also be found inside downloaded csv file
    lodash.forEach(respJson, item => {
      const dateInJson = getDate(new Date(parseInt(item.dateCreated) * 1000)); // Transform to dd/mm/yyyy
      const emailInJson = item.email;
      const finding = lodash.filter(rows, row => row.email === emailInJson && row.dateCreated === dateInJson);
      expect(finding.length,
        `Matching record for email: "${emailInJson}" and dateCreated: "${dateInJson}" in downloaded csv file.`)
      .toEqual(1);
    });

    // Verify Mailing List table

    // Verify headers
    const table = await mailingListPage.getMailingListTable();
    const orderedHeaders = [COLUMN.EMAIL, COLUMN.DATE];
    const actualHeaders = await table.getHeaderNames();
    assertTableHeaders(actualHeaders, orderedHeaders);

    // Verify new RGP participant email is found inside table
    await table.sort(COLUMN.DATE, SortOrder.DESC); // Sorting to get newest record to display first
    let tCell = await table.findCell(COLUMN.EMAIL, newEmail, COLUMN.EMAIL);
    await expect(tCell, `Matching email ${newEmail} in Mailing List table`).toBeTruthy();

    // Verify date signed up is found inside table
    tCell = await table.findCell(COLUMN.EMAIL, newEmail, COLUMN.DATE, { exactMatch: false });
    await expect(tCell, `Find column ${COLUMN.DATE} in Mailing List table`).toBeTruthy();

    // Retrieve new RGP user Date Signed Up from API response body, compare with what's displayed in table
    const user: MailListCSV[] = lodash.filter(respJson, row => row.email === newEmail);
    const dateInJson = mailingListCreatedDate(new Date(parseInt(user[0].dateCreated) * 1000));
    const dateInTCell = mailingListCreatedDate(new Date(await tCell!.innerText()));
    expect(dateInTCell, `Matching date ${dateInTCell}`).toEqual(dateInJson);
  });
});
