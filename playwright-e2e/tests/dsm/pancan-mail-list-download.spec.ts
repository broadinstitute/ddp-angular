import { expect } from '@playwright/test';
import { APP } from 'data/constants';
import { test } from 'fixtures/pancan-fixture';
import { login } from 'authentication/auth-dsm';
import {StudyEnum} from "lib/component/dsm/navigation/enums/selectStudyNav-enum";
import {MiscellaneousEnum} from "lib/component/dsm/navigation/enums/miscellaneousNav-enum";
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import Modal from 'lib/component/modal';
import { SortOrder } from 'lib/component/table';
import MailingListPage, { COLUMN } from 'pages/dsm/mailing-list-page';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { assertTableHeaders } from 'utils/assertion-helper';
import { getDate, getMailingListDownloadedFileDate, mailingListCreatedDate } from 'utils/date-utils';
import { generateEmailAlias, generateUserName } from 'utils/faker-utils';
import lodash from 'lodash';

import HomePage from 'pages/pancan/home-page';
import { MailListCSV, readMailListCSVFile } from 'utils/file-utils';


const PANCAN_USER_EMAIL = process.env.PANCAN_USER_EMAIL as string;
const newEmail = generateEmailAlias(PANCAN_USER_EMAIL);
const firstName = generateUserName('PANCAN');
const lastName = generateUserName('PANCAN');

test.describe.serial('Join Pancan Mailing List', () => {
  test('Join Mail List @dss @visual @pancan', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.waitForReady();
    await homePage.fillInStayInformedModal(firstName, lastName, newEmail);

    // Take screenshot
    await homePage.joinMailingListButton.click();
    const modal = new Modal(page);
    await expect(modal.toLocator().locator('h1.Modal-title')).toHaveText('Stay informed!');
    expect(await modal.toLocator().screenshot()).toMatchSnapshot('stay-informed-modal.png');
  });

  test('DSM download Mail List @dsm @pancan', async ({ page, request }) => {
    await login(page);

    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(StudyEnum.PANCAN);

    const navigation = new Navigation(page, request);
    const [mailListResponse] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/ui/mailingList/PanCan') && response.status() === 200),
      navigation.selectMiscellaneous(MiscellaneousEnum.MAILING_LIST)
    ]);
    const respJson: MailListCSV[] = JSON.parse(await mailListResponse.text());
    expect(respJson.length).toBeGreaterThan(1); // response should contains at least one emails

    const mailingListPage = new MailingListPage(page, APP.PANCAN);
    await mailingListPage.waitForReady();

    // Downloading mailing list
    const download = await mailingListPage.download();
    const actualFileName = download.suggestedFilename();
    const expectedFileName = `MailingList ${APP.PANCAN} ${getMailingListDownloadedFileDate()}.csv`;
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
    const orderedHeaders = [COLUMN.FIRST_NAME, COLUMN.LAST_NAME, COLUMN.EMAIL, COLUMN.DATE];
    const actualHeaders: string[] = await table.getHeaderNames();
    assertTableHeaders(actualHeaders, orderedHeaders);

    // Verify new Pancan participant email is found inside table.
    // To handle any delay, retry blocks of code until email is found successfully.
    await expect(async () => {
      await table.sort(COLUMN.DATE, SortOrder.DESC); // Sorting to get newest record to display first
      const cell = await table.findCell(COLUMN.EMAIL, newEmail, COLUMN.EMAIL);
      await expect(cell, `Matching email ${newEmail} in Mailing List table`).toBeTruthy();
    }).toPass();

    // Verify date signed up is found inside table
    const tCell = await table.findCell(COLUMN.EMAIL, newEmail, COLUMN.DATE, { exactMatch: false });
    await expect(tCell, `Find column ${COLUMN.DATE} in Mailing List table`).toBeTruthy();

    // Retrieve new Pancan user Date Signed Up from API response body, compare with what's displayed in table
    const user: MailListCSV[] = lodash.filter(respJson, row => row.email === newEmail);
    const dateInJson = mailingListCreatedDate(new Date(parseInt(user[0].dateCreated) * 1000));
    const dateInTCell = mailingListCreatedDate(new Date(await tCell!.innerText()));
    expect(dateInTCell, `Matching date ${dateInTCell}`).toEqual(dateInJson);
  });
});
