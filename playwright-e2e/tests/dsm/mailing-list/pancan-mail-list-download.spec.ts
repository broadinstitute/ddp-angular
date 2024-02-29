import { expect } from '@playwright/test';
import { APP } from 'data/constants';
import { test } from 'fixtures/pancan-fixture';
import { login } from 'authentication/auth-dsm';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import {MiscellaneousEnum} from 'dsm/component/navigation/enums/miscellaneousNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import Modal from 'dss/component/modal';
import { SortOrder } from 'dss/component/table';
import MailingListPage from 'dsm/pages/mailing-list-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { assertTableHeaders } from 'utils/assertion-helper';
import { dateFormat, getMailingListDownloadedFileDate, mailingListCreatedDate } from 'utils/date-utils';
import { generateEmailAlias, generateUserName } from 'utils/faker-utils';
import lodash from 'lodash';
import HomePage from 'dss/pages/pancan/home-page';
import { MailListCSV, readMailListCSVFile } from 'utils/file-utils';
import { logInfo } from 'utils/log-utils';
import { Label } from 'dsm/enums';


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
    await expect(modal.toLocator()).toHaveScreenshot('stay-informed-modal.png');
  });

  test('DSM download Mail List @dsm @pancan', async ({ page, request }) => {
    await login(page);

    const welcomePage = new WelcomePage(page);
    const navigation = new Navigation(page, request);
    await welcomePage.selectStudy(StudyEnum.PANCAN);
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
    const csvRows = await readMailListCSVFile(file)
    .catch((error) => {
      console.error(error);
      throw error;
    });

    // Verify CSV file: Assert every user from API response body can also be found inside downloaded csv file
    lodash.forEach(respJson, item => {
      const dateInJson = dateFormat().format(new Date(parseInt(item.dateCreated) * 1000)); // Transform to dd/mm/yyyy
      const emailInJson = item.email;
      logInfo(`JSON date: ${dateInJson} and email: ${emailInJson}`);
      const finding = lodash.filter(csvRows, row => row.email === emailInJson && row.dateCreated === dateInJson);
      expect.soft(finding.length,
        `Fail to find match for email: "${emailInJson}" and dateCreated: "${dateInJson}" in downloaded csv file.`)
      .toBe(1);
    });

    // Verify Mailing List table

    // Verify headers
    const table = await mailingListPage.getMailingListTable();
    const orderedHeaders = [Label.FIRST_NAME, Label.LAST_NAME, 'Email', Label.DATE_SIGNED_UP];
    const actualHeaders: string[] = await table.getHeaderNames();
    assertTableHeaders(actualHeaders, orderedHeaders);

    // Verify new Pancan participant email is found inside table.
    // To handle any delay, retry blocks of code until email is found successfully.
    await expect(async () => {
      await mailingListPage.reload(); // page reload to trigger new request
      await table.sort(Label.DATE_SIGNED_UP, SortOrder.DESC); // Sorting to get newest record to display first
      const cell = await table.findCell('Email', newEmail, 'Email');
      expect(cell).toBeTruthy();
    }).toPass({ timeout: 30000 });

    // Verify date signed up is found inside table
    const tCell = await table.findCell('Email', newEmail, Label.DATE_SIGNED_UP, { exactMatch: false });
    expect(tCell, `Find column ${Label.DATE_SIGNED_UP} in Mailing List table`).toBeTruthy();

    // Retrieve new Pancan user Date Signed Up from API response body, compare with what's displayed in table
    const user: MailListCSV[] = lodash.filter(respJson, row => row.email === newEmail);
    const dateInJson = mailingListCreatedDate(new Date(parseInt(user[0].dateCreated) * 1000));
    const dateInTCell = mailingListCreatedDate(new Date(await tCell!.innerText()));
    expect(dateInTCell, `Matching date ${dateInTCell}`).toEqual(dateInJson);
  });
});
