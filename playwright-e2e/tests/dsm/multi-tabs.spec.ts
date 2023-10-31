import { test, expect, Page, APIRequestContext } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { OncHistoryInputColumnsEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { studyShortName } from 'utils/test-utils';

const { DSM_USER_EMAIL, DSM_USER_PASSWORD } = process.env;

test('Multiple browser tabs', async ({ browser, request }) => {
  const pancan = StudyEnum.PANCAN;
  const brain = StudyEnum.BRAIN;

  // Create two pages in same browser
  const aContext = await browser.newContext();
  const pancanPage = await aContext.newPage();
  const brainPage = await aContext.newPage();

  // Tab A: Open Participant List page, realm matches expected study PanCan
  const pancanParticipantListPage = await logIntoStudy(pancanPage, request, pancan);
  const pancanParticipantShortId = await findAnyParticipantShortId(pancanParticipantListPage);
  logInfo(`PanCan participant Short ID: ${pancanParticipantShortId}`);

  // Tab B: Open Participant List page, realm matches expected study Brain
  const brainParticipantListPage = await logIntoStudy(brainPage, request, brain);
  const brainParticipantShortId = await findAnyParticipantShortId(brainParticipantListPage);
  logInfo(`Brain participant Short ID: ${brainParticipantShortId}`);

  // Add new Onc History for study PanCan in tab A
  await addOncHistory(pancanPage, pancanParticipantListPage, pancan);

  // Add new Onc History for study Brain in tab B
  await addOncHistory(brainPage, brainParticipantListPage, brain);
});

async function findAnyParticipantShortId(participantListPage: ParticipantListPage): Promise<string> {
  return await test.step('Search for a participant with Onc history', async () => {
    // Find a participant with existing Onc History
    const oncHistoryRequestStatusColumn = 'Request Status';

    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomViewColumns.ONC_HISTORY, [oncHistoryRequestStatusColumn]);

    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
    await searchPanel.checkboxes(oncHistoryRequestStatusColumn, { checkboxValues: ['Request'] });
    const filterListResponse = await searchPanel.search();

    const participantListTable = participantListPage.participantListTable;
    const rows = await participantListTable.rowsCount;
    expect(rows).toBeGreaterThanOrEqual(1);

    // Find the first participant that has DSM Participant ID. Short ID is random.
    let shortId;
    const responseJson = JSON.parse(await filterListResponse.text());
    for (const i in responseJson.participants) {
      const dsmParticipantId = responseJson.participants[i].esData.dsm.participant?.participantId;
      if (dsmParticipantId !== undefined) {
        shortId = responseJson.participants[i].esData.profile?.hruid;
        break;
      }
    }
    expect(shortId).toBeTruthy();
    logInfo(`Participant Short ID: ${shortId}`);
    return shortId;
  });
}

async function addOncHistory(page: Page, participantListPage: ParticipantListPage, study: StudyEnum): Promise<void> {
  const realm = studyShortName(study).realm;
  await test.step(`Add Onc history for study ${study}`, async () => {
    await page.bringToFront();
    const pancanParticipantListTable = participantListPage.participantListTable;
    const participantPage: ParticipantPage = await pancanParticipantListTable.openParticipantPageAt(0);
    const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
    const oncHistoryTable = oncHistoryTab.table;
    const rowIndex = await oncHistoryTable.getRowsCount() - 1;
    const cell = await oncHistoryTable.checkColumnAndCellValidity(OncHistoryInputColumnsEnum.DATE_OF_PX, rowIndex);
    const resp = await oncHistoryTable.fillDate(cell, {
      date: {
        yyyy: new Date().getFullYear(),
        month: new Date().getMonth(),
        dayOfMonth: new Date().getDate()
      }
    });
    // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TYPE_OF_PX, { value: generateAlphaNumeric(6) }, rowIndex);
    // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.LOCATION_OF_PX, { value: 'Pancreatic' }, rowIndex);
    // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: 'm', lookupSelectIndex: 1 }, rowIndex);
    // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, { select: OncHistorySelectRequestEnum.REQUEST });
    expect(resp).toBeTruthy();
    logInfo(`${study} request payload:\n${JSON.stringify(resp?.request().postDataJSON())}`);
    expect(resp?.request().postDataJSON()).toHaveProperty('realm', realm);
    await oncHistoryTable.deleteRowAt(rowIndex); // clean up
  });
}

async function logIntoStudy(page: Page, request: APIRequestContext, study: StudyEnum): Promise<ParticipantListPage> {
  return await test.step(`Log into study ${study}`, async () => {
    await page.bringToFront();
    await login(page, { email: DSM_USER_EMAIL, password: DSM_USER_PASSWORD });
    await new WelcomePage(page).selectStudy(study);
    const participantListPage = await new Navigation(page, request).selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const [pancanRealm] = await participantListPage.participantListTable.getTextAt(0, 'DDP');
    expect(pancanRealm).toStrictEqual(studyShortName(study).shortName);
    return participantListPage;
  });
}
