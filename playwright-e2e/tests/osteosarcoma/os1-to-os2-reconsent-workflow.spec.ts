import { test } from 'fixtures/dsm-fixture';
import { expect } from '@playwright/test';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, CustomizeViewID, DataFilter, Label } from 'dsm/enums';
import { getUserId, updateAuth0UserPassword } from 'utils/api-utils';
import { APP } from 'data/constants';

test.describe(`Reconsent an OS1 participant into OS2`, () => {
  const PARTICIPANT_PASSWORD = process.env.OSTEO_USER_PASSWORD as string;
  const OSTEO_BASE_URL = process.env.OSTEO_BASE_URL as string;

  let navigation;
  let shortID;
  let participantEmail;

  test(`Osteo: Re-consent workflow`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    shortID = await findOS1ParticipantWhoHasNotReconsented(participantListPage);

    const participantListTable = participantListPage.participantListTable;
    const participantPage = await participantListTable.openParticipantPageAt({ position: 0 });
    await participantPage.waitForReady();
    participantEmail = await participantPage.getEmail();
    expect(participantEmail).toBeTruthy();
    console.log(`Participant email is: ${participantEmail}`);
    console.log(`Participant password is: ${PARTICIPANT_PASSWORD}`);

    await page.goto(OSTEO_BASE_URL);
    await page.waitForURL(OSTEO_BASE_URL);
    await getUserId(APP.OSTEO, participantEmail);
    //await updateAuth0UserPassword(APP.OSTEO, participantEmail, PARTICIPANT_PASSWORD);
  });
});

async function findOS1ParticipantWhoHasNotReconsented(participantList: ParticipantListPage): Promise<string> {
  //Find OS1 participants that do not have the 'OS PE-CGS' cohort tag -> use Playwright-created OS1 participants, who all have status of Registered
  const customizeViewPanel = participantList.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.openColumnGroup({ columnSection: CustomizeView.COHORT_TAGS, stableID: CustomizeViewID.COHORT_TAG });
  await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
  await customizeViewPanel.closeColumnGroup({ columnSection: CustomizeView.COHORT_TAGS, stableID: CustomizeViewID.COHORT_TAG });
  await customizeViewPanel.close();

  const searchPanel = participantList.filters.searchPanel;
  await searchPanel.open();
  await searchPanel.text( Label.FIRST_NAME, { textValue: 'OS1', additionalFilters: [DataFilter.EXACT_MATCH], exactMatch: false } );
  await searchPanel.checkboxes( Label.STATUS, { checkboxValues: [DataFilter.REGISTERED] } );
  await searchPanel.search({ uri: 'filterList' });

  const participantListTable = participantList.participantListTable;
  const numberOfReturnedParticipants = await participantListTable.rowsCount;
  expect(numberOfReturnedParticipants).toBeGreaterThanOrEqual(1);
  console.log(`Current page shows ${numberOfReturnedParticipants} participants`);

  const shortID = await participantListTable.getCellDataForColumn( Label.SHORT_ID, 1 );
  const participantCohortTags = await participantListTable.getCellDataForColumn( Label.COHORT_TAG_NAME, 1 );
  expect(participantCohortTags).not.toContain(`OS PE-CGS`);
  expect(participantCohortTags).toContain(`OS`);
  console.log(`Chosen short id: ${shortID}`);

  //Return the participant
  return shortID;
}