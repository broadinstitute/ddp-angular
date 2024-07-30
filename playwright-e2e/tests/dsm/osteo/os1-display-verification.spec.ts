import { expect } from '@playwright/test';
import CohortTag from 'dsm/component/cohort-tag';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { CustomizeView as CV, DataFilter, CustomizeViewID as ID, Label, ParticipantListPageOptions as ParticipantList, FieldSettingInputType as FieldSetting, Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import Select from 'dss/component/select';
import { SortOrder } from 'dss/component/table';
import { SurveyDataPanelEnum as SurveyName, ActivityVersionEnum as ActivityVersion } from 'dsm/component/tabs/enums/survey-data-enum';
import { test } from 'fixtures/dsm-fixture';
import { logInfo } from 'utils/log-utils';

const { DSM_BASE_URL } = process.env;
test.describe.serial(`${StudyName.OSTEO}: Verify expected display of participant information @dsm @functional @${StudyName.OSTEO}`, () => {
  test.skip(DSM_BASE_URL === undefined || (DSM_BASE_URL as string).indexOf('test') === -1);
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

    await test.step(`Verify that all Customize View options are displayed`, async () => {
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      /* Participant Columns */
      await customizeViewPanel.openColumnGroup({columnSection: CV.PARTICIPANT, stableID: ID.PARTICIPANT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.CONSENT_BLOOD_NORMAL_CASE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.CONSENT_TISSUE_NORMAL_CASE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.COUNTRY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DATE_OF_MAJORITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DDP);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DIAGNOSIS_MONTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DIAGNOSIS_YEAR);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.DO_NOT_CONTACT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.EMAIL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.FILE_UPLOAD_TIME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.FIRST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.LAST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.PARTICIPANT_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.PREFERRED_LANGUAGE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.REGISTRATION_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.SHORT_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT, ID.PARTICIPANT, Label.UPLOADED_FILE_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PARTICIPANT, stableID: ID.PARTICIPANT });

      /* Participant - DSM Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PARTICIPANT_DSM, stableID: ID.PARTICIPANT_DSM });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.DATE_WITHDRAWN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.INCOMPLETE_OR_MINIMAL_MEDICAL_RECORDS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.MR_ASSIGNEE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.ONC_HISTORY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.ONC_HISTORY_REVIEWED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PAPER_CR_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PAPER_CR_SENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PARTICIPANT_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.PATIENT_CONTACTED_FOR_PAPER_CR);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.READY_FOR_ABSTRACTION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PARTICIPANT_DSM, ID.PARTICIPANT_DSM, Label.TISSUE_ASSIGNEE);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PARTICIPANT_DSM, stableID: ID.PARTICIPANT_DSM });

      /* Medical Record Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RECORD, stableID: ID.MEDICAL_RECORD });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.DUPLICATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.FOLLOW_UP_REQUIRED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.FOLLOW_UP_REQUIRED_TEXT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INITIAL_MR_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RECORD, ID.MEDICAL_RECORD, Label.INITIAL_MR_REQUEST);
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

      /* Onc History Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.ONC_HISTORY, stableID: ID.ONC_HISTORY });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.ACCESSION_NUMBER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.DATE_OF_PX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.DESTRUCTION_POLICY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.FACILITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.FACILITY_FAX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.FACILITY_PHONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.GENDER);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.HISTOLOGY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.LOCATION_OF_PX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.ONC_HISTORY_NOTES);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.PROBLEM_WITH_TISSUE_COLUMN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.REQUEST_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_REQUEST_DATE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_REQUEST_DATE_TWO);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TISSUE_REQUEST_DATE_THREE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.TYPE_OF_PX);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ONC_HISTORY, ID.ONC_HISTORY, Label.UNABLE_TO_OBTAIN);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.ONC_HISTORY, stableID: ID.ONC_HISTORY });

      /* Tissue Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.TISSUE, stableID: ID.TISSUE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.BLOCK_ID_TO_SHL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.BLOCK_TO_SHL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.BLOCK);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.COUNT_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.DATE_SENT_TO_GP);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.TISSUE, ID.TISSUE, Label.EXPECTED_RETURN_DATE);
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

      /* Sample Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.SAMPLE, stableID: ID.SAMPLE });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.COLLABORATOR_PARTICIPANT_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.MF_CODE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.NORMAL_COLLABORATOR_SAMPLE_ID);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_DEACTIVATION);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_RECEIVED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_SENT);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.SAMPLE_TYPE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.TRACKING_IN);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.SAMPLE, ID.SAMPLE, Label.TRACKING_OUT);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SAMPLE, stableID: ID.SAMPLE });

      /* Abstraction Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.ABSTRACTION, stableID: ID.ABSTRACTION });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.ABSTRACTION, ID.ABSTRACTION, Label.ACTIVITY);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.ABSTRACTION, ID.ABSTRACTION, Label.USER);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.ABSTRACTION, stableID: ID.ABSTRACTION });

      /* Cohort Tag Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.COHORT_TAGS, ID.COHORT_TAG, Label.COHORT_TAG_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });

      /* Survey: Your Child's Osteosarcoma Columns */
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

      /* Research Consent Form Columns (adult) */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_ADULT});

      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_SURVEY_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_SURVEY_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_LAST_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_SURVEY_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_BLOOD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.CONSENT_TISSUE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_ADULT, Label.YOUR_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_ADULT});

      /* Loved One Survey Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.LOVED_ONE_SURVEY, stableID: ID.LOVED_ONE});

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
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_LOVED_ONE_FIRSTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_LOVED_ONE_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHAT_IS_RELATION_TO_LOVED_ONE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.LOVED_ONE_SURVEY, ID.LOVED_ONE, Label.WHEN_DID_LOVED_ONE_PASS_AWAY);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.LOVED_ONE_SURVEY, stableID: ID.LOVED_ONE});

      /* Research Consent & Assent Form Columns (consent-assent) */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_ASSENT_FORM, stableID: ID.CONSENT_ASSENT});

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
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_ASSENT_FORM, ID.CONSENT_ASSENT, Label.YOUR_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.RESEARCH_CONSENT_ASSENT_FORM, stableID: ID.CONSENT_ASSENT});

      /* Research Consent Form Columns (parental-consnet) */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_KID});

      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_COMPLETED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_CREATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_UPDATED);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_STATUS);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_BLOOD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CON_CHILD_LASTNAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.PARENTAL_CONSENT_TISSUE);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.RELATIONSHIP_TO_CHILD);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.YOUR_CHILD_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.CHILD_DATE_OF_BIRTH);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.RESEARCH_CONSENT_FORM, ID.RESEARCH_CONSENT_FORM_KID, Label.YOUR_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.RESEARCH_CONSENT_FORM, stableID: ID.RESEARCH_CONSENT_FORM_KID});

      /* Medical Release Form Columns (adult) */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_ADULT });

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

      /* Prequalifier Survey Columns */
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

      /* Medical Release Form Columns (pediatric/minor) */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_KID });

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

      /* Proxy Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.PROXY, stableID: ID.PROXY });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROXY, ID.PROXY, Label.EMAIL);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROXY, ID.PROXY, Label.FIRST_NAME);
      await customizeViewPanel.assertColumnOptionDisplayed(CV.PROXY, ID.PROXY, Label.LAST_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.PROXY, stableID: ID.PROXY });

      /* Invitation Columns */
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

    await test.step(`Verify that the amount of ptps with the 'OS' cohort tag is the same as the total amount of ptps in the study`, async () => {
      const amountOfStudyParticipants = await participantListTable.numOfParticipants();
      //quick check that there are participants currently displayed
      expect(amountOfStudyParticipants).toBeGreaterThan(0);

      //Do a search for 'OS' cohort tag and verify that the amount of ptps returned matched that amount in the study
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.openColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });
      await customizeViewPanel.selectColumns(CV.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
      await customizeViewPanel.closeColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.COHORT_TAG_NAME, { textValue: 'OS', exactMatch: true });
      await searchPanel.search();

      const amountOfOSTaggedParticipants = await participantListTable.numOfParticipants();
      expect(amountOfOSTaggedParticipants).toBe(amountOfStudyParticipants);
    });
  })

  test(`${StudyName.OSTEO}: Verify expected display of participant page`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantListTable = participantListPage.participantListTable;
    let participantPage: ParticipantPage;
    let shortID: string;
    let surveyDataTab: SurveyDataTab;

    //Search for an enrolled participant and check that they have the expected webelements
    await test.step(`Find a participant with most of the OS1 activities`, async () => {
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      await customizeViewPanel.openColumnGroup({ columnSection: CV.SURVEY_YOUR_CHILDS_OSTEO, stableID: ID.SURVEY_YOUR_CHILDS_OSTEO });
      await customizeViewPanel.selectColumns(CV.SURVEY_YOUR_CHILDS_OSTEO, [Label.ABOUT_CHILD_COMPLETED]);
      await customizeViewPanel.closeColumnGroup({ columnSection: CV.SURVEY_YOUR_CHILDS_OSTEO, stableID: ID.SURVEY_YOUR_CHILDS_OSTEO });

      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_KID });
      await customizeViewPanel.selectColumnsByID(
        'Medical Release Form Columns',
        [Label.INSTITUTION_UPPER_CASE],
        ID.MEDICAL_RELEASE_FORM_KID,
        { nth: 1 }
      );
      await customizeViewPanel.closeColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_KID });

      await customizeViewPanel.close();
      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
      await searchPanel.dates(Label.ABOUT_CHILD_COMPLETED, { additionalFilters: [DataFilter.NOT_EMPTY] });
      await searchPanel.search();

      //Note a.k.a TODO: when PEPPER-1434 is fixed, also do a search for Not Empty results for Institution
      const amountOfReturnedParticipants = await participantListTable.numOfParticipants();
      expect(amountOfReturnedParticipants).toBeGreaterThan(0);

      await participantListTable.sort(Label.INSTITUTION_UPPER_CASE, SortOrder.ASC);
      shortID = await participantListPage.findParticipantWithTab({
        tab: Tab.ONC_HISTORY,
        isPediatric: true,
        isAgedUpParticipant: false,
        uri: 'filterList'
      });
      participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
      logInfo(`Checking ${shortID}'s participant page`);
    });

    await test.step(`Check participant page - profile section to make sure all webelements are accounted for`, async () => {
      await participantPage.waitForReady();

      //Check the profile section
      const enrollmentStatus = await participantPage.getStatus();
      expect(enrollmentStatus).toBe(DataFilter.ENROLLED);

      const registrationDate = await participantPage.getRegistrationDate();
      expect(registrationDate).toBeTruthy();

      const participantPageShortID = await participantPage.getShortId();
      expect(participantPageShortID).toBeTruthy();

      const participantGuid = await participantPage.getGuid();
      expect(participantGuid).toBeTruthy();

      const firstName = await participantPage.getFirstName();
      expect(firstName).toBeTruthy();

      const lastName = await participantPage.getLastName();
      expect(lastName).toBeTruthy();

      const email = await participantPage.getEmail();
      expect(email).toBeFalsy(); //only adults (self-consent and aged-up ptps who have re-consented get their emails put in here)

      const doNotContactCheckbox = participantPage.getDoNotContactSection();
      await expect(doNotContactCheckbox).toBeVisible();

      const dateOfBirth = await participantPage.getDateOfBirth();
      expect(dateOfBirth).toBeTruthy();

      const dateOfMajority = await participantPage.getDateOfMajority();
      expect(dateOfMajority).toBeTruthy();

      //Date of Diagnosis is not a required question - so skipping asserting that it is present

      const consentTissueResponse = await participantPage.getConsentTissue();
      expect(consentTissueResponse).toMatch(/(Yes|No)/);

      const consentBloodResponse = await participantPage.getConsentBlood();
      expect(consentBloodResponse).toMatch(/(Yes|No)/);

      //Gender is not a required question - so skipping asserting that it is present

      const preferredLanguage = await participantPage.getPreferredLanguage();
      expect(preferredLanguage).toMatch(/(English|Español)/); //Español, in case a ptp is re-consented

      //Check that cohort tags are as expected
      const participantPageCohortTags = new CohortTag(page);
      const researchTag = participantPageCohortTags.getTag('OS');
      expect(researchTag).toBeTruthy();

      //Additional profile section check e.g. webelements usually added via Field Settings
      const participantNotes = participantPage.getFieldSettingWebelement({ name: Label.PARTICIPANT_NOTES, fieldSettingType: FieldSetting.TEXTAREA });
      await expect(participantNotes).toBeVisible();

      const oncHistoryCreated = participantPage.getFieldSettingWebelement({ name: Label.ONC_HISTORY_CREATED, fieldSettingType: FieldSetting.DATE });
      await expect(oncHistoryCreated).toBeVisible();

      const medicalRecordCheckbox = participantPage.getFieldSettingWebelement({
        name: Label.INCOMPLETE_OR_MINIMAL_MEDICAL_RECORDS,
        fieldSettingType: FieldSetting.CHECKBOX
      });
      await expect(medicalRecordCheckbox).toBeVisible();

      const readyForAbstractionCheckbox = participantPage.getFieldSettingWebelement({
        name: Label.READY_FOR_ABSTRACTION,
        fieldSettingType: FieldSetting.CHECKBOX
      });
      await expect(readyForAbstractionCheckbox).toBeVisible();

      //May be an OS1-only webelement - seen in OS1 Prod
      const patientContactedForPaperCRDate = participantPage.getFieldSettingWebelement({
        name: 'Patient Contacted for Paper C/R',
        fieldSettingType: FieldSetting.DATE
      });
      await expect(patientContactedForPaperCRDate).toBeVisible();
    });

    await test.step(`Check that expected OS1 tabs are displayed`, async () => {
      //Check that the participant has the Survey Data, Sample Information, Medical Records, Onc History tab
      //Note: following check is also done for a OS1 -> OS2 ptp in os1-to-os2-display-verification.spec.ts
      const isSurveyDataTabVisible = await participantPage.tablist(Tab.SURVEY_DATA).isVisible();
      expect(isSurveyDataTabVisible).toBeTruthy();

      //TODO Adjust the OS1 ptp creation test utility to also add a kit to the OS1 ptp, to add checking for the Sample Information tab

      const isMedicalRecordTabVisible = await participantPage.tablist(Tab.MEDICAL_RECORD).isVisible();
      expect(isMedicalRecordTabVisible).toBeTruthy();

      const isOncHistoryTabVisible = await participantPage.tablist(Tab.ONC_HISTORY).isVisible();
      expect(isOncHistoryTabVisible).toBeTruthy();

      const jumpToText = participantPage.getJumpTo();
      await jumpToText.scrollIntoViewIfNeeded();
      await expect(jumpToText).toBeVisible();

      const prequalifierSurveyLink = participantPage.getSurveyLink({ surveyName: 'Prequalifier Survey v1' });
      await expect(prequalifierSurveyLink).toBeVisible();

      const consentFormLink = participantPage.getSurveyLink({ surveyName: 'Research Consent & Assent Form v1' });
      await expect(consentFormLink).toBeVisible();

      const medicalReleaseLink = participantPage.getSurveyLink({ surveyName: 'Medical Release Form v1' });
      await expect(medicalReleaseLink).toBeVisible();
    });

    await test.step(`Check that the Prequalifier Survey is displayed as expected`, async () => {
      //Check that the participant has the Prequalifier activity
      surveyDataTab = new SurveyDataTab(page);

      //Check Prequalifier questions are all present
      const prequalActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.PREQUALIFIER,
        activityVersion: ActivityVersion.ONE
      });
      await prequalActivity.scrollIntoViewIfNeeded();
      await expect(prequalActivity).toBeVisible();
      await prequalActivity.click(); //Click to open the panel to access the questions

      const prequalSelfDescribe = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.PREQUAL_SELF_DESCRIBE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(prequalSelfDescribe);

      const currentAge = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.SELF_CURRENT_AGE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(currentAge);

      const country = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.SELF_COUNTRY
      });
      await surveyDataTab.assertActivityQuestionDisplayed(country);

      const province = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.SELF_PROVINCE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(province);

      const childAge = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.CHILD_CURRENT_AGE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childAge);

      const childCountry = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.CHILD_COUNTRY
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childCountry);

      const childState = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.CHILD_STATE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childState);

      const childProvince = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.CHILD_PROVINCE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childProvince);
    })

    await test.step(`Check that the Research Consent Form is displayed as expected`, async () => {
      surveyDataTab = new SurveyDataTab(page);

      const consentAssentActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.RESEARCH_CONSENT_ASSENT_FORM,
        activityVersion: ActivityVersion.ONE,
        checkForVisibility: false
      });
      const parentalConsentActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.RESEARCH_CONSENT_FORM,
        activityVersion: ActivityVersion.ONE,
        checkForVisibility: false
      });

      //Determine if we're looking at a consent-assent or parental-consent ptp - use this method until PEPPER-1434 is fixed
      const useConsentAssentActivity = await consentAssentActivity.isVisible();
      const consentBloodID = useConsentAssentActivity ? Label.CONSENT_ASSENT_BLOOD : Label.PARENTAL_CONSENT_BLOOD;
      const consentTissueID = useConsentAssentActivity ? Label.CONSENT_ASSENT_TISSUE : Label.PARENTAL_CONSENT_TISSUE;
      const childFirstNameID = useConsentAssentActivity ? Label.CONSENT_ASSENT_CHILD_FISRTNAME : Label.PARENTAL_CON_CHILD_FIRSTNAME;
      const childLastNameID = useConsentAssentActivity ? Label.CONSENT_ASSENT_CHILD_LASTNAME : Label.PARENTAL_CON_CHILD_LASTNAME;
      const childDateOfBirthID = useConsentAssentActivity ? Label.CONSENT_ASSENT_CHILD_DATE_OF_BIRTH : Label.PARENTAL_CON_CHILD_DATE_OF_BIRTH;
      const proxyFirstNameID = useConsentAssentActivity ? Label.CONSENT_ASSENT_FIRSTNAME : Label.PARENTAL_CONSENT_FIRSTNAME;
      const proxyLastNameID = useConsentAssentActivity ? Label.CONSENT_ASSENT_LASTNAME : Label.PARENTAL_CONSENT_LASTNAME;
      const proxyRelationshipToChildID = useConsentAssentActivity ? Label.CONSENT_ASSENT_RELATIONSHIP : Label.PARENTAL_CONSENT_RELATIONSHIP;
      const childAssentSignatureID = Label.CONSENT_ASSENT_CHILD_SIGNATURE;

      const researchConsentActivity = useConsentAssentActivity ? consentAssentActivity : parentalConsentActivity;
      await researchConsentActivity.scrollIntoViewIfNeeded();
      await expect(researchConsentActivity).toBeVisible();
      await researchConsentActivity.click();

      //Check pediatric research consent questions
      const consentBlood = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: consentBloodID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(consentBlood);

      const consentTissue = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: consentTissueID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(consentTissue);

      const studyParticipantFirstName = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: childFirstNameID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(studyParticipantFirstName);

      const studyParticipantLastName = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: childLastNameID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(studyParticipantLastName);

      const studyParticipantDateOfBirth = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: childDateOfBirthID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(studyParticipantDateOfBirth);

      const proxyFirstName = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: proxyFirstNameID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(proxyFirstName);

      const proxyLastName = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: proxyLastNameID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(proxyLastName);

      const proxyRelationshipToChild = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: proxyRelationshipToChildID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(proxyRelationshipToChild);

      if (useConsentAssentActivity) {
        const childAssentSignature = await surveyDataTab.getActivityQuestion({
          activity: researchConsentActivity,
          questionShortID: childAssentSignatureID
        });
        await surveyDataTab.assertActivityQuestionDisplayed(childAssentSignature);
      }
    })

    await test.step(`Check that the Medical Release Form is displayed as expected`, async () => {
      surveyDataTab = new SurveyDataTab(page);
      const medicalReleaseActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.MEDICAL_RELEASE_FORM,
        activityVersion: ActivityVersion.ONE
      });
      await medicalReleaseActivity.scrollIntoViewIfNeeded();
      await expect(medicalReleaseActivity).toBeVisible();
      await medicalReleaseActivity.click();

      const mailingAdress = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseActivity,
        questionShortID: Label.MAILING_ADDRESS_SHORT_ID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(mailingAdress);

      const physician = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseActivity,
        questionShortID: Label.PHYSICIAN
      });
      await surveyDataTab.assertActivityQuestionDisplayed(physician);

      const initialBiopsy = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseActivity,
        questionShortID: Label.INITIAL_BIOPSY
      });
      await surveyDataTab.assertActivityQuestionDisplayed(initialBiopsy);

      const institution = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseActivity,
        questionShortID: Label.INSTITUTION_UPPER_CASE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(institution);

      const releaseMinorAgreement = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseActivity,
        questionShortID: Label.RELEASE_MINOR_AGREEMENT
      });
      await surveyDataTab.assertActivityQuestionDisplayed(releaseMinorAgreement);
    })

    await test.step(`Check that the Survey: Your Child's Osteosarcoma is displayed as expected`, async () => {
      surveyDataTab = new SurveyDataTab(page);

      //Check that the participant has the Survey: Your Child's Osteosarcoma activity
      const yourChildOsteoActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.SURVEY_YOUR_CHILDS_OSTEOSARCOMA,
        activityVersion: ActivityVersion.ONE,
      });
      await yourChildOsteoActivity.scrollIntoViewIfNeeded();
      await expect(yourChildOsteoActivity).toBeVisible();
      await yourChildOsteoActivity.click();

      const fillingOutSurvey = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.WHO_IS_FILLING_ID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(fillingOutSurvey);

      const childDiagnosisDate = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_DIAGNOSIS_DATE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childDiagnosisDate);

      const childSymptomStartTime = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_SYMPTOMS_START_TIME
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childSymptomStartTime);

      const childInitialBodyLocation = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_INITIAL_BODY_LOC
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childInitialBodyLocation);

      const childCurrentBodyLocation = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_CURRENT_BODY_LOC
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childCurrentBodyLocation);

      const childHadRadiation = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_HAD_RADIATION
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childHadRadiation);

      const childTherapiesReceived = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_THERAPIES_RECEIVED
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childTherapiesReceived);

      const childEverRelapsed = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_EVER_RELAPSED
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childEverRelapsed);

      const childCurrentlyTreated = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_CURRENTLY_TREATED
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childCurrentlyTreated);

      const childOtherCancers = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_OTHER_CANCERS
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childOtherCancers);

      const childOtherCancersList = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_OTHER_CANCERS_LIST
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childOtherCancersList);

      const childExperience = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_EXPERIENCE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childExperience);

      const childHispanic = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_HISPANIC
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childHispanic);

      const childRace = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_RACE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childRace);

      const childHowHeardAboutProject = await surveyDataTab.getActivityQuestion({
        activity: yourChildOsteoActivity,
        questionShortID: Label.CHILD_HOW_HEARD_ID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(childHowHeardAboutProject);
    })
  })
})
