import { expect } from '@playwright/test';
import CohortTag from 'dsm/component/cohort-tag';
import { FieldSettingInputType as FieldSetting, Label, Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { logInfo } from 'utils/log-utils';
import { totalNumberOfOccurences } from 'utils/test-utils';
import { SurveyDataPanelEnum as SurveyName, ActivityVersionEnum as ActivityVersion } from 'dsm/component/tabs/enums/survey-data-enum';

test.describe.serial(`${StudyName.OSTEO} -> ${StudyName.OSTEO2}: Verify expected display of participant information @dsm`, () => {
  //Use 1 participant throughout the test to check the display of information
  let shortID = '';
  let navigation;
  let participantListPage: ParticipantListPage;
  let participantListTable;
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
        shouldHaveOncHistory: true,
        shouldHaveKits: true,
      });
    })
  })

  test(`OS2: Verify the OS1 participant can be found in the OS2 Participant List`, async ({ page, request }) => {
    await test.step(`name`, async () => {
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

      const isSampleInformationTabVisible = await participantPage.tablist(Tab.SAMPLE_INFORMATION).isVisible();
      expect(isSampleInformationTabVisible).toBeTruthy();

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

    await test.step(`Check that expected OS1 activites are present in the Survey Data tab`, async () => {
      //Check that the participant has the Prequalifier, Consent, and Medical Release activities
      const surveyDataTab = new SurveyDataTab(page);

      //Check Prequalifier questions are all present
      const prequalActivity = await surveyDataTab.getActivity({ activityName: SurveyName.PREQUALIFIER, activityVersion: ActivityVersion.ONE });
      await prequalActivity.scrollIntoViewIfNeeded();
      await expect(prequalActivity).toBeVisible();
      await prequalActivity.click(); //Click to open the panel to access the questions

      const prequalSelfDescribe = await surveyDataTab.getActivityQuestion({
        activity: prequalActivity,
        questionShortID: Label.PREQUAL_SELF_DESCRIBE
      });
      await expect(prequalSelfDescribe).toBeVisible();

      //Check Consent questions are all present

      //Check Medical Release questions are all present
    })

    await test.step(`name`, async () => {
      //Check that OS2-specific activities are not present in Participant Page -> Survey Data tab
    })
  })

  test.skip(`OS1: Verify OS1 onc history cannot be found in OS2`, async ({ page, request }) => {
    //stuff here
  })

  test.skip(`OS1: Verify OS1 kits cannot be found in OS2`, async ({ page, request }) => {
    //stuff here
  })

  test.skip(`OS2: Verify a re-consented participant has the expected display`, async ({ page, request }) => {
    //
  })

  test.skip(`OS2: Verify OS2 kits cannot be found in OS1`, async ({ page, request }) => {
    //stuff here
  })
});
