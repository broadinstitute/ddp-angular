import { expect } from '@playwright/test';
import { QuickFiltersEnum as QuickFilter } from 'dsm/component/filters/quick-filters';
import { CustomizeView as CV, CustomizeViewID as ID, DataFilter, Label, Tab, CustomizeView } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import ContactInformationTab from 'dsm/pages/tablist/contact-information-tab';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import SequeuncingOrderTab from 'dsm/pages/tablist/sequencing-order-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { mailingListCreatedDate } from 'utils/date-utils';

test.describe.serial(`${StudyName.OSTEO2}: Verify expected display of participant information @dsm @${StudyName.OSTEO2}`, () => {
  const filterReturnOfResults = `PW - Return of Results filter for OS2 - created on ${mailingListCreatedDate(new Date())}`; //named as such due to bug PEPPER-935
  const filterNewYorkResidence = `PW - New York residence filter for OS2 - created on ${mailingListCreatedDate(new Date())}`;

  const osteoTestFilter = [
    Label.PARTICIPANT_LIST_CHECKBOX_HEADER,
    Label.COHORT_TAG_NAME,
    Label.CLINICAL_ORDER_PDO_NUMBER,
    Label.CONSENT_TISSUE,
    Label.SOMATIC_CONSENT_TUMOR,
    Label.SOMATIC_RESULTS_CREATED,
    Label.STATE,
    Label.SM_ID_VALUE
  ];

  let navigation;
  let clinicalParticipantShortID: string;

  test(`OS2: Create various filters that can be used to check that OS2 is functioning as expected`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = participantListPage.participantListTable;
    await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO2 }); //check to make sure test is starting from clean slate

    //Display columns that will be needed to make the following saved filters
    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CV.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
    await customizeViewPanel.selectColumns(CV.CLINICAL_ORDERS, [Label.CLINICAL_ORDER_PDO_NUMBER]);
    await customizeViewPanel.selectColumns(CV.RESEARCH_CONSENT_FORM, [Label.CONSENT_TISSUE], { nth: 0 }); //adult's consent
    await customizeViewPanel.selectColumns(CV.LEARN_ABOUT_YOUR_TUMOR, [Label.SOMATIC_CONSENT_TUMOR]);
    await customizeViewPanel.selectColumns(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, [Label.SOMATIC_RESULTS_CREATED]);
    await customizeViewPanel.selectColumns(CV.CONTACT_INFORMATION, [Label.STATE]);
    await customizeViewPanel.selectColumns(CV.TISSUE, [Label.SM_ID_VALUE]);
    await customizeViewPanel.close();

    const searchPanel = participantListPage.filters.searchPanel;

    /**
     * In this case, once the Sequencing Order tab is available, it should state a message that the participant is not eligible for clinical sequencing
     */
    await test.step(`Create a saved filter that can be used to check participants whose residence is in New York`, async () => {
      await searchPanel.open();
      await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED]});
      await searchPanel.text(Label.SM_ID_VALUE, { additionalFilters: [DataFilter.NOT_EMPTY] }); //Must be 'Not Empty' to help find participants who might have accessioned SM-IDs
      await searchPanel.text(Label.COHORT_TAG_NAME, { textValue: StudyName.OSTEO2, exactMatch: true }); //'Exact Match' needs to be true else nothing is returned
      await searchPanel.text(Label.STATE, { textValue: 'NY' }); //will be using just New York residence for the test
      await searchPanel.search();
      await participantListPage.assertParticipantsCountGreaterOrEqual(1);

      await participantListPage.saveCurrentView(filterNewYorkResidence);
    });

    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.search({ uri: 'ui/applyFilter?' });
    await participantListTable.assertDisplayedHeaders({ customFilter: osteoTestFilter });

    /**
     * Use this filter to check participants who have completed most activities (and therefore have the most things for study admin to check)
     */
    await test.step(`Create a saved filter that can be used to check participants that already have at least one Return of Results`, async () => {
      await searchPanel.open();
      await searchPanel.dates(Label.SOMATIC_RESULTS_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });
      await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
      await searchPanel.search();
      await participantListPage.assertParticipantsCountGreaterOrEqual(1);

      await participantListPage.saveCurrentView(filterReturnOfResults);
    });

    await test.step(`Confirm that the above saved filters were successfully saved into the Saved Filter section`, async () => {
      await participantListPage.reloadWithDefaultFilter();
      await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO2 });

      const savedFilterSection = participantListPage.savedFilters; //Check for the presence of the 3 filters in the Saved Filter section
      await savedFilterSection.openPanel();
      await savedFilterSection.exists(filterNewYorkResidence);
      await savedFilterSection.exists(filterReturnOfResults);

      await savedFilterSection.delete(filterNewYorkResidence);//Will move these to a test occurring later - putting here to not clog saved filter before tests are finalized
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify general participant list webelements`, async ({ page, request }) => {
    test.slow();
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = participantListPage.participantListTable;
    await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO2 }); //check to make sure test is starting from clean slate

    await test.step(`Verify that the Select All option is displayed`, async () => {
      const checkbox = page.getByRole('checkbox', { name: 'Select all' });
      await expect(checkbox).toBeVisible();
    })

    await test.step(`Verify the ${StudyName.OSTEO2} quick filters are displayed`, async () => {
      const quickFilters = participantListPage.quickFilters;
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.MEDICAL_RECORDS_NOT_REQUESTED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.MEDICAL_RECORDS_NOT_RECEIVED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.TISSUE_NEEDS_REVIEW);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.TISSUE_NOT_REQUESTED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.TISSUE_REQUESTED_NOT_RECEIVED_YET);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.PARTICIPANT_WITHDRAWN);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.AOM_IN_NEXT_SIX_MONTHS);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.AOM_IN_LAST_SIX_MONTHS);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.LOST_TO_FOLLOW_UP_AOM_WAS_OVER_ONE_MONTH_AGO);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.UNDER_AGE);
      await quickFilters.assertQuickFilterDisplayed(QuickFilter.PHI_REPORT);
    })

    await test.step(`Verify that the Download List and Bulk Cohort Tagis displayed`, async () => {
      await participantListPage.assertDownloadListDisplayed();
      await participantListPage.assertBulkCohortTagDisplayed();
    })

    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();

    await test.step(`Verify: Participant Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PARTICIPANT, stableID: ID.PARTICIPANT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.COUNTRY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DATE_OF_MAJORITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DDP);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DO_NOT_CONTACT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.EMAIL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.FILE_UPLOAD_TIME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.FIRST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.LAST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.PARTICIPANT_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.PREFERRED_LANGUAGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.REGISTRATION_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.SHORT_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.UPLOADED_FILE_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.STATUS);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PARTICIPANT, stableID: ID.PARTICIPANT });
    })

    await test.step(`Verify: Participant - DSM Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PARTICIPANT_DSM, stableID: ID.PARTICIPANT_DSM });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.DATE_WITHDRAWN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.GERMLINE_CONSENT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.INCOMPLETE_OR_MINIMAL_MEDICAL_RECORDS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.MR_ASSIGNEE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.ONC_HISTORY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.ONC_HISTORY_REVIEWED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PAPER_CR_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PAPER_CR_SENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PARTICIPANT_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.READY_FOR_ABSTRACTION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.SOMATIC_CONSENT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.TISSUE_ASSIGNEE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PARTICIPANT_DSM, stableID: ID.PARTICIPANT_DSM });
    })

    await test.step(`Verify: Medical Record Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RECORD, stableID: ID.MEDICAL_RECORD });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.DUPLICATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.FOLLOW_UP_REQUIRED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.FOLLOW_UP_REQUIRED_TEXT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INITIAL_MR_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INITIAL_MR_REQUEST_TWO);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INITIAL_MR_REQUEST_THREE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INSTITUTION_CONTACT_PERSON);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INSTITUTION_FAX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INSTITUTION_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INSTITUTION_PHONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INTERNATIONAL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_DOCUMENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_DOCUMENT_FILE_NAMES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_PROBLEM);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_PROBLEM_TEXT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_REVIEW);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.MR_UNABLE_TO_OBTAIN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.NO_ACTION_NEEDED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.PAPER_CR_REQUIRED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.PATHOLOGY_PRESENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.TYPE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.MEDICAL_RECORD, stableID: ID.MEDICAL_RECORD });
    })

    await test.step(`Verify: Onc History Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.ONC_HISTORY, stableID: ID.ONC_HISTORY });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.NECROSIS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.VIABLE_TUMOR);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.ACCESSION_NUMBER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.BLOCK_TO_REQUEST_CAPITALIZED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.BLOCKS_WITH_TUMOR);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.DATE_OF_PX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.DESTRUCTION_POLICY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.FACILITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.FACILITY_FAX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.FACILITY_PHONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.GENDER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.HISTOLOGY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.SAMPLE_FFPE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.LOCAL_CONTROL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.LOCATION_OF_PX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.METHOD_OF_DECALCIFICATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.ONC_HISTORY_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.PROBLEM_WITH_TISSUE_COLUMN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.REQUEST_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_REQUEST_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_REQUEST_DATE_TWO);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_REQUEST_DATE_THREE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TUMOR_SIZE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TYPE_OF_PX);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.ONC_HISTORY, stableID: ID.ONC_HISTORY });
    })

    await test.step(`Verify: Tissue Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.TISSUE, stableID: ID.TISSUE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.BLOCK_ID_TO_SHL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.BLOCK_TO_SHL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.BLOCK);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.COUNT_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.DATE_SENT_TO_GP);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.FIRST_SM_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.H_E_SINGULAR);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.H_E_PLURAL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.PATHOLOGY_REPORT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.RETURN_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SCROLL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SCROLLS_BACK_FROM_SHL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SEQUENCING_RESULTS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SHL_WORK_NUMBER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SK_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SM_ID_FOR_H_E);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.SM_ID_VALUE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TISSUE_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TISSUE_SITE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TISSUE_TYPE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TRACKING_NUMBER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TUMOR_COLLABORATOR_SAMPLE_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.TUMOR_TYPE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.USS_UNSTAINED);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.TISSUE, stableID: ID.TISSUE });
    })

    await test.step(`Verify: Sample Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SAMPLE, stableID: ID.SAMPLE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.COLLABORATOR_PARTICIPANT_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.COLLECTION_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.MF_CODE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.NORMAL_COLLABORATOR_SAMPLE_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_DEACTIVATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_SENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_TYPE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SEQUENCING_RESTRICTIONS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.TRACKING_IN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.TRACKING_OUT);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SAMPLE, stableID: ID.SAMPLE });
    })

    await test.step(`Verify: Cohort Tags Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });
      await customizeViewPanel.assertColumnOptionDisplayed(CV.COHORT_TAGS, ID.COHORT_TAG, Label.COHORT_TAG_NAME);
      await customizeViewPanel.closeColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });
    })

    await test.step(`Verify: Clinical Orders Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.CLINICAL_ORDERS, stableID: ID.CLINICAL_ORDER });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.CLINICAL_ORDERS, ID.CLINICAL_ORDER, Label.CLINICAL_ORDER_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CLINICAL_ORDERS, ID.CLINICAL_ORDER, Label.CLINICAL_ORDER_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CLINICAL_ORDERS, ID.CLINICAL_ORDER, Label.CLINICAL_ORDER_PDO_NUMBER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CLINICAL_ORDERS, ID.CLINICAL_ORDER, Label.CLINICAL_ORDER_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CLINICAL_ORDERS, ID.CLINICAL_ORDER, Label.CLINICAL_ORDER_STATUS_DATE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.CLINICAL_ORDERS, stableID: ID.CLINICAL_ORDER });
    })

    await test.step(`Verify: Survey: Your Child's Osteosarcoma Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SURVEY_YOUR_CHILDS_OSTEO, stableID: ID.SURVEY_YOUR_CHILDS_OSTEO });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.ABOUT_CHILD_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.ABOUT_CHILD_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.ABOUT_CHILD_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.ABOUT_CHILD_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_CURRENT_BODY_LOC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_CURRENTLY_TREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_DIAGNOSIS_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_EXPERIENCE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_HAD_RADIATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_HISPANIC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_INITIAL_BODY_LOC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_OTHER_CANCERS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_OTHER_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_RACE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_SYMPTOMS_START_TIME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.CHILD_THERAPIES_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.HAS_CHILD_OSTEO_RELAPSED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.HOW_HEARD_ABOUT_PROJECT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_CHILDS_OSTEO, ID.SURVEY_YOUR_CHILDS_OSTEO, Label.WHO_IS_FILLING_OUT_SURVEY);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SURVEY_YOUR_CHILDS_OSTEO, stableID: ID.SURVEY_YOUR_CHILDS_OSTEO });
    })

    await test.step(`Verify: Additional Consent & Assent: Learning More About Your Child's DNA with Invitae Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.LEARN_KID_DNA_WITH_INVITAE, stableID: ID.LEARN_KID_DNA });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.ADDENDUM_CONSENT_KID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.DATE, 0);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.DATE, 1);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.GERMLINE_CONSENT_KID_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.GERMLINE_CONSENT_KID_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.GERMLINE_CONSENT_KID_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.GERMLINE_CONSENT_KID_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.PATIENT_SIGNATURE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_KID_DNA_WITH_INVITAE, ID.LEARN_KID_DNA, Label.SIGNATURE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.LEARN_KID_DNA_WITH_INVITAE, stableID: ID.LEARN_KID_DNA });
    })

    await test.step(`Verify: Biological / Birth Parent 1: Assigned female at birth Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.BIRTH_PARENT_FEMALE, stableID: ID.BIRTH_PARENT_FEMALE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.HAVE_JEWISH_ANCESTRY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FAMILY_HISTORY_MOM_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FAMILY_HISTORY_MOM_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FAMILY_HISTORY_MOM_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FAMILY_HISTORY_MOM_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FH_MOM_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FH_MOM_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.FH_MOM_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.PLEASE_SPECIFY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_FEMALE, ID.BIRTH_PARENT_FEMALE, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.BIRTH_PARENT_FEMALE, stableID: ID.BIRTH_PARENT_FEMALE });
    })

    await test.step(`Verify: Research Consent Form Columns [Adult / Self Consent]`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_ADULT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_SURVEY_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_SURVEY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_SURVEY_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_BLOOD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_TISSUE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.YOUR_CONTACT_INFORMATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.YOUR_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_ADULT });
    })

    await test.step(`Verify: Loved One Survey Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.LOVED_ONE_SURVEY, stableID: ID.LOVED_ONE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.HOW_HEARD_ABOUT_PROJECT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_ADDITIONAL_SURVEY_CONTACT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_DIAGNOSED_DETAILS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_DIAGNOSIS_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_DIAGNOSIS_POSTAL_CODE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_DIAGNOSIS_PRIMARY_LOCATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_DIAGNOSIS_SPREAD_LOC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_EVER_RELAPSED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_EXPERIENCE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_FAMILY_HISTORY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_FUTURE_CONTACT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_HAD_BENIGN_BONE_TUMOR);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_HAD_RADIATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_HAD_SURGERY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_HISPANIC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_METASTATIC_DISEASE_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_OTHER_CANCERS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_OTHER_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_PASSED_POSTAL_CODE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_PRIMARY_CAREGIVER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_RACE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_RADIATION_LOC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_RECEIVED_RADIATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_RELAPSE_DATES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_SURGERIES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_SYMPTOMS_START_TIME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.LOVED_ONE_THERAPIES_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_YOUR_FIRST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_YOUR_LAST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_LOVED_ONE_FIRSTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_LOVED_ONE_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_RELATION_TO_LOVED_ONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHEN_DID_LOVED_ONE_PASS_AWAY);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.LOVED_ONE_SURVEY, stableID: ID.LOVED_ONE });
    })

    await test.step(`Verify: Research Consent & Assent Form Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_ASSENT_FORM, stableID: ID.CONSENT_ASSENT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CHILD_ADOLESCENT_ASSENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_BLOOD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_CHILD_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CONSENT_ASSENT_TISSUE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.RELATIONSHIP_TO_CHILD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.YOUR_CHILD_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CHILD_DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.CHILD_MAILING_ADDRESS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.YOUR_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.RESEARCH_CONSENT_ASSENT_FORM, stableID: ID.CONSENT_ASSENT });
    })

    await test.step(`Verify: Research Consent Form Columns [Pediatric / Parental-Consent] Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_KID });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_BLOOD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CON_CHILD_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_TISSUE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.RELATIONSHIP_TO_CHILD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.CHILD_DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.CHILD_FULLNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.CHILD_MAILING_ADDRESS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.YOUR_FULLNAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_KID });
    })

    await test.step(`Verify: Biological / Birth Parent 2: Assigned male at birth Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.BIRTH_PARENT_MALE, stableID: ID.BIRTH_PARENT_MALE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.HAVE_JEWISH_ANCESTRY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FAMILY_HISTORY_DAD_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FAMILY_HISTORY_DAD_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FAMILY_HISTORY_DAD_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FAMILY_HISTORY_DAD_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FH_DAD_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FH_DAD_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.FH_DAD_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.PLEASE_SPECIFY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.BIRTH_PARENT_MALE, ID.BIRTH_PARENT_MALE, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.BIRTH_PARENT_MALE, stableID: ID.BIRTH_PARENT_MALE });
    })

    await test.step(`Verify: What We've Learned from Your Child's/Your Yumor (somatic) DNA Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, stableID: ID.SOMATIC_DNA });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, ID.SOMATIC_DNA, Label.RESULT_FILE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, ID.SOMATIC_DNA, Label.SHOW_RESULTS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, ID.SOMATIC_DNA, Label.SOMATIC_RESULTS_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, ID.SOMATIC_DNA, Label.SOMATIC_RESULTS_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, ID.SOMATIC_DNA, Label.SOMATIC_RESULTS_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, ID.SOMATIC_DNA, Label.SOMATIC_RESULTS_CREATED);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, stableID: ID.SOMATIC_DNA });
    })

    await test.step(`Verify: Half-sibling Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.HALF_SIBLING, stableID: ID.HALF_SIBLING });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FAMILY_HISTORY_HALF_SIBLING_SURVEY_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FAMILY_HISTORY_HALF_SIBLING_SURVEY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FAMILY_HISTORY_HALF_SIBLING_SURVEY_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FAMILY_HISTORY_HALF_SIBLING_SURVEY_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FH_HALF_SIBLING_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FH_HALF_SIBLING_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.FH_HALF_SIBLING_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.HALF_SIBLING, ID.HALF_SIBLING, Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.HALF_SIBLING, stableID: ID.HALF_SIBLING });
    })

    await test.step(`Verify: Additional Consent: Learning More About Your DNA with Invitae Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.LEARN_DNA_WITH_INVITAE, stableID: ID.LEARN_DNA_WITH_INVITAE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_DNA_WITH_INVITAE, ID.LEARN_DNA_WITH_INVITAE, Label.ADDENDUM_CONSENT_BOOL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_DNA_WITH_INVITAE, ID.LEARN_DNA_WITH_INVITAE, Label.GERMLINE_CONSENT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_DNA_WITH_INVITAE, ID.LEARN_DNA_WITH_INVITAE, Label.GERMLINE_CONSENT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_DNA_WITH_INVITAE, ID.LEARN_DNA_WITH_INVITAE, Label.GERMLINE_CONSENT_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_DNA_WITH_INVITAE, ID.LEARN_DNA_WITH_INVITAE, Label.GERMLINE_SURVEY_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_DNA_WITH_INVITAE, ID.LEARN_DNA_WITH_INVITAE, Label.SIGNATURE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.LEARN_DNA_WITH_INVITAE, stableID: ID.LEARN_DNA_WITH_INVITAE });
    })

    await test.step(`Verify: Provide contact information Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PROVIDE_CONTACT_INFORMATION, stableID: ID.PROVIDE_CONTACT_INFO });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROVIDE_CONTACT_INFORMATION, ID.PROVIDE_CONTACT_INFO, Label.CHILD_CONTACT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROVIDE_CONTACT_INFORMATION, ID.PROVIDE_CONTACT_INFO, Label.CHILD_CONTACT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROVIDE_CONTACT_INFORMATION, ID.PROVIDE_CONTACT_INFO, Label.CHILD_CONTACT_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROVIDE_CONTACT_INFORMATION, ID.PROVIDE_CONTACT_INFO, Label.CHILD_CONTACT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROVIDE_CONTACT_INFORMATION, ID.PROVIDE_CONTACT_INFO, Label.YOUR_CHILD_EMAIL_ADDRESS);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PROVIDE_CONTACT_INFORMATION, stableID: ID.PROVIDE_CONTACT_INFO});
    })

    await test.step(`Verify: Child Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.CHILD, stableID: ID.CHILD });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FAMILY_HISTORY_KID_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FAMILY_HISTORY_KID_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FAMILY_HISTORY_KID_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FAMILY_HISTORY_KID_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FH_CHILD_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FH_CHILD_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.FH_CHILD_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CHILD, ID.CHILD, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.CHILD, stableID: ID.CHILD });
    })

    await test.step(`Verify: Medical Release Form Columns [Adult]`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_ADULT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.FULL_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.INSTITUTION_UPPER_CASE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.PHYSICIAN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.RELEASE_SELF_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.RELEASE_SELF_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.RELEASE_SELF_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.RELEASE_SELF_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.RELEASE_SELF_AGREEMENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.WHERE_INITIAL_BIOPSY_DONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.YOUR_MAILING_ADDRESS);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_ADULT });
    })

    await test.step(`Verify: Additional Details Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.ADDITIONAL_DETAILS, stableID: ID.ADDITIONAL_DETAILS });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADDITIONAL_DETAILS, ID.ADDITIONAL_DETAILS, Label.FAMILY_HISTORY_SELF_DETAILS_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADDITIONAL_DETAILS, ID.ADDITIONAL_DETAILS, Label.FAMILY_HISTORY_SELF_DETAILS_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADDITIONAL_DETAILS, ID.ADDITIONAL_DETAILS, Label.FAMILY_HISTORY_SELF_DETAILS_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADDITIONAL_DETAILS, ID.ADDITIONAL_DETAILS, Label.FAMILY_HISTORY_SELF_DETAILS_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADDITIONAL_DETAILS, ID.ADDITIONAL_DETAILS, Label.FH_OTHER_FACTORS_CANCER_RISK);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.ADDITIONAL_DETAILS, stableID: ID.ADDITIONAL_DETAILS });
    })

    await test.step(`Verify: Add child participant Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.ADD_CHILD_PARTICIPANT, stableID: ID.ADD_CHILD_PARTICIPANT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADD_CHILD_PARTICIPANT, ID.ADD_CHILD_PARTICIPANT, Label.ADD_CHILD_PARTICIPANT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADD_CHILD_PARTICIPANT, ID.ADD_CHILD_PARTICIPANT, Label.ADD_CHILD_PARTICIPANT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADD_CHILD_PARTICIPANT, ID.ADD_CHILD_PARTICIPANT, Label.ADD_CHILD_PARTICIPANT_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADD_CHILD_PARTICIPANT, ID.ADD_CHILD_PARTICIPANT, Label.ADD_CHILD_PARTICIPANT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADD_CHILD_PARTICIPANT, ID.ADD_CHILD_PARTICIPANT, Label.CHILD_STATE_COPY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ADD_CHILD_PARTICIPANT, ID.ADD_CHILD_PARTICIPANT, Label.WHERE_DOES_YOUR_CHILD_LIVE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.ADD_CHILD_PARTICIPANT, stableID: ID.ADD_CHILD_PARTICIPANT });
    })

    await test.step(`Verify: Survey: Family History of Cancer Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SURVEY_FAMILY_HISTORY, stableID: ID.FAMILY_HISTORY });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.FAMILY_HISTORY_SELF_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.FAMILY_HISTORY_SELF_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.FAMILY_HISTORY_SELF_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.FAMILY_HISTORY_SELF_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.NO_CHILDREN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.PARENT_ONE_DUNNO);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_FAMILY_HISTORY, ID.FAMILY_HISTORY, Label.PARENT_TWO_DUNNO);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SURVEY_FAMILY_HISTORY, stableID: ID.FAMILY_HISTORY });
    })

    await test.step(`Verify: Prequalifier Survey Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PREQUALIFIER, stableID: ID.PREQUALIFIER });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.CHILD_PROVINCE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.CHILD_STATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.HOW_OLD_ARE_YOU);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.HOW_OLD_IS_YOUR_CHILD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.PREQUAL_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.PREQUAL_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.PREQUAL_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.PREQUAL_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.PREQUAL_SELF_DESCRIBE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.SELF_PROVINCE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.SELF_STATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.WHERE_DO_YOU_LIVE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PREQUALIFIER, ID.PREQUALIFIER, Label.WHERE_DOES_YOUR_CHILD_LIVE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PREQUALIFIER, stableID: ID.PREQUALIFIER });
    })

    await test.step(`Verify: Survey: Your Child's/Your Osteosarcoma Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SURVEY_YOUR_OSTEO, stableID: ID.SURVEY_YOUR_OSTEO});

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.ABOUT_YOUR_OSTEO_SURVEY_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.ABOUT_YOUR_OSTEO_SURVEY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.ABOUT_YOUR_OSTEO_SURVEY_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.ABOUT_YOUR_OSTEO_SURVEY_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.CURRENT_BODY_LOC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.CURRENTLY_TREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.DIAGNOSIS_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.EVER_RELAPSED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.EXPERIENCE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.HAD_RADIATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.HISPANIC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.HOW_HEARD_ABOUT_PROJECT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.INITIAL_BODY_LOC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.OTHER_CANCERS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.OTHER_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.SYMPTOMS_START_TIME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.THERAPIES_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.WHAT_IS_YOUR_RACE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.WHO_IS_FILLING_OUT_SURVEY, 0);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_YOUR_OSTEO, ID.SURVEY_YOUR_OSTEO, Label.WHO_IS_FILLING_OUT_SURVEY, 1);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SURVEY_YOUR_OSTEO, stableID: ID.SURVEY_YOUR_OSTEO});
    })

    await test.step(`Verify: Grandparent Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.GRANDPARENT, stableID: ID.GRANDPARENT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FAMILY_HISTORY_GRANDPARENT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FAMILY_HISTORY_GRANDPARENT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FAMILY_HISTORY_GRANDPARENT_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FAMILY_HISTORY_GRANDPARENT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FH_GRANDPARENT_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FH_GRANDPARENT_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.FH_GRANDPARENT_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.GRANDPARENT, ID.GRANDPARENT, Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.GRANDPARENT, stableID: ID.GRANDPARENT });
    })

    await test.step(`Verify: Additional Consent & Assent: Learning About Your Child's Tumor Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.LEARN_ABOUT_KID_TUMOR, stableID: ID.LEARN_ABOUT_KID_TUMOR });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.CONSENT_ADDENDUM_KID_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.CONSENT_ADDENDUM_KID_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.CONSENT_ADDENDUM_KID_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.CONSENT_ADDENDUM_KID_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.SIGNATURE_WITHOUT_COLON);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.SIGNATURE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.SOMATIC_ASSENT_ADDENDUM);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_KID_TUMOR, ID.LEARN_ABOUT_KID_TUMOR, Label.SOMATIC_CONSENT_TUMOR_KID);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.LEARN_ABOUT_KID_TUMOR, stableID: ID.LEARN_ABOUT_KID_TUMOR });
    })

    await test.step(`Verify: Sibling Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SIBLING, stableID: ID.SIBLING });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FAMILY_HISTORY_SIBLING_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FAMILY_HISTORY_SIBLING_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FAMILY_HISTORY_SIBLING_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FAMILY_HISTORY_SIBLING_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FH_SIBLING_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FH_SIBLING_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.FH_SIBLING_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SIBLING, ID.SIBLING, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SIBLING, stableID: ID.SIBLING });
    })

    await test.step(`Verify: Medical Release Form Columns [Pediatric]`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_KID });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.FULL_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.INITIAL_BIOPSY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.INSTITUTION_UPPER_CASE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.PHYSICIAN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.RELEASE_MINOR_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.RELEASE_MINOR_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.RELEASE_MINOR_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.RELEASE_MINOR_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.RELEASE_MINOR_AGREEMENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.YOUR_CHILD_MAIL_ADDRESS);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_KID });
    })

    await test.step(`Verify: Parent's Sibling Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PARENT_SIBLING, stableID: ID.PARENTS_SIBLING });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FAMILY_HISTORY_PARENT_SIBLING_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FAMILY_HISTORY_PARENT_SIBLING_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FAMILY_HISTORY_PARENT_SIBLING_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FAMILY_HISTORY_PARENT_SIBLING_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FH_PARENT_SIBLING_AGE_RANGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FH_PARENT_SIBLING_CANCERS_LIST);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.FH_PARENT_SIBLING_HAD_CANCER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.IS_THIS_PERSON_CURRENTLY_LIVING);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.NAME_OR_NICKNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.WHAT_SEX_ASSIGNED_AT_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARENT_SIBLING, ID.PARENTS_SIBLING, Label.WHICH_SIDE_OF_FAMILY_IS_THIS_PERSON_ON);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PARENT_SIBLING, stableID: ID.PARENTS_SIBLING });
    })

    await test.step(`Verify: Additional Consent: Learning Abou Your Tumor Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.LEARN_ABOUT_YOUR_TUMOR, stableID: ID.LEARN_ABOUT_YOUR_TUMOR });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_YOUR_TUMOR, ID.LEARN_ABOUT_YOUR_TUMOR, Label.CONSENT_ADDENDUM_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_YOUR_TUMOR, ID.LEARN_ABOUT_YOUR_TUMOR, Label.CONSENT_ADDENDUM_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_YOUR_TUMOR, ID.LEARN_ABOUT_YOUR_TUMOR, Label.CONSENT_ADDENDUM_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_YOUR_TUMOR, ID.LEARN_ABOUT_YOUR_TUMOR, Label.CONSENT_ADDENDUM_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_YOUR_TUMOR, ID.LEARN_ABOUT_YOUR_TUMOR, Label.SIGNATURE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LEARN_ABOUT_YOUR_TUMOR, ID.LEARN_ABOUT_YOUR_TUMOR, Label.SOMATIC_CONSENT_TUMOR);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.LEARN_ABOUT_YOUR_TUMOR, stableID: ID.LEARN_ABOUT_YOUR_TUMOR });
    })

    await test.step(`Verify: Survey: About your child/you Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SURVEY_ABOUT_YOU, stableID: ID.SURVEY_ABOUT_YOU });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.ABOUT_YOU_ACTIVITY_SURVEY_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.ABOUT_YOU_ACTIVITY_SURVEY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.ABOUT_YOU_ACTIVITY_SURVEY_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.ABOUT_YOU_ACTIVITY_SURVEY_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.AFRO_HISPANIC);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.BIRTH_SEX_ASSIGN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.CONFIDENCE_LEVEL_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.GENDER_IDENTITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.HIGHEST_LEVEL_SCHOOL_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.HOW_HEARD_ABOUT_PROJECT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.INDIGENOUS_NATIVE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.MIXED_RACE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.OTHER_COMMENTS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.PROBLEM_UNDERSTANDING_WRITTEN_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.RACE_QUESTION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.READ_HOSPITAL_MATERIALS_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SURVEY_ABOUT_YOU, ID.SURVEY_ABOUT_YOU, Label.WHAT_LANGUAGE_DO_YOU_SPEAK_AT_HOME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SURVEY_ABOUT_YOU, stableID: ID.SURVEY_ABOUT_YOU });
    })

    await test.step(`Verify: Invitae Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.INVITAE, stableID: ID.INVITAE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITAE, ID.INVITAE, Label.BAM_FILE_RECEIVED_FROM_INVITAE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITAE, ID.INVITAE, Label.DATE_BAM_FILE_RECEIVED_FROM_INVITAE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITAE, ID.INVITAE, Label.DATE_REPORT_RECEIVED_FROM_INVITAE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITAE, ID.INVITAE, Label.GERMLINE_RETURN_NOTES_FIELD);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.INVITAE, stableID: ID.INVITAE });
    })

    await test.step(`Verify: Proxy Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PROXY, stableID: ID.PROXY });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROXY, ID.PROXY, Label.EMAIL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROXY, ID.PROXY, Label.FIRST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROXY, ID.PROXY, Label.LAST_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PROXY, stableID: ID.PROXY });
    })

    await test.step(`Verify: Invitation Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.INVITATION, stableID: ID.INVITATION });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.ACCEPTED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.CONTACT_EMAIL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.INVITATION_CODE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.TYPE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.VERIFIED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.INVITATION, ID.INVITATION, Label.VOIDED);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.INVITATION, stableID: ID.INVITATION });
    })

    await test.step(`Verify: Contact Information Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.CONTACT_INFORMATION, stableID: ID.CONTACT_INFORMATION });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.CITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.COUNTRY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.MAIL_TO_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.PHONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.STATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.STREET_ONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.STREET_TWO);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.VALID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.CONTACT_INFORMATION, ID.CONTACT_INFORMATION, Label.ZIP);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.CONTACT_INFORMATION, stableID: ID.CONTACT_INFORMATION });
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify a ptp with only 'OS PE-CGS' cohort tag only shows up in OS2 realm, not OS1`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    let shortId: string;

    await test.step(`Find a participant in OS2 that only has the OS PE-CGS cohort tag`, async () => {
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns(CV.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
      await customizeViewPanel.close();

      shortId = await participantListPage.findParticipantWithSingleCohortTag({ tagName: StudyName.OSTEO2 });
    })

    await test.step(`Check that the participant found above is not found within DSM -> OS1 Participant List`, async () => {
      console.log(`Checking OS1`);
      navigation = new Navigation(page, request);
      await navigation.selectStudy(StudyName.OSTEO);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortId, exactMatch: true });
      await searchPanel.search();

      const osteoParticipantListTable = participantListPage.participantListTable;
      const numberOfParticipantsDisplayed = await osteoParticipantListTable.rowsCount;
      expect(numberOfParticipantsDisplayed, `The OS2 participant ${shortId} was found to also be displayed in OS1 Participant List`).toBe(0);
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify general appearance of participant page`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const participantListTable = participantListPage.participantListTable;
    let participantPosition: number;
    let participantPage: ParticipantPage;
    let shortID: string;

    await test.step(`Use a filter to get the participants who likely have the most activities filled out`, async () => {
      const savedFilterSection = participantListPage.savedFilters;
      await savedFilterSection.openPanel();
      await savedFilterSection.exists(filterReturnOfResults);
      await savedFilterSection.open(filterReturnOfResults);
    })

    await test.step(`Choose a participant`, async () => {
      //stuff here
    })

    await test.step(`Check their profile section`, async () => {
      //stuff here
    })

    await test.step(`Check the section below profile`, async () => {
      //stuff here
    })

    await test.step(`Check for presence of all expected tabs`, async () => {
      //stuff here
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify that a ptp who resides in New York is not eligible for clinical sequencing`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const participantListTable = participantListPage.participantListTable;
    let participantPosition: number;
    let participantPage: ParticipantPage;
    let shortID: string;
    let contactInformationTab;
    let sequencingOrderTab;

    await test.step(`Use the filter to display participants whose residence is in New York state`, async () => {
      const savedFilterSection = participantListPage.savedFilters;
      await savedFilterSection.openPanel();
      await savedFilterSection.exists(filterNewYorkResidence);
      await savedFilterSection.open(filterNewYorkResidence);
    })

    await test.step(`Select a participant`, async () => {
      [participantPosition] = await participantListTable.randomizeRows();
      console.log(`Randomized row: ${participantPosition}`);
      shortID = await participantListTable.getParticipantDataAt(participantPosition, Label.SHORT_ID);
      console.log(`New York Participant Chosen: ${shortID}`);
    })

    await test.step(`Navigate to their participant page`, async () => {
      participantPage = await participantListTable.openParticipantPageAt(participantPosition);
      await participantPage.waitForReady();
    })

    await test.step(`Check that their residence is New York using the Contact Information Tab`, async () => {
      contactInformationTab = await participantPage.tablist(Tab.CONTACT_INFORMATION).click<ContactInformationTab>();
      const participantCountry = await contactInformationTab.getCountry();
      expect(participantCountry).toBe('US');
      const participantState = await contactInformationTab.getState();
      expect(participantState).toBe('NY');
    })

    await test.step(`Check that Sequencing Tab has the "Error: ...participant is not eligible for clinical sequencing" text`, async () => {
      sequencingOrderTab = await participantPage.tablist(Tab.SEQUENCING_ORDER).click<SequeuncingOrderTab>();
      await sequencingOrderTab.waitForReady();
      await sequencingOrderTab.assertParticipantNotEligibleForClinicalSequencing();
    })

    await test.step(`Delete the used NY participant list filter`, async () => {
      await participantPage.backToList();
      const savedFilterSection = participantListPage.savedFilters;
      await savedFilterSection.openPanel();
      await savedFilterSection.exists(filterNewYorkResidence);
      await savedFilterSection.delete(filterNewYorkResidence);
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify that onc history error message is present for ptps with CONSENT_TISSUE = No`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const participantListTable = participantListPage.participantListTable;
    let participantPosition: number;
    let participantPage: ParticipantPage;
    let shortID: string;
    let oncHistoryTab;

    await test.step(`Find a participant who has responded Consent=No`, async () => {
      participantPosition = await participantListPage.findParticipantFor(
        CustomizeView.RESEARCH_CONSENT_FORM,
        Label.CONSENT_TISSUE,
        { value: 'No', nth: 0 }
      );

      const consentInput = (await participantListTable.getParticipantDataAt(participantPosition, Label.CONSENT_TISSUE)).trim();
      shortID = await participantListTable.getParticipantDataAt(participantPosition, Label.SHORT_ID);
      console.log(`Consent Input = ${consentInput} for shortID: ${shortID}`);
      expect(shortID).toBeTruthy();
      expect(consentInput).toBe('No');
    })

    await test.step(`Select a participant that has only 1 response to Consent=No recorded`, async () => {
      participantPage = await participantListTable.openParticipantPageAt(participantPosition);
      await participantPage.waitForReady();
    })

    await test.step(`Check that their Onc History tab displays "This ptp did not consent to tissue message"`, async () => {
      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const participantDidNotConsentMessage = oncHistoryTab.didNotConsentMessage;
      await expect(participantDidNotConsentMessage).toBeVisible();

      const oncHistoryTable = page.locator(`//app-onc-history-detail`);
      console.log(`onc history table: ${oncHistoryTable}`);
      await expect(oncHistoryTable).toHaveCount(0);
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify that display of participant page for ptp with at least one Return of Results`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    const participantListTable = participantListPage.participantListTable;

    await test.step(`Find a participant who has had at least one Return of Results`, async () => {
      //these participants are likely to have most of the activities done + the return of results
    })

    await test.step(`Find a participant who has had at least one Return of Results`, async () => {
      //these participants are likely to have most of the activities done + the return of results
    })
  })
});
