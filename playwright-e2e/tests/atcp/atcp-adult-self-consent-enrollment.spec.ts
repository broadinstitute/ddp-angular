/* eslint-disable max-len */
import { expect, Page } from '@playwright/test';
import { APP } from 'data/constants';
import AtcpConsentPage from 'dss/pages/atcp/atcp-consent-page';
import AtcpContactPhysicianPage from 'dss/pages/atcp/atcp-contact-physician-page';
import AtcpDashboardPage from 'dss/pages/atcp/atcp-dashboard-page';
import AtcpGenomeStudyPage from 'dss/pages/atcp/atcp-genome-study-page';
import AtcpHomePage from 'dss/pages/atcp/atcp-home-page';
import AtcpMedicalHistoryPage from 'dss/pages/atcp/atcp-medical-history-page';
import AtcpReviewSubmissionPage from 'dss/pages/atcp/atcp-review-submission-page';
import { test } from 'fixtures/atcp-fixture';
import * as auth from 'authentication/auth-atcp';
import * as user from 'data/fake-user.json';
import { setAuth0UserEmailVerified } from 'utils/api-utils';
import { assertTableHeaders } from 'utils/assertion-helper';
import { generateUserName } from 'utils/faker-utils';
import { logParticipantCreated } from 'utils/log-utils';

