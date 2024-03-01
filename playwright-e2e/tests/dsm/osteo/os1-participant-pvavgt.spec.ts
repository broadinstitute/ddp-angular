import { Page, expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import MedicalRecordsTab from 'dsm/pages/tablist/medical-records-tab';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import CohortTag from 'dsm/component/cohort-tag';
import KitsSearchPage, { SearchByField } from 'dsm/pages/kits-search-page';
import { Navigation, Samples, Study, StudyName } from 'dsm/navigation';
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
  const osteo1 = StudyName.OSTEO;

  test(`Should find by Cohort Tag in Osteo1`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, osteo1, request);

    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);

    const searchPanel = participantListPage.filters.searchPanel;
    const participantListTable = participantListPage.participantListTable;

    // Should find multiple Osteo1 participants when search by Osteo1 Cohort tag: "OS"
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text(Label.COHORT_TAG_NAME, { additionalFilters: [DataFilter.EXACT_MATCH], textValue: 'OS' });
    await searchPanel.search();
    expect(await participantListTable.numOfParticipants()).toBeGreaterThan(0);

    // Should find test participant by: Cohort tag, Status and Short ID
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text(Label.SHORT_ID, { textValue: shortID });
    await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
    await searchPanel.text(Label.COHORT_TAG_NAME, { additionalFilters: [DataFilter.EXACT_MATCH], textValue: 'OS' });
    await searchPanel.search();
    expect(await participantListTable.numOfParticipants()).toStrictEqual(1);
  });

  test(`Should match expected data in Osteo1 Participant page`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, osteo1, request);
    await participantListPage.filterListByShortId(shortID);
    await participantListPage.waitForReady();

    // Open participant page
    const participantPage = await participantListPage.participantListTable.openParticipantPageAt(0);

    await test.step('Verify data', async () => {
      expect(await participantPage.getStatus()).toStrictEqual('Enrolled');
      expect(await participantPage.getRegistrationDate()).toContain('Feb 5, 2020');
      expect(await participantPage.getShortId()).toStrictEqual(shortID);
      expect(await participantPage.getGuid()).toStrictEqual('NSAVPY9ERWUFBMWJY3GY');

      const ptLocator = page.locator('table.table.table-condensed');
      await expect(ptLocator).toHaveScreenshot('participant-data.png',
        { mask: [ptLocator.locator('app-cohort-tag mat-form-field')] });

      // Check visible tabs
      const expectedTabs = ['Survey Data', 'Sample Information', 'Medical Records', 'Onc History', 'First Medical Record Abstraction'];

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
      const medicalRecordsTab = await participantPage.tablist(Tab.MEDICAL_RECORD).click<MedicalRecordsTab>();
      const medicalRecordTable = medicalRecordsTab.table;
      await expect(medicalRecordTable.tableLocator()).toHaveScreenshot('medical-records-view.png');

      // Compare Onc History screenshot
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      await expect(oncHistoryTable.tableLocator()).toHaveScreenshot('onc-history-view.png');

      // Check Cohort Tags
      // Should find Osteo1 Cohort tag: "OS"
      expect(await tagLength(page, 'OS')).toBeGreaterThanOrEqual(1);
      // Should not find Osteo2 Cohort tag: "OS PE-CGS"
      expect(await tagLength(page, 'OS PE-CGS')).toStrictEqual(0);
    });
  });

  test(`Should match expected data in Osteo1 Kits Search page`, async ({page, request}) => {
    await new WelcomePage(page).selectStudy(osteo1);
    const kitsSearchPage = await new Navigation(page, request).selectFromSamples<KitsSearchPage>(Samples.SEARCH);
    await kitsSearchPage.waitForReady();

    const table = await kitsSearchPage.searchByField(SearchByField.SHORT_ID, shortID);
    await table.sort(Label.TYPE, SortOrder.ASC);
    await expect(table.tableLocator()).toHaveScreenshot('kits-search-results.png');
  });

  test(`Should not find Osteo1 participant in Osteo2 study`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, StudyName.OSTEO2, request);
    await participantListPage.filterListByShortId(shortID, { resultsCount: 0 });
  });

  async function tagLength(page: Page, tagName: string): Promise<number> {
    const cohortTag = new CohortTag(page);
    return (await page.locator(cohortTag.getCohortXPathTagFor(tagName)).all()).length;
  }
})
