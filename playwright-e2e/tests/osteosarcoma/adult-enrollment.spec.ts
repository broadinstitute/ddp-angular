import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/osteo-fixture';
import TextArea from 'lib/widget/textarea';
import ConsentAddendumPage from 'pages/osteo/consent-addendump-page';
import GetStartedPage from 'pages/osteo/get-started-page';
import SurveyAboutYou from 'pages/survey-about-you';
import { assertActivityHeader } from 'utils/assertion-helper';
import ResearchConsentFormPage from 'pages/osteo/research-consent-page';
import HomePage from 'pages/osteo/home-page';
import MedicalReleasePage from 'pages/osteo/medical-release-page';
import SurveyAboutYourOsteosarcoma from 'pages/osteo/survey-about-osteo-page';
import { logParticpantCreated } from 'utils/log-utils';
import { generateUserName } from 'utils/faker-utils';
import { CancerSelector } from 'pages/cancer-selector';
import { FamilyHistory } from 'pages/family-history';
import * as user from 'data/fake-user.json';
import * as auth from 'authentication/auth-osteo';
// import { checkUserReceivedEmails } from 'utils/email-utils';

const { OSTEO_USER_EMAIL, OSTEO_USER_PASSWORD, OSTEO_BASE_URL } = process.env;

const assertActiveActivityStep = async (page: Page, expectedText: string) => {
  await expect(page.locator('.activity-step.active')).toHaveText(expectedText);
};

