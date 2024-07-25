import {expect} from '@playwright/test';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import Select from 'dss/component/select';
import { test } from 'fixtures/dsm-fixture';
import { createNewOS1Participant, generateEmailAlias, generateUserName } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';
import { logInfo } from 'utils/log-utils';
import { Label } from 'dsm/enums';
import ParticipantListPage from 'dsm/pages/participant-list-page';

const OSTEO_USER_EMAIL = process.env.OSTEO_USER_EMAIL as string;

test.describe('Create a new OS1 participant to be used for OS1 -> OS2 reconsent workflow testing', () => {
  let shortID: string;
  let navigation;
  let participantListPage: ParticipantListPage;

  test('Create a OS1 participant @dsm @functional @osteo', async ({ page, request }) => {
    await test.step(`Create a new OS1 participant using the auth_token from DSM`, async () => {
    //Get auth_token from DSM
    const userIDToken = await page.evaluate(() => localStorage.getItem(`auth_token`)) as string;
    const firstName = generateUserName(`OS1-${user.patient.firstName}`);
    const lastName = generateUserName(user.patient.lastName);
    const month = user.patient.birthDate.MM;
    const day = user.patient.birthDate.DD;
    const year = user.patient.birthDate.YYYY;
    const dateOfBirth = `${year}-${month}-${day}`; //Must be in YYYY-MM-DD format
    const email = generateEmailAlias(OSTEO_USER_EMAIL);
    logInfo(`Checking name: ${firstName} ${lastName}`);
    logInfo(`Checking date of birth: ${dateOfBirth}`);
    logInfo(`Checking email: ${email}`);
    shortID = await createNewOS1Participant(userIDToken, request, email, firstName, lastName, dateOfBirth, { returnedIDType: Label.SHORT_ID });
    })

    await test.step(`Check that the newly created participant can be seen in OS1 realm in DSM`, async () => {
      navigation = new Navigation(page, request);
      await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

      participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
      await participantListPage.waitForReady();

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID, exactMatch: true });

      await expect(async () => {
        await searchPanel.search();
        const participantListTable = participantListPage.participantListTable;
        const numberOfDisplayedParticipants = await participantListTable.rowsCount;
        expect(numberOfDisplayedParticipants).toBe(1);
      }).toPass({
        intervals: [10_000], //re-try in 10 second intervals
        timeout: 120_000 //timeout in 2 minutes
      });
    })

    await test.step(`Check that the newly created participant can not be seen in OS2 realm in DSM`, async () => {
      navigation = new Navigation(page, request);
      await navigation.selectStudy(StudyName.OSTEO2);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.text(Label.SHORT_ID, { textValue: shortID, exactMatch: true });
      await searchPanel.search();

      const participantListTable = participantListPage.participantListTable;
      const numberOfDisplayedParticipants = await participantListTable.rowsCount;
      expect(numberOfDisplayedParticipants).toBe(0);
    })
  })
})
