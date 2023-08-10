import { expect } from '@playwright/test';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import Select from 'dss/component/select';
import * as user from 'data/fake-user.json';
import { test } from 'fixtures/dsm-fixture';
import { login } from 'authentication/auth-dsm';
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

    test('Verify that a family member can be added without copying proband info @rgp @functional', async ({ page, request }) => {
        //Go into DSM
        await login(page);
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

        await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);

        //Add a new family member
        const rgpParticipantPage = new RgpParticipantPage(page);

        const addFamilyMemberButton = rgpParticipantPage.getAddFamilyMemberButton();
        await addFamilyMemberButton.click();

        const addFamilyMemberPopup = rgpParticipantPage.getAddFamilyMemberPopup();
        await expect(addFamilyMemberPopup).toBeVisible();

        //Setup new family member
        const maternalGrandfather = new FamilyMemberTab(page, FamilyMember.MATERNAL_GRANDFATHER);
        maternalGrandfather.relationshipID = user.maternalGrandfather.relationshipID;
        maternalGrandfather.firstName = user.maternalGrandfather.firstName;
        maternalGrandfather.lastName = user.maternalGrandfather.lastName;

        const familyMemberFirstName = rgpParticipantPage.getFamilyMemberFirstName();
        await familyMemberFirstName.fill(maternalGrandfather.firstName);

        const familyMemberLastName = rgpParticipantPage.getFamilyMemberLastName();
        await familyMemberLastName.fill(maternalGrandfather.lastName);

        const familyMemberRelationshipID = rgpParticipantPage.getFamilyMemberRelationshipID();
        await familyMemberRelationshipID.fill(maternalGrandfather.relationshipID);

        const familyMemberRelation = rgpParticipantPage.getFamilyMemberRelation();
        await familyMemberRelation.click();
        const dropdownOptions = rgpParticipantPage.getDropdownOptions();
        await dropdownOptions.filter({ hasText: maternalGrandfather.relationToProband}).click();

        const copyProbandInfo = rgpParticipantPage.getCopyProbandInfo();
        await expect(copyProbandInfo).not.toBeChecked();

        const submitButton = rgpParticipantPage.getAddFamilyMemberFormSubmitButton();
        await expect(submitButton).toBeEnabled();
        await submitButton.click();

        const successfullyAddedFamilyMemberMessage = rgpParticipantPage.getAddFamilyMemberSuccessfulMessage();
        await expect(successfullyAddedFamilyMemberMessage).toBeVisible();

        await page.keyboard.press('Escape'); //Press Escape key to close the 'Successfully Added Family Member' dialog
        await expect(successfullyAddedFamilyMemberMessage).not.toBeVisible();

        //Check that the expected Participant Info fields have been filled after non-copied family member creation
        const maternalGrandFatherFamilyMemberTab = maternalGrandfather.getFamilyMemberTab();
        await maternalGrandFatherFamilyMemberTab.scrollIntoViewIfNeeded();
        await expect(maternalGrandFatherFamilyMemberTab).toBeVisible();

        await maternalGrandFatherFamilyMemberTab.click();
        await expect(maternalGrandFatherFamilyMemberTab).toHaveClass('nav-link active'); //Make sure the tab is in view and selected
        const maternalGrandfatherFamilyID = await maternalGrandfather.getFamilyIDFromFamilyMemberTab();

        const maternalGrandfatherParticipantInfoSection = maternalGrandfather.getParticipantInfoSection();
        await maternalGrandfatherParticipantInfoSection.click();

        const maternalGrandfatherSubjectIDField = maternalGrandfather.getSubjectID();
        await expect(maternalGrandfatherSubjectIDField).not.toBeEmpty();

        const maternalGrandfatherFamilyIDField = maternalGrandfather.getFamilyID();
        await expect(maternalGrandfatherFamilyIDField).not.toBeEmpty();
        await expect(maternalGrandfatherFamilyIDField).not.toBeEditable();

        const maternalGrandfatherFirstNameField = maternalGrandfather.getFirstName();
        await expect(maternalGrandfatherFirstNameField).toHaveValue(maternalGrandfather.firstName);

        //Middle name is not set in family member creation - check that it has no input for non-copied family member - intended to be a canary in coal mine assertion
        const maternalGrandfatherMiddleNameField = maternalGrandfather.getMiddleName();
        await expect(maternalGrandfatherMiddleNameField).toHaveValue('');

        const maternalGrandfatherLastNameField = maternalGrandfather.getLastName();
        await expect(maternalGrandfatherLastNameField).toHaveValue(maternalGrandfather.lastName);

        const maternalGrandfatherIsAliveRadioButton = maternalGrandfather.getLivingStatusOption('Alive');
        await expect(maternalGrandfatherIsAliveRadioButton).toBeChecked();

        const maternalGrandfatherRelationshipToProband = maternalGrandfather.getRelationshipToProband();
        await expect(maternalGrandfatherRelationshipToProband).toHaveText('Maternal Grandfather');

        //Check that the newly added family member has the same family id as the proband - check added due to non-prod bug that occurs occassionaly
        //Setup to check the existing proband information
        const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);
        proband.relationshipID = user.patient.relationshipID;

        const probandFamilyMemberTab = proband.getFamilyMemberTab();
        await expect(probandFamilyMemberTab).toBeVisible();
        const probandFamilyID = await proband.getFamilyIDFromFamilyMemberTab();

        console.log(`grandfather family id ${maternalGrandfatherFamilyID} vs proband family id: ${probandFamilyID}`);
        await expect(maternalGrandfatherFamilyID).toEqual(probandFamilyID);
      })
});
