import { expect } from '@playwright/test';
import { CustomizeView, DataFilter, Label, Tab } from 'dsm/enums';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ContactInformationTab from 'dsm/pages/tablist/contact-information-tab';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
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

      //Check for phone number info from column groups in Participant List
      //Check for phone number info in Participant Page

      if (isCMIStudy(study) || isPECGSStudy(study)) {
        //Check Research Consent -> Your Contact Info to make sure phone information is displayed
        await customizeViewPanel.selectColumns(CustomizeView.CONTACT_INFORMATION, [Label.PHONE]);
        await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, [Label.MAILING_ADDRESS]);
        await customizeViewPanel.close();

        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.text(Label.MAILING_ADDRESS, { additionalFilters: [DataFilter.NOT_EMPTY] });
        await searchPanel.search({ uri: 'filterList' });

        //NOTE: Contact Information Columns -> Phone cannot be filtered (covered by PEPPER-1505) - will be using header's sorting to find non-empty phone numbers
        const phoneNumberHeader = participantListTable.getHeaderByName(Label.PHONE);
        await phoneNumberHeader.click(); //click twice in order to get the participants that have a phone number
        await phoneNumberHeader.click();

        //Get first option for phone number and check if the study participant's address include that information
        shortID = await participantListTable.getCellDataForColumn(Label.SHORT_ID, 1);
        console.log(`Checking participant ${shortID}'s information`);

        const participantPhoneNumber = await participantListTable.getCellDataForColumn(Label.PHONE, 1);
        console.log(`Participant ${shortID}'s Phone Number: ${participantPhoneNumber}`);
        expect(participantPhoneNumber).toBeTruthy();

        const participantAddressInList = await participantListTable.getCellDataForColumn(Label.MAILING_ADDRESS, 1);
        expect(participantAddressInList.includes(participantPhoneNumber)).toBeTruthy();

        await participantListPage.filterListByShortId(shortID);
        participantPage = await participantListTable.openParticipantPageAt({ position: 0 });

        //Check Survey Data


        //Check Contact Information tab
        await participantPage.tablist(Tab.CONTACT_INFORMATION).isVisible();
        const contactInformationTab = await participantPage.tablist(Tab.CONTACT_INFORMATION).click<ContactInformationTab>();
        const contactInformationPhoneNumber = await contactInformationTab.getPhone();
        expect(participantPhoneNumber).toBe(contactInformationPhoneNumber);
      } else {
        // (Specifically for ATCP) Check Registration -> Phone
      }
    })
  }
})
