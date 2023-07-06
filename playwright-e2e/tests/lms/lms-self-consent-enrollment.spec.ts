/* eslint-disable max-len */
import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-lms';
import * as user from 'data/fake-user.json';
import LmsAdditionalConsentPage from 'dss/pages/lms/lms-additional-consent-page';
import LmsHomePage from 'dss/pages/lms/lms-home-page';
import LmsGetStartedPage from 'dss/pages/lms/lms-get-started-page';
import LmsResearchConsentPage from 'dss/pages/lms/lms-research-consent-page';
import LmsMedicalReleasePage from 'dss/pages/lms/lms-medical-release-page';
import LmsSurveyAboutLmsPage from 'dss/pages/lms/lms-survey-about-lms-page';
import SurveyAboutYou from 'dss/pages/survey-about-you';
import { test } from 'fixtures/lms-fixture';
import { assertActivityHeader } from 'utils/assertion-helper';
import { generateUserName } from 'utils/faker-utils';
import { logParticipantCreated } from 'utils/log-utils';
import { waitForResponse } from 'utils/test-utils';

test.describe.serial('LMS Adult Enrollment', () => {
  let researchConsentPage: LmsResearchConsentPage;
  let additionalConsentPage: LmsAdditionalConsentPage;

  const assertActiveActivityStep = async (page: Page, expectedText: string) => {
    await expect(page.locator('.activity-step.active')).toHaveText(expectedText);
  };

  test('self-consent @visual @enrollment @lms', async ({ page }) => {
    researchConsentPage = new LmsResearchConsentPage(page);
    additionalConsentPage = new LmsAdditionalConsentPage(page);

    const participant = user.adult;
    const firstName = generateUserName(participant.firstName);
    const lastName = generateUserName(participant.lastName);
    const fullName = `${firstName} ${lastName}`;

    await test.step('Create account with an email', async () => {
      const homePage = new LmsHomePage(page);
      await homePage.waitForReady();
      await homePage.countMeIn();

      const getStartedPage = new LmsGetStartedPage(page);
      await getStartedPage.waitForReady();
      await expect(page.locator('.ddp-content')).toHaveScreenshot('get-started-instruction.png');
      await getStartedPage.whoIsSigningUP().toCheckbox("I have been diagnosed with LMS and I'm signing myself up").check();
      await getStartedPage.next();

      await getStartedPage.age().fill(participant.age);
      await getStartedPage.fillInCountry(participant.country.abbreviation, { state: participant.state.abbreviation });
      await getStartedPage.submit();

      const userEmail = await auth.createAccountWithEmailAlias(page, {
        email: process.env.LMS_USER_EMAIL,
        password: process.env.LMS_USER_PASSWORD
      });
      logParticipantCreated(userEmail, fullName);
    })

    await test.step('Asserting text contents on Research Consent Form: Step 1. Key Points', async () => {
      await assertActivityHeader(page, 'Research Consent Form');
      await assertActiveActivityStep(page, '1. Key Points');

      await expect(page.locator('.ddp-content')).toHaveScreenshot('research-consent-form-message.png');
      await expect(page.locator('.activity-steps')).toHaveScreenshot('research-consent-activity-steps.png');
      const paragraphs = await page.locator('.ddp-li .ddp-block-body').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`research-consent-key-points-page-paragraph-${i}.png`);
      }
    })

    await researchConsentPage.next();

    await test.step('Asserting text contents on Research Consent Form: Step 2. Full Form', async () => {
      await assertActiveActivityStep(page, '2. Full Form');
      const questionALocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Introduction")]]');
      let paragraphs = await questionALocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`research-consent-full-form-page-A-paragraph-${i}.png`);
      }

      const questionBLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Why is this research study being done?")]]');
      await expect(questionBLocator).toHaveScreenshot(`research-consent-full-form-page-B-paragraph.png`);

      const questionCLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What other options are there?")]]');
      await expect(questionCLocator).toHaveScreenshot(`research-consent-full-form-page-C-paragraph.png`);

      const questionDLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What is involved in the research study?")]]');
      paragraphs = await questionDLocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`research-consent-full-form-page-D-paragraph-${i}.png`);
      }

      const questionELocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "How long will I be in this research study?")]]');
      await expect(questionELocator).toHaveScreenshot(`research-consent-full-form-page-E-paragraph.png`);

      const questionFLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What kind of information could be found in this study and will I be able to see it?")]]');
      paragraphs = await questionFLocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`research-consent-full-form-page-F-paragraph-${i}.png`);
      }

      const questionGLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What are the benefits of the research study?")]]');
      await expect(questionGLocator).toHaveScreenshot(`research-consent-full-form-page-G-paragraph.png`);

      // Note: Questions H to P are not checked
    })

    await researchConsentPage.next();

    await test.step('Asserting text contents on Research Consent Form: Step 3. Sign Consent', async () => {
      await assertActiveActivityStep(page, '3. Sign Consent');

      await expect(page.locator('p.secondary-text')).toHaveScreenshot(`research-consent-sign-consent-info.png`);
      await expect(await researchConsentPage.agreeToDrawBloodQuestion.toLocator()).toHaveScreenshot('research-consent-agree-to-draw-blood-question.png');
      await expect(await researchConsentPage.canRequestStoredTumorSamples.toLocator()).toHaveScreenshot('research-consent-can-request-tumor-samples-question.png');

      await researchConsentPage.agreeToDrawBloodSamples();
      await researchConsentPage.requestStoredSamples();

      const agreeToFollowing = page.locator('//ddp-activity-content[.//text()[normalize-space()= "In addition, I agree to all of the following:"]]');
      await expect(agreeToFollowing).toHaveScreenshot(`research-consent-agree-to-following.png`);

      const fullNameIndicatesFollowing = page.locator('//ddp-activity-content[.//text()[normalize-space()= "My full name below indicates:"]]');
      await expect(fullNameIndicatesFollowing).toHaveScreenshot(`research-consent-full-name-indicates-following.png`);

      await researchConsentPage.fillInName(firstName, lastName);
      await researchConsentPage.fillInDateOfBirth(participant.birthDate.MM, participant.birthDate.DD, participant.birthDate.YYYY);
      await researchConsentPage.fillInContactAddress({
        fullName,
        country: user.patient.country.name,
        state: user.patient.state.name,
        street: user.patient.streetAddress,
        city: user.patient.city,
        zipCode: user.patient.zip
      });
    })

    await researchConsentPage.submit();

    await test.step('Asserting text contents on Additional Consent Form: Learning About Your Tumor', async () => {
      // Additional Consent Form: Learning About Your tumor
      await assertActivityHeader(page, 'Additional Consent Form: Learning About Your Tumor');

      const paragraphALocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Introduction")]]');
      await expect(paragraphALocator).toHaveScreenshot(`research-consent-additional-consent-page-A-paragraph.png`);

      const paragraphBLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Brief Description of the Project")]]');
      await expect(paragraphBLocator).toHaveScreenshot(`research-consent-additional-consent-page-B-paragraph.png`);

      const paragraphCLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What are the new procedures involved?")]]');
      await expect(paragraphCLocator).toHaveScreenshot(`research-consent-additional-consent-page-C-paragraph.png`);

      const paragraphDLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Are there any new risks associated with participating in this portion of the research study?")]]');
      await expect(paragraphDLocator).toHaveScreenshot(`research-consent-additional-consent-page-D-paragraph.png`);

      const paragraphELocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Who do I contact if I have questions about the research study?")]]');
      await expect(paragraphELocator).toHaveScreenshot(`research-consent-additional-consent-page-E-paragraph.png`);

      const additionalConsentPage = new LmsAdditionalConsentPage(page);
      await additionalConsentPage.agreeToShareWithMeResults('Yes');
      const requestPromise = waitForResponse(page, { uri: '/answers'});
      await Promise.all([additionalConsentPage.signature().fill(fullName), requestPromise]);
      await additionalConsentPage.submit();
    })

    await test.step('Asserting text contents on Medical Release Form', async () => {
      const medicalReleasePage = new LmsMedicalReleasePage(page);
      await medicalReleasePage.waitForReady();

      const contents = await page.locator('//ddp-activity-content[not(contains(.,"Date"))]').all();
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`medical-release-content-${i}.png`);
      }
      await expect(page.locator('.ddp-activity-question.Question--AGREEMENT')).toHaveScreenshot(`medical-release-agreement.png`);

      await medicalReleasePage.fillInPhysicianInstitution();
      await medicalReleasePage.agreeToAllowUsToContactPhysicianToObtainRecords();
      await medicalReleasePage.fillInFullName(fullName);
      await medicalReleasePage.submit();
    })

    // Next page: Survey: Your LMS
    await test.step('Asserting text contents on Survey: Your LMS', async () => {
      await assertActivityHeader(page, 'Survey: Your LMS');

      const surveyAboutLms = new LmsSurveyAboutLmsPage(page);
      await surveyAboutLms.waitForReady();

      const contents = await page.locator('.ddp-content').all();
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`survey-your-lms-content-${i}.png`);
      }

      await surveyAboutLms.fillInDiagnosedDate('February', '2000');
      await surveyAboutLms.bodyLocationWhenFirstDiagnosed().fill('Blood', { nth: 0 });
      await surveyAboutLms.bodyLocationWhenFirstDiagnosed().button('Add another location').click();
      await surveyAboutLms.bodyLocationWhenFirstDiagnosed().fill('Lung', { nth: 1 });
      await surveyAboutLms.bodyLocationEverHad().fill('Pancreas');
      await surveyAboutLms.hadReceivedTherapies().check('Radiation');
      await surveyAboutLms.medicationsChemotherapyReceived().fill('ABARELIX', { nth: 0 });
      await surveyAboutLms.bodyLocationWhenFirstDiagnosed().button('Add medication/chemotherapy').click();
      await surveyAboutLms.medicationsChemotherapyReceived().fill('AFATINIB', { nth: 1 });
      await surveyAboutLms.submit();
    })

    // Next page: Survey: About You
    await test.step('Asserting text contents on Survey: About You', async () => {
      await assertActivityHeader(page, 'Survey: About You');

      const surveyAboutYou = new SurveyAboutYou(page);
      await surveyAboutYou.waitForReady();

      const contents = await page.locator('.ddp-content').all();
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`survey-about-you-content-${i}.png`);
      }

      await surveyAboutYou.sex().toRadiobutton().check('Female');
      await surveyAboutYou.gender().toCheckbox('Woman').check();
      await surveyAboutYou.race().toCheckbox('Asian').check();
      await surveyAboutYou.race().toCheckbox(/^\s*Chinese\s*$/).check();
      await surveyAboutYou.tellUsAnythingElse().toTextarea().fill('automation testing!');
      await surveyAboutYou.howDidYouHearAboutProject().check('Word of mouth (friend/family, study staff, study participants, patient, support group, etc.)');
      await surveyAboutYou.howDidYouHearAboutProject().toCheckbox(/Brochure/).check();
      await surveyAboutYou.howOftenDoYouNeedHelpReadHospitalMaterials().toRadiobutton().check('None of the time');
      await surveyAboutYou.howOftenDoYouHaveProblemsUnderstandWrittenInformation().toRadiobutton().check('None of the time')
      await surveyAboutYou.howConfidentAreYouFillingOutFormsByYourself().toRadiobutton().check('Always');
      await surveyAboutYou.highestLevelOfSchoolCompleted().toRadiobutton().check('Graduate or professional school (for example Masters, PhD, MD, JD/LLB)');
      await surveyAboutYou.speakLanguage().toRadiobutton().check('English');
      await surveyAboutYou.submit();
    })

    // Dashboard
    await expect(page.locator('h1.dashboard-title-section__title span')).toHaveText('Participant Dashboard');
    await expect(page.locator('.infobox_dashboard')).toHaveScreenshot('dashboard-message.png');
    await expect(page.locator('ddp-user-activities [role="table"]')).toHaveScreenshot('dashboard-table.png');
  });
})
