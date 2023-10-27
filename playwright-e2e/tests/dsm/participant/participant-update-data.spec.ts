import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { logInfo } from 'utils/log-utils';
import { faker } from '@faker-js/faker';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { waitForNoSpinner } from 'utils/test-utils';

test.describe('Editig Participant Information', () => {
  let participantPage: ParticipantPage;

  let shortID: string;
  let firstName: string;
  let lastName: string;
  let newFirstName: string;
  let newLastName: string;

  const cmiClinicalStudies = [StudyEnum.LMS, StudyEnum.OSTEO2];
  const cmiResearchStudies = [StudyEnum.PANCAN];

  for (const study of cmiClinicalStudies.concat(cmiResearchStudies)) {
    test(`Update First Name @dsm @${study}`, async ({page, request}) => {
      const participantListPage: ParticipantListPage = await ParticipantListPage.goto(page, study, request);

      await test.step('Find a participant', async () => {
        const oncHistoryRequestStatusColumn = 'Request Status';
        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.ONC_HISTORY, [oncHistoryRequestStatusColumn]);

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.checkboxes(oncHistoryRequestStatusColumn, { additionalFilters: [AdditionalFilter.NOT_EMPTY] });
        await searchPanel.search();
      });

      // Open participant in the first row
      const participantListTable = participantListPage.participantListTable;
      const rowIndex = 0;
      participantPage = await participantListTable.openParticipantPageAt(rowIndex);

      await test.step('Collect participant information before change', async () => {
        shortID = await participantPage.getShortId();
        firstName = await participantPage.getFirstName();
        lastName = await participantPage.getLastName();

        const status = await participantPage.getStatus();
        const registrationDate = await participantPage.getRegistrationDate();
        const guid = await participantPage.getGuid();
        const dob = await participantPage.getDateOfBirth();

        expect(shortID?.length).toBeTruthy();
        expect(status?.length).toBeTruthy();
        expect(firstName?.length).toBeTruthy();
        expect(registrationDate?.length).toBeTruthy();
        expect(guid?.length).toBeTruthy();

        logInfo(`Participant Short Id: ${shortID}`);
      });

      await test.step('Change participant first and last name', async () => {
        newFirstName = faker.person.firstName();
        newLastName = faker.person.lastName();
        await participantPage.updateInput(MainInfoEnum.FIRST_NAME, newFirstName);
        await participantPage.updateInput(MainInfoEnum.LAST_NAME, newLastName);
        await participantPage.backToList();
      });

      await test.step('Verify changed first name', async () => {
        await expect(async () => {
          await page.reload();
          await waitForNoSpinner(page);
          await participantListPage.filterListByShortId(shortID);
          participantPage = await participantListTable.openParticipantPageAt(rowIndex);
          expect(await participantPage.getFirstName()).toEqual(newFirstName);
          expect(await participantPage.getLastName()).toEqual(newLastName);
        }).toPass();
      });
    });
  }
})