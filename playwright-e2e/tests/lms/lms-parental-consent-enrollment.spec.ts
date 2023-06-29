/* eslint-disable max-len */
import { expect, Page } from '@playwright/test';
import * as auth from 'authentication/auth-lms';
import * as user from 'data/fake-user.json';
import LmsAdditionalConsentPage from 'dss/pages/lms/lms-additional-consent-page';
import LmsDashboardPage from 'dss/pages/lms/lms-dashboard-page';
import LmsHomePage from 'dss/pages/lms/lms-home-page';
import LmsGetStartedPage from 'dss/pages/lms/lms-get-started-page';
import LmsResearchConsentPage from 'dss/pages/lms/lms-research-consent-page';
import LmsMedicalReleasePage from 'dss/pages/lms/lms-medical-release-page';
import LmsSurveyAboutLmsPage from 'dss/pages/lms/lms-survey-about-lms-page';
import SurveyAboutYou from 'dss/pages/survey-about-you';
import { test } from 'fixtures/lms-fixture';
import { assertActivityHeader } from 'utils/assertion-helper';
import { getDate } from 'utils/date-utils';
import { generateUserName } from 'utils/faker-utils';
import { logParticipantCreated } from 'utils/log-utils';
import { waitForResponse } from 'utils/test-utils';

const { LMS_USER_EMAIL, LMS_USER_PASSWORD } = process.env;

test.describe.serial('LMS Young Child Enrollment', () => {
  let userEmail: string;

  let dashboardPage: LmsDashboardPage;
  let homePage: LmsHomePage;
  let researchConsentPage: LmsResearchConsentPage;
  let additionalConsentPage: LmsAdditionalConsentPage;

  const assertActiveActivityStep = async (page: Page, expectedText: string) => {
    await expect(page.locator('.activity-step.active')).toHaveText(expectedText);
  };

  test('Parental consent child is three years old @visual @enrollment @lms', async ({ page }) => {
    researchConsentPage = new LmsResearchConsentPage(page, 'secondChild');
    additionalConsentPage = new LmsAdditionalConsentPage(page);

    const child = user.secondChild;
    const childFirstName = generateUserName(child.firstName);
    const childLastName = generateUserName(child.lastName);
    const childFullName = `${childFirstName} ${childLastName}`;

    const parent = user.adult;
    const adultFirstName = generateUserName(parent.firstName);
    const adultLastName = generateUserName(parent.lastName);
    const adultFullName = `${adultFirstName} ${adultLastName}`;

    await test.step('Create account with an email', async () => {
      homePage = new LmsHomePage(page);
      await homePage.waitForReady();
      await homePage.countMeIn();

      const getStartedPage = new LmsGetStartedPage(page);
      await getStartedPage.waitForReady();

      await getStartedPage.whoIsSigningUP().toCheckbox('My child has been diagnosed with LMS and I am signing up for them or with them').check();
      await getStartedPage.next();

      await expect(getStartedPage.age().toQuestion()).toHaveScreenshot('how-old-is-your-child-question.png');
      await getStartedPage.age().fill(child.age);

      await getStartedPage.fillInCountry(child.country.abbreviation, { state: child.state.abbreviation });
      await getStartedPage.submit();

      userEmail = await auth.createAccountWithEmailAlias(page, {
        email: LMS_USER_EMAIL,
        password: LMS_USER_PASSWORD
      });
      logParticipantCreated(userEmail, childFullName);
    })

    await test.step('Asserting contents on Research Consent Form: Step 1. Key Points', async () => {
      await assertActivityHeader(page, 'Research Consent Form');
      await assertActiveActivityStep(page, '1. Key Points');

      await expect(page.locator('.ddp-content')).toHaveScreenshot('lms-research-consent-form-message.png');
      await expect(page.locator('.activity-steps')).toHaveScreenshot('lms-research-consent-activity-steps.png');

      const paragraphs = await page.locator('.ddp-section .ddp-li').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-form-paragraph-${i}.png`);
      }
      await researchConsentPage.next();
    })

    await test.step('Asserting contents on Research Consent Form: Step 2. Full Form', async () => {
      await assertActiveActivityStep(page, '2. Full Form');

      // Paragraphs A to P are checked with screenshots
      const questionALocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Introduction")]]');
      let paragraphs = await questionALocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-A-paragraph-${i}.png`);
      }

      const questionBLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Why is this research study being done?")]]');
      await expect(questionBLocator).toHaveScreenshot(`lms-research-consent-full-form-page-B-paragraph.png`);

      const questionCLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What other options are there?")]]');
      await expect(questionCLocator).toHaveScreenshot(`lms-research-consent-full-form-page-C-paragraph.png`);

      const questionDLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What is involved in the research study?")]]');
      paragraphs = await questionDLocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-D-paragraph-${i}.png`);
      }

      const questionELocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "How long will my child be in this research study?")]]');
      await expect(questionELocator).toHaveScreenshot(`lms-research-consent-full-form-page-E-paragraph.png`);

      const questionFLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What kind of information could be found in this study and will I be able to see it?")]]');
      paragraphs = await questionFLocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-F-paragraph-${i}.png`);
      }

      const questionGLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What are the benefits of the research study?")]]');
      await expect(questionGLocator).toHaveScreenshot(`lms-research-consent-full-form-page-G-paragraph.png`);

      const questionHLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What are the risks or discomforts of the research study?")]]');
      paragraphs = await questionHLocator.locator('//*[contains(@class,"ddp-block-body")]//p[node()]').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-H-paragraph-${i}.png`);
      }
      paragraphs = await questionHLocator.locator('//ul').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-H-list-${i}.png`);
      }

      const questionILocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Will I or my child be paid to take part in this research study?")]]');
      await expect(questionILocator).toHaveScreenshot(`lms-research-consent-full-form-page-I-paragraph.png`);

      const questionJLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What are the costs to take part in this research study?")]]');
      await expect(questionJLocator).toHaveScreenshot(`lms-research-consent-full-form-page-J-paragraph.png`);

      const questionKLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Can my child stop being in the research study and what are my child’s rights?")]]');
      paragraphs = await questionKLocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-K-paragraph-${i}.png`);
      }

      const questionLLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What happens if my child is injured or sick because they took part in this research study?")]]');
      await expect(questionLLocator).toHaveScreenshot(`lms-research-consent-full-form-page-L-paragraph.png`);

      const questionMLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "How will this study protect patient confidentiality?")]]');
      paragraphs = await questionMLocator.locator('.ddp-block-body p').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-M-paragraph-${i}.png`);
      }

      const questionNLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[normalize-space()="Whom do I contact if I have questions about the research study?"]]');
      await expect(questionNLocator).toHaveScreenshot(`lms-research-consent-full-form-page-N-paragraph.png`);

      const questionOLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Authorization to use your child’s health information for research purposes")]]');
      paragraphs = await questionOLocator.locator('//*[contains(@class,"ddp-block-body")]//p[node()]').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-O-paragraph-${i}.png`);
      }
      paragraphs = await questionOLocator.locator('//ol/li').all();
      for (let i = 0; i < paragraphs.length; i++) {
        await expect(paragraphs[i]).toHaveScreenshot(`lms-research-consent-full-form-page-O-list-${i}.png`);
      }

      const questionPLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Participation Information")]]');
      await expect(questionPLocator).toHaveScreenshot(`lms-research-consent-full-form-page-P-paragraph.png`);

      await researchConsentPage.next();
    })

    await test.step('Asserting contents on Research Consent & Assent Form: Step 3. Sign Consent', async () => {
      await assertActiveActivityStep(page, '3. Sign Consent');

      await expect(page.locator('p.secondary-text')).toHaveScreenshot(`lms-research-consent-sign-consent-info.png`);
      await expect(await researchConsentPage.agreeToDrawBloodQuestion.toLocator()).toHaveScreenshot('lms-agree-to-draw-blood-question.png');
      await expect(await researchConsentPage.canRequestStoredTumorSamples.toLocator()).toHaveScreenshot('lms-can-request-tumor-samples-question.png');

      await researchConsentPage.agreeToDrawBloodSamples();
      await researchConsentPage.requestStoredSamples();

      // In addition, I agree to all of the following:
      const agreeToFollowingList = await page.locator('//ddp-activity-content[.//text()[normalize-space()= "In addition, I agree to all of the following:"]]//ul/li').all();
      for (let i = 0; i < agreeToFollowingList.length; i++) {
        await expect(agreeToFollowingList[i]).toHaveScreenshot(`lms-sign-consent-agree-list-${i}.png`);
      }

      // My full name below indicates:
      const fullNameIndicatesFollowing = page.locator('//ddp-activity-content[.//text()[normalize-space()= "My full name below indicates:"]]');
      await expect(fullNameIndicatesFollowing).toHaveScreenshot(`lms-my-full-name-indicates-following.png`);

      await researchConsentPage.fillInChildFullName(childFirstName, childLastName);
      await researchConsentPage.fillInDateOfBirth(child.birthDate.MM, child.birthDate.DD, child.birthDate.YYYY);
      await researchConsentPage.fillInYourFullName(adultFirstName, adultLastName); // Your Full name
      await researchConsentPage.fillInSignature(adultFullName) // Your Signature (Full Name)
      await researchConsentPage.selectRelationshipToChild('Parent');
      await researchConsentPage.fillInContactAddress({ // Your Child’s Mailing Address:
        fullName: childFullName,
        country: child.country.name,
        state: child.state.name,
        street: child.streetAddress,
        city: child.city,
        zipCode: child.zip
      });

      await researchConsentPage.submit();
    })

    // Additional Consent Form: Learning About Your Child's Tumor
    await test.step("Asserting contents on Additional Consent Form: Learning About Your Child's Tumor", async () => {
      await assertActivityHeader(page, 'Additional Consent Form: Learning About Your Child’s Tumor');
      await assertActiveActivityStep(page, '1. Consent Addendum');

      const additionalConsentPage = new LmsAdditionalConsentPage(page, 'secondChild');
      await additionalConsentPage.waitForReady();

      const paragraphALocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Introduction")]]');
      await expect(paragraphALocator).toHaveScreenshot(`lms-additional-consent-page-A-paragraph.png`);

      const paragraphBLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Brief Description of the Project")]]');
      await expect(paragraphBLocator).toHaveScreenshot(`lms-additional-consent-page-B-paragraph.png`);

      const paragraphCLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "What are the new procedures involved?")]]');
      await expect(paragraphCLocator).toHaveScreenshot(`lms-additional-consent-page-C-paragraph.png`);

      const paragraphDLocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Are there any new risks associated with participating in this portion of the research study?")]]');
      await expect(paragraphDLocator).toHaveScreenshot(`lms-additional-consent-page-D-paragraph.png`);

      const paragraphELocator = page.locator('//li[contains(@class, "ddp-li")][.//*[contains(normalize-space(), "Who do I contact if I have questions about the research study?")]]');
      await expect(paragraphELocator).toHaveScreenshot(`lms-additional-consent-page-E-paragraph.png`);

      await additionalConsentPage.agreeToShareWithMeResults('Yes');

      const requestPromise = waitForResponse(page, { uri: '/answers'});
      await Promise.all([additionalConsentPage.signature().fill(adultFullName), requestPromise]);

      // Date text shows today's date with mm/dd/yyyy format
      expect(getDate(await additionalConsentPage.getDate())).toBe(getDate(new Date()));

      await additionalConsentPage.submit();
    })

    await test.step('Asserting contents on Medical Release Form', async () => {
      const medicalReleasePage = new LmsMedicalReleasePage(page);
      await medicalReleasePage.waitForReady();

      const contents = await page.locator('//ddp-activity-content[not(contains(.,"Date"))]').all();
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`lms-medical-release-page-content-${i}.png`);
      }

      await expect(page.locator('.Question--AGREEMENT')).toHaveScreenshot(`lms-medical-release-page-agreement-question.png`);

      await medicalReleasePage.fillInPhysicianInstitution();
      await medicalReleasePage.agreeToAllowUsToContactPhysicianToObtainRecords();
      await medicalReleasePage.fillInFullName(adultFullName);

      await medicalReleasePage.submit();
    })

    // Next page: Survey: Your Child's LMS
    await test.step("Asserting contents on Survey: Your Child's LMS", async () => {
      await assertActivityHeader(page, "Survey: Your Child's LMS");

      const surveyAboutLms = new LmsSurveyAboutLmsPage(page, 'secondChild');
      await surveyAboutLms.waitForReady();

      const contents = await page.locator('.ddp-content').all();
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`lms-survey-your-child-content-${i}.png`);
      }

      await surveyAboutLms.fillInDiagnosedDate('February', child.birthDate.YYYY);

      await surveyAboutLms.bodyLocationWhenFirstDiagnosed().fill('Lung', { nth: 0 });
      await surveyAboutLms.areYouCancerFree().toCheckbox('No').check();
      await surveyAboutLms.bodyLocationEverHad().fill('Skin');
      await surveyAboutLms.hadReceivedTherapies().check('Radiation');
      await surveyAboutLms.hadReceivedTherapies().check('Surgery');
      await surveyAboutLms.medicationsChemotherapyReceived().fill('ABARELIX', { nth: 0 });
      await surveyAboutLms.bodyLocationWhenFirstDiagnosed().button('Add medication/chemotherapy').click();
      await surveyAboutLms.medicationsChemotherapyReceived().fill('AFATINIB', { nth: 1 });

      await surveyAboutLms.submit();
    })

    // Next page: Survey: About Your Child
    await test.step('Asserting contents on Survey: About Your Child', async () => {
      await assertActivityHeader(page, 'Survey: About Your Child');

      const surveyAboutYou = new SurveyAboutYou(page);
      await surveyAboutYou.waitForReady();

      const contents = await page.locator('.ddp-content').all();
      for (let i = 0; i < contents.length; i++) {
        await expect(contents[i]).toHaveScreenshot(`lms-survey-about-your-child-instruction-${i}.png`);
      }

      await assertRaceOptions(surveyAboutYou);

      await surveyAboutYou.sex().toRadiobutton().check('Female');
      await surveyAboutYou.gender().toCheckbox('Girl').check();
      await surveyAboutYou.race().toCheckbox('White').check();
      await surveyAboutYou.race().toCheckbox(/^\s*English\s*$/).check();
      await surveyAboutYou.tellUsAnythingElse().toTextarea().fill('playwright e2e testing!');
      await surveyAboutYou.howDidYouHearAboutProject().check('Word of mouth (friend/family, study staff, study participants, patient, support group, etc.)');
      await surveyAboutYou.howDidYouHearAboutProject().toCheckbox(/Brochure/).check();
      await surveyAboutYou.howOftenDoYouNeedHelpReadHospitalMaterials().toRadiobutton().check('None of the time');
      await surveyAboutYou.howOftenDoYouHaveProblemsUnderstandWrittenInformation().toRadiobutton().check('None of the time')
      await surveyAboutYou.howConfidentAreYouFillingOutFormsByYourself().toRadiobutton().check('Always');
      await surveyAboutYou.highestLevelOfSchoolCompleted().toRadiobutton().check('Graduate or professional school (for example Masters, PhD, MD, JD/LLB)');
      await surveyAboutYou.speakLanguage().toRadiobutton().check('English');

      await surveyAboutYou.submit();
    })

    // On Dashboard
    await test.step('Asserting contents on Participant Dashboard page', async () => {
      dashboardPage = new LmsDashboardPage(page);
      await dashboardPage.waitForReady();

      await expect(page.locator('.infobox_dashboard')).toHaveScreenshot('lms-dashboard-message.png');
      await expect(dashboardPage.getTable().tableLocator()).toHaveScreenshot('lms-dashboard-table-1.png');

      // Log out
      await dashboardPage.getLogOutButton().click();
      await homePage.waitForReady();
    })
  });

  test('New participant sign in @visual @enrollment @lms', async ({ page }) => {
    await auth.login(page, {email: userEmail, password: LMS_USER_PASSWORD});

    dashboardPage = new LmsDashboardPage(page);
    await dashboardPage.waitForReady();
    await expect(page.locator('.infobox_dashboard')).not.toBeVisible();
    await expect(dashboardPage.getTable().tableLocator()).toHaveScreenshot('lms-dashboard-table-2.png');
  });

  async function assertRaceOptions(surveyAboutYou: SurveyAboutYou): Promise<void> {
    const allCheckbox = ['American Indian or Alaska Native', 'Asian', 'Black, African American, or African',
      'Hispanic, Latino, or Spanish', 'Middle Eastern or North African', 'Native Hawaiian or other Pacific Islander', 'White'];

    for (let i = 0; i < allCheckbox.length; i++) {
      const name = allCheckbox[i].replace(' ', '');
      const checkbox = surveyAboutYou.race().toCheckbox(allCheckbox[i]);
      await expect(checkbox.toLocator()).toHaveScreenshot(`${name}-checkbox.png`);
      await checkbox.check(); // Opens up nested checkbox list

      const nestedList = await checkbox.getNestedCheckbox();
      let listLength = (await nestedList.toLocators()).length;
      expect(listLength).toBeGreaterThan(0);

      const checkboxes = await nestedList.toLocators();
      for (let i = 0; i < listLength; i++) {
        await expect(checkboxes[i]).toHaveScreenshot(`${name}-nested-checkbox-${i}.png`);
      }

      await checkbox.uncheck(); // Close nested checkbox list
      listLength = (await nestedList.toLocators())!.length;
      expect(listLength).toBe(0);
    }
  }
})
