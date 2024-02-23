import { expect } from '@playwright/test';
import { Navigation, Study, StudyName } from 'dsm/component/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import * as user from 'data/fake-user.json';
import { test } from 'fixtures/dsm-fixture';
import ParticipantRgpPage from 'dsm/pages/participant-rgp-page';
import { saveParticipantGuid } from 'utils/faker-utils';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import ParticipantPage from 'dsm/pages/participant-page';
import { WelcomePage } from 'dsm/pages/welcome-page';


test.describe('DSM Family Enrollment Handling', () => {
  test('Verify the display and functionality of family account dynamic fields @dsm @rgp', async ({ page, request}) => {
    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(StudyName.RGP);

    const navigation = new Navigation(page, request);

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    //Get the most recent automated test participant (searches for up to a week ago)
    const participantGuid = await participantListPage.getGuidOfMostRecentAutomatedParticipant(user.patient.firstName, true);
    expect(participantGuid).toBeTruthy();
    saveParticipantGuid(participantGuid);

    //Filter the Participant List by the given guid
    await participantListPage.filterListByParticipantGUID(participantGuid);

    const participantListTable = new ParticipantListTable(page);
    const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);

    const guid = await participantPage.getGuid();
    expect(guid).toBe(participantGuid);

    //Confirm the 'Add Family Member' button is visible
    const rgpParticipantPage = new ParticipantRgpPage(page);
    const rgpEmail = await rgpParticipantPage.getEmail(); //Get the actual email used for the family account - to be used later
    expect(rgpEmail).not.toBeNull();
    const addFamilyMemberButton = rgpParticipantPage.addFamilyMemberDialog._addFamilyMemberButton;
    await expect(addFamilyMemberButton).toBeVisible();

    //Confirm 'Family Notes' is present and functional
    const datetime = new Date();
    await rgpParticipantPage.inputFamilyNotes(`Random text by playwright test on: '${datetime}'`);

    //Confirm 'Seqr project' is present and functional
    const seqrProject = rgpParticipantPage.getSeqrProject();
    await expect(seqrProject).toBeVisible();
    await seqrProject.click();
    const dropdownOptions = rgpParticipantPage.getDropdownOptions();
    await dropdownOptions.filter({ hasText: 'HMB Genome' }).click();

    //Confirm 'Specialty Project: R21' is present and functional
    const specialtyProjectR21 = rgpParticipantPage.getSpecialtyProjectR21();
    await expect(specialtyProjectR21).toBeVisible();
    await specialtyProjectR21.click();

    //Confirm 'Specialty Project: CAGI 2022' is present and functional
    const specialtyProjectCagi2022 = rgpParticipantPage.getSpecialtyProjectCagi2022();
    await expect(specialtyProjectCagi2022).toBeVisible();
    await specialtyProjectCagi2022.click();

    //Confirm 'Specialty Project: CAGI 2023' is present and functional
    const specialtyProjectCagi2023 = rgpParticipantPage.getSpecialtyProjectCagi2023();
    await expect(specialtyProjectCagi2023).toBeVisible();
    await specialtyProjectCagi2023.click();

    //Confirm 'Specialty Project: CZI' is present and functional
    const specialtyProjectCZI = rgpParticipantPage.getSpecialtyProjectCZI();
    await expect(specialtyProjectCZI).toBeVisible();
    await specialtyProjectCZI.click();

    //Confirm 'Expected # to Sequence' is present and functional
    const expectedNumberToSequence = rgpParticipantPage.getExpectedNumberToSequence();
    await expect(expectedNumberToSequence).toBeVisible();
    await expectedNumberToSequence.click();
    await dropdownOptions.filter({ hasText: '5' }).click();
  });
});
