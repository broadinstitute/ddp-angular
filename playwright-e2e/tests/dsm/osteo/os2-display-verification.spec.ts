import { CustomizeView, DataFilter, Label } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { mailingListCreatedDate } from 'utils/date-utils';

test.describe.serial(`OS2 Verify expected display of participant information`, () => {
  const savedFilterName = `Playwright PE-CGS filter for OS2 - created on ${mailingListCreatedDate(new Date())}`;
  const participantsWithReturnOfResultsFilter = [
    Label.PARTICIPANT_LIST_CHECKBOX_HEADER,
    Label.COHORT_TAG_NAME,
    Label.CLINICAL_ORDER_PDO_NUMBER,
    Label.CONSENT_TISSUE,
    Label.SOMATIC_CONSENT_TUMOR,
    Label.SOMATIC_RESULTS_SURVEY_CREATED
  ];
  let navigation;

  test(`OS2: Verify participants that can view Return of Results can be filtered for`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    //Create a filter to be used to check participants that already have at least one Return of Results / Somatic Results document
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
    await customizeViewPanel.selectColumns(CustomizeView.CLINICAL_ORDERS, [Label.CLINICAL_ORDER_PDO_NUMBER]);
    await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, [Label.CONSENT_TISSUE], { nth: 0 }); //adult's consent
    await customizeViewPanel.selectColumns(CustomizeView.ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR, [Label.SOMATIC_CONSENT_TUMOR]);
    await customizeViewPanel.selectColumns(CustomizeView.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, [Label.SOMATIC_RESULTS_SURVEY_CREATED]);
    await customizeViewPanel.close();

    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED]});
    await searchPanel.text(Label.COHORT_TAG_NAME, { textValue: StudyName.OSTEO2, exactMatch: true }); //Exact match needs to be true else nothing is returned
    await searchPanel.dates(Label.SOMATIC_RESULTS_SURVEY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });
    await searchPanel.search();

    await participantListPage.saveCurrentView(savedFilterName); //modify to throw an error if name is not unique

    await participantListPage.reloadWithDefaultFilter();
    const participantListTable = participantListPage.participantListTable;
    //Check that the default CMI filter is now present after using Reload with Default Filters
    await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO2 });

    const savedFilterSection = participantListPage.savedFilters;
    await savedFilterSection.open(savedFilterName);
    await savedFilterSection.exists(savedFilterName); //check that the filter was saved
  })

  test(`OS2: Verify participant list webelements`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    //First check the CMI default filter is present
    const participantListTable = participantListPage.participantListTable;
    await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO2 });

    //Then check that calling a saved filter displays all expected columns
    const savedFilterSection = participantListPage.savedFilters;
    await savedFilterSection.open(savedFilterName);
    await participantListTable.assertDisplayedHeaders({ customFilter: participantsWithReturnOfResultsFilter });
    await savedFilterSection.delete(savedFilterName);

    //Verify that all Customize View column groups are displayed
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.assertStudyColumnsDisplayedFor({ studyName: StudyName.OSTEO2 });
  })

  test.skip(`OS2: Verify participant page webelements`, async ({ page, request }) => {
    //stuff here
  })
})