test.describe('Adult self-consent enrollment', () => {
  const assertActivityStep = async (page: Page, expectedText: string) => {
    await expect(page.locator('.activity-steps .active p')).toHaveText(expectedText);
  };

  test.skip('Welcome page @enrollment @atcp @visual', async ({ page }) => {
    const homePage = new AtcpHomePage(page);
    await homePage.waitForReady();

    await expect(page.locator('.Header .logo')).toHaveScreenshot('atcp-header-logo.png');
    await expect(page.locator('.first-display h1')).toHaveScreenshot('atcp-welcome-text-1.png');
    await expect(page.locator('.first-display h2')).toHaveScreenshot('atcp-welcome-text-2.png');

    const steps = await page.locator('.participate-display .step').all();
    expect(steps.length).toBe(4);
    for (let i = 0; i < steps.length; i++) {
      await expect(steps[i]).toHaveScreenshot(`atcp-welcome-step-${i}.png`);
    }
  });

  test('Should be able to complete self-enrollment @enrollment @atcp @visual', async ({ page }) => {
    const adult = user.adult;
    const adultFirstName = generateUserName(adult.firstName);
    const adultLastName = generateUserName(adult.lastName);
    const adultFullName = `${adultFirstName} ${adultLastName}`;
    const dob = `${adult.birthDate.MM}/${adult.birthDate.DD}/${adult.birthDate.YYYY}`;

    const homePage = new AtcpHomePage(page);
    await homePage.waitForReady();

    const joinUsPage = await homePage.joinUs();
    await joinUsPage.fillInName(adultFirstName, adultLastName,
      { firstNameTestId: 'answer:PREQUAL_FIRST_NAME', lastNameTestId: 'answer:PREQUAL_LAST_NAME' });

    await joinUsPage.prequalSelfDescribe.toRadiobutton().check('I have A-T');
    await joinUsPage.clickJoinUs();

    const userEmail = await auth.createAccountWithEmailAlias(page, {
      email: process.env.ATCP_USER_EMAIL,
      password: process.env.ATCP_USER_PASSWORD
    });
    logParticipantCreated(userEmail, adultFullName);

    await expect(page.locator('text="Account Activation"')).toBeVisible();
    await expect(page.locator('.activate-account h2.Subtitle')).toHaveText(
      `You are almost done! Please check your email: ${userEmail}. An email has been sent there with the guidelines to activate your account.`
    );

    // Send Auth0 API to verify user email
    await setAuth0UserEmailVerified(APP.AT, userEmail, { isEmailVerified: true });

    const registrationPage = await auth.login(page, { email: userEmail });

    await expect(registrationPage.participantFirstName.toInput().toLocator()).toHaveValue(adultFirstName);
    await expect(registrationPage.participantLastName.toInput().toLocator()).toHaveValue(adultLastName);

    await registrationPage.participantGender.toSelect().selectOption('Male', { exactMatch: true });
    await registrationPage.participantDOB.fill(dob);
    await registrationPage.participantStreetAddress.fill(adult.streetAddress);
    await registrationPage.participantCity.fill(adult.city);
    await registrationPage.participantStreetPostalCode.fill(adult.zip);
    await registrationPage.fillInCountry(adult.country.abbreviation, { state: 'US-MA' });
    await registrationPage.register.click();

    await expect(registrationPage.agreement.errorMessage())
      .toContainText('You must confirm that this participant was diagnosed with ataxia-telangiectasia before continuing.');
    await registrationPage.agreement.toCheckbox('I have been diagnosed with ataxia-telangiectasia').check();
    await registrationPage.register.click();

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
    await consentPage.signature().fill(adultFullName);
    await consentPage.participantDOB.fill(dob);
    await consentPage.signAndConsent.click();

    const contactPhysicianPage = new AtcpContactPhysicianPage(page);
    await contactPhysicianPage.waitForReady();

    const doctor = user.secondDoctor;
    const address = `${doctor.hospital}, ${doctor.address}`;
    await contactPhysicianPage.physicianFirstName.fill(doctor.firstName, { waitForSavingRequest: true });
    await contactPhysicianPage.physicianLastName.fill(doctor.lastName, { waitForSavingRequest: true });
    await contactPhysicianPage.physicianMailingAddress.fill(address, { waitForSavingRequest: true });
    await contactPhysicianPage.physicianPhone.fill(doctor.phone, { waitForSavingRequest: true });
    await contactPhysicianPage.saveAndSubmit();

    const medicalHistory = new AtcpMedicalHistoryPage(page);
    await medicalHistory.waitForReady();

    await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-medical-history-form.png');
    await medicalHistory.startResume.click();

    await medicalHistory.hasDiagnosedWithAtaxiaTelangiectasia.toRadiobutton().check('Yes');
    await medicalHistory.next();

    await medicalHistory.diagnosedAgeYear.fill('21');
    await medicalHistory.diagnosedAgeMonth.fill('5');
    await medicalHistory.firstSymptomObservedAge.fill('20');
    await medicalHistory.neurologicProblemFirstSuspectedAge.fill('15');
    // select all that apply
    await medicalHistory.howWasDiagnosisDetermined.check('Genetic Laboratory Analysis / Analysis of the ATM gene');
    await medicalHistory.howWasDiagnosisDetermined.check('Physical Exam / Clinical Findings');
    await medicalHistory.howWasDiagnosisDetermined.check('Spontaneous Chromosome Breakage Analysis');
    await medicalHistory.howWasDiagnosisDetermined.check('Functional ATM Kinase Assay');
    await medicalHistory.howWasDiagnosisDetermined.check('Imaging - CT');
    await medicalHistory.next();

    await medicalHistory.ATMMutations.fill('Stomach cancer');
    await medicalHistory.physicianMadeDiagnosis.fill(doctor.fullName);
    await medicalHistory.physicianPhone.fill(doctor.phone);
    await medicalHistory.physicianHospitalName.fill(doctor.hospital);
    await medicalHistory.physicianHospitalCity.fill(doctor.city);
    await medicalHistory.physicianHospitalState.fill(doctor.state);
    await medicalHistory.physicianHospitalCountry.fill('USA');
    await medicalHistory.next();

    await medicalHistory.haveHistoryOfCancer.check('No');
    await medicalHistory.next();

    await medicalHistory.descriptionOfAbilityToWalk.check('Walks independently', { exactMatch: true });
    await medicalHistory.next();

    await medicalHistory.symptomsOrConditionsAssociatedWithAT.check('Ataxic gait');
    await medicalHistory.symptomsOrConditionsAssociatedWithAT.check('Fatigue');
    await medicalHistory.symptomsOrConditionsAssociatedWithAT.check('Diabetes');

    await medicalHistory.telangiectasia.check('Telangiectasia - skin');
    await medicalHistory.frequentInfections.check('Frequent infections - sinus');
    await medicalHistory.skinConditions.check('Skin conditions - granulomas');
    await medicalHistory.next();

    await medicalHistory.otherSymptomsOrConditions.check('Arthritis');
    await medicalHistory.otherSymptomsOrConditions.check('Asthma');
    await medicalHistory.otherSymptomsOrConditions.check('Osteoporosis');
    await medicalHistory.next();

    await medicalHistory.hasImmunodeficiency.check('No', { exactMatch: true });
    await medicalHistory.next();

    await medicalHistory.hasEverAcquiredInfectionFromImmunization.check('No', { exactMatch: true });
    await medicalHistory.surgeries.check('No surgeries');
    await medicalHistory.next();

    // antibiotics
    await medicalHistory.medicationName.fill('Penicillin', { waitForSavingRequest: true });
    await medicalHistory.addAnotherMedication();
    await medicalHistory.medicationName.fill('Tetracycline', { nth: 1, waitForSavingRequest: true });
    await medicalHistory.next();

    await medicalHistory.takeAnyOverTheCounterNutritionalSupplements.check('No', { exactMatch: true });
    await medicalHistory.areParentsConsanguineous.check('No', { exactMatch: true });
    await medicalHistory.siblingsSex.toSelect().selectOption('Female');
    await medicalHistory.siblingsAge.fill('15');
    await medicalHistory.siblingsATDiagnosis.toSelect().selectOption('No', { exactMatch: true });
    await medicalHistory.siblingsATCarrier.toSelect().selectOption('No', { exactMatch: true });
    await medicalHistory.next();

    await medicalHistory.hasPreviouslyParticipatedInAnyClinicalDrugTrials.check('No', { exactMatch: true });
    await medicalHistory.isCurrentlyParticipateInAnyClinicalDrugTrials.check('No', { exactMatch: true });
    await medicalHistory.hasPreviouslyDonatedSampleOfBloodTissueOrBiospecimen.check('No', { exactMatch: true });
    await medicalHistory.next();

    await expect(page.locator('.ddp-li')).toHaveScreenshot('atcp-medical-history-submit-form.png');
    await medicalHistory.submit();

    const genomeStudyPage = new AtcpGenomeStudyPage(page);
    await genomeStudyPage.waitForReady();

    blocks = await page.locator('.ddp-content').all();
    expect(blocks.length).toBe(4);
    for (let i = 0; i < blocks.length; i++) {
      await expect(blocks[i]).toHaveScreenshot(`atcp-genome-study-form-content-${i}.png`);
    }

    await genomeStudyPage.sendMeSalivaSampleCollectionKit.check();
    await genomeStudyPage.chooseEthnicity.toSelect().selectOption('CAUCASIAN');
    await genomeStudyPage.saveAndSubmit();

    // Review & Submission form
    const reviewSubmissionPage = new AtcpReviewSubmissionPage(page);
    await reviewSubmissionPage.waitForReady();

    await expect(page.locator('h1.activity-header')).toHaveText('Review & Submission');
    blocks = await page.locator('.ddp-content').all();
    expect(blocks.length).toBe(2);
    for (let i = 0; i < blocks.length; i++) {
      await expect(blocks[i]).toHaveScreenshot(`atcp-review-submission-form-content-${i}.png`);
    }

    await reviewSubmissionPage.saveAndSubmitEnrollment();

    const dashboardPage = new AtcpDashboardPage(page);
    await dashboardPage.waitForReady();

    await expect(page.locator('h2.subtitle')).toHaveScreenshot('atcp-dashboard-thank-you-message.png');
    await expect(page.locator('.registration-status')).toHaveScreenshot('atcp-dashboard-registration-status.png');

    const expectedHeaders = ['Form', 'Summary', 'Created', 'Status', 'Actions'];
    const table = dashboardPage.getTable();
    const actualHeaders = await table.getHeaderNames();
    await assertTableHeaders(actualHeaders, expectedHeaders);

    expect(await table.getRowsCount()).toBe(6);

    let columnText = await table.getColumnValues('Form');
    expect(columnText).toStrictEqual([
      'Registration', 'Consent', 'Contacting Physician', 'Medical History', 'Genome Study', 'Review & Submission'
    ]);

    columnText = await table.getColumnValues('Summary');
    expect(columnText).toStrictEqual([
      'Thank you for signing the registration form.',
      'Thank you for signing the research consent form.',
      'Thank you for signing the contacting physician form.',
      'Thank you for signing the Medical History form.',
      'Thank you for signing the Genome Study form.',
      'Review & Submission'
    ]);

    columnText = await table.getColumnValues('Status');
    expect(columnText).toStrictEqual([
      'Complete', 'Complete', 'Complete', 'Complete', 'Complete', 'Complete'
    ]);

    const actionsCell = await table.findCell('Form', 'Registration', 'Actions');
    expect(actionsCell).not.toBeNull();
    const viewButton = table.findButtonInCell(actionsCell!, { label: 'View' });
    expect(await viewButton.isVisible()).toBeTruthy();
    const editButton = table.findButtonInCell(actionsCell!, { label: 'Edit' });
    expect(await editButton.isVisible()).toBeTruthy();

    /*
    // participant: zoey.redwalker+326719871@test.firecloud.org E2E-Corkeryfatally Playwright-DurganGroup
    */
  });
});
