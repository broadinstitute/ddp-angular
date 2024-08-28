import { expect, Locator } from '@playwright/test';
import { ActivityVersion, SurveyName } from 'dsm/component/tabs/enums/survey-data-enum';
import { CustomizeView, CustomizeViewID as ID, DataFilter, Label, Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ContactInformationTab from 'dsm/pages/tablist/contact-information-tab';
import ParticipantInfoTab from 'dsm/pages/tablist/participant-info-tab';
import SurveyDataTab from 'dsm/pages/tablist/survey-data-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { logInfo } from 'utils/log-utils';
import { isCMIStudy, isPECGSStudy } from 'utils/test-utils';

test.describe(`Confirm that participant phone number information is displayed @dsm @functional`, () => {
  const studies = [StudyName.PANCAN, StudyName.OSTEO2, StudyName.AT];
  let navigation;
  let shortID;
  let participantPage;

  for (const study of studies) {
    test(`${study}: Confirm that participant phone number information is displayed`, async ({ page, request }) => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(study);

      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const participantListTable = participantListPage.participantListTable;
      const searchPanel = participantListPage.filters.searchPanel;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();

      if (isCMIStudy(study) || isPECGSStudy(study)) {
        //Check Research Consent -> Your Contact Info to make sure phone information is displayed
        await customizeViewPanel.selectColumns(CustomizeView.CONTACT_INFORMATION, [Label.PHONE]);
        const addressLabel = isPECGSStudy(study) ? Label.YOUR_CONTACT_INFORMATION : Label.MAILING_ADDRESS;
        logInfo(`Label of the address in the Research Consent column options: ${addressLabel}`);
        await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, [addressLabel]);
        await customizeViewPanel.close();

        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.text(addressLabel, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.search({ uri: 'filterList' });

        //NOTE: Contact Information Columns -> Phone cannot be filtered for Not Empty (covered by PEPPER-1505) - will be using the header's sorting to find non-empty phone numbers
        const phoneNumberHeader = participantListTable.getHeaderByName(Label.PHONE);
        await phoneNumberHeader.click(); //click twice in order to get the participants that have a phone number
        await phoneNumberHeader.click();

        //Get first option for phone number and check if the study participant's address include that information
        shortID = await participantListTable.getCellDataForColumn(Label.SHORT_ID, 1);
        expect(shortID).toBeTruthy();
        logInfo(`Checking participant ${shortID}'s information`);

        const participantListPhoneNumber = await participantListTable.getCellDataForColumn(Label.PHONE, 1);
        logInfo(`Participant ${shortID}'s Phone Number: ${participantListPhoneNumber}`);
        expect(participantListPhoneNumber).toBeTruthy();

        const participantAddressInList = await participantListTable.getCellDataForColumn(addressLabel, 1);
        expect(participantAddressInList.includes(participantListPhoneNumber)).toBeTruthy();

        await participantListPage.filterListByShortId(shortID);
        participantPage = await participantListTable.openParticipantPageAt({ position: 0 });

        //Check Survey Data
        await participantPage.tablist(Tab.SURVEY_DATA).isVisible();
        const surveyDataTab = await participantPage.tablist(Tab.SURVEY_DATA).click<SurveyDataTab>();

        //Some studies have more than 1 research consent activity version e.g. OS2
        const researchConsentForm = await getDisplayedConsent(surveyDataTab);
        const mailingAddress = await surveyDataTab.getActivityQuestion({
          activity: researchConsentForm,
          questionShortID: Label.MAILING_ADDRESS_SHORT_ID
        });
        const addressFormPhoneNumber = await surveyDataTab.getActivityAnswer({
          activityQuestion: mailingAddress,
          fieldName: Label.PHONE_NUMBER
        });
        expect(addressFormPhoneNumber).toBeTruthy();
        expect(addressFormPhoneNumber).toBe(participantListPhoneNumber);

        //Check Contact Information tab
        await participantPage.tablist(Tab.CONTACT_INFORMATION).isVisible();
        const contactInformationTab = await participantPage.tablist(Tab.CONTACT_INFORMATION).click<ContactInformationTab>();
        const contactInformationPhoneNumber = await contactInformationTab.getPhone();
        expect(participantListPhoneNumber).toBe(contactInformationPhoneNumber);
      } else {
        // (Specifically for ATCP) Check Registration -> Phone
        //Get the columns that usually consistently have some phone number information
        await customizeViewPanel.selectColumnsByID(CustomizeView.REGISTRATION, [Label.REGISTRATION_PHONE], ID.ATCP_DSS_REGISTRATION);
        await customizeViewPanel.selectColumnsByID(CustomizeView.PARTICIPANT_INFO, [Label.PHONE_HOME], ID.ATCP_PARTICIPANT_INFO);

        //Search/filter to make sure to only get the test participants that have provided the information
        await searchPanel.open();
        await searchPanel.text(Label.REGISTRATION_PHONE, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.search({ uri: 'filterList' });
        await participantListTable.waitForReady();

        const numberOfReturnedParticipants = await participantListTable.getRowsCount();
        expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);

        //Verify that the information in the columns above match in the Participant List
        const registrationActivityPhoneNumber = (await participantListTable.getCellDataForColumn(Label.REGISTRATION_PHONE, 1)).trim();
        expect(registrationActivityPhoneNumber).toBeTruthy();

        const participantHomePhoneNumber = (await participantListTable.getCellDataForColumn(Label.PHONE_HOME, 1)).trim();
        expect(participantHomePhoneNumber).toBeTruthy();

        logInfo(`Activity #:${registrationActivityPhoneNumber}`);
        logInfo(`Home #:${participantHomePhoneNumber}`);
        expect(participantHomePhoneNumber).toBe(registrationActivityPhoneNumber);

        //Verify that the information is the same in the Participant Page
        shortID = await participantListTable.getCellDataForColumn(Label.SHORT_ID, 1);
        expect(shortID).toBeTruthy();
        await participantListPage.filterListByShortId(shortID);
        logInfo(`Checking participant ${shortID}'s information`);
        logInfo(`Phone number as entered in Registration activity:${registrationActivityPhoneNumber}`);

        participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
        await participantPage.waitForReady();

        //Check Survey Data tab -> Registration
        const isSurveyDataTabVisible = await participantPage.tablist(Tab.SURVEY_DATA).isVisible();
        expect(isSurveyDataTabVisible).toBeTruthy();

        const surveyDataTab = new SurveyDataTab(page);

        const registrationActivity = await surveyDataTab.getActivity({
          activityName: SurveyName.REGISTRATION,
          activityVersion: ActivityVersion.ONE
        });
        await registrationActivity.scrollIntoViewIfNeeded();
        await expect(registrationActivity).toBeVisible();
        await registrationActivity.click(); //Clicking to open the panel

        const registrationActivtyPhoneNumberQuestion = await surveyDataTab.getActivityQuestion({
          activity: registrationActivity,
          questionShortID: Label.REGISTRATION_PHONE
        });
        const registrationActivtiyPhoneNumberResponse = await surveyDataTab.getActivityAnswer({
          activityQuestion: registrationActivtyPhoneNumberQuestion
        });
        logInfo(`phone # info in survey data: ${registrationActivtiyPhoneNumberResponse}`);

        //Check Participant Info tab -> Phone (H)
        const isParticipantInfoTabVisible = await participantPage.tablist(Tab.PARTICIPANT_INFO).isVisible();
        expect(isParticipantInfoTabVisible).toBeTruthy();

        await participantPage.tablist(Tab.PARTICIPANT_INFO).click();

        const participantInfoTab = new ParticipantInfoTab(page);
        const participantInfoTabPhoneNumber = await participantInfoTab.getFieldInput({
          fieldName: Label.PHONE_HOME
        });
        logInfo(`Participant Info Tab phone#: ${participantHomePhoneNumber}`);
        expect(participantInfoTabPhoneNumber).toBe(registrationActivityPhoneNumber);
      }
    })
  }
})

async function getDisplayedConsent(surveyDataTab: SurveyDataTab): Promise<Locator> {
  const consentFormVersionOne = await surveyDataTab.getActivity({
    activityName: SurveyName.RESEARCH_CONSENT_FORM,
    activityVersion: ActivityVersion.ONE,
    checkForVisibility: false
  });

  const consentFormVersionTwo = await surveyDataTab.getActivity({
    activityName: SurveyName.RESEARCH_CONSENT_FORM,
    activityVersion: ActivityVersion.TWO,
    checkForVisibility: false
  });

  const consentFormVersionThree = await surveyDataTab.getActivity({
    activityName: SurveyName.RESEARCH_CONSENT_FORM,
    activityVersion: ActivityVersion.THREE,
    checkForVisibility: false
  });

  let researchConsent = consentFormVersionOne; //Initially make it version 1, unless a different version is visible
  if (await consentFormVersionTwo.isVisible()) {
    researchConsent = consentFormVersionTwo;
  } else if (await consentFormVersionThree.isVisible()) {
    researchConsent = consentFormVersionThree;
  }

  return researchConsent;
}
