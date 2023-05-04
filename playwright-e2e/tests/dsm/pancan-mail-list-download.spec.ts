import { expect } from '@playwright/test';
import { APP } from 'data/constants';
import { test } from 'fixtures/pancan-fixture';
import { login } from 'authentication/auth-dsm';
import { Miscellaneous } from 'lib/component/dsm/navigation/enums/miscellaneousNav.enum';
import { Study } from 'lib/component/dsm/navigation/enums/selectStudyNav.enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import Modal from 'lib/component/modal';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { generateEmailAlias, generateUserName } from 'utils/faker-utils';
import lodash from 'lodash';

import HomePage from 'pages/pancan/home-page';

const RGP_USER_EMAIL = process.env.PANCAN_USER_EMAIL as string;
const newEmail = generateEmailAlias(RGP_USER_EMAIL);
const firstName = generateUserName('PANCAN');
const lastName = generateUserName('PANCAN');

test.describe.serial('Join Pancan Mailing List', () => {
  test('Join Mail List @visual @pancan', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.waitForReady();
    await homePage.fillInStayInformedModal(firstName, lastName, newEmail);

    // Take screenshot
    await homePage.joinMailingListButton.click();
    const modal = new Modal(page);
    await expect(modal.toLocator().locator('h1.Modal-title')).toHaveText('Stay informed!');
    expect(await modal.toLocator().screenshot()).toMatchSnapshot('stay-informed-modal.png');
  });

  test('DSM download Mail List @visual @dsm @rgp', async ({ page }) => {
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
