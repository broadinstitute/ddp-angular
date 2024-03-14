import { test, expect, Page, APIRequestContext } from '@playwright/test';
import { login } from 'authentication/auth-dsm';
import { Label, Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { logInfo } from 'utils/log-utils';
import { studyShortName } from 'utils/test-utils';

const { DSM_USER_EMAIL, DSM_USER_PASSWORD } = process.env;

test('Multiple browser tabs @dsm', async ({ browser, request }) => {
  const pancan = StudyName.PANCAN;
  const angio = StudyName.ANGIO;

  // Create two pages in same browser
  const browserContext = await browser.newContext();

  // Tab A: Open Participant List page, realm matches expected study PanCan
  const pancanPage = await browserContext.newPage();
  const pancanParticipantListPage = await logIntoStudy(pancanPage, request, pancan);
  const pancanParticipantShortId = await pancanParticipantListPage.findParticipantWithTab({ tab: Tab.ONC_HISTORY });
  logInfo(`PanCan participant Short ID: ${pancanParticipantShortId}`);

  // Tab B: Open Participant List page, realm matches expected study angio
  const angioPage = await browserContext.newPage();
  const angioParticipantListPage = await logIntoStudy(angioPage, request, angio);
  const angioParticipantShortId = await angioParticipantListPage.findParticipantWithTab({ tab: Tab.ONC_HISTORY });
  logInfo(`angio participant Short ID: ${angioParticipantShortId}`);

  // Add new Onc History for study PanCan in tab A
  await addOncHistory(pancanPage, pancanParticipantShortId, pancanParticipantListPage, pancan);

  // Add new Onc History for study angio in tab B
  await addOncHistory(angioPage, angioParticipantShortId, angioParticipantListPage, angio);
});

async function addOncHistory(page: Page, shortID: string, participantListPage: ParticipantListPage, study: StudyName): Promise<void> {
  const realm = studyShortName(study).realm;
  await test.step(`Add Onc history for study ${study}`, async () => {
    await page.bringToFront();
    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
    await searchPanel.search();

    const participantListTable = participantListPage.participantListTable;
    const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
    const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
    const oncHistoryTable = oncHistoryTab.table;
    const rowIndex = await oncHistoryTable.getRowsCount() - 1;
    expect(rowIndex).toBeGreaterThanOrEqual(0);
    const cell = await oncHistoryTable.checkColumnAndCellValidity(Label.DATE_OF_PX, rowIndex);
    const resp = await oncHistoryTable.fillDate(cell, {
      date: {
        yyyy: new Date().getFullYear(),
        month: new Date().getMonth(),
        dayOfMonth: new Date().getDate()
      }
    });
    expect(resp).toBeTruthy();
    logInfo(`${study} request payload:\n${JSON.stringify(resp?.request().postDataJSON())}`);
    const respData = resp?.request().postDataJSON();
    expect(respData).toHaveProperty('realm', realm);
    await oncHistoryTable.deleteRowAt(rowIndex); // clean up
  });
}

async function logIntoStudy(page: Page, request: APIRequestContext, study: StudyName): Promise<ParticipantListPage> {
  return await test.step(`Log into study ${study}`, async () => {
    await page.bringToFront();
    await login(page, { email: DSM_USER_EMAIL, password: DSM_USER_PASSWORD });
    await new WelcomePage(page).selectStudy(study);
    const participantListPage = await new Navigation(page, request).selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const [pancanRealm] = await participantListPage.participantListTable.getTextAt(0, Label.DDP);
    expect(pancanRealm).toStrictEqual(studyShortName(study).shortName);
    return participantListPage;
  });
}
