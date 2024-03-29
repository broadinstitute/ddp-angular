/* eslint-disable max-len */
import { expect, Page } from '@playwright/test';
import AtcpConsentPage from 'dss/pages/atcp/atcp-consent-page';
import AtcpContactPhysicianPage from 'dss/pages/atcp/atcp-contact-physician-page';
import AtcpDashboardPage from 'dss/pages/atcp/atcp-dashboard-page';
import AtcpGenomeStudyPage from 'dss/pages/atcp/atcp-genome-study-page';
import AtcpHomePage, { EnrollmentReason } from 'dss/pages/atcp/atcp-home-page';
import AtcpMedicalHistoryPage from 'dss/pages/atcp/atcp-medical-history-page';
import AtcpRegistrationPage from 'dss/pages/atcp/atcp-registration-page';
import AtcpReviewSubmissionPage from 'dss/pages/atcp/atcp-review-submission-page';
import { test } from 'fixtures/atcp-fixture';
import * as auth from 'authentication/auth-atcp';
import * as user from 'data/fake-user.json';
import { assertTableHeaders } from 'utils/assertion-helper';
import { generateUserName } from 'utils/faker-utils';

/**
 * toddler: Female 3 years old
 */
test.describe('ATCP parent consent enrollment', () => {
  const assertWorkflowInProgressStep = async (page: Page, textSubstring: string | RegExp) => {
    await expect(page.locator('.workflow-progress .in-progress')).toContainText(textSubstring);
  };

  const assertActivityStep = async (page: Page, expectedText: string) => {
    await expect(page.locator('.activity-steps .active p')).toHaveText(expectedText);
  };

  test('toddler is 3 years old @dss @atcp @visual', async ({ page }) => {
    let userEmail: string;

    const adult = user.adult;
    const adultFirstName = generateUserName(adult.firstName);
    const adultLastName = generateUserName(adult.lastName);
    const adultFullName = `${adultFirstName} ${adultLastName}`;
    const adultDoB = `${adult.birthDate.MM}/${adult.birthDate.DD}/${adult.birthDate.YYYY}`;

    const child = user.secondChild;
    const childSex = child.sex;
    const childFirstName = generateUserName(child.firstName);
    const childLastName = generateUserName(child.lastName);
    const childFullName = `${childFirstName} ${childLastName}`;
    const childDoB = `${child.birthDate.MM}/${child.birthDate.DD}/${child.birthDate.YYYY}`;

    const doctor = user.doctor;

    await test.step('Create new account', async () => {
      const homePage = new AtcpHomePage(page);
      await homePage.waitForReady();
      userEmail = await homePage.createNewAcct(adultFirstName, adultLastName, EnrollmentReason.PARENT_GUARDIAN);
    });

    await test.step('Log in', async () => {
      await auth.login(page, { email: userEmail });
      const dashboardPage = new AtcpDashboardPage(page);
      await dashboardPage.addParticipantButton();
    });

    await test.step('Registration', async () => {
      await assertWorkflowInProgressStep(page, 'Registration');

      const registrationPage = new AtcpRegistrationPage(page);
      await registrationPage.waitForReady();
      await registrationPage.participantFirstName.fill(childFirstName);
      await registrationPage.participantLastName.fill(childLastName);
      await registrationPage.participantGender.toSelect().selectOption(childSex, { exactMatch: true });
      await registrationPage.participantDOB.fill(childDoB);
      await registrationPage.participantStreetAddress.fill(child.streetAddress);
      await registrationPage.participantCity.fill(child.city);
      await registrationPage.participantStreetPostalCode.fill(child.zip);
      // Wait for the very long patch requests to finish before select country and state
      await expect(registrationPage.register.toLocator()).toBeVisible();
      await registrationPage.fillInCountry(child.country.abbreviation, { state: 'US-MA' });
      await registrationPage.register.click();

      await expect(registrationPage.agreement.errorMessage())
        .toContainText('You must confirm that this participant was diagnosed with ataxia-telangiectasia before continuing.');
      await registrationPage.agreement.toCheckbox('I have been diagnosed with ataxia-telangiectasia').check();
      await registrationPage.register.click();
    });

    await test.step('Consent', async () => {
      await assertWorkflowInProgressStep(page, 'Consent');

      const consentPage = new AtcpConsentPage(page);
      await consentPage.waitForReady();

      await assertActivityStep(page, '1');
      let blocks = await page.locator('.ddp-li').all();
      expect(blocks.length).toBe(1);
      await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-consent-form-step-1.png');
      await consentPage.next();

      await assertActivityStep(page, '2');
      blocks = await page.locator('.ddp-li').all();
      expect(blocks.length).toBe(3);
      for (let i = 0; i < blocks.length; i++) {
        await expect(blocks[i]).toHaveScreenshot(`atcp-consent-form-step-2-block-${i}.png`);
      }
      await consentPage.next();

      await assertActivityStep(page, '3');
      blocks = await page.locator('.ddp-li').all();
      expect(blocks.length).toBe(3);
      for (let i = 0; i < blocks.length; i++) {
        await expect(blocks[i]).toHaveScreenshot(`atcp-consent-form-step-3-block-${i}.png`);
      }
      await consentPage.next();

      await assertActivityStep(page, '4');
      blocks = await page.locator('.ddp-li').all();
      expect(blocks.length).toBe(3);
      for (let i = 0; i < blocks.length; i++) {
        await expect(blocks[i]).toHaveScreenshot(`atcp-consent-form-step-4-block-${i}.png`);
      }
      await consentPage.next();

      await assertActivityStep(page, '5');
      blocks = await page.locator('.ddp-li').all();
      expect(blocks.length).toBe(1);
      await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-consent-form-step-5.png');
      await consentPage.next();

      await assertActivityStep(page, '6');
      blocks = await page.locator('.ddp-li').all();
      expect(blocks.length).toBe(1);
      await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-consent-form-step-6.png');
      await consentPage.next();

      await assertActivityStep(page, '7');

      await expect(consentPage.mayContactMeWithFollowupResearchQuestionnaires.toLocator()).toHaveScreenshot('atcp-consent-recontact-followup-question.png');
      await consentPage.mayContactMeWithFollowupResearchQuestionnaires.toRadiobutton().check('Yes');

      await expect(consentPage.mayPerformDNASequencingOnSalivaSample.toLocator()).toHaveScreenshot('atcp-consent-perform-dna-sequencing-question.png');
      await consentPage.mayPerformDNASequencingOnSalivaSample.toRadiobutton().check('Yes');

      await expect(consentPage.mayRequestMyMedicalRecords.toLocator()).toHaveScreenshot('atcp-consent-request-medical-records-question.png');
      await consentPage.mayRequestMyMedicalRecords.toRadiobutton().check('Yes');

      await expect(consentPage.mayContactMeToReturnGeneticResults.toLocator()).toHaveScreenshot('atcp-consent-return-genetics-results-question.png');
      await consentPage.mayContactMeToReturnGeneticResults.toRadiobutton().check('Yes');

      await expect(consentPage.mayContactMyPhysician.toLocator()).toHaveScreenshot('atcp-consent-contact-physician-question.png');
      await consentPage.mayContactMyPhysician.toRadiobutton().check('Yes');
      await consentPage.next();

      await assertActivityStep(page, '8');
      await expect(page.locator('ddp-activity-content')).toHaveScreenshot('atcp-consent-form-step-8.png');

      await consentPage.parentOrLegalGuardianOf().fill(childFullName);
      await consentPage.myRelationshipToParticipant().fill('Father');
      await consentPage.signature().fill(adultFullName);
      await consentPage.parentDoB.fill(adultDoB);
      await consentPage.signAndConsent();
    });

/*
    await test.step("New Participant's Enrollment Process: Assent for Kids", async () => {
      await assertWorkflowInProgressStep(page, 'Assent for Kids');

      const assentForKidsPage = new AtcpAssentForKidsPage(page);
      await assentForKidsPage.waitForReady();

      const paragraphs = await page.locator('ddp-group-block-list p').all();
      for (const [index, paragraph] of paragraphs.entries()) {
        await expect(paragraph).toHaveScreenshot(`atcp-assent-for-kids-step-1-paragraph-${index}.png`)
      }

      await assentForKidsPage.next();

      await expect(page.locator('ddp-group-block-list')).toHaveScreenshot('atcp-assent-for-kids-step-2.png');
      await assentForKidsPage.next();

      await expect(page.locator('ddp-group-block-list')).toHaveScreenshot('atcp-assent-for-kids-step-3.png');
      await assentForKidsPage.next();

      await expect(page.locator('ddp-group-block-list')).toHaveScreenshot('atcp-assent-for-kids-step-4.png');
      await assentForKidsPage.next();

      await expect(page.locator('ddp-group-block-list')).toHaveScreenshot('atcp-assent-for-kids-step-5.png');
      await assentForKidsPage.next();

      await expect(page.locator('ddp-group-block-list .ddp-li')).toHaveScreenshot('atcp-assent-for-kids-step-6.png');
      await expect(assentForKidsPage.canContactMeLater.toLocator()).toHaveScreenshot('atcp-assent-for-kids-contact-me-later-question.png');
      await expect(assentForKidsPage.canDoTestsOnGenes.toLocator()).toHaveScreenshot('atcp-assent-for-kids-can-do-tests-on-genes-question.png');
      await expect(assentForKidsPage.canAskMyDoctorAboutMyHealth.toLocator()).toHaveScreenshot('atcp-assent-for-kids-ask-doctor-about-my-health-question.png');
      await expect(assentForKidsPage.canGetTestResults.toLocator()).toHaveScreenshot('atcp-assent-for-kids-get-test-results-question.png');
      await expect(assentForKidsPage.canTellMyDoctorAboutLearnedResults.toLocator()).toHaveScreenshot('atcp-assent-for-kids-tell-doctor-about-test-results-question.png');

      await assentForKidsPage.canContactMeLater.check('Yes');
      await assentForKidsPage.canDoTestsOnGenes.check('Yes');
      await assentForKidsPage.canAskMyDoctorAboutMyHealth.check('Yes');
      await assentForKidsPage.canGetTestResults.check('Yes');
      await assentForKidsPage.canTellMyDoctorAboutLearnedResults.check('Yes');
      await assentForKidsPage.next();

      await assentForKidsPage.signatureOfChild.fill(childFullName);
      await expect(assentForKidsPage.dateOfBirthOfChild.toInput().toLocator()).toHaveValue(childDoB);
      await assentForKidsPage.signatureOfParent.fill(adultFullName);
      await assentForKidsPage.assentDate.fill(getDate());
      await assentForKidsPage.signAndAssent();
    });
*/

    await test.step('Contacting Physician', async () => {
      await assertWorkflowInProgressStep(page, 'Contacting Physician');

      const contactPhysicianPage = new AtcpContactPhysicianPage(page);
      await contactPhysicianPage.waitForReady();

      const address = `${doctor.hospital}, ${doctor.address}`;
      await contactPhysicianPage.physicianFirstName.fill(doctor.firstName, { waitForSaveRequest: true });
      await contactPhysicianPage.physicianLastName.fill(doctor.lastName, { waitForSaveRequest: true });
      await contactPhysicianPage.physicianMailingAddress.fill(address, { waitForSaveRequest: true });
      await contactPhysicianPage.physicianPhone.fill(doctor.phone, { waitForSaveRequest: true });
      await contactPhysicianPage.evaluatedInstitution.check('A-T Clinical Center at Johns Hopkins Hospital, Baltimore, MD, USA');

      await expect(contactPhysicianPage.evaluatedInstitution.toLocator().locator('ddp-activity-checkboxes-picklist-question')).toHaveScreenshot('atcp-medical-institution-list.png');
      await contactPhysicianPage.saveAndSubmit();
    });

    await test.step('Medical History', async () => {
      await assertWorkflowInProgressStep(page, 'Medical History');

      const medicalHistory = new AtcpMedicalHistoryPage(page);
      await medicalHistory.waitForReady();

      await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-medical-history-page.png');
      await medicalHistory.startResume.click();

      await expect(medicalHistory.hasDiagnosedWithAtaxiaTelangiectasia.toLocator()).toContainText("Note: Selecting 'No' will automatically end this survey.");
      await medicalHistory.hasDiagnosedWithAtaxiaTelangiectasia.toRadiobutton().check('Yes');
      await medicalHistory.next();

      await medicalHistory.diagnosedAgeYear.fill('2');
      await medicalHistory.diagnosedAgeMonth.fill('5');
      await medicalHistory.firstSymptomObservedAge.fill('2');
      await medicalHistory.neurologicProblemFirstSuspectedAge.fill('1');
      // select all that apply
      await medicalHistory.howWasDiagnosisDetermined.check('Serum Alpha-Fetoprotein(AFP)');
      await medicalHistory.howWasDiagnosisDetermined.check('Physical Exam / Clinical Findings');
      await medicalHistory.howWasDiagnosisDetermined.check('Spontaneous Chromosome Breakage Analysis');
      await medicalHistory.howWasDiagnosisDetermined.check('Functional ATM Kinase Assay');
      await medicalHistory.howWasDiagnosisDetermined.check('Imaging - CT');
      await medicalHistory.howWasDiagnosisDetermined.check('Imaging - MRI');
      await medicalHistory.howWasDiagnosisDetermined.check('Imaging - PET');
      await medicalHistory.next(); // INSERT more diagosis

      await medicalHistory.ATMMutations.fill('skin cancer');
      await medicalHistory.physicianMadeDiagnosis.fill(doctor.name);
      await medicalHistory.physicianPhone.fill(doctor.phone);
      await medicalHistory.physicianHospitalName.fill(doctor.hospital);
      await medicalHistory.physicianHospitalCity.fill(doctor.city);
      await medicalHistory.physicianHospitalState.fill(doctor.state.name);
      await medicalHistory.physicianHospitalCountry.fill('USA');
      await medicalHistory.next();

      await medicalHistory.haveHistoryOfCancer.check("Don't know");
      await medicalHistory.next();

      await expect(medicalHistory.descriptionOfAbilityToWalk.toLocator().locator('mat-radio-group')).toHaveScreenshot('question-ability-to-walk.png');
      await medicalHistory.descriptionOfAbilityToWalk.check('Uses manual wheelchair most of the time without assistance', { exactMatch: true });
      await medicalHistory.next();

      await expect(medicalHistory.symptomsOrConditionsAssociatedWithAT.toLocator().locator('mat-list')).toHaveScreenshot('question-conditions-associated-with-AT.png');
      await medicalHistory.symptomsOrConditionsAssociatedWithAT.check('Fatigue');

      await expect(medicalHistory.telangiectasia.toLocator().locator('mat-list')).toHaveScreenshot('question-telangiectasia.png');
      await medicalHistory.telangiectasia.check('Telangiectasia - skin');

      await expect(medicalHistory.frequentInfections.toLocator().locator('mat-list')).toHaveScreenshot('question-frequentInfections.png');
      await medicalHistory.frequentInfections.check('Frequent infections - sinus');

      await expect(medicalHistory.skinConditions.toLocator().locator('mat-list')).toHaveScreenshot('question-skin-conditions.png');
      await medicalHistory.skinConditions.check('Skin conditions - granulomas');
      await medicalHistory.next();

      await expect(medicalHistory.otherSymptomsOrConditions.toLocator().locator('mat-list')).toHaveScreenshot('question-other-symptoms-or-conditions.png');
      await medicalHistory.otherSymptomsOrConditions.check('Leg cramps');
      await medicalHistory.next();

      // Females-only questions
      await medicalHistory.hasExperiencedOnsetOfPeriod.check('No', { exactMatch: true });
      await medicalHistory.hasEverBeenPregnant.check('No', { exactMatch: true });
      await medicalHistory.next();

      await expect(medicalHistory.hadAnyInfectiousDiseases.toLocator().locator('mat-list')).toHaveScreenshot('question-infectious-diseases.png');
      await medicalHistory.hadAnyInfectiousDiseases.check('Measles');

      await expect(medicalHistory.hasImmunodeficiency.toLocator().locator('mat-radio-group')).toHaveScreenshot('question-has-immunodeficiency.png');
      await medicalHistory.hasImmunodeficiency.check('No', { exactMatch: true });
      await medicalHistory.next();

      await expect(medicalHistory.hasEverAcquiredInfectionFromImmunization.toLocator().locator('mat-radio-group')).toHaveScreenshot('question-has-ever-acquiredInfection-from-immunization.png');
      await medicalHistory.hasEverAcquiredInfectionFromImmunization.check('No', { exactMatch: true });

      await expect(medicalHistory.surgeries.toLocator().locator('mat-list')).toHaveScreenshot('question-surgeries.png');
      await medicalHistory.surgeries.check('Eye surgery');
      await medicalHistory.next();

      // medications
      await medicalHistory.medicationCategory.toSelect().selectOption('Steroid');
      await medicalHistory.medicationName.fill('cortisone', { waitForSaveRequest: true });
      await medicalHistory.addAnotherMedication();
      await medicalHistory.medicationName.fill('Prednisone', { waitForSaveRequest: true, nth: 1 });
      await medicalHistory.next();

      await medicalHistory.takeAnyOverTheCounterNutritionalSupplements.check('No', { exactMatch: true });
      await medicalHistory.areParentsConsanguineous.check('No', { exactMatch: true });
      await medicalHistory.next();

      await medicalHistory.hasPreviouslyParticipatedInAnyClinicalDrugTrials.check('No', { exactMatch: true });
      await medicalHistory.isCurrentlyParticipateInAnyClinicalDrugTrials.check('No', { exactMatch: true });
      await medicalHistory.hasPreviouslyDonatedSampleOfBloodTissueOrBiospecimen.check('No', { exactMatch: true });
      await medicalHistory.next();

      await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-medical-history-submit-form.png');
      await medicalHistory.submit();
    });

    await test.step('Genome Study', async () => {
      await assertWorkflowInProgressStep(page, 'Genome Study');

      const genomeStudyPage = new AtcpGenomeStudyPage(page);
      await genomeStudyPage.waitForReady();

      const contents = await page.locator('.ddp-content').all();
      expect(contents.length).toBe(4);
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`atcp-genome-study-form-content-${i}.png`);
      }

      await genomeStudyPage.chooseEthnicity.toSelect().selectOption('Prefer not to answer');
      await genomeStudyPage.saveAndSubmit();
    });

    await test.step('Review & Submission', async () => {
      await assertWorkflowInProgressStep(page, 'Review & Submission');

      const reviewSubmissionPage = new AtcpReviewSubmissionPage(page);
      await reviewSubmissionPage.waitForReady();

      await expect(page.locator('h1.activity-header')).toHaveText('Review & Submission');
      const blocks = await page.locator('.ddp-content').all();
      expect(blocks.length).toBe(2);
      for (let i = 0; i < blocks.length; i++) {
        await expect(blocks[i]).toHaveScreenshot(`atcp-review-submission-form-content-${i}.png`);
      }

      await reviewSubmissionPage.saveAndSubmitEnrollment();
    });

    await test.step('Dashboard Verification', async () => {
      const dashboardPage = new AtcpDashboardPage(page);
      await dashboardPage.waitForReady();

      await expect(page.locator('h1.title')).toHaveScreenshot('atcp-dashboard-h1-title.png');
      await expect(page.locator('h2.subtitle')).toHaveScreenshot('atcp-dashboard-h2-subtitle.png');
      await expect(page.locator('h2.title')).toHaveScreenshot('atcp-dashboard-h2-title.png');
      await expect(page.locator('.participant-expandable__name')).toHaveText(childFullName);

      await dashboardPage.expandTable();
      const table = dashboardPage.getTable();
      const expectedHeaders = ['Form', 'Summary', 'Created', 'Status', 'Actions'];
      const actualHeaders = await table.getHeaderNames();
      assertTableHeaders(actualHeaders, expectedHeaders);

      expect(await table.getRowsCount()).toBe(6);

      const columnForm = await table.getColumnAllTexts('Form');
      expect(columnForm).toStrictEqual([
        'Registration', 'Consent', 'Contacting Physician', 'Medical History', 'Genome Study', 'Review & Submission'
      ]);

      const columnStatus = await table.getColumnAllTexts('Status');
      expect(columnStatus).toStrictEqual([
        'Complete', 'Complete', 'Complete', 'Complete', 'Complete', 'Complete'
      ]);

      const columnSummary = await table.getColumnAllTexts('Summary');
      expect(columnSummary).toStrictEqual([
        'Thank you for signing the registration form.',
        'Thank you for signing the research consent form.',
        'Thank you for signing the contacting physician form.',
        'Thank you for signing the Medical History form.',
        'Thank you for signing the Genome Study form.',
        'Review & Submission'
      ]);

      const actionsCell = await table.findCell('Form', 'Registration', 'Actions');
      expect(actionsCell).not.toBeNull();
      const viewButton = table.findButtonInCell(actionsCell!, { label: 'View' });
      expect(await viewButton.isVisible()).toBeTruthy();
      const editButton = table.findButtonInCell(actionsCell!, { label: 'Edit' });
      expect(await editButton.isVisible()).toBeTruthy();

      await dashboardPage.signOut();
    });

    await test.step('Signed out', async () => {
      const homePage = new AtcpHomePage(page);
      await homePage.waitForReady();

      await expect(page.locator('.Header .logo')).toHaveScreenshot('atcp-home-page-logo.png');
      await expect(page.locator('.first-display h1')).toHaveScreenshot('atcp-home-page-h1-message.png');
      await expect(page.locator('.first-display h2')).toHaveScreenshot('atcp-home-page-h2-message.png');
      await expect(page.locator('.participate-display')).toHaveScreenshot('atcp-home-page-how-to-participant-message.png');
      await expect(page.locator('.together-display h3')).toHaveScreenshot('atcp-home-page-together-message.png');
    });
  });
});
