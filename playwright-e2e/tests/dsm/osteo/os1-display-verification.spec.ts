import { expect } from '@playwright/test';
import { QuickFiltersEnum } from 'dsm/component/filters/quick-filters';
import { CustomizeView as CV, CustomizeViewID as ID, Label, ParticipantListPageOptions as ParticipantList } from 'dsm/enums';
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

      /* Tissue Columns */

      /* Sample Columns */

      /* Abstraction Columns */

      /* Cohort Tag Columns */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.COHORT_TAGS, ID.COHORT_TAG, Label.COHORT_TAG_NAME);

      await customizeViewPanel.closeColumnGroup({ columnSection: CV.COHORT_TAGS, stableID: ID.COHORT_TAG });

      /* Survey: Your Child's Osteosarcoma Columns */

      /* Research Consent Form Columns (adult) */

      /* Loved One Survey Columns */

      /* Research Consent & Assent Form Columns (consent-assent) */

      /* Research Consent Form Columns (parental-consnet) */

      /* Medical Release Form Columns (adult) */
      await customizeViewPanel.openColumnGroup({ columnSection: CV.MEDICAL_RELEASE_FORM, stableID: ID.MEDICAL_RELEASE_FORM_ADULT });

      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_ADULT, Label.INSTITUTION);
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
      await customizeViewPanel.assertColumnOptionDisplayed(CV.MEDICAL_RELEASE_FORM, ID.MEDICAL_RELEASE_FORM_KID, Label.INSTITUTION);
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

    //Check that the amount of participants with the 'OS' cohort tag is a match for total participants in the study
  })

  test.skip(`${StudyName.OSTEO}: Verify expected display of participant page`, async ({ page, request }) => {
    //stuff here
  })
})
