import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import * as user from 'data/fake-user.json';
import { test } from 'fixtures/dsm-fixture';
import { calculateBirthDate, getRandomInteger } from 'utils/faker-utils';
import { login } from 'authentication/auth-dsm';
import { Navigation } from 'dsm/component/navigation/navigation';
import Select from 'dss/component/select';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import FamilyMemberTab from 'dsm/pages/participant-page/rgp/family-member-tab';
import { FamilyMember } from 'dsm/component/tabs/enums/familyMember-enum';
import RgpParticipantPage from 'dsm/pages/participant-page/rgp/rgp-participant-page';
import DSMHomePage from 'dsm/pages/home-page';
import DSSHomePage from 'dss/pages/rgp/home-page';
import DashboardPage from 'dss/pages/rgp/dashboard-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import KitUploadPage from 'dsm/pages/kitUpload-page/kitUpload-page';
import {SamplesNavEnum} from 'dsm/component/navigation/enums/samplesNav-enum';
import { KitUploadInfo } from 'dsm/pages/kitUpload-page/models/kitUpload-model';
import {StudyEnum} from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';

const { RGP_USER_PASSWORD } = process.env;
const probandName = user.patient.firstName;
const brotherName = user.brother.firstName;
let rgpEmail: string;

test.describe.serial('DSM Family Enrollment Handling', () => {
test('Verify the display and functionality of family account dynamic fields @functional @rgp', async ({ page, request}) => {
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListPage.selectParticipant(user.patient.participantGuid);

    //Confirm the 'Add Family Member' button is visible
    const rgpParticipantPage = new RgpParticipantPage(page);
    rgpEmail = await rgpParticipantPage.getEmail(); //Get the actual email used for the family account - to be used later
    const addFamilyMemberButton = rgpParticipantPage.getAddFamilyMemberButton();
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

  test('Verify that the proband family member tab can be filled out @functional @rgp', async ({ page, request }) => {
    //Go into DSM
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListPage.selectParticipant(user.patient.participantGuid);

    //Verify that the proband tab is present (and includes the text RGP and 3 as proband subject ids have the format RGP_{family id}_3)
    const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);

    //Initial setup
    proband.relationshipID = user.patient.relationshipID;

    const probandTab = proband.getFamilyMemberTab();
    await expect(probandTab).toBeVisible();

    //Verify that the dynamic form menu is present
    const jumpToMenuText = proband.getJumpToMenuText();
    await expect(jumpToMenuText).toBeVisible();

    const participantInfoMenuLink = proband.getParticipantInfoMenuLink();
    await expect(participantInfoMenuLink).toBeVisible();

    const contactInfoMenuLink = proband.getContactInfoMenuLink();
    await expect(contactInfoMenuLink).toBeVisible();

    const studyStatusLink = proband.getStudyStatusMenuLink();
    await expect(studyStatusLink).toBeVisible();

    const medicalRecordsLink = proband.getMedicalRecordsMenuLink();
    await expect(medicalRecordsLink).toBeVisible();

    const primarySampleLink = proband.getPrimarySampleMenuLink();
    await expect(primarySampleLink).toBeVisible();

    const tissueLink = proband.getTissueMenuLink();
    await expect(tissueLink).toBeVisible();

    const rorLink = proband.getRORMenuLink();
    await expect(rorLink).toBeVisible();

    const surveyLink = proband.getSurveyMenuLink();
    await expect(surveyLink).toBeVisible();

    //Fill out Participant Info section
    const participantInfoSection = proband.getParticipantInfoSection();
    await participantInfoSection.click();

    const subjectID = proband.getSubjectID();
    //Note: Subject ID is usually automatically filled out for the family members; proband at family account registration and family members after they are added
    await expect(subjectID).not.toBeEmpty();

    const familyID = proband.getFamilyID();
    proband.familyID = Number((await familyID.inputValue()).toString());
    await expect(familyID).not.toBeEditable(); //Verify that family id is not selectable/able to be changed

    //Confirm that the same family id is used between proband tab, subject id field, family id field
    const familyIDFromSubjectID = await proband.getFamilyIDFromSubjectID();
    const familyIDFromFamilyMemberTab = await proband.getFamilyIDFromFamilyMemberTab();

    await expect(familyIDFromSubjectID).toEqual(proband.familyID);
    await expect(familyIDFromFamilyMemberTab).toEqual(proband.familyID);

    //Prep for checking note content  in Participant Info later on
    const importantNotesTextarea = proband.getImportantNotes();
    const processNotesTextarea = proband.getProcessNotes();
    const mixedRaceTextarea = proband.getMixedRaceNotes();

    //Confirm that input entered in Important Notes and Process Notes is saved
    await proband.inputImportantNotes('Testing notes here - Important Notes');
    await proband.inputProcessNotes('Testing notes here - Process Notes');

    const firstName = proband.getFirstName();
    await firstName.fill(`${user.patient.firstName}_PROBAND`); // PROBAND suffix to make it easy to check for messages in DSS

    const middleName = proband.getMiddleName();
    await middleName.fill(user.patient.middleName);

    const lastName = proband.getLastName();
    await lastName.fill(user.patient.lastName);

    const suffix = proband.getNameSuffix();
    await suffix.fill('junior');

    const preferredLanguage = proband.getPreferredLanguage();
    await preferredLanguage.click();
    const dropdownOptions = proband.getDropdownOptions(); // Only needs to be called once and can be re-used for dropdown options
    await dropdownOptions.filter({ hasText: 'Spanish' }).click();

    const sex = proband.getSex();
    await sex.click();
    await dropdownOptions.filter({ hasText: 'Female' }).click();

    const pronouns = proband.getPronouns();
    await pronouns.click();
    await dropdownOptions.filter({ hasText: 'they/them' }).click();

    //section for Participant Info -> DOB
    const dateOfBirth = proband.getDateOfBirth();
    await dateOfBirth.fill(`${user.patient.birthDate.MM}/${user.patient.birthDate.DD}/${user.patient.birthDate.YYYY}`);
    //DOB field must either use Enter press or be de-selected in order for age to show up in following Age Today field
    await dateOfBirth.blur();

    //section for Participant Info -> Age Today; check that the age is automatically calculated and inputted into
    //Age Today field is the the correct age given the age inputted in DOB field
    const ageToday = proband.getAgeToday();
    const estimatedAge = calculateBirthDate(user.patient.birthDate.MM, user.patient.birthDate.DD, user.patient.birthDate.YYYY);
    await expect(ageToday).toHaveValue(estimatedAge.toString());

    //The default value for Participant Info -> Alive/Deceased is an Alive status
    const probandIsAliveStatus = proband.getLivingStatusOption('Alive');
    await expect(probandIsAliveStatus).toBeChecked();

    //The default value in the proband tab should be 'Self' (the proband is the main person in the study)
    const relationshipToProband = proband.getRelationshipToProband();
    await expect(relationshipToProband).toHaveText('Self');

    const affectedStatus = proband.getAffectedStatus();
    await affectedStatus.click();
    await dropdownOptions.filter({ hasText: 'Uncertain' }).click();

    const race = proband.getRace();
    await race.click();
    await dropdownOptions.filter({ hasText: 'Black or African American' }).click();

    const ethnicity = proband.getEthnicity();
    await ethnicity.click();
    await dropdownOptions.filter({ hasText: 'Not Hispanic' }).click();

    await proband.inputMixedRaceNotes('Testing notes here - Mixed Race Notes');
    //await mixedRaceTextarea.blur(); //This blur action is needed to make sure automated input stays for later verification - lessens but does not get totally rid of flakiness

    //Verify that the input to Important Notes, Process Notes, Mixed Race Notes has been saved even when page is re-visited
    const importantNotes = await proband.getImportantNotesContent();
    const processNotes = await proband.getProcessNotesContent();
    const mixedRaceNotes = await proband.getMixedRaceNotesContent();

    //Go back to Participant List and refresh using Reload with Default Filters
    const familyAccount = new RgpParticipantPage(page);
    await familyAccount.backToList();
    participantListPage.filters.reloadWithDefaultFilters;
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListPage.selectParticipant(user.patient.participantGuid);

    //After refreshing participant list and page, check that the input for the above textareas are as expected
    //Note: Proband tab is usually the tab that is open/selected upon visiting participant page/family account page
    await probandTab.scrollIntoViewIfNeeded();
    await expect(probandTab).toHaveClass('nav-link active'); //Make sure proband tab is opened

    await participantInfoSection.click();
    expect(await importantNotesTextarea.inputValue()).toEqual(importantNotes);
    expect(await processNotesTextarea.inputValue()).toEqual(processNotes);
    expect(await mixedRaceTextarea.inputValue()).toEqual(mixedRaceNotes);

    //Fill out Contact Info section
    const contactInfoSection = proband.getContactInfoSection();
    await contactInfoSection.click();

    const primaryPhone = proband.getPrimaryPhoneNumber();
    await primaryPhone.fill(user.patient.phone);

    const secondaryPhone = proband.getSecondaryPhoneNumber();
    await secondaryPhone.fill(user.patient.secondaryPhoneNumber);

    //Verify that the proband's preferred email matches the email of the family account
    const email = proband.getPreferredEmail();
    const familyAccountEmail = await familyAccount.getEmail();
    expect(await email.inputValue()).toEqual(familyAccountEmail);

    //Verify that Send Secure has a default value of 'Unknown'
    const sendSecure = proband.getSendSecure();
    await expect(sendSecure).toHaveText('Unknown');

    //Verify that Portal Message*** has a default value of 'Automated Default'
    const portalMessage = proband.getPortalMessage();
    await expect(portalMessage).toHaveText('Automated Default');

    const currentDay = new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
    const currentDate = currentDay.split('/');
    const portalMessageDate = proband.getPortalMessageDate();
    await portalMessageDate.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const streetOne = proband.getStreetOne();
    await streetOne.fill(user.patient.streetAddress);

    const city = proband.getCity();
    await city.fill(user.patient.city);

    const state = proband.getState();
    await state.click();
    await dropdownOptions.filter({ hasText: `${user.patient.state.name}` }).click();

    const zip = proband.getZip();
    await zip.fill(user.patient.zip);

    const country = proband.getCountry();
    await country.fill(user.patient.country.name);

    //Fill out Study Status section
    const studyStatusSection = proband.getStudyStatusSection();
    await studyStatusSection.click();

    const probandAcceptanceStatus = proband.getAcceptanctStatus();
    await probandAcceptanceStatus.click();
    await dropdownOptions.filter({ hasText: 'NMI to Accepted' }).click();

    const probandAcceptanceStatusDate = proband.getAcceptanctStatusDate();
    await probandAcceptanceStatusDate.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    //The default value of Active/Inactive/HOLD is 'Active'
    const probandActiveInactiveHold = proband.getActiveInactiveHold();
    await expect(probandActiveInactiveHold).toHaveText('Active');

    //The default value of Inactive Reason is 'N/A'
    const probandInactiveReason = proband.getInactiveReason();
    await expect(probandInactiveReason).toHaveText('N/A');

    const probandAcuityAppointmentDate = proband.getAcuityAppointmentDate();
    await probandAcuityAppointmentDate.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const probandDateOfConsentCall = proband.getDateOfConsentCall();
    await probandDateOfConsentCall.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const probandEnrollmentDate = proband.getEnrollmentDate();
    await probandEnrollmentDate.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    //The default value of Data-sharing permissions is 'Unknown'
    const probandDataSharingPermissions = proband.getDataSharingPermissions();
    await expect(probandDataSharingPermissions).toHaveText('Unknown');

    await proband.inputConsentingNotes('Testing notes here - Consenting Notes');

    const consentDocumentationCompleteYes = proband.getConsentDocumentationCompleteOption('Yes');
    await consentDocumentationCompleteYes.check();

    //The default value of photo permissions is 'N/A'
    const probandPhotoPermissions = proband.getPhotoPermissions();
    await expect(probandPhotoPermissions).toHaveText('N/A');

    //Fill out Medical records section
    const medicalRecordsSection = proband.getMedicalRecordsSection();
    await medicalRecordsSection.click();

    const probandMedicalRecordsReceivedYes = proband.getMedicalRecordsReceived('Yes');
    await probandMedicalRecordsReceivedYes.check();
    await expect(probandMedicalRecordsReceivedYes).toBeChecked();

    const medicalRecordslastReceived = proband.getMedicalRecordsLastReceived();
    await medicalRecordslastReceived.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    await proband.inputMedicalRecordsNotes('Testing notes here - Medical Records Notes');

    //The default value of Medical Records Release Obtained is 'No'
    const medicalRecordsReleaseObtainedNo = proband.getMedicalRecordsReleaseObtained('No');
    await expect(medicalRecordsReleaseObtainedNo).toBeChecked();

    const recordsLastRequested = proband.getRecordsLastRequested();
    await recordsLastRequested.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const familyProvidedURL = proband.getFamilyUrlProvided();
    await familyProvidedURL.fill('https://en.wikipedia.org/wiki/Broad_Institute');

    //todo Update testing Referral Source to check for functionality from ticket PEPPER-575 (ticket in-progress)
    const referralSource = proband.getReferralSource();
    await referralSource.click();
    await dropdownOptions.filter({ hasText: 'Doctor' }).click();

    await proband.inputReferralNotes('Testing notes here - Referral Notes');

    const referringClinician = proband.getReferringClinician();
    await referringClinician.fill(`${user.doctor.name}`);

    const clinicianReferralForm = proband.getClinicianReferralForm();
    await clinicianReferralForm.click();
    await dropdownOptions.filter({ hasText: 'No' }).click();

    //The default value of Consent to speak with clinician is 'Unknown'
    const consentToSpeakToClinician = proband.getConsentToSpeakWithClinician();
    await expect(consentToSpeakToClinician).toHaveText('Unknown');

    const cohort = proband.getCohort();
    await cohort.click();
    await dropdownOptions.filter({ hasText: 'Hereditary hemorrhagic telangeictasia' }).click();

    //Fill out Primary Sample section
    const primarySampleSection = proband.getPrimarySampleSection();
    await primarySampleSection.click();

    const kitTypeToRequest = proband.getKitTypeToRequest();
    await kitTypeToRequest.click();
    await dropdownOptions.filter({ hasText: 'None - external DNA from blood' }).click();

    const dateKitSent = proband.getDateKitSent();
    await dateKitSent.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const cliaOrNonCliaKitSent = proband.getCliaOrNonCliaKitSent();
    await cliaOrNonCliaKitSent.click();
    await dropdownOptions.filter({ hasText: 'Non CLIA' }).click();

    const dateEDTASampleReceived = proband.getDateEdtaSampleReceived();
    await dateEDTASampleReceived.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const datePAXgeneSampleReceived = proband.getDatePaxgeneSampleReceived();
    await datePAXgeneSampleReceived.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const dateBackupEDTATubeReceived = proband.getDatePaxgeneSampleReceived();
    await dateBackupEDTATubeReceived.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const dateSentToGP = proband.getSentToGPDate();
    await dateSentToGP.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    await proband.inputSampleNotes('Testing notes here - Sample Notes');

    const bloodSalivaProcessing = proband.getBloodSalivaProcessing();
    await bloodSalivaProcessing.click();
    await dropdownOptions.filter({ hasText: 'WGS' }).click();

    //The default value of Long-read WGS is 'No'
    const longReadWGS = proband.getLongReadWGS();
    await expect(longReadWGS).toHaveText('No');

    //The default value of Methylation is 'No'
    const methlytation = proband.getMethylation();
    await expect(methlytation).toHaveText('No');

    //The default value of Blood RNASeq? is 'N/A'
    const bloodRNASeqNotApplicable = proband.getBloodRnaSeq('N/A')
    await expect(bloodRNASeqNotApplicable).toBeChecked();

    //Fill out Tissue section
    const tissueSection = proband.getTissueSection();
    await tissueSection.click();

    const potentialTissueSampleAvailable = proband.getPotentialTissueSampleAvailable();
    await potentialTissueSampleAvailable.click();
    await dropdownOptions.filter({ hasText: 'Maybe' }).click();

    await proband.inputTissueNotes('Testing notes here - Tissue Notes');

    const tissueTypeReceived = proband.getTissueTypeReceived();
    await tissueTypeReceived.fill('Mysterious Tissue');

    //The default value of Tissue processing is 'N/A'
    const tissueProcessing = proband.getTissueProcessing();
    await expect(tissueProcessing).toHaveText('N/A');

    const sampleID = getRandomInteger(50000);
    const tissueSampleID = proband.getTissueSampleID();
    await tissueSampleID.fill(`RGP_${sampleID}`);

    //Fill out ROR section
    const rorSection = proband.getRORSection();
    await rorSection.click();

    //The default value of Reportable result is 'No'
    const reportableResult = proband.getReportableResult();
    await expect(reportableResult).toHaveText('No');

    //The default value of ROR notification is 'N/A'
    const rorNotification = proband.getRorNotification();
    await expect(rorNotification).toHaveText('N/A');

    //The default value of Solved is 'No'
    const solved = proband.getSolved();
    await expect(solved).toHaveText('No');

    const geneName = proband.getGeneName();
    await geneName.fill('Mysterious Gene');

    //The default value of Proceeding to confirm is 'N/A'
    const proceedingToConfirm = proband.getProceedingToConfirm();
    await expect(proceedingToConfirm).toHaveText('N/A');

    const providerContactInfo = proband.getProviderContactInfo();
    await providerContactInfo.fill(user.doctor.phone);

    //The default value of Confirm Lab is 'N/A'
    const confirmLab = proband.getConfirmLab();
    await expect(confirmLab).toHaveText('N/A');

    const confirmLabAccessionNumber = proband.getConfirmLabAccessionNumber();
    const accessionNumber = getRandomInteger(50000);
    await confirmLabAccessionNumber.fill(`RGP_LAB_${accessionNumber}`);

    const dateConfirmKitSent = proband.getDateConfirmKitSent();
    await dateConfirmKitSent.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    const dateOfConfirmReport = proband.getDateOfConfirmReport();
    await dateOfConfirmReport.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY

    await proband.inputRorStatusNotes('Testing notes here - ROR Status/Notes');

    await proband.inputPostDisclosureNotes('Testing notes here - Post-disclosure notes');

    //The default value of Collaboration? is 'N/A'
    const collaboration = proband.getCollaboration();
    await expect(collaboration).toHaveText('N/A');

    //The default value of MTA is 'N/A'
    const mta = proband.getMTA();
    await expect(mta).toHaveText('N/A');

    //The default value of Publication is 'N/A'
    const publication = proband.getPublication();
    await expect(publication).toHaveText('N/A');

    await proband.inputPublicationInfo('Testing notes here - Publication Info');

    //Fill out Survey section
    const surveySection = proband.getSurveySection();
    await surveySection.click();

    const redcapSurveyTaker = proband.getRedCapSurveyTaker();
    await redcapSurveyTaker.click();
    await dropdownOptions.filter({ hasText: 'Yes' }).click();

    const redCapSurveyCompletedDate = proband.getRedCapSurveyCompletedDate();
    await redCapSurveyCompletedDate.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY
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
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListPage.selectParticipant(user.patient.participantGuid);

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

  test('Verify that a family member can be added using copied proband info @rgp @functional', async ({ page, request }) => {
    //Go into DSM
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListPage.selectParticipant(user.patient.participantGuid);

    //Add a new family member
    const rgpParticipantPage = new RgpParticipantPage(page);

    const addFamilyMemberButton = rgpParticipantPage.getAddFamilyMemberButton();
    await addFamilyMemberButton.click();

    const addFamilyMemberPopup = rgpParticipantPage.getAddFamilyMemberPopup();
    await expect(addFamilyMemberPopup).toBeVisible();

    //Setup new family member
    const brother = new FamilyMemberTab(page, FamilyMember.BROTHER);
    brother.relationshipID = user.brother.relationshipID;
    brother.firstName = user.brother.firstName;
    brother.lastName = user.brother.lastName;

    const familyMemberFirstName = rgpParticipantPage.getFamilyMemberFirstName();
    await familyMemberFirstName.fill(brother.firstName);

    const familyMemberLastName = rgpParticipantPage.getFamilyMemberLastName();
    await familyMemberLastName.fill(brother.lastName);

    const familyMemberRelationshipID = rgpParticipantPage.getFamilyMemberRelationshipID();
    await familyMemberRelationshipID.fill(brother.relationshipID);

    const familyMemberRelation = rgpParticipantPage.getFamilyMemberRelation();
    await familyMemberRelation.click();
    const dropdownOptions = rgpParticipantPage.getDropdownOptions();
    await dropdownOptions.filter({ hasText: brother.relationToProband}).click();

    const copyProbandInfo = rgpParticipantPage.getCopyProbandInfo();
    await copyProbandInfo.check();

    const submitButton = rgpParticipantPage.getAddFamilyMemberFormSubmitButton();
    await submitButton.click();

    const successfullyAddedFamilyMemberMessage = rgpParticipantPage.getAddFamilyMemberSuccessfulMessage();
    await expect(successfullyAddedFamilyMemberMessage).toBeVisible();
    await page.keyboard.press('Escape'); //Press Escape key to close the 'Successfully Added Family Member' dialog
    await expect(successfullyAddedFamilyMemberMessage).not.toBeVisible();
  });

  test('Verify that a copied family member has similar info to the proband @rgp @functional', async ({ page, request }) => {
    //Go into DSM
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
    await participantListPage.selectParticipant(user.patient.participantGuid);

    //Setup the family members to check
    const rgpParticipantPage = new RgpParticipantPage(page);

    const brother = new FamilyMemberTab(page, FamilyMember.BROTHER);
    brother.relationshipID = user.brother.relationshipID;
    brother.firstName = user.brother.firstName;
    brother.lastName = user.brother.lastName;

    const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);
    proband.firstName = user.patient.firstName;
    proband.lastName = user.patient.lastName;
    proband.relationshipID = user.patient.relationshipID;

    //Open new family member's tab
    const brotherFamilyMemberTab = brother.getFamilyMemberTab();
    await brotherFamilyMemberTab.scrollIntoViewIfNeeded();
    await expect(brotherFamilyMemberTab).toBeVisible();
    await brotherFamilyMemberTab.click();
    await expect(brotherFamilyMemberTab).toHaveClass('nav-link active'); //Make sure the tab is in view and selected

    //Verify Participant Info data is as expected - first gather brother's info
    const brotherParticipantInfoSection = brother.getParticipantInfoSection();
    await brotherParticipantInfoSection.click();

    const brotherSubjectID = brother.getSubjectID();
    await expect(brotherSubjectID).not.toBeEmpty();

    const brotherFamilyID = await brother.getFamilyIDFromSubjectID(); //Compare this with proband's to make sure family members get the same family id
    const brotherFamilyIDField = brother.getFamilyID();
    await expect(brotherFamilyIDField).not.toBeEditable();

    const brotherImportantNotes = brother.getImportantNotes();
    const brotherImportantNotesContents = await brother.getImportantNotesContent();
    await expect(brotherImportantNotes).not.toBeEmpty();

    const brotherProcessNotes = brother.getProcessNotes();
    const brotherProcessNotesContent = await brother.getProcessNotesContent();
    await expect(brotherProcessNotes).not.toBeEmpty();

    const brotherFirstNameField = brother.getFirstName();
    await expect(brotherFirstNameField).toHaveValue(user.brother.firstName);

    const brotherMiddleNameField = await brother.getMiddleName(); //Should have the same as proband, used for comparison later

    const brotherLastNameField = brother.getLastName();
    await expect(brotherLastNameField).toHaveValue(user.brother.lastName);

    const brotherNameSuffix = brother.getNameSuffix();
    const brotherPreferredLanguage = brother.getPreferredLanguage();
    const brotherSex = brother.getSex();
    const brotherPronouns = brother.getPronouns();
    const brotherDateOfBirth = brother.getDateOfBirth();
    const brotherAgeToday = await brother.getAgeToday();

    const brotherIsAliveRadioButton = brother.getLivingStatusOption('Alive');
    await expect(brotherIsAliveRadioButton).toBeChecked();

    const brotherRelationshipToProband = brother.getRelationshipToProband();
    await expect(brotherRelationshipToProband).toHaveText('Brother');

    const brotherAffectedStatus = brother.getAffectedStatus();
    const brotherRace = brother.getRace();
    const brotherEthnicity = brother.getEthnicity();
    const brotherMixedRaceNotes = await brother.getMixedRaceNotesContent();

    //Do Participant Info comparison of proband and brother
    const probandTab = proband.getFamilyMemberTab();
    await probandTab.click();

    const probandParticipantInfoSection = proband.getParticipantInfoSection();
    await probandParticipantInfoSection.click();

    const probandSubjectID = proband.getSubjectID();
    await expect(probandSubjectID).not.toBeEmpty();

    const probandFamilyIDField = proband.getFamilyID();
    await expect(probandFamilyIDField).not.toBeEmpty();
    await expect(probandFamilyIDField).not.toBeEditable();
    const probandFamilyID = await proband.getFamilyIDFromSubjectID();

    //Compare family member family ids
    await expect(brotherFamilyID).toEqual(probandFamilyID);

    //Compare the rest of the expected copied Participant Info fields
    const probandImportantNotesContent = await proband.getImportantNotesContent();
    await expect(brotherImportantNotesContents).toEqual(probandImportantNotesContent);

    const probandProcessNotesContent = await proband.getProcessNotesContent();
    await expect(brotherProcessNotesContent).toEqual(probandProcessNotesContent);

    const probandMiddleNameField = await proband.getMiddleName();
    await expect(brotherMiddleNameField).toEqual(probandMiddleNameField);

    const probandNameSuffix = await proband.getNameSuffix();
    await expect(brotherNameSuffix).toEqual(probandNameSuffix);

    const probandPreferredLanguage = proband.getPreferredLanguage();
    await expect(brotherPreferredLanguage).toHaveText(await probandPreferredLanguage.innerText());

    const probandSex = proband.getSex();
    await expect(brotherSex).toHaveText(await probandSex.innerText());

    const probandPronouns = proband.getPronouns();
    await expect(brotherPronouns).toHaveText(await probandPronouns.innerText());

    //DOB here

    const probandAgeToday = await proband.getAgeToday();
    await expect(brotherAgeToday).toEqual(probandAgeToday);

    const probandIsAliveRadioBUtton = proband.getLivingStatusOption('Alive');
    await expect(probandIsAliveRadioBUtton).toBeChecked();
    await expect(brotherIsAliveRadioButton).toBeChecked();

    const probandRace = proband.getRace();
    await expect(brotherRace).toHaveText(await probandRace.innerText());

    const probandEthnicity = proband.getEthnicity();
    await expect(brotherEthnicity).toHaveText(await probandEthnicity.innerText());

    const probandMixedRaceNotesContent = await proband.getMixedRaceNotesContent();
    expect(brotherMixedRaceNotes).toEqual(probandMixedRaceNotesContent);
  });

  test('Verify that a blood rna kit can be uploaded @upload @rgp @functional', async ({ page, request}, testInfo) => {
    const testResultDirectory = testInfo.outputDir;
    console.log(`Directory: ${testResultDirectory}`);
    let kitLabel: string;
    let trackingLabel: string;
    let shippingID: string;

    const study = StudyEnum.RGP;
    const kitType = KitTypeEnum.BLOOD_AND_RNA;
    const expectedKitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA]; //Later will be just Blood & RNA kit type for RGP

    //Go into DSM
    await login(page);
    const navigation = new Navigation(page, request);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Go to recently created playwright test participant to get their short id
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();

    await participantListPage.filterListByParticipantGUID('4FBXLRIXYU7DJQT7QZA0');
    await participantListPage.selectParticipant('4FBXLRIXYU7DJQT7QZA0');

    //For RGP, the short id needed for the kit upload is the family member's subject id
    const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);
    proband.relationshipID = user.patient.relationshipID;

    const probandTab = proband.getFamilyMemberTab();
    await expect(probandTab).toBeVisible();
    await probandTab.click();
    await expect(probandTab).toHaveClass('nav-link active');//Make sure the tab is in view and selected

    const participantInfoSection = proband.getParticipantInfoSection();
    await participantInfoSection.click();

    const probandSubjectID = proband.getSubjectID();
    await expect(probandSubjectID).not.toBeEmpty();
    const shortID = await probandSubjectID.inputValue();
    console.log(`Proband's subject ID: ${shortID}`);

    //The rest of the kit upload information - RGP kits are by family member instead of by account - using the proband's info to make a kit
    const kitUploadInfo = new KitUploadInfo(shortID, user.patient.firstName, user.patient.lastName);
    kitUploadInfo.street1 = user.patient.streetAddress;
    kitUploadInfo.city = user.patient.city;
    kitUploadInfo.postalCode = user.patient.zip;
    kitUploadInfo.state = user.patient.state.abbreviation;
    kitUploadInfo.country = user.patient.country.abbreviation;

    //Note: no blood kits are automatically created for RGP - so there's no need for preliminary deactivation of existing kits
    //Upload a Blood & RNA kit
    const kitUploadPage = await navigation.selectFromSamples<KitUploadPage>(SamplesNavEnum.KIT_UPLOAD);
    await kitUploadPage.waitForLoad();
    await kitUploadPage.assertPageTitle();
    await kitUploadPage.assertDisplayedKitTypes(expectedKitTypes);
    await kitUploadPage.selectKitType(kitType);
    await kitUploadPage.assertBrowseBtn();
    await kitUploadPage.assertUploadKitsBtn();
    //await kitUploadPage.assertInstructionSnapshot();
    await kitUploadPage.uploadFile(kitType, [kitUploadInfo], study, testResultDirectory);
  });

  test.skip('Verify that messages are displayed in DSS dashboard @rgp @functional', async ({ page, request }) => {
    const homePage = new DSSHomePage(page);
    await homePage.clickSignIn();

    await auth.login(page, {email: rgpEmail, password: RGP_USER_PASSWORD });
    const dashboard = new DashboardPage(page);
    const orderedHeaders = ['Date', 'Title', 'Description'];
    const table = await dashboard.getDashboardTable();
    console.log(`DSS Dashboard table result: ${table}`);
    const resultHeaders = await table.getHeaderNames();
    console.log(`DSS Dashboard table header names: ${resultHeaders}`);

    //Verify display of proband messages
    const probandSection = dashboard.getFamilyMemberSection(probandName);

    //Verify display of sibling (brother) message
    const brotherSection = dashboard.getFamilyMemberSection(brotherName);

    //Verify that grandparent is not displayed
  });
});
