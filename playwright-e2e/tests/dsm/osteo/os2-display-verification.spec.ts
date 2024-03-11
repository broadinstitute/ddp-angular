import { expect } from '@playwright/test';
import { QuickFiltersEnum as QuickFilter } from 'dsm/component/filters/quick-filters';
import { CustomizeView as CV, CustomizeViewID as ID, DataFilter, Label } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { mailingListCreatedDate } from 'utils/date-utils';

test.describe.serial(`${StudyName.OSTEO2}: Verify expected display of participant information @dsm @${StudyName.OSTEO2}`, () => {
  const filterReturnOfResults = `PW - Return of Results filter for OS2 - created on ${mailingListCreatedDate(new Date())}`; //named as such due to bug PEPPER-935
  const filterDidNotConsentToTissue = `PW - Did not consent to Tissue filter for OS2 - created on ${mailingListCreatedDate(new Date())}`;
  const filterNewYorkResidence = `PW - New York residence filter for OS2 - created on ${mailingListCreatedDate(new Date())}`;

  const osteoTestFilter = [
    Label.PARTICIPANT_LIST_CHECKBOX_HEADER,
    Label.COHORT_TAG_NAME,
    Label.CLINICAL_ORDER_PDO_NUMBER,
    Label.CONSENT_TISSUE,
    Label.SOMATIC_CONSENT_TUMOR,
    Label.SOMATIC_RESULTS_SURVEY_CREATED,
    Label.SELF_STATE,
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
    await customizeViewPanel.selectColumns(CV.ADDITIONAL_CONSENT_LEARNING_ABOUT_TUMOR, [Label.SOMATIC_CONSENT_TUMOR]);
    await customizeViewPanel.selectColumns(CV.WHAT_WE_LEARNED_FROM_SOMATIC_DNA, [Label.SOMATIC_RESULTS_SURVEY_CREATED]);
    await customizeViewPanel.selectColumns(CV.PREQUALIFIER_SURVEY, [Label.SELF_STATE]);
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
      await searchPanel.checkboxes(Label.SELF_STATE, { checkboxValues: ['New York'] }); //will be using just New York residence for the test
      await searchPanel.search();
      await participantListPage.assertParticipantsCountGreaterOrEqual(1);

      await participantListPage.saveCurrentView(filterNewYorkResidence);
    });

    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.search({ uri: 'ui/applyFilter?' });
    await participantListTable.assertDisplayedHeaders({ customFilter: osteoTestFilter });

    /**
     * In this case, should a participant have CONSENT_TISSUE = No, the Onc History tab should be present but nothing should be able to be inputted
     */
    await test.step(`Create a saved filter that can be used to check participants that have not consented to sharing tissue`, async () => {
      //Note - curious bug where CONSENT_TISSUE = No must be selected before Status = Enrolled - in order to get results (vice versa returns no pts - TODO make bug ticket)
      await searchPanel.open();
      await searchPanel.checkboxes(Label.CONSENT_TISSUE, { checkboxValues: [DataFilter.NO] });
      await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
      await searchPanel.text(Label.COHORT_TAG_NAME, { textValue: StudyName.OSTEO2, exactMatch: true });
      await searchPanel.search();
      await participantListPage.assertParticipantsCountGreaterOrEqual(1);

      await participantListPage.saveCurrentView(filterDidNotConsentToTissue);
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
      await searchPanel.dates(Label.SOMATIC_RESULTS_SURVEY_CREATED, { additionalFilters: [DataFilter.NOT_EMPTY] });
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
      await savedFilterSection.exists(filterDidNotConsentToTissue);
      await savedFilterSection.exists(filterReturnOfResults);

      await savedFilterSection.delete(filterNewYorkResidence);
      await savedFilterSection.delete(filterDidNotConsentToTissue);
      await savedFilterSection.delete(filterReturnOfResults);
    })
  })

  test(`${StudyName.OSTEO2}: Verify general participant list webelements`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = participantListPage.participantListTable;
    await participantListTable.assertDisplayedHeaders({ checkDefaultFilterOfStudy: true, studyName: StudyName.OSTEO2 }); //check to make sure test is starting from clean slate

    await test.step(`Verify that the Select All option is displayed`, async () => {
      await participantListPage.assertSelectAllDisplayed();
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

    //TODO add a method to check all possible column options are as expected for Customize View
    //Break each column group into test.step() and check them
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
      console.log(`\n`);
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
      console.log(`\n`);
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
      console.log(`\n`);
    })

    await test.step(`Verify: Onc History Columns`, async () => {
      //stuff here
    })

    await test.step(`Verify: Tissue Columns`, async () => {
      //stuff here
    })

    await test.step(`Verify: Sample Columns`, async () => {
      //stuff here
    })

    await test.step(`Verify: Cohort Tags Columns`, async () => {
      await customizeViewPanel.openColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });
      await customizeViewPanel.assertColumnOptionDisplayed(CV.COHORT_TAGS, ID.COHORT_TAG, Label.COHORT_TAG_NAME);
      await customizeViewPanel.closeColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });
    })

    await test.step(`Verify: Clinical Orders Columns`, async () => {
      //stuff here
    })
  })

  test.skip(`${StudyName.OSTEO2}: Verify a ptp with only 'OS PE-CGS' cohort tag only shows up in OS2 realm, not OS1`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const customizeViewPanel = participantListPage.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(CV.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
    await customizeViewPanel.close();

    const shortId = await participantListPage.findParticipantWithSingleCohortTag(StudyName.OSTEO2);
  })

  test.skip(`${StudyName.OSTEO2}: Verify general appearance of participant page`, async ({ page, request }) => {
    //stuff here
  })

  test.skip(`${StudyName.OSTEO2}: Verify that a ptp who resides in New York is not eligible for clinical sequencing`, async ({ page, request }) => {
    //stuff here - plan to use saved filter to just check that error message is displayed in Sequencing Tab e.g. "they're in NY or CA so are not eligible"
  })

  test.skip(`${StudyName.OSTEO2}: Verify that onc history is not inputted for ptps who responded CONSENT_TISSUE = No`, async ({ page, request }) => {
    //stuff here - plan to use saved filter to just check that error message is displayed in Onc History tab e.g. "they have not consented to sharing tissue"
  })

  test.skip(`${StudyName.OSTEO2}: Verify that display of participant page for ptp with at least one Return of Results`, async ({ page, request }) => {
    //stuff here
  })
})
