import { expect } from '@playwright/test';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import * as user from 'data/fake-user.json';
import { test } from 'fixtures/dsm-fixture';
import RgpParticipantPage from 'dsm/pages/participant-page/rgp/rgp-participant-page';
import { saveParticipantGuid } from 'utils/faker-utils';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';

let rgpEmail: string;

test.describe.serial('DSM Family Enrollment Handling', () => {
    test('Verify the display and functionality of family account dynamic fields @functional @rgp', async ({ page, request}) => {
        const navigation = new Navigation(page, request);

        //select RGP study
        await new Select(page, { label: 'Select study' }).selectOption('RGP');

        //Verify the Participant List is displayed
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.assertPageTitle();
        await participantListPage.waitForReady();

        //Get the most recent automated test participant (searches for up to a week ago)
        const participantListTable = new ParticipantListTable(page);
        const participantGuid = await participantListTable.getGuidOfMostRecentAutomatedParticipant(user.patient.firstName, true);
        saveParticipantGuid(participantGuid);

        //Filter the Participant List by the given guid
        await participantListPage.filterListByParticipantGUID(participantGuid);
        await participantListTable.openParticipantPageAt(0);
        await expect(page.getByRole('heading', { name: 'Participant Page' })).toBeVisible();
        await expect(page.getByRole('cell', { name: user.patient.participantGuid })).toBeVisible();

        //Confirm the 'Add Family Member' button is visible
        const rgpParticipantPage = new RgpParticipantPage(page);
        rgpEmail = await rgpParticipantPage.getEmail(); //Get the actual email used for the family account - to be used later
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
