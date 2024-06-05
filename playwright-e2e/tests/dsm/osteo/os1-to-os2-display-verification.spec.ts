import { expect } from '@playwright/test';
import CohortTag from 'dsm/component/cohort-tag';
import { FieldSettingInputType as FieldSetting, Label, Tab } from 'dsm/enums';
import { Navigation, Samples, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { logInfo } from 'utils/log-utils';
import { totalNumberOfOccurences } from 'utils/test-utils';
import { SurveyDataPanelEnum as SurveyName, ActivityVersionEnum as ActivityVersion } from 'dsm/component/tabs/enums/survey-data-enum';
import { language } from 'googleapis/build/src/apis/language';
import OncHistoryTable from 'dsm/component/tables/onc-history-table';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import { OsteoOncHistoryUpload } from 'dsm/component/models/onc-history-upload-interface';
import KitsSearchPage, { SearchByField } from 'dsm/pages/kits-search-page';

test.describe.serial(`${StudyName.OSTEO} -> ${StudyName.OSTEO2}: Verify expected display of participant information @dsm`, () => {
  //Use 1 participant throughout the test to check the display of information
  let shortID = '';
  let navigation;
  let participantListPage: ParticipantListPage;
  let participantListTable;
  let participantPage;
  let surveyDataTab;
  let sampleInformationTab;
  let medicalRecordsTab;
  let oncHistoryTab;

  test(`${StudyName.OSTEO}: Find a participant who is re-consented into ${StudyName.OSTEO2}`, async ({ page, request }) => {
    //Find a re-consented participant by searching for those who have both `OS` and `OS PE-CGS` tags
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    await test.step(`Find a participant who has the 'OS' and 'OS PE-CGS' tags`, async () => {
      //Search for enrolled participants who have both the 'OS' and 'OS PE-CGS' tag, have onc history, and have a kit (to be able to check everything)
      shortID = await participantListPage.findParticipantWithTab({
        tab: Tab.ONC_HISTORY,
        cohortTags: ['OS', 'OS PE-CGS'],
        shouldHaveOncHistory: true
      });
    })
  })

  test(`OS2: Verify the OS1 participant can be found in the OS2 Participant List`, async ({ page, request }) => {
    await test.step(`Verify that the OS1 re-consented participant can be seen in the OS2 Participant List`, async () => {
        //Check that the chosen participant can also be seen in OS2 Participant List'
        navigation = new Navigation(page, request);
        await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

        participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.text(Label.SHORT_ID, { textValue: shortID, exactMatch: true })
        await searchPanel.search();

        participantListTable = participantListPage.participantListTable;
        const numberOfReturnedParticipants = await participantListTable.rowsCount;
        expect(numberOfReturnedParticipants).toBe(1);

        //Check that the chosen participant also has the 'OS' and 'OS PE-CGS' cohort tags in OS2 Participant List
        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Cohort Tags Columns', ['Cohort Tag Name']);
        await customizeViewPanel.close();

        const cohortTags = await participantListTable.getParticipantDataAt(0, 'Cohort Tag Name');
        expect(cohortTags).toContain('OS');
        expect(cohortTags).toContain('OS PE-CGS');

        //Check the amount of times the tags are added to the participants (duplicate tags are not allowed - each Osteo tag should only be added once)
        const cohortTagArray = cohortTags.split('\n\n');
        logInfo(`cohort tags as array: ${cohortTagArray.join(', ')}`);
        const researchOsteoTagOccurences = totalNumberOfOccurences({ arrayToSearch: cohortTagArray, wordToSearchFor: 'OS' });
        const clinicalOsteoTagOccurences = totalNumberOfOccurences({ arrayToSearch: cohortTagArray, wordToSearchFor: 'OS PE-CGS' });
        expect(researchOsteoTagOccurences).toBe(1);
        expect(clinicalOsteoTagOccurences).toBe(1);
    })
  })

  test(`OS1: Verify that the participant page has the expected display`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    await participantListPage.filterListByShortId(shortID);
    participantListTable = participantListPage.participantListTable;
    const participantPage = await participantListTable.openParticipantPageAt(0);

    await test.step(`Check that expected OS1 profile webelements are as expected`, async () => {
      await participantPage.waitForReady();

      //General profile section check
      const enrollmentStatus = await participantPage.getStatus();
      expect(enrollmentStatus).toMatch(/(Enrolled|Exited after Enrollment)/); //Since chosen test participant should at least have been enrolled

      const registrationDate = await participantPage.getRegistrationDate();
      expect(registrationDate).toBeTruthy();

      const participantPageShortID = await participantPage.getShortId();
      expect(participantPageShortID).toBe(shortID);
      const guid = await participantPage.getGuid();
      expect(guid).toBeTruthy();

      const firstName = await participantPage.getFirstName();
      expect(firstName).toBeTruthy();
      const lastName = await participantPage.getLastName();
      expect(lastName).toBeTruthy();

      const doNotContact = participantPage.getDoNotContactSection();
      await expect(doNotContact).toBeVisible();

      const dateOfBirth = await participantPage.getDateOfBirth();
      expect(dateOfBirth).toBeTruthy();

      //Gender is an optional question - so skipping validation for that

      const preferredLanguage = await participantPage.getPreferredLanguage();
      expect(preferredLanguage).toMatch(/(English|Español)/);

      const participantPageCohortTags = new CohortTag(page);
      const researchTag = participantPageCohortTags.getTag('OS');
      const clinicalTag = participantPageCohortTags.getTag('OS PE-CGS');

      expect(researchTag).toBeTruthy();
      await expect(researchTag).toBeVisible();

      expect(clinicalTag).toBeTruthy();
      await expect(clinicalTag).toBeVisible();

      //Additional profile section check e.g. webelements usually added via Field Settings
      const participantNotes = participantPage.getFieldSettingWebelement({ name: Label.PARTICIPANT_NOTES, fieldSettingType: FieldSetting.TEXTAREA });
      await expect(participantNotes).toBeVisible();

      const oncHistoryCreated = participantPage.getFieldSettingWebelement({ name: Label.ONC_HISTORY_CREATED, fieldSettingType: FieldSetting.DATE });
      await expect(oncHistoryCreated).toBeVisible();

      const oncHistoryReviewed = participantPage.getOncHistoryReviewed();
      await expect(oncHistoryReviewed).toBeVisible();

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
    })

    await test.step(`Check that expected OS1 tabs are displayed`, async () => {
      //Check that the participant has the Survey Data, Sample Information, Medical Records, Onc History tab
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

      const consentFormLink = participantPage.getSurveyLink({ surveyName: 'Research Consent Form v1' });
      await expect(consentFormLink).toBeVisible();

      const medicalReleaseLink = participantPage.getSurveyLink({ surveyName: 'Medical Release Form v1' });
      await expect(medicalReleaseLink).toBeVisible();
    })

    await test.step(`Check that the Prequalifier Survey is displayed as expected`, async () => {
      //Check that the participant has the Prequalifier activity
      surveyDataTab = new SurveyDataTab(page);

      //Check Prequalifier questions are all present
      const prequalActivity = await surveyDataTab.getActivity({ activityName: SurveyName.PREQUALIFIER, activityVersion: ActivityVersion.ONE });
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

      //Check that the participant has the Research Consent activity
      const researchConsentActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.RESEARCH_CONSENT_FORM,
        activityVersion: ActivityVersion.ONE
      });
      await researchConsentActivity.scrollIntoViewIfNeeded();
      await expect(researchConsentActivity).toBeVisible();
      await researchConsentActivity.click();

      //Check Consent questions are all present
      const consentBlood = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: Label.CONSENT_BLOOD
      });
      await surveyDataTab.assertActivityQuestionDisplayed(consentBlood);

      const consentTissue = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: Label.CONSENT_TISSUE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(consentTissue);

      const participantFirstName = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: Label.CONSENT_FIRSTNAME
      });
      await surveyDataTab.assertActivityQuestionDisplayed(participantFirstName);

      const participantLastName = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: Label.CONSENT_LASTNAME
      });
      await surveyDataTab.assertActivityQuestionDisplayed(participantLastName);

      const dateOfBirth = await surveyDataTab.getActivityQuestion({
        activity: researchConsentActivity,
        questionShortID: Label.CONSENT_DOB
      });
      await surveyDataTab.assertActivityQuestionDisplayed(dateOfBirth);
    })

    await test.step(`Check that the Medical Release Survey is displayed as expected`, async () => {
      //Check that the participant has the Medical Release activity
      surveyDataTab = new SurveyDataTab(page);

      //Check Medical Release questions are all present
      const medicalReleaseFormActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.MEDICAL_RELEASE_FORM,
        activityVersion: ActivityVersion.ONE
      });

      const mailingAddress = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseFormActivity,
        questionShortID: Label.MAILING_ADDRESS_SHORT_ID
      });
      await surveyDataTab.assertActivityQuestionDisplayed(mailingAddress);

      const physician = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseFormActivity,
        questionShortID: Label.PHYSICIAN
      });
      await surveyDataTab.assertActivityQuestionDisplayed(physician);

      const initialBiopsy = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseFormActivity,
        questionShortID: Label.INITIAL_BIOPSY
      });
      await surveyDataTab.assertActivityQuestionDisplayed(initialBiopsy);

      const institution = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseFormActivity,
        questionShortID: Label.INSTITUTION_UPPER_CASE
      });
      await surveyDataTab.assertActivityQuestionDisplayed(institution);

      const releaseAgreement = await surveyDataTab.getActivityQuestion({
        activity: medicalReleaseFormActivity,
        questionShortID: Label.RELEASE_SELF_AGREEMENT
      });
      await surveyDataTab.assertActivityQuestionDisplayed(releaseAgreement);
    })

    await test.step(`Check that OS2-specific activities are not present in OS1 Participant Page -> Survey Data tab`, async () => {
      //Check that OS2-specific activities are not present in Participant Page -> Survey Data tab
      /* These are the following:
          Additional details (v1) [for Family History activity]
          Biologival / Birth Parent 1: Assigend female at birth (v1) [for Family History activity]
          Biological / Birth Parent 2: Assigned male at birth (v1) [for Family History activity]
          Survey: Family History of Cancer (v2)
          Survey: Your Child's/Your Osteosarcoma (v2) [OS1 has v1]
          Survey: About your child/you (v2)
          Add child participant (v1)
      */
      surveyDataTab = new SurveyDataTab(page);

      const additionalDetailsPanel = await surveyDataTab.getActivity({
        activityName: SurveyName.ADDITIONAL_DETAILS,
        activityVersion: ActivityVersion.ONE,
        checkForVisibility: false
      });
      await expect(additionalDetailsPanel).not.toBeVisible();

      const birthParentFemalePanel = await surveyDataTab.getActivity({
        activityName: SurveyName.FAMILIY_HISTORY_BIOLOGICAL_PARENT_FEMALE,
        activityVersion: ActivityVersion.ONE,
        checkForVisibility: false
      });
      await expect(birthParentFemalePanel).not.toBeVisible();

      const birthParentMalePanel = await surveyDataTab.getActivity({
        activityName: SurveyName.FAMILY_HISTORY_BIOLOGICAL_PARENT_MALE,
        activityVersion: ActivityVersion.ONE,
        checkForVisibility: false
      });
      await expect(birthParentMalePanel).not.toBeVisible();

      const familyHistoryActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.SURVEY_FAMILY_HISTORY_OF_CANCER,
        activityVersion: ActivityVersion.TWO,
        checkForVisibility: false
      });
      await expect(familyHistoryActivity).not.toBeVisible();

      const yourOsteosarcomaActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.SURVEY_YOUR_OR_YOUR_CHILDS_OSTEOSARCOMA,
        activityVersion: ActivityVersion.TWO,
        checkForVisibility: false
      });
      await expect(yourOsteosarcomaActivity).not.toBeVisible();

      const aboutYouActivity = await surveyDataTab.getActivity({
        activityName: SurveyName.SURVEY_ABOUT_YOU_OR_YOUR_CHILD,
        activityVersion: ActivityVersion.TWO,
        checkForVisibility: false
      });
      await expect(aboutYouActivity).not.toBeVisible();

      const addChildParticipantPanel = await surveyDataTab.getActivity({
        activityName: SurveyName.ADD_CHILD_PARTICIPANT,
        activityVersion: ActivityVersion.ONE,
        checkForVisibility: false
      });
      await expect(addChildParticipantPanel).not.toBeVisible();
    })
  })

  test(`OS1: Verify OS1 onc history cannot be found in OS2`, async ({ page, request }) => {
    const previousOncHistory: OsteoOncHistoryUpload[] = [];

    await test.step(`Get test participant's OS1 onc history`, async () => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);
      participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();
      await participantListPage.filterListByShortId(shortID);
      participantListTable = participantListPage.participantListTable;
      const participantPage = await participantListTable.openParticipantPageAt(0);

      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable: OncHistoryTable = oncHistoryTab.table;

      //There is usually an extra row that is empty and ready for input
      const numberOfRows = await oncHistoryTable.getRowsCount() - 1;
      expect(numberOfRows).toBeGreaterThanOrEqual(1);
      /**
       * Check for the following columns:
       * Date of PX
       * Type of PX
       * Location of PX
       * Histology
       * Accession Number
       * Facility
       * Phone
       * Fax
       * Destruction Policy (years)
       * Request Status
       */
      for (let index = 0; index < numberOfRows; index++) {
        const oncHistoryID = await oncHistoryTable.getRowID(Label.DATE_OF_PX, index);
        const dateOfPX = await oncHistoryTable.getFieldValue(Label.DATE_OF_PX, index);
        const typeOfPX = await oncHistoryTable.getFieldValue(Label.TYPE_OF_PX, index);
        const locationOfPX = await oncHistoryTable.getFieldValue(Label.LOCATION_OF_PX, index);
        const histology = await oncHistoryTable.getFieldValue(Label.HISTOLOGY, index);
        const accessionNumber = await oncHistoryTable.getFieldValue(Label.ACCESSION_NUMBER, index);
        const facilityName = await oncHistoryTable.getFieldValue(Label.FACILITY, index);
        const facilityPhoneNumber = await oncHistoryTable.getFieldValue(Label.PHONE, index);
        const facilityFaxNumber = await oncHistoryTable.getFieldValue(Label.FAX, index);
        const destructionPolicy = await oncHistoryTable.getFieldValue(Label.DESTRUCTION_POLICY, index);
        const requestStatus = await oncHistoryTable.getFieldValue(Label.REQUEST, index);

        const oncHistory: OsteoOncHistoryUpload = {
          DATE_PX: dateOfPX,
          TYPE_PX: typeOfPX,
          LOCATION_PX: locationOfPX,
          HISTOLOGY: histology,
          ACCESSION: accessionNumber,
          FACILITY: facilityName,
          PHONE: facilityPhoneNumber,
          FAX: facilityFaxNumber,
          DESTRUCTION: destructionPolicy,
          REQUEST_STATUS: requestStatus,
          RECORD_ID: '',
          ROW_ID: oncHistoryID
        }
        previousOncHistory.push(oncHistory);
      }

      await participantPage.backToList();
      await participantListPage.waitForReady();
      logInfo(`Total onc histories: ${previousOncHistory.length}\n\n`);
    })

    await test.step(`Check OS2 for OS1 onc history`, async () => {
      navigation = new Navigation(page, request);
      await navigation.selectStudy(StudyName.OSTEO2);
      await participantListPage.filterListByShortId(shortID);
      participantListTable = participantListPage.participantListTable;
      participantPage = await participantListTable.openParticipantPageAt(0);

      oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
      const oncHistoryTable: OncHistoryTable = oncHistoryTab.table;
      const numberOfRows = await oncHistoryTable.getRowsCount() - 1;
      expect(numberOfRows).toBeGreaterThanOrEqual(1);
      console.log(`Number of OS2 onc history for ptp ${shortID}: ${numberOfRows}`);

      const clinicalOncHistories: OsteoOncHistoryUpload[] = [];
      for (let index = 0; index < numberOfRows; index++) {
        const clinicalOncHistoryID = await oncHistoryTable.getRowID(Label.DATE_OF_PX, index);
        const clinicalDateOfPX = await oncHistoryTable.getFieldValue(Label.DATE_OF_PX, index);
        const clinicalTypeOfPX = await oncHistoryTable.getFieldValue(Label.TYPE_OF_PX, index);
        const clinicalLocationOfPX = await oncHistoryTable.getFieldValue(Label.LOCATION_OF_PX, index);
        const clinicalHistology = await oncHistoryTable.getFieldValue(Label.HISTOLOGY, index);
        const clinicalAccessionNumber = await oncHistoryTable.getFieldValue(Label.ACCESSION_NUMBER, index);
        const clinicalFacilityName = await oncHistoryTable.getFieldValue(Label.FACILITY, index);
        const clinicalFacilityPhoneNumber = await oncHistoryTable.getFieldValue(Label.PHONE, index);
        const clinicalFacilityFaxNumber = await oncHistoryTable.getFieldValue(Label.FAX, index);
        const clinicalDestructionPolicy = await oncHistoryTable.getFieldValue(Label.DESTRUCTION_POLICY, index);
        const clinicalRequestStatus = await oncHistoryTable.getFieldValue(Label.REQUEST, index);

        const clinicalOncHistory: OsteoOncHistoryUpload = {
          DATE_PX: clinicalDateOfPX,
          TYPE_PX: clinicalTypeOfPX,
          LOCATION_PX: clinicalLocationOfPX,
          HISTOLOGY: clinicalHistology,
          ACCESSION: clinicalAccessionNumber,
          FACILITY: clinicalFacilityName,
          PHONE: clinicalFacilityPhoneNumber,
          FAX: clinicalFacilityFaxNumber,
          DESTRUCTION: clinicalDestructionPolicy,
          REQUEST_STATUS: clinicalRequestStatus,
          RECORD_ID: '',
          ROW_ID: clinicalOncHistoryID
        }
        clinicalOncHistories.push(clinicalOncHistory);
      }

      for (let index = 0; index < previousOncHistory.length; index++) {
        const researchOncHistory = previousOncHistory[index];
        expect(clinicalOncHistories.includes(researchOncHistory)).toBeFalsy();
      }
    })
  })

  test(`OS2: Verify a re-consented participant has the expected display`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    await participantListPage.filterListByShortId(shortID);
    participantListTable = participantListPage.participantListTable;
    const participantPage = await participantListTable.openParticipantPageAt(0);

    //Check profile info
    const enrollmentStatus = await participantPage.getStatus();
    expect(enrollmentStatus).toMatch(/(Enrolled|Exited after Enrollment)/); //Since chosen test participant should at least have been enrolled

    const registrationDate = await participantPage.getRegistrationDate();
    expect(registrationDate).toBeTruthy();

    const participantPageShortID = await participantPage.getShortId();
    expect(participantPageShortID).toBe(shortID);
    const guid = await participantPage.getGuid();
    expect(guid).toBeTruthy();

    const firstName = await participantPage.getFirstName();
    expect(firstName).toBeTruthy();
    const lastName = await participantPage.getLastName();
    expect(lastName).toBeTruthy();

    const doNotContact = participantPage.getDoNotContactSection();
    await expect(doNotContact).toBeVisible();

    const dateOfBirth = await participantPage.getDateOfBirth();
    expect(dateOfBirth).toBeTruthy();

    //Gender is an optional question - so skipping validation for that
    const preferredLanguage = await participantPage.getPreferredLanguage();
    expect(preferredLanguage).toMatch(/(English|Español)/);

    //Check that cohort tags are as expected
    const participantPageCohortTags = new CohortTag(page);
    const researchTag = participantPageCohortTags.getTag('OS');
    const clinicalTag = participantPageCohortTags.getTag('OS PE-CGS');

    expect(researchTag).toBeTruthy();
    await expect(researchTag).toBeVisible();

    expect(clinicalTag).toBeTruthy();
    await expect(clinicalTag).toBeVisible();

    //Additional profile section check e.g. webelements usually added via Field Settings
    const participantNotes = participantPage.getFieldSettingWebelement({ name: Label.PARTICIPANT_NOTES, fieldSettingType: FieldSetting.TEXTAREA });
    await expect(participantNotes).toBeVisible();

    const oncHistoryCreated = participantPage.getFieldSettingWebelement({ name: Label.ONC_HISTORY_CREATED, fieldSettingType: FieldSetting.DATE });
    await expect(oncHistoryCreated).toBeVisible();

    const oncHistoryReviewed = participantPage.getOncHistoryReviewed();
    await expect(oncHistoryReviewed).toBeVisible();

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

    //Check that Survey Data tab is as expected
    /**
     * For consistency - will check for the following activities (playwright fills out family history activity for adult):
     * Prequalifier Survey
     * Research Consent Form
     * Additional Consent: Learning About Your Tumor
     * Medical Release Form
     * Additional Details
     * Child (playwright adds 1 child)
     * Grandparent (playwright adds 4 grandparents)
     * Half-Sibling (playwright adds 1 half-sibling)
     * Parent's Sibling (playwright adds 2 parent's siblings)
     * Biological / Birth Parent 1: Assigned female at birth
     * Biological / Birth Parent 2: Assigned male at birth
     * Sibling (playwright adds 2 siblings)
     * Survey: Your Child's/Your Osteosarcoma
     * Survey: About your child/you
     * Survey: Family History of Cancer
     */
    surveyDataTab = new SurveyDataTab(page);

    /* Prequalifier Activity */
    const prequalifierActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.PREQUALIFIER,
      activityVersion: ActivityVersion.ONE
    });
    await prequalifierActivity.scrollIntoViewIfNeeded();
    await expect(prequalifierActivity).toBeVisible();

    /* Research Consent Form Activities - from OS1 and OS2 */
    const researchConsentActivityForOS1 = await surveyDataTab.getActivity({
      activityName: SurveyName.RESEARCH_CONSENT_FORM,
      activityVersion: ActivityVersion.ONE
    });
    await researchConsentActivityForOS1.scrollIntoViewIfNeeded();
    await expect(researchConsentActivityForOS1).toBeVisible();

    const researchConsentActivityForOS2 = await surveyDataTab.getActivity({
      activityName: SurveyName.RESEARCH_CONSENT_FORM,
      activityVersion: ActivityVersion.THREE
    });
    await researchConsentActivityForOS2.scrollIntoViewIfNeeded();
    await expect(researchConsentActivityForOS2).toBeVisible();

    /* Consent Addendum Activity */
    const consentAddendumActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.CONSENT_ADDENDUM,
      activityVersion: ActivityVersion.THREE
    });
    await consentAddendumActivity.scrollIntoViewIfNeeded();
    await expect(consentAddendumActivity).toBeVisible();

    /* Medical Release Form Activity */
    const medicalReleaseFormActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.MEDICAL_RELEASE_FORM,
      activityVersion: ActivityVersion.ONE
    });
    await medicalReleaseFormActivity.scrollIntoViewIfNeeded();
    await expect(medicalReleaseFormActivity).toBeVisible();

    /* Additional Details section (from Family History Activity) */
    const additionalDetails = await surveyDataTab.getActivity({
      activityName: SurveyName.ADDITIONAL_DETAILS,
      activityVersion: ActivityVersion.ONE
    });
    await additionalDetails.scrollIntoViewIfNeeded();
    await expect(additionalDetails).toBeVisible();

    /* Child section (from Family History Activity) */
    const familyHistoryForChild = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_CHILD,
      activityVersion: ActivityVersion.ONE
    });
    await familyHistoryForChild.scrollIntoViewIfNeeded();
    await expect(familyHistoryForChild).toBeVisible();

    /* Grandparents section (from Family History Activity) */
    const familyHistoryForGrandparentOne = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_GRANDPARENT,
      activityVersion: ActivityVersion.ONE,
      nth: 1
    });
    await familyHistoryForGrandparentOne.scrollIntoViewIfNeeded();
    await expect(familyHistoryForGrandparentOne).toBeVisible();

    const familyHistoryForGrandparentTwo = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_GRANDPARENT,
      activityVersion: ActivityVersion.ONE,
      nth: 2
    });
    await familyHistoryForGrandparentTwo.scrollIntoViewIfNeeded();
    await expect(familyHistoryForGrandparentTwo).toBeVisible();

    const familyHistoryForGrandparentThree = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_GRANDPARENT,
      activityVersion: ActivityVersion.ONE,
      nth: 3
    });
    await familyHistoryForGrandparentThree.scrollIntoViewIfNeeded();
    await expect(familyHistoryForGrandparentThree).toBeVisible();

    const familyHistoryForGrandparentFour = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_GRANDPARENT,
      activityVersion: ActivityVersion.ONE,
      nth: 4
    });
    await familyHistoryForGrandparentFour.scrollIntoViewIfNeeded();
    await expect(familyHistoryForGrandparentFour).toBeVisible();

    /* Half-Sibling section (from Family History Activity) */
    const familyHistoryForHalfSibling = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_HALF_SIBLING,
      activityVersion: ActivityVersion.ONE
    });
    await familyHistoryForHalfSibling.scrollIntoViewIfNeeded();
    await expect(familyHistoryForHalfSibling).toBeVisible();

    /* Parent's Sibling section (from Family History Activity) */
    const familyHistoryForParentSiblingOne = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_PARENTS_SIBLING,
      activityVersion: ActivityVersion.ONE,
      nth: 1
    });
    await familyHistoryForParentSiblingOne.scrollIntoViewIfNeeded();
    await expect(familyHistoryForParentSiblingOne).toBeVisible();

    const familyHistoryForParentSiblingTwo = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_PARENTS_SIBLING,
      activityVersion: ActivityVersion.ONE,
      nth: 2
    });
    await familyHistoryForParentSiblingTwo.scrollIntoViewIfNeeded();
    await expect(familyHistoryForParentSiblingTwo).toBeVisible();

    /* Birth Parents (female & male) section (from Family History Activity) */
    const familyHistoryForFemaleBirthParent = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILIY_HISTORY_BIOLOGICAL_PARENT_FEMALE,
      activityVersion: ActivityVersion.ONE
    });
    await familyHistoryForFemaleBirthParent.scrollIntoViewIfNeeded();
    await expect(familyHistoryForFemaleBirthParent).toBeVisible();

    const familyHistoryForMaleBirthParent = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_BIOLOGICAL_PARENT_MALE,
      activityVersion: ActivityVersion.ONE
    });
    await familyHistoryForMaleBirthParent.scrollIntoViewIfNeeded();
    await expect(familyHistoryForMaleBirthParent).toBeVisible();

    /* Sibling section (from Family History Activity) */
    const familyHistoryForSiblingOne = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_SIBLING,
      activityVersion: ActivityVersion.ONE,
      nth: 1
    });
    await familyHistoryForSiblingOne.scrollIntoViewIfNeeded();
    await expect(familyHistoryForSiblingOne).toBeVisible();

    const familyHistoryForSiblingTwo = await surveyDataTab.getActivity({
      activityName: SurveyName.FAMILY_HISTORY_SIBLING,
      activityVersion: ActivityVersion.ONE,
      nth: 2
    });
    await familyHistoryForSiblingTwo.scrollIntoViewIfNeeded();
    await expect(familyHistoryForSiblingTwo).toBeVisible();

    /* Your Osteosarcoma Activity */
    const yourOsteosarcomaActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.SURVEY_YOUR_OR_YOUR_CHILDS_OSTEOSARCOMA,
      activityVersion: ActivityVersion.TWO
    });
    await yourOsteosarcomaActivity.scrollIntoViewIfNeeded();
    await expect(yourOsteosarcomaActivity).toBeVisible();

    /* About You Activity */
    const aboutYouActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.SURVEY_ABOUT_YOU_OR_YOUR_CHILD,
      activityVersion: ActivityVersion.TWO
    });
    await aboutYouActivity.scrollIntoViewIfNeeded();
    await expect(aboutYouActivity).toBeVisible();

    /* Family History Activity */
    const familyHistoryActivity = await surveyDataTab.getActivity({
      activityName: SurveyName.SURVEY_FAMILY_HISTORY_OF_CANCER,
      activityVersion: ActivityVersion.TWO
    });
    await familyHistoryActivity.scrollIntoViewIfNeeded();
    await expect(familyHistoryActivity).toBeVisible();
  })

  //TODO add a sample kit to OS1 test utility ptps
  test(`OS1: Verify OS1 kits cannot be found in OS2`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    //Check using the Kit Search page
    const kitSearchPage = await navigation.selectFromSamples<KitsSearchPage>(Samples.SEARCH);
    await kitSearchPage.waitForReady();
    await kitSearchPage.searchByField(SearchByField.SHORT_ID, shortID);

    //Get a list of the participant's kit shipping ids
    const researchShippingIDs = await kitSearchPage.getKitInformationFrom({ column: Label.SHIPPING_ID });

    //If the participant had kits in OS1, check for them in OS2
    if (researchShippingIDs.length >= 1) {
      await navigation.selectStudy(StudyName.OSTEO2);
      await navigation.selectFromSamples<KitsSearchPage>(Samples.SEARCH);
      await kitSearchPage.searchByField(SearchByField.SHORT_ID, shortID);
      await kitSearchPage.checkForAbsenceOfKitInformationInColumn({ column: Label.SHIPPING_ID, kitInformation: researchShippingIDs });
    }
  })

  test(`OS2: Verify OS2 kits cannot be found in OS1`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO2);

    //Check using the Kit Search page
    const kitSearchPage = await navigation.selectFromSamples<KitsSearchPage>(Samples.SEARCH);
    await kitSearchPage.waitForReady();
    await kitSearchPage.searchByField(SearchByField.SHORT_ID, shortID);

    //Get a list of the participant's kit shipping ids
    const clinicalShippingIDs = await kitSearchPage.getKitInformationFrom({ column: Label.SHIPPING_ID });

    //If the participant had kits in OS2, check for them in OS1
    if (clinicalShippingIDs.length >= 1) {
      await navigation.selectStudy(StudyName.OSTEO);
      await navigation.selectFromSamples<KitsSearchPage>(Samples.SEARCH);
      await kitSearchPage.searchByField(SearchByField.SHORT_ID, shortID);
      await kitSearchPage.checkForAbsenceOfKitInformationInColumn({ column: Label.SHIPPING_ID, kitInformation: clinicalShippingIDs });
    }
  })
});
