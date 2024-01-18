import { Page, expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import MedicalRecordsTab from 'dsm/pages/medical-records/medical-records-tab';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import CohortTag from 'dsm/component/cohort-tag';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import SearchPage, { SearchByField } from 'dsm/pages/samples/search-page';
import { Navigation } from 'dsm/component/navigation/navigation';
import { SortOrder } from 'dss/component/table';
import { WelcomePage } from 'dsm/pages/welcome-page';

const { DSM_BASE_URL } = process.env;

/**
  Run on Test env only!
  Participant Short ID is hard-coded. Participant data is expected to be unchanged.
*/

test.describe.serial('Osteo1 Participant', () => {
  test.skip(DSM_BASE_URL === undefined || (DSM_BASE_URL as string).indexOf('test') === -1);

  const shortID = 'PVAVGT';
  const osteo1 = StudyEnum.OSTEO;

  test(`Should find by Cohort Tag`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, osteo1, request);

    const tagNameColumn = 'Cohort Tag Name';
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomViewColumns.COHORT_TAGS, [tagNameColumn]);

    const searchPanel = participantListPage.filters.searchPanel;
    const participantListTable = participantListPage.participantListTable;

    // Should not find any Osteo2 participant when search by Osteo2 Cohort tag: "OS PE-CGS"
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text(tagNameColumn, { additionalFilters: [AdditionalFilter.EXACT_MATCH], textValue: 'OS PE-CGS' });
    await searchPanel.search();
    expect(await participantListTable.numOfParticipants()).toStrictEqual(0);

    // Should find participant when search by Osteo1 Cohort tag: "OS"
    await searchPanel.open();
    await searchPanel.text('Short ID', { textValue: shortID });
    await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
    await searchPanel.text(tagNameColumn, { additionalFilters: [AdditionalFilter.EXACT_MATCH], textValue: 'OS' });
    await searchPanel.search();
    expect(await participantListTable.numOfParticipants()).toStrictEqual(1);
  });

  test(`Should match expected data in Participant page`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, osteo1, request);
    await participantListPage.filterListByShortId(shortID);
    await participantListPage.waitForReady();

    // Open participant page
    const participantPage = await participantListPage.participantListTable.openParticipantPageAt(0);

    await test.step('Verify data', async () => {
      expect(await participantPage.getStatus()).toStrictEqual('Enrolled');
      expect(await participantPage.getRegistrationDate()).toStrictEqual('Feb 5, 2020, 5:36:27 PM');
      expect(await participantPage.getShortId()).toStrictEqual(shortID);
      expect(await participantPage.getGuid()).toStrictEqual('NSAVPY9ERWUFBMWJY3GY');

      const ptLocator = page.locator('table.table.table-condensed');
      await expect(ptLocator).toHaveScreenshot('participant-data.png',
        { mask: [ptLocator.locator('app-cohort-tag mat-form-field')] });

      // Check visible tabs
      const expectedTabs = ['Survey Data', 'Medical Records', 'Onc History', 'First Medical Record Abstraction'];

      const tabs = await page.locator('tabset a[role="tab"]').allInnerTexts();
      expect(tabs).toStrictEqual(expectedTabs);

      // Check Survey Data tab data
      const surveyTabLocator = page.locator('tab[heading="Survey Data"][role="tabpanel"] > div');
      await expect(surveyTabLocator).toHaveScreenshot('survey-data-tab-collapsed-view.png');

      // Expand Prequalifier Survey and compare screenshot
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(0).click(); // expand click
      await expect(surveyTabLocator.locator('.mat-expansion-panel-body:visible').nth(0)).toHaveScreenshot('prequalifier-survey-expanded-view.png');
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(0).click(); // collapse click

      // Expand Medical Release form and compare screenshot
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(2).click(); // expand click
      await expect(surveyTabLocator.locator('.mat-expansion-panel-body:visible').nth(0)).toHaveScreenshot('medical-release-form-expanded-view.png');
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(2).click(); // collapse click

      // Compare Medical Records screenshot
      const medicalRecordsTab = await participantPage.clickTab<MedicalRecordsTab>(TabEnum.MEDICAL_RECORD);
      const medicalRecordTable = medicalRecordsTab.table;
      await expect(medicalRecordTable.tableLocator()).toHaveScreenshot('medical-records-view.png');

      // Compare Onc History screenshot
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      await expect(oncHistoryTable.tableLocator()).toHaveScreenshot('onc-history-view.png');

      // Check Cohort Tags
      // Should find Osteo1 Cohort tag: "OS"
      expect(await tagLength(page, 'OS')).toBeGreaterThanOrEqual(1);
      // Should not find Osteo2 Cohort tag: "OS PE-CGS"
      expect(await tagLength(page, 'OS PE-CGS')).toStrictEqual(0);
    });
  });

  test(`Should match expected data in Kits Search page`, async ({page, request}) => {
    await new WelcomePage(page).selectStudy(osteo1);
    const kitsSearchPage = await new Navigation(page, request).selectFromSamples<SearchPage>(SamplesNavEnum.SEARCH);
    await kitsSearchPage.waitForReady();

    const table = await kitsSearchPage.searchByField(SearchByField.SHORT_ID, shortID);
    await table.sort('Type', SortOrder.ASC);
    await expect(table.tableLocator()).toHaveScreenshot('kits-search-results.png');
  });

  test(`Should not find Osteo1 participant in Osteo2 study`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, StudyEnum.OSTEO2, request);
    await participantListPage.filterListByShortId(shortID, { resultsCount: 0 });
  });

  async function tagLength(page: Page, tagName: string): Promise<number> {
    const cohortTag = new CohortTag(page);
    return (await page.locator(cohortTag.getCohortXPathTagFor(tagName)).all()).length;
  }
})