test('Osteo adult self enroll @osteo', async ({ page }) => {
  test.slow();

  const firstName = generateUserName('OS');
  const lastName = generateUserName('OS');
  const fullName = `${firstName} ${lastName}`;
  const patient = user.adult;


  const homePage = new HomePage(page);
  await homePage.waitForReady();
  await homePage.clickCountMeIn();

  const getStartedPage = new GetStartedPage(page);
  await getStartedPage.waitForReady();
  await getStartedPage.whoIsSigningUP().toCheckbox("I have been diagnosed with osteosarcoma and I'm signing myself up").check();
  await getStartedPage.next();

  await getStartedPage.age().fill(patient.age);
  await getStartedPage.fillInCountry(patient.country.abbreviation, { state: 'CO' });
  await getStartedPage.submit();

  const userEmail = await auth.createAccountWithEmailAlias(page, {
    email: OSTEO_USER_EMAIL,
    password: OSTEO_USER_PASSWORD
  });
  logParticpantCreated(userEmail, fullName);

  await assertActivityHeader(page, 'Research Consent Form');
  const researchConsentPage = new ResearchConsentFormPage(page);
  await researchConsentPage.waitForReady();

  await assertActiveActivityStep(page, '1. Key Points');
  await researchConsentPage.next();
  await assertActiveActivityStep(page, '2. Full Form');
  await researchConsentPage.next();
  await assertActiveActivityStep(page, '3. Sign Consent');
  await researchConsentPage.agreeToDrawBloodSamples();
  await researchConsentPage.requestStoredSamples('Yes');
  await researchConsentPage.fillInName(firstName, lastName);
  await researchConsentPage.fillInDateOfBirth(patient.birthDate.MM, patient.birthDate.DD, patient.birthDate.YYYY)
  await researchConsentPage.fillInContactAddress({
    fullName,
    country: user.patient.country.name,
    state: user.patient.state.name,
    street: user.patient.streetAddress,
    city: user.patient.city,
    zipCode: user.patient.zip
  });
  await researchConsentPage.submit();

  const consentAddendumPage = new ConsentAddendumPage(page);
  await consentAddendumPage.waitForReady();
  await consentAddendumPage.agreeToShareAvailableResults().check('Yes');
  await consentAddendumPage.signature().fill(fullName);
  await page.waitForTimeout(2000);
  await consentAddendumPage.submit()

  const medicalReleasePage = new MedicalReleasePage(page);
  await medicalReleasePage.waitForReady();
  await medicalReleasePage.fillInPhysicianInstitution();

  await medicalReleasePage.addAnotherPhysician();
  await medicalReleasePage.fillInPhysicianInstitution({
    physicianName: 'Dr. McTesterson',
    institutionName: 'Motley Crue Hospital',
    city: 'Los Angeles',
    state: 'California',
    nth: 1
  });

  await medicalReleasePage.agreeToAllowUsToContactPhysicians();
  await medicalReleasePage.fillInFullName(fullName);
  await medicalReleasePage.submit()

  await assertActivityHeader(page, 'Survey: About Your Osteosarcoma')
  const surveyAboutOsteosarcoma = new SurveyAboutYourOsteosarcoma(page);
  await surveyAboutOsteosarcoma.waitForReady();
  await surveyAboutOsteosarcoma.next();

  await surveyAboutOsteosarcoma.waitForReady();
  await surveyAboutOsteosarcoma.fillInDiagnosedDate('February', '2009');
  await surveyAboutOsteosarcoma.chooseTimeframe('SIX_TO_TWELVE_MONTHS');
  await surveyAboutOsteosarcoma.initialBodyLocation().toCheckbox('Leg -- above the knee (femur)').check();
  await surveyAboutOsteosarcoma.initialBodyLocation().toCheckbox('Other').check();
  await surveyAboutOsteosarcoma.initialBodyLocation().checkAndFillInInput('Other', {inputText: 'A different part of my body' });
  await surveyAboutOsteosarcoma.currentBodyLocation().toCheckbox('Lung (both)').check();
  await surveyAboutOsteosarcoma.hadRadiationAsTreatment().toRadiobutton().check('No', { exact: true });
  await surveyAboutOsteosarcoma.hadReceivedTherapies().toCheckbox('Cisplatin').check();
  await surveyAboutOsteosarcoma.hadReceivedTherapies().toCheckbox('Methotrexate').check();
  await surveyAboutOsteosarcoma.isCurrentlyBeingTreated().toRadiobutton().check('Yes');
  await surveyAboutOsteosarcoma.haveOtherCancer().toRadiobutton().check('Yes');

  const cancerSelector = new CancerSelector(page, '.activity-text-input-OTHER_CANCER_NAME', '.date-answer-OTHER_CANCER_YEAR');
  await cancerSelector.chooseCancer(0, 'bone', 2, 'Giant Cell Tumor of the Bone (GCT)');
  await cancerSelector.chooseDiagnosisAt(0, '2000');

  await surveyAboutOsteosarcoma.submit();

  const surveyAboutYou = new SurveyAboutYou(page);
  await surveyAboutYou.waitForReady();

  await surveyAboutYou.sex().radioButton('Female', { exactMatch: true }).locator('label').click();
  await surveyAboutYou.gender().toCheckbox('Woman').check();
  await surveyAboutYou.race().toCheckbox('Hispanic, Latino, or Spanish').check();
  await surveyAboutYou.race().toCheckbox('Cuban').check();
  await surveyAboutYou.race().toCheckbox('Dominican').check();
  await surveyAboutYou.isMixedRace().toRadiobutton().check('Yes');
  await surveyAboutYou.isIndigenousNative().toRadiobutton().check('No', { exact: true });
  await surveyAboutYou.tellUsAnythingElse().toTextarea().fill('testing comments!');


  await surveyAboutYou.howDidYouHearAboutProject().check('General internet/Online sources (search engines, patient advocacy group website,');
  await surveyAboutYou.howOftenDoYouNeedHelpReadHospitalMaterials().toRadiobutton().check('Most of the time');
  await surveyAboutYou.howOftenDoYouHaveProblemsUnderstandWrittenInformation().toRadiobutton().check('A little of the time')
  await surveyAboutYou.howConfidentAreYouFillingOutFormsByYourself().toRadiobutton().check('Occasionally');
  await surveyAboutYou.highestLevelOfSchoolCompleted().toRadiobutton().check('High school graduate or equivalent');
  await surveyAboutYou.speakLanguage().toRadiobutton().check('English');
  await surveyAboutYou.submit();

  await page.getByText('Thank you for providing information regarding your experiences with osteosarcoma').click();
  await page.getByRole('button', { name: `${fullName} Hide` }).click();
  await page.getByRole('button', { name: `${fullName} Show` }).click();
  await page.getByRole('button', { name: 'Research Consent Form' }).click();
  await page.getByRole('heading', { name: 'Research Consent Form' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Survey: Your Osteosarcoma' }).click();
  await page.getByRole('heading', { name: 'Survey: About Your Osteosarcoma' }).click();
  await page.getByText('Please tell us more about your experience with osteosarcoma by answering the que').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Edit' }).click();

  const familyHistoryPage = new FamilyHistory(page);

  await familyHistoryPage.waitForReady();
  await familyHistoryPage.next();
  await page
    .getByText(
      'In this survey we would like to know the living status, age, and cancer history of people in your biological, ' +
        'or blood-related, family. We recognize that there are many different types of families, ' +
        'so please skip sections that do not apply to your family tree.'
    )
    .click();
  await familyHistoryPage.next();
  await familyHistoryPage.addFamilyMember('PARENT1', {
    nickname: 'Mom',
    sexAtBirth: 'Female',
    currentlyLiving: true,
    ageRange: '60-64',
    cancers: [
      {
        cancerSearch: 'gan',
        expectedCancerResult: 'Ganglioglioma',
        numTimesToHitDownArrow: 1,
        time: '45-49'
      },
      {
        cancerSearch: 'multi',
        expectedCancerResult: 'Glioblastoma / Glioblastoma multiforme (GBM)',
        numTimesToHitDownArrow: 3,
        time: '35-39'
      }
    ],
    ancestry: ['Ashkenazi']
  });
  await familyHistoryPage.addFamilyMember('PARENT2', {
    nickname: 'Dad',
    sexAtBirth: 'Male',
    currentlyLiving: true,
    ageRange: '65-69',
    cancers: [],
    ancestry: []
  });

  await familyHistoryPage.next();
  await familyHistoryPage.clickAddParentSibling();
  await familyHistoryPage.addFamilyMember('PARENT_SIBLING', {
    nickname: "Dad's sister",
    sexAtBirth: 'Female',
    currentlyLiving: true,
    ageRange: '65-69',
    cancers: [],
    ancestry: [],
    sideOfFamily: 'Biological / Birth Parent 2: Assigned Male at birth'
  });
  await familyHistoryPage.clickAddParentSibling();
  await familyHistoryPage.addFamilyMember('PARENT_SIBLING', {
    nickname: "Mom's sister",
    sexAtBirth: 'Female',
    currentlyLiving: false,
    ageRange: '60-64',
    cancers: [],
    ancestry: [],
    sideOfFamily: 'Biological / Birth Parent 1: Assigned Female at birth'
  });
  await familyHistoryPage.next();
  await familyHistoryPage.clickAddGrandParent();
  await familyHistoryPage.addFamilyMember('GRANDPARENT', {
    nickname: "Mom's Dad",
    sexAtBirth: 'Male',
    currentlyLiving: false,
    ageRange: '90-94',
    cancers: [
      {
        cancerSearch: 'noid',
        expectedCancerResult: 'Gastrointestinal carcinoid tumor',
        numTimesToHitDownArrow: 6,
        time: '55-59'
      }
    ],
    ancestry: [],
    sideOfFamily: 'Biological / Birth Parent 1: Assigned Female at birth'
  });
  await familyHistoryPage.clickAddGrandParent();
  await familyHistoryPage.addFamilyMember('GRANDPARENT', {
    nickname: "Mom's Mom",
    sexAtBirth: 'Female',
    currentlyLiving: false,
    ageRange: '90-94',
    cancers: [
      {
        cancerSearch: 'carcinoma',
        expectedCancerResult: 'Cholangiocarcinoma / Bile duct cancer',
        numTimesToHitDownArrow: 3,
        time: '25-29'
      }
    ],
    ancestry: [],
    sideOfFamily: 'Biological / Birth Parent 1: Assigned Female at birth'
  });
  await familyHistoryPage.clickAddGrandParent();
  await familyHistoryPage.addFamilyMember('GRANDPARENT', {
    nickname: "Dads's Mom",
    sexAtBirth: 'Female',
    currentlyLiving: false,
    ageRange: '90-94',
    cancers: [
      {
        cancerSearch: 'acute',
        expectedCancerResult: 'Acute myeloid leukemia (AML)',
        numTimesToHitDownArrow: 3,
        time: '25-29'
      }
    ],
    ancestry: [],
    sideOfFamily: 'Biological / Birth Parent 2: Assigned Male at birth'
  });
  await familyHistoryPage.clickAddGrandParent();
  await familyHistoryPage.addFamilyMember('GRANDPARENT', {
    nickname: "Dads's Dad",
    sexAtBirth: 'Male',
    currentlyLiving: true,
    ageRange: '90-94',
    cancers: [],
    ancestry: [],
    sideOfFamily: 'Biological / Birth Parent 2: Assigned Male at birth'
  });
  await familyHistoryPage.next();
  await familyHistoryPage.clickAddSibling();
  await familyHistoryPage.addFamilyMember('SIBLING', {
    nickname: 'Big Sis',
    sexAtBirth: 'Female',
    currentlyLiving: true,
    ageRange: '20-24',
    cancers: [],
    ancestry: []
  });
  await familyHistoryPage.clickAddSibling();
  await familyHistoryPage.addFamilyMember('SIBLING', {
    nickname: 'Little Bro',
    sexAtBirth: 'Female',
    currentlyLiving: true,
    ageRange: '10-14',
    cancers: [
      {
        cancerSearch: 'renal',
        expectedCancerResult: 'Kidney cancer / Renal cell carcinoma (RCC), all subtypes',
        numTimesToHitDownArrow: 2,
        time: '5-9'
      }
    ],
    ancestry: []
  });

  await familyHistoryPage.next();

  await familyHistoryPage.clickAddHalfSibling();
  await familyHistoryPage.addFamilyMember('HALF_SIBLING', {
    nickname: 'Little Half Sis',
    sexAtBirth: 'Female',
    currentlyLiving: true,
    ageRange: '10-14',
    sideOfFamily: 'Biological / Birth Parent 2: Assigned Male at birth',
    cancers: [
      {
        cancerSearch: 'fibro',
        expectedCancerResult: 'Primary myelofibrosis (PMF)',
        numTimesToHitDownArrow: 2,
        time: '5-9'
      }
    ],
    ancestry: []
  });

  await familyHistoryPage.next();

  await familyHistoryPage.clickAddChild();
  await familyHistoryPage.addFamilyMember('CHILD', {
    nickname: 'My Daughter',
    sexAtBirth: 'Female',
    currentlyLiving: true,
    ageRange: '10-14',
    cancers: [
      {
        cancerSearch: 'fibro',
        expectedCancerResult: 'Desmoid-type fibrosis / Desmoid tumor (DF)',
        numTimesToHitDownArrow: 4,
        time: '5-9'
      }
    ],
    ancestry: []
  });

  await familyHistoryPage.next();

  await new TextArea(page, { ddpTestID: 'answer:FH_OTHER_FACTORS_CANCER_RISK' }).toLocator().waitFor({
    state: 'visible',
    timeout: 60 * 1000
  });

  await familyHistoryPage.finish();

  const viewCompletedButton = page
    .getByRole('row', {
      name: 'Survey: Family History of Cancer Thank you for telling us more about your family history of cancer.'
    })
    .getByRole('button', { name: 'View Completed' });
  await viewCompletedButton.click();
  await page.getByRole('link', { name: 'Dashboard' }).click();


  /*
  * Disable email checks. Slack https://broadinstitute.slack.com/archives/C043W8G8SS3/p1676387289422749
  await checkUserReceivedEmails(userEmail, [
    {
      subject: 'Thank you for providing your consent',
      textProbe: `Dear ${firstName}`
    },
    {
      subject: 'Thank you for providing your consent',
      textProbe: "Your participation isn't just important to our work - it drives everything that we do"
    },
    {
      subject: 'Thank you for providing additional consent',
      textProbe:
        'Thank you for joining the Osteosarcoma Project and for giving us your consent to share with you any available information we learned from the sequencing of your tumor sample[s] that the study receives.'
    }
  ]);
  *
  */
});
