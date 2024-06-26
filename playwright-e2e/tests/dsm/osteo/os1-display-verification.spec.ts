import { expect } from '@playwright/test';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { ParticipantListPageOptions as ParticipantList } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';

test.describe.serial(`${StudyName.OSTEO}: Verify expected display of participant information @dsm @functional @${StudyName.OSTEO}`, () => {
  let navigation;

  test(`${StudyName.OSTEO}: Verifying display of participant list`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = participantListPage.participantListTable;

    await test.step(`Verify all expected quick filters are displayed`, async () => {
      const quickFilters = participantListPage.quickFilters;
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.MEDICAL_RECORDS_NOT_REQUESTED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.MEDICAL_RECORDS_NOT_RECEIVED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.TISSUE_NEEDS_REVIEW);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.TISSUE_NOT_REQUESTED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.TISSUE_REQUESTED_NOT_RECEIVED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.PARTICIPANT_WITHDRAWN);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.AOM_IN_NEXT_SIX_MONTHS);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.AOM_IN_LAST_SIX_MONTHS);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.LOST_TO_FOLLOW_UP_AOM_WAS_OVER_ONE_MONTH_AGO);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.UNDER_AGE);
      await quickFilters.assertQuickFilterDisplayed(QuickFiltersEnum.PAPER_CR_NEEDED);
    })

    await test.step(`Verify that the expected table headers are displayed`, async () => {
      await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO });
    })

    await test.step(`Verify that 'Select all' checkbox is displayed`, async () => {
      const selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' })
      await expect(selectAllCheckbox).toBeVisible();
    })

    await test.step(`Verify that 'Download List' and 'Bulk Cohort Tag' buttons are displayed`, async () => {
      await participantListPage.assertDownloadListDisplayed();
      await participantListPage.assertBulkCohortTagDisplayed();
    })

    //Check left-hand options section
    await test.step(`Verify that the left-hand participant list filtering and saving options are displayed`, async () => {
      //Verify the sections are displayed
      const searchButton = participantListPage.getParticipantListOption({ optionName: ParticipantList.SEARCH });
      await expect(searchButton).toBeVisible();

      const reloadWithDefaultFilterButton = participantListPage.getParticipantListOption({ optionName: ParticipantList.RELOAD_WITH_DEFAULT_FILTER });
      await expect(reloadWithDefaultFilterButton).toBeVisible();

      const customizeViewButton = participantListPage.getParticipantListOption({ optionName: ParticipantList.CUSTOMIZE_VIEW });
      await expect(customizeViewButton).toBeVisible();

      const saveCurrentViewButton = participantListPage.getParticipantListOption({ optionName: ParticipantList.SAVE_CURRENT_VIEW });
      await expect(saveCurrentViewButton).toBeVisible();

      const savedFiltersButton = participantListPage.getParticipantListOption({ optionName: ParticipantList.SAVED_FILTERS });
      await expect(savedFiltersButton).toBeVisible();
    })

    //Check that the amount of participants with the 'OS' cohort tag is a match for total participants in the study
  })

  test.skip(`${StudyName.OSTEO}: Verify expected display of participant page`, async ({ page, request }) => {
    //stuff here
  })
})
