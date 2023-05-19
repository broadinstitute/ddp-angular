import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { AdditionalFilter } from 'lib/component/dsm/filters/sections/search/search-enums';
import Table, { SortOrder } from 'lib/component/table';
import { MainInfoEnum } from 'pages/dsm/participant-page/enums/main-info-enum';
import ParticipantListPage from 'pages/dsm/participantList-page';
import HomePage from 'pages/dsm/home-page';
import { StudyNavEnum } from 'lib/component/dsm/navigation/enums/studyNav-enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { StudyEnum } from 'lib/component/dsm/navigation/enums/selectStudyNav-enum';
import { dateFormat, getDate, subtractDaysFromToday } from 'utils/date-utils';

test.describe('Participants list search and filter', () => {
  let welcomePage: WelcomePage;
  let homePage: HomePage;
  let navigation: Navigation;

  const studies = [StudyEnum.LMS]; //, StudyEnum.OSTEO2];

  test.beforeEach(async ({ page, request }) => {
    welcomePage = new WelcomePage(page);
    homePage = new HomePage(page);
    navigation = new Navigation(page, request);
  });

  for (const study of studies) {
    test.skip(`Search by Short ID in ${study} @dsm @${study}`, async ({ page }) => {
      const participantListPage = await openParticipantListPage(study);
      const participantsTable = participantListPage.participantListTable;

      // Save DDP and Short ID on first row
      const row = 0
      const guid = await participantsTable.getParticipantDataAt(row, 'DDP');
      const shortId = await participantsTable.getParticipantDataAt(row, 'Short ID');

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text('Short ID', { textValue: shortId });
      await searchPanel.search();

      expect(await participantsTable.rowLocator().count(),
        `Participant List page - Displayed participants count is not 1`)
        .toEqual(1);
      expect(guid).toEqual(getStudyName(study));
    });

    test(`Search by Registration Date in ${study} @dsm @${study}`, async ({ page }) => {
      const participantListPage = await openParticipantListPage(study);
      const participantsTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Participant Columns', [MainInfoEnum.REGISTRATION_DATE]);
      await customizeViewPanel.close();

      // Save Registration Date found on random row
      const randomRowIndex = await getRandomRow(participantsTable);
      const registrationDate = await participantsTable.getParticipantDataAt(randomRowIndex, MainInfoEnum.REGISTRATION_DATE);
      const randomDate = getDate(new Date(registrationDate)); // Returns a formatted date mm/dd/yyyy

      // Search filter with exact date
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(MainInfoEnum.REGISTRATION_DATE, { textValue: randomDate }); // search date format is mm/dd/yyyy
      await searchPanel.search();

      let rowCount = await participantsTable.getRowsCount();
      console.log(`Search by Registration Date returns ${rowCount} rows.`);
      expect(rowCount).toBeGreaterThanOrEqual(1);

      // Iterate all rows on display, verify Registration Date matches the search date. Rows on next pages are ignored.
      const headerIndex = await participantsTable.getHeaderIndex(MainInfoEnum.REGISTRATION_DATE);
      for (let i = 0; i < rowCount; i++) {
        // Verify Registration Date
        const cellText = await participantsTable.cell(i, headerIndex).innerText();
        expect(getDate(new Date(cellText))).toEqual(randomDate);
        // Verify DDP value
        const guid = await participantsTable.getParticipantDataAt(i, 'DDP');
        expect(guid).toEqual(getStudyName(study));
        // Verify Status is not empty or null
        const status = await participantsTable.getParticipantDataAt(i, 'Status');
        expect(status).toBeTruthy();
        // Verify First Short ID is not empty or null and length is 6
        const shortId = await participantsTable.getParticipantDataAt(i, 'Short ID');
        expect(shortId).toBeTruthy();
        expect(shortId.length).toEqual(6);
      }

      // Search filter with date range (don't need to open Search panel because it does not close automatically)
      const today = getDate(new Date());
      const fiveDaysAgo = subtractDaysFromToday(5);
      await searchPanel.dates(MainInfoEnum.REGISTRATION_DATE, { additionalFilters: [AdditionalFilter.RANGE], from: fiveDaysAgo, to: today});
      await searchPanel.search();

      rowCount = await participantsTable.getRowsCount();
      console.log(`Search by Registration Date Range returns ${rowCount} rows.`);
      expect(rowCount).toBeGreaterThanOrEqual(1);

      // Use Registration Date column filter to find date range in table
      await participantsTable.sort(MainInfoEnum.REGISTRATION_DATE, SortOrder.DESC);
      let firstRowDate = await participantsTable.cell(0, headerIndex).innerText();
      expect(getDate(new Date(firstRowDate))).toEqual(today);

      await participantsTable.sort(MainInfoEnum.REGISTRATION_DATE, SortOrder.ASC);
      firstRowDate = await participantsTable.cell(0, headerIndex).innerText();
      expect(getDate(new Date(firstRowDate))).toEqual(fiveDaysAgo);

      await page.pause();
    });

    test.skip(`Search by MF Barcode in ${study} @dsm @${study}`, async ({ page }) => {
      const participantListPage = await openParticipantListPage(study);
      const participantsTable = participantListPage.participantListTable;

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Participant Columns', [MainInfoEnum.REGISTRATION_DATE]);
      await customizeViewPanel.close();

      // Save Registration Date found on random row
      const randomRowIndex = await getRandomRow(participantsTable);
      const registrationDate = await participantsTable.getParticipantDataAt(randomRowIndex, MainInfoEnum.REGISTRATION_DATE);
      const randomDate = getDate(new Date(registrationDate)); // Returns a formatted date mm/dd/yyyy

      // Search filter with exact date
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(MainInfoEnum.REGISTRATION_DATE, { textValue: randomDate }); // search date format is mm/dd/yyyy
      await searchPanel.search();

      let rowCount = await participantsTable.getRowsCount();
      console.log(`Search by Registration Date returns ${rowCount} rows.`);
      expect(rowCount).toBeGreaterThanOrEqual(1);

      // Iterate all rows on display, verify Registration Date matches the search date. Rows on next pages are ignored.
      const headerIndex = await participantsTable.getHeaderIndex(MainInfoEnum.REGISTRATION_DATE);
      for (let i = 0; i < rowCount; i++) {
        // Verify Registration Date
        const cellText = await participantsTable.cell(i, headerIndex).innerText();
        expect(getDate(new Date(cellText))).toEqual(randomDate);
        // Verify DDP value
        const guid = await participantsTable.getParticipantDataAt(i, 'DDP');
        expect(guid).toEqual(getStudyName(study));
        // Verify Status is not empty or null
        const status = await participantsTable.getParticipantDataAt(i, 'Status');
        expect(status).toBeTruthy();
        // Verify First Short ID is not empty or null and length is 6
        const shortId = await participantsTable.getParticipantDataAt(i, 'Short ID');
        expect(shortId).toBeTruthy();
        expect(shortId.length).toEqual(6);
      }

      // Search filter with date range (don't need to open Search panel because it does not close automatically)
      const today = getDate(new Date());
      const fiveDaysAgo = subtractDaysFromToday(5);
      await searchPanel.dates(MainInfoEnum.REGISTRATION_DATE, { additionalFilters: [AdditionalFilter.RANGE], from: fiveDaysAgo, to: today});

      rowCount = await participantsTable.getRowsCount();
      console.log(`Search by Registration Date Range returns ${rowCount} rows.`);
      expect(rowCount).toBeGreaterThanOrEqual(1);

      await page.pause();
    });
  }

  async function openParticipantListPage(study: string): Promise<ParticipantListPage> {
    await welcomePage.selectStudy(study);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    await participantListPage.assertPageTitle();

    const participantsTable = participantListPage.participantListTable;
    expect(await participantsTable.rowLocator().count(), `Participant List page - Displayed participants count is wrong.`)
      .toBeGreaterThanOrEqual(1);
    return participantListPage;
  }

  function getStudyName(study: StudyEnum): string | null {
    let studyName: string | null;
    switch (study) {
      case StudyEnum.LMS:
        studyName = 'cmi-lms';
        break;
      case StudyEnum.OSTEO2:
        studyName = 'cmi-osteo';
        break;
      default:
        studyName = null;
        break;
    }
    return studyName;
  }

  async function getRandomRow(table: Table): Promise<number> {
    const rowsCount = await table.getRowsCount();
    return Math.floor(Math.random() * rowsCount);
  }
});
