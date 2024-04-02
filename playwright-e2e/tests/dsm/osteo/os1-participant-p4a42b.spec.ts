import { Page, expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { Label, Tab } from 'dsm/enums';
import MedicalRecordsTab from 'dsm/pages/tablist/medical-records-tab';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import CohortTag from 'dsm/component/cohort-tag';
import KitsSearchPage, { SearchByField } from 'dsm/pages/kits-search-page';
import { Navigation, Samples, StudyName } from 'dsm/navigation';
import { SortOrder } from 'dss/component/table';
import { WelcomePage } from 'dsm/pages/welcome-page';

const { DSM_BASE_URL } = process.env;

/**
  Run on Test env only!
  Participant Short ID is hard-coded. Participant data is expected to be unchanged.
*/

test.describe.serial('Same Participant in Osteo1 and Osteo2', () => {
  test.skip(DSM_BASE_URL === undefined || (DSM_BASE_URL as string).indexOf('test') === -1);

  const shortID = 'P4A42B';
  const osteo1 = StudyName.OSTEO;

  test(`Should match expected data in Osteo1 Participant page`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, osteo1, request);
    await participantListPage.filterListByShortId(shortID);
    await participantListPage.waitForReady();

    // Open participant page
    const participantPage = await participantListPage.participantListTable.openParticipantPageAt(0);

    await test.step('Verify data', async () => {
      expect(await participantPage.getStatus()).toStrictEqual('Enrolled');
      expect(await participantPage.getRegistrationDate()).toContain('Aug 21, 2020');
      expect(await participantPage.getShortId()).toStrictEqual(shortID);
      expect(await participantPage.getGuid()).toStrictEqual('S4TF6YG65972AJV775LA');

      const ptLocator = await page.locator('table.table.table-condensed').all();
      for (let i = 0; i < ptLocator.length; i++) {
        await expect(ptLocator[i]).toHaveScreenshot(`participant-data-table-${i}.png`,
          { mask: [ptLocator[i].locator('osteo1-app-cohort-tag mat-form-field')] });
      }

      // Check visible tabs
      const expectedTabs = ['Survey Data', 'Sample Information', 'Medical Records', 'Onc History'];
      const tabs = await page.locator('tabset a[role="tab"]').allInnerTexts();
      expect(tabs).toStrictEqual(expectedTabs);
      await expect(page.locator('tabset .nav-tabs')).toHaveScreenshot('osteo1-tabs-visible-view.png');

      // Check Survey Data tab data
      const surveyTabLocator = page.locator('tab[heading="Survey Data"][role="tabpanel"] > div');
      await expect(surveyTabLocator).toHaveScreenshot('osteo1-survey-data-tab-collapsed-view.png');

      // Expand Prequalifier Survey and compare screenshot
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(0).click(); // expand click
      await expect(surveyTabLocator.locator('.mat-expansion-panel-body:visible').nth(0))
        .toHaveScreenshot('osteo1-prequalifier-survey-expanded-view.png');
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(0).click(); // collapse click

      // Expand Research Consent Form and compare screenshot
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(1).click(); // expand click
      await expect(surveyTabLocator.locator('.mat-expansion-panel-body:visible').nth(0))
        .toHaveScreenshot('osteo1-research-consent-form-expanded-view.png');
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(1).click(); // collapse click

      // Expand Medical Release form and compare screenshot
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(2).click(); // expand click
      await expect(surveyTabLocator.locator('.mat-expansion-panel-body:visible').nth(0))
        .toHaveScreenshot('osteo1-medical-release-form-expanded-view.png');
      await surveyTabLocator.locator('mat-expansion-panel-header').nth(2).click(); // collapse click

      // Compare Medical Records tab screenshot
      const medicalRecordsTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const medicalRecordTable = medicalRecordsTab.table;
      //await expect(medicalRecordTable.tableLocator()).toHaveScreenshot('osteo1-medical-records-tab-view.png');

      // Compare Onc History tab screenshot
      const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable = oncHistoryTab.table;
      //await expect(oncHistoryTable.tableLocator()).toHaveScreenshot('osteo1-onc-history-tab-view.png');

      // Check Cohort Tags
      // Should find Osteo1 Cohort tag: "OS"
      expect(await tagLength(page, 'OS')).toBeGreaterThanOrEqual(1);
      // Should also find Osteo2 Cohort tag: "OS PE-CGS"
      expect(await tagLength(page, 'OS PE-CGS')).toBeGreaterThanOrEqual(1);
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

  test(`Should find participant in Osteo2 study`, async ({page, request}) => {
    const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, StudyName.OSTEO2, request);
    await participantListPage.filterListByShortId(shortID);
    const participantPage = await participantListPage.participantListTable.openParticipantPageAt(0);

    // Check visible tabs
    const expectedTabs = ['Survey Data', 'Sample Information', 'Contact Information', 'Medical Records', 'Onc History', 'Invitae'];
    const tabs = await page.locator('tabset a[role="tab"]').allInnerTexts();
    expect(tabs).toStrictEqual(expectedTabs);
    await expect(page.locator('tabset .nav-tabs')).toHaveScreenshot('osteo2-tabs-visible-view.png');

    // Compare Medical Records tab screenshot
    const medicalRecordsTab = await participantPage.tablist(Tab.MEDICAL_RECORD).click<MedicalRecordsTab>();
    const medicalRecordTable = medicalRecordsTab.table;
    await expect(medicalRecordTable.tableLocator()).toHaveScreenshot('osteo2-medical-records-tab-view.png');

    // Compare Onc History tab screenshot
    const oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
    const oncHistoryTable = oncHistoryTab.table;
    //await expect(oncHistoryTable.tableLocator()).toHaveScreenshot('osteo2-onc-history-tab-view.png');
  });

  async function tagLength(page: Page, tagName: string): Promise<number> {
    const cohortTag = new CohortTag(page);
    return (await page.locator(cohortTag.getCohortXPathTagFor(tagName)).all()).length;
  }
})
