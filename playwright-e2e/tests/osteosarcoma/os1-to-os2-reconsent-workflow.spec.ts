import { test } from 'fixtures/dsm-fixture';
import { expect } from '@playwright/test';
import { Navigation, StudyName } from 'dsm/navigation';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { CustomizeView, CustomizeViewID, Label } from 'dsm/enums';

interface StudyParticipant {
  shortID: string,
  email: string
}

test.describe(`Reconsent an OS1 participant into OS2`, () => {
  let navigation;

  test(`Osteo: Re-consent workflow`, async ({ page, request }) => {
    navigation = new Navigation(page, request);
    await new Select(page, { label: 'Select study' }).selectOption(StudyName.OSTEO);

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();
    findOS1ParticipantWhoHasNotReconsented(participantListPage)
  });
});

async function findOS1ParticipantWhoHasNotReconsented(participantList: ParticipantListPage): Promise<StudyParticipant> {
  //Find OS1 participants that do not have the 'OS PE-CGS' cohort tag
  const customizeViewPanel = participantList.filters.customizeViewPanel;
  await customizeViewPanel.open();
  await customizeViewPanel.openColumnGroup({ columnSection: CustomizeView.COHORT_TAGS, stableID: CustomizeViewID.COHORT_TAG });
  await customizeViewPanel.selectColumns(CustomizeView.COHORT_TAGS, [Label.COHORT_TAG_NAME]);
  await customizeViewPanel.close();

  
  //Choose one of the participants

  //Update their password (since they are created without one)

  //Return the participant

}