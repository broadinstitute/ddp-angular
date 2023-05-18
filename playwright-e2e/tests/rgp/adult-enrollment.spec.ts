import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-rgp';
import * as user from 'data/fake-user.json';
import { APP } from 'data/constants';
import { test } from 'fixtures/rgp-fixture';
import DashboardPage from 'pages/rgp/dashboard-page';
import HowItWorksPage from 'pages/rgp/how-it-works-page';
import TellUsAboutYourFamilyPage from 'pages/rgp/enrollment/tell-us-about-your-family-page';
import TellUsYourStoryPage, { WHO } from 'pages/rgp/enrollment/tell-us-your-story-page';
import HomePage from 'pages/rgp/home-page';
import { setAuth0UserEmailVerified } from 'utils/api-utils';
import { calculateBirthDate, getRandomInteger, setPatientParticipantGuid } from 'utils/faker-utils';
import dsmHome from 'pages/dsm/home-page';
import * as dsmAuth from 'authentication/auth-dsm';
import Select from 'lib/widget/select';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import ParticipantListPage from 'pages/dsm/participantList-page';
import { StudyNav } from 'lib/component/dsm/navigation/enums/studyNav.enum';
import exp from 'constants';
import FamilyMemberTab from 'pages/dsm/rgp/familyMember-tab';
import { FamilyMember } from 'lib/component/dsm/study/rgp/enums/familyMember.enum';
import ParticipantPage from 'pages/dsm/participant-page';
import { drop } from 'lodash';
import RgpParticipantPage from 'pages/dsm/rgp/rgp-participant-page';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD, DSM_USER_EMAIL, DSM_USER_PASSWORD } = process.env;

test.describe.serial('Adult Self Enrollment', () => {
  const assertProgressActiveItem = async (page: Page, itemName: string): Promise<void> => {
    const locator = page.locator('li.activity-stepper__step-container button.stepper-btn.stepper-btn--active');
    await expect(locator).toHaveCount(1);
    await expect(locator).toContainText(itemName);
  };

  test('Can complete application @functional @enrollment @rgp', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickGetStarted();

    const howItWorks = new HowItWorksPage(page);
    await howItWorks.startApplication();

    const tellUsYourStoryPage = new TellUsYourStoryPage(page);
    await tellUsYourStoryPage.waitForReady();
    // Check all checkboxes
    await tellUsYourStoryPage.who().check(WHO.UnderstandEnglishOrSpanish);
    await tellUsYourStoryPage.who().check(WHO.LivesInUS);
    await tellUsYourStoryPage.who().check(WHO.HasRareGeneticallyUndiagnosedCondition);
    await tellUsYourStoryPage.who().check(WHO.IsUnderCare);
    await tellUsYourStoryPage.submit();

    const userEmail = await auth.createAccountWithEmailAlias(page, {
      email: RGP_USER_EMAIL,
      password: RGP_USER_PASSWORD,
      waitForNavigation: false,
      waitForAuth: false
    });

    await expect(page.locator('text="Account Verification"')).toBeVisible();
    await expect(page.locator('#view__account-verification p:first-child')).toHaveText(
      'An email has been sent to the address that you provided. ' +
        'Please check your inbox, ' +
        'open the email and click "Verify my account and complete questionnaire" ' +
        'to move forward in the submission process.'
    );
    await expect(page.locator('#view__account-verification p:last-child')).toHaveText(
      'If you do not receive an email, contact us at raregenomes@broadinstitute.org.'
    );

    // Verify user email by Auth0 API
    await setAuth0UserEmailVerified(APP.RGP, userEmail, { isEmailVerified: true });

    await auth.login(page, { email: userEmail });

    const tellUsAboutYourFamily = new TellUsAboutYourFamilyPage(page);

    await setPatientParticipantGuid(page);

    await tellUsAboutYourFamily.waitForReady();

    await assertProgressActiveItem(page, '1');
    await tellUsAboutYourFamily.yourTitle().selectOption(user.patient.title);
    await tellUsAboutYourFamily.yourFirstName().fill(user.patient.firstName);
    await tellUsAboutYourFamily.phone().fill(user.patient.phone);
    await tellUsAboutYourFamily.confirmPhone().fill(user.patient.phone);
    await tellUsAboutYourFamily.patientRelationship().selectOption('MYSELF');
    await tellUsAboutYourFamily.state().toSelect().selectOption(user.patient.state.abbreviation);
    await tellUsAboutYourFamily.website().fill('https://en.wikipedia.org/wiki/Broad_Institute');
    await tellUsAboutYourFamily.describeGeneticCondition().fill('Single-gene disorders');
    await tellUsAboutYourFamily.haveAnyClinicalDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamily.clinicalDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamily.haveAnyGeneticDiagnosesBeenMade().check('Yes');
    await tellUsAboutYourFamily.geneticDiagnosesDetails().fill('Single-gene disorders');
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().checkAndFillInInput('Doctor', { inputText: user.doctor.name });
    await tellUsAboutYourFamily.howDidYouFindOutAboutThisProject().check('Twitter');
    await tellUsAboutYourFamily.next();

    await assertProgressActiveItem(page, '2');
    await expect(page.locator('text="Please provide information on the patient:"')).toBeVisible();
    await expect(page.locator('ddp-activity-content p.SubHeading')).toHaveText(
      'This study requires that at least one individual in the family affected by the rare condition provide a DNA sample.'
    );

    await tellUsAboutYourFamily.patientAge().fill(user.patient.age);
    await tellUsAboutYourFamily.patientAgeAtOnsetCondition().fill(user.patient.age);
    await tellUsAboutYourFamily.patientSex().check(user.patient.sex, { exactMatch: true });
    await tellUsAboutYourFamily.patientRace().toSelect('Select all that apply').selectOption('I prefer not to answer');
    await tellUsAboutYourFamily.patientEthnicity().check('I prefer not to answer');
    await tellUsAboutYourFamily.indicateTypesOfDoctors().toSelect('Select all that apply').selectOption('Pulmonologist');
    await tellUsAboutYourFamily.indicateAnyFollowingTest().check('Karyotype');
    await tellUsAboutYourFamily.indicateAnyFollowingTest().check('Single gene testing');
    await tellUsAboutYourFamily.indicateAnyBiopsiesAvailable().check('Bone Marrow Biopsy');
    await tellUsAboutYourFamily.indicateAnyBiopsiesAvailable().check('Skin Biopsy');
    await tellUsAboutYourFamily.indicateAnyBiopsiesAvailable().check('Muscle Biopsy');
    await tellUsAboutYourFamily.isPatientParticipatingInOtherResearchStudies().check('No');
    await tellUsAboutYourFamily.next();

    await assertProgressActiveItem(page, '3');

    await tellUsAboutYourFamily.patientBiologicalMotherRace().toSelect('Select all that apply').selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamily.patientBiologicalMotherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamily.doesMotherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalMotherAbleToParticipateStudy().check('No');

    await tellUsAboutYourFamily.patientBiologicalFatherRace().toSelect('Select all that apply').selectOption('White', { exactMatch: false });
    await tellUsAboutYourFamily.patientBiologicalFatherEthnicity().check('Not Hispanic');
    await tellUsAboutYourFamily.doesFatherHaveSameGeneticMedicalCondition().check('No', { exactMatch: true });
    await tellUsAboutYourFamily.isPatientBiologicalFatherAbleToParticipateStudy().check('No');
    await tellUsAboutYourFamily.doesNotHaveAnySiblings().check();
    await tellUsAboutYourFamily.doesNotHaveAnyChildren().check();
    await tellUsAboutYourFamily.doesNotHaveAnyOtherFamilyMembersAffectedByCondition().check();

    await tellUsAboutYourFamily.iAgreeToMatchToResearchStudy().check();
    await tellUsAboutYourFamily.iAgreeToBeContacted().check();
    await tellUsAboutYourFamily.iUnderstand().check();

    await tellUsAboutYourFamily.submit();

    const dashboard = new DashboardPage(page);
    await dashboard.waitForReady();

    const orderedHeaders = ['Form', 'Summary', 'Status', 'Actions'];
    const table = dashboard.getDashboardTable();
    const headers = await table.getHeaderNames();
    expect(headers).toHaveLength(4); // Four columns in table
    expect(headers).toEqual(orderedHeaders);

    const summaryCell = await table.findCell('Form', 'Tell us about your family', 'Summary');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(summaryCell!).toHaveText('Your application is complete. Thank you for applying!');

    const statusCell = await table.findCell('Form', 'Tell us about your family', 'Status');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expect(statusCell!).toContainText('Complete');

    const actionsCell = await table.findCell('Form', 'Tell us about your family', 'Actions');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const viewButton = table.findButtonInCell(actionsCell!, { label: 'View' });
    await expect(viewButton).toBeTruthy();
    // Make sure the View button in table cell is working by clicking it and checks page navigation
    await viewButton.click();
    await tellUsAboutYourFamily.waitForReady();
    // fields should be disabled. check one field to verify is disabled
    expect(await tellUsAboutYourFamily.yourTitle().isDisabled()).toEqual(true);
    expect(await tellUsAboutYourFamily.yourFirstName().isDisabled()).toEqual(true);
  });

  test('Go to DSM to verify the newly created account can be found @functional @rgp', async ({ page }) => {
    //Go to DSM to verify the newly created account can be found there
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);

    await participantListPage.assertPageTitle();

    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);
  });

  test('Verify the display and functionality of family account dynamic fields @functional @rgp', async ({ page}) => {
    //Go into DSM
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);

    //Confirm the 'Add Family Member' button is visible
    const rgpParticipantPage = new RgpParticipantPage(page);
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

  test('Verify that the proband family member tab can be filled out @functional @rgp', async ({ page }) => {
    //Go into DSM
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);

    //Verify that the proband tab is present (and includes the text RGP and 3 as proband subject ids have the format RGP_{family id}_3)
    const proband = new FamilyMemberTab(page, FamilyMember.PROBAND);

    //Initial setup
    proband.relationshipID = '_3';

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

    //Confirm that the same family id is used between proband tab, subject id field, family id field
    const subjectID = proband.getSubjectID();
    //const subjectID = (await probandSubjectID.inputValue()).substring(4, 8); //To get the family id in the subject id

    const familyID = proband.getFamilyID();
    await expect(familyID).not.toBeEditable(); //Verify that family id is not selectable/able to be changed

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

    //section for Participant Info -> Age Today; check that the age automatically calculated and inputted into
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
    await dropdownOptions.filter({ hasText: 'Unknown or Not Reported' }).click();

    await proband.inputMixedRaceNotes('Testing notes here - Mixed Race Notes');

    //todo verify that the input to Important Notes, Process Notes, Mixed Race Notes is saved even when page is re-visited

    //Fill out Contact Info section
    const contactInfoSection = proband.getContactInfoSection();
    await contactInfoSection.click();

    const primaryPhone = proband.getPrimaryPhoneNumber();
    await primaryPhone.fill(user.patient.phone);

    const secondaryPhone = proband.getSecondaryPhoneNumber();
    await secondaryPhone.fill(user.patient.secondaryPhoneNumber);

    //Verify that the proband's preferred email matches the email of the family account
    const email = proband.getPreferredEmail();
    const familyAccount = new ParticipantPage(page);
    const familyAccountEmail = familyAccount.getEmail();
    await expect(email.inputValue()).toEqual(familyAccountEmail.inputValue());

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

    const publicationInfo = proband.inputPublicationInfo('Testing notes here - Publication Info');

    //Fill out Survey section
    const surveySection = proband.getSurveySection();
    await surveySection.click();

    const redcapSurveyTaker = proband.getRedCapSurveyTaker();
    await redcapSurveyTaker.click();
    await dropdownOptions.filter({ hasText: 'Yes' }).click();

    const redCapSurveyCompletedDate = proband.getRedCapSurveyCompletedDate();
    await redCapSurveyCompletedDate.fill(`${currentDate[0]}/${currentDate[1]}/${currentDate[2]}`);//[0] is MM, [1] is DD, [2] is YYYY
  });

  test('Verify that a family member can be added using copied proband info @rgp @functional', async ({ page }) => {
    //Go into DSM
    const dsm = new dsmHome(page);
    const dsmUserEmail = await dsmAuth.login(page, {
      email: DSM_USER_EMAIL,
      password: DSM_USER_PASSWORD
    });
    const navigation = new Navigation(page);

    //select RGP study
    await new Select(page, { label: 'Select study' }).selectOption('RGP');

    //Verify the Participant List is displayed
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNav.PARTICIPANT_LIST);
    await participantListPage.assertPageTitle();
    await participantListPage.waitForReady();
    await participantListPage.filterListByParticipantGUID(user.patient.participantGuid);

    //Add a new family member
    const rgpParticipantPage = new RgpParticipantPage(page);

    const addFamilyMemberButton = rgpParticipantPage.getAddFamilyMemberButton();
    await addFamilyMemberButton.click();

    const addFamilyMemberPopup = rgpParticipantPage.getAddFamilyMemberPopup();
    await expect(addFamilyMemberPopup).toBeVisible();

    //Setup new family member
    const testBrother = new FamilyMemberTab(page, FamilyMember.BROTHER);
    testBrother.relationshipID = '10';
    testBrother.firstName = 'Test Brother';
    testBrother.lastName = user.patient.lastName;

    const familyMemberFirstName = rgpParticipantPage.getFamilyMemberFirstName();
    await familyMemberFirstName.fill(testBrother.firstName);

    const familyMemberLastName = rgpParticipantPage.getFamilyMemberLastName();
    await familyMemberLastName.fill(testBrother.lastName);

    const familyMemberRelationshipID = rgpParticipantPage.getFamilyMemberRelationshipID();
    await familyMemberRelationshipID.fill(testBrother.relationshipID);

    const familyMemberRelation = rgpParticipantPage.getFamilyMemberRelation();
    await familyMemberRelation.click();
    const dropdownOptions = rgpParticipantPage.getDropdownOptions();
    await dropdownOptions.filter({ hasText: testBrother.relationToProband}).click();

    const copyProbandInfo = rgpParticipantPage.getCopyProbandInfo();
    await copyProbandInfo.check();

    const submitButton = rgpParticipantPage.getAddFamilyMemberFormSubmitButton();
    await submitButton.click();
  });
});
