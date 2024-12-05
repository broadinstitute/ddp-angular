import { test } from 'fixtures/dsm-fixture';
import { expect } from '@playwright/test';
import { Navigation, Study, StudyName } from 'dsm/navigation';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, CustomizeViewID, DataFilter, Label } from 'dsm/enums';
import { updateAuth0UserPassword } from 'utils/api-utils';
import { APP } from 'data/constants';
import HomePage from 'dss/pages/osteo/home-page';
import { fillSitePassword } from 'utils/test-utils';
import { login } from 'authentication/auth-osteo';
import ResearchConsentFormPage from 'dss/pages/osteo/research-consent-page';
import * as user from 'data/fake-user.json';
import ConsentAddendumPage from 'dss/pages/osteo/consent-addendump-page';

test.describe(`Reconsent an OS1 participant into OS2`, () => {
  const PARTICIPANT_PASSWORD = process.env.OSTEO_USER_PASSWORD as string;
  const OSTEO_BASE_URL = process.env.OSTEO_BASE_URL as string;

  let navigation;
  let shortID;
  let participantEmail: string;

  test(`Osteo: Re-consent workflow`, async ({ page, request }) => {
    await test.step('Choose an OS1 participant to re-consent', async () => {
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
      console.log(`Participant password is: ${PARTICIPANT_PASSWORD}\n`);
    });

    await test.step('Update their passsword so that they can be logged into', async () => {
      await updateAuth0UserPassword(APP.OSTEO, participantEmail, PARTICIPANT_PASSWORD);
    });

    await test.step('Re-consent to OS2 / OS PE-CGS', async () => {
      //Playwright general participant test info
      const firstName = user.patient.firstName;
      const lastName = user.patient.lastName;
      const participantFullName = user.patient.fullName;
      const birthMonth = user.patient.birthDate.MM;
      const birthDate = user.patient.birthDate.DD;
      const birthYear = user.patient.birthDate.YYYY;

      await page.goto(OSTEO_BASE_URL);
      await fillSitePassword(page);

      const homePage = new HomePage(page);
      await homePage.waitForReady();
      await login(page, { email: participantEmail, password: PARTICIPANT_PASSWORD });

      const researchConsentPage = new ResearchConsentFormPage(page, 'adult');
      await researchConsentPage.waitForReady(); //Currently in 1. Key Points
      await researchConsentPage.next(); //Currently in 2. Full Form
      await researchConsentPage.next(); //Currently in 3. Sign Consent
      await researchConsentPage.assertCurrentResearchConsentSection('3. Sign Consent');
      await researchConsentPage.agreeToDrawBloodSamples();
      await researchConsentPage.requestStoredSamples();
      await researchConsentPage.fillInName(firstName, lastName);
      await researchConsentPage.fillInDateOfBirth(birthMonth, birthDate, birthYear);
      await researchConsentPage.fillInContactAddress({ fullName: participantFullName });
      await researchConsentPage.submit();

      const consentAddendumPage = new ConsentAddendumPage(page);
      await consentAddendumPage.waitForReady();
      await consentAddendumPage.clickAgreeToShareAvailableResults({ response: 'Yes' });
      await consentAddendumPage.signature().fill(participantFullName);
      await consentAddendumPage.submit();
    });

    await test.step('Verify that the participant now has 2 consents in the DSS dashabord', async () => {
      //stuff here
    });

    await test.step('Verify that the participant now has 2 consents in the DSM participant page', async () => {
      //stuff here
    });
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