import { expect, Page } from '@playwright/test';
import { test } from 'fixtures/osteo-fixture';
import ConsentAddendumPage from 'pages/osteo/consent-addendump-page';
import GetStartedPage from 'pages/osteo/get-started-page';
import { assertActivityHeader } from 'utils/assertion-helper';
import { generateEmailAlias } from 'utils/faker-utils';
import ResearchConsentFormPage from 'pages/osteo/research-consent-page';
import HomePage from 'pages/osteo/home-page';
import PrequalPage from 'pages/osteo/prequal-page';
import ConsentAssentPage from 'pages/osteo/consent-assent-page';
import MedicalReleasePage from 'pages/osteo/medical-release-page';
import AboutYourOsteosarcoma from 'pages/osteo/about-your-osteosarcoma-page';
import { logParticpantCreated } from 'utils/log-utils';
import { generateUserName } from 'utils/faker-utils';
import { CancerSelector } from 'pages/cancer-selector';
import { FamilyHistory } from 'pages/family-history';
import * as user from 'data/fake-user.json';
import * as auth from 'authentication/auth-osteo';
// import { checkUserReceivedEmails } from 'utils/email-utils';

const { OSTEO_USER_EMAIL, OSTEO_USER_PASSWORD } = process.env;

const assertActiveActivityStep = async (page: Page, expectedText: string) => {
  await expect(page.locator('.activity-step.active')).toHaveText(expectedText);
};

test('Osteo adult self enroll @osteo', async ({ page }) => {
  test.slow();

  const userEmail = generateEmailAlias(OSTEO_USER_EMAIL);
  const firstName = generateUserName('OS');
  const lastName = generateUserName('OS');
  const fullName = `${firstName} ${lastName}`;
  const patient = user.adult;

  logParticpantCreated(userEmail, fullName);

  const homePage = new HomePage(page);
  await homePage.waitForReady();
  await homePage.clickCountMeIn();

  const getStartedPage = new GetStartedPage(page);
  await getStartedPage.whoIsSigningUP()
    .toCheckbox("I have been diagnosed with osteosarcoma and I'm signing myself up").check();
  await getStartedPage.next();

  await getStartedPage.age('answer:SELF_CURRENT_AGE').fill(patient.age)
  await getStartedPage.fillInCountry(patient.country.abbreviation, { state: 'CO' });
  await getStartedPage.submit();

  await auth.createAccountWithEmailAlias(page, {
    email: OSTEO_USER_EMAIL,
    password: OSTEO_USER_PASSWORD
  });

  await assertActivityHeader(page, 'Research Consent Form');

  const researchConsentPage = new ResearchConsentFormPage(page);
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
  await researchConsentPage.submit()

  const consentAddendumPage = new ConsentAddendumPage(page);
  await consentAddendumPage.waitForReady();
  await consentAddendumPage.agreeToShareAvailableResults().radiobutton('Yes').check();
  await consentAddendumPage.signature().fill(fullName);
  await Promise.all([
    expect(consentAddendumPage.getSubmitButton()).toBeVisible(),
    expect(consentAddendumPage.getSavingButton()).toBeVisible()
  ])
  await consentAddendumPage.submit()

  const medicalReleasePage = new MedicalReleasePage(page);
  await medicalReleasePage.waitForReady();
  await medicalReleasePage.fillInPhysicianInstitution();

  await page.pause();

  /*
  await page.getByText("Thank you for your interest in the Osteosarcoma Project. Here's what sign up and").click();
  await page.getByText('First, who is signing up for the Osteosarcoma Project? Check all that apply').click();
  await page.getByText("I have been diagnosed with osteosarcoma and I'm signing myself up").click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter age').click();

  await page.getByLabel('Enter age').fill('30');

  await page.locator('#mat-input-2').selectOption('US');
  await page.locator('#mat-input-3').selectOption('CO');
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByPlaceholder('yours@example.com').click();
  await page.getByPlaceholder('yours@example.com').fill(userEmail);
  await page.getByPlaceholder('yours@example.com').press('Tab');
  await page.getByPlaceholder('your password').fill(OSTEO_USER_PASSWORD!);
  await page.getByPlaceholder('your password').press('Enter');

  await page.getByRole('heading', { name: 'Research Consent Form' }).click();
  await page.getByText('Please read through the consent form text below and click "Next" when you are do').click();
  await page.getByText('What is the purpose of this study?').click();
  await page.getByText('What will I have to do if I agree to participate in this study?').click();
  await page.getByText('Can I stop taking part in this research study?').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('heading', { name: 'Research Consent Form' }).click();
  await page.getByText('Please read through the consent form text below and click "Next" when you are do').click();
  await page.getByText('Introduction').click();
  await page.getByText('You are being invited to participate in this research study because you have bee').click();
  await page.getByText('What happens if I am injured or sick because I took part in this research study?').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('heading', { name: 'Research Consent Form' }).click();
  await page.getByRole('heading', { name: 'Q. Documentation of Consent' }).click();
  await page.locator('#mat-radio-2').getByText('Yes').click();
  await page.locator('#mat-radio-6').getByText('No').click();
  await page.locator('#mat-radio-5').getByText('Yes').click();
  await page.getByLabel('First Name').click();
  await page.getByRole('combobox', { name: 'First Name' }).fill(firstName);
  await page.getByRole('combobox', { name: 'First Name' }).press('Tab');
  await page.getByRole('combobox', { name: 'Last Name' }).fill(lastName);
  await page.getByLabel('MM').click();
  await page.getByLabel('MM').fill('01');
  await page.getByLabel('DD', { exact: true }).fill('01');
  await page.getByLabel('YYYY').fill('1991');

  const consentPage = new ResearchConsentPage(page);

  await consentPage.fillInContactAddress({
    fullName,
    country: 'UNITED STATES',
    street: '75 Ames Street',
    city: 'Cambridge',
    state: 'MASSACHUSETTS',
    zipCode: '02476',
    telephone: '5555551212'
  });

  await page.waitForTimeout(1000);
  await consentPage.submit();

  await page
    .getByRole('heading', {
      name: 'Consent Form Addendum: Learning About Your Tumor'
    })
    .click();
  await page.getByText('Introduction').click();
  await page.getByText('This consent addendum gives new information about the research study in which yo').click();
  await page.getByText('This is what I agree to:').click();
  await page.getByText('You can share with me any available results from the sequencing of tumor sample[').click();
  await page.getByText('Yes').click();
  await page.locator('.mat-form-field-infix').click();
  await page.locator('#mat-input-12').fill(fullName);
  await page.getByRole('heading', { name: 'Date' }).click();
  await page.waitForTimeout(1000);
  await consentPage.submit();

  const releasePage = new ReleasePage(page);

  await page.getByRole('heading', { name: 'Medical Release Form' }).click();
  await page.getByText('Thank you for your consent to participate in this research study.').click();

  await releasePage.chooseInstitutionInList(
    0,
    'Pittsburgh',
    3,
    "Children's Institute Of Pittsburgh, The",
    'Pittsburgh',
    'PA',
    'USA'
  );
  await releasePage.setPhysician(0, 'Dr. Teeth');
  await releasePage.addAnotherPhysician();

  //await releasePage.typeNewInstitute(0, 'Motley Crue Hospital', "Partyville", "Los Angeles", "Califoooornia" );
  await releasePage.setPhysician(0, 'Dr. Feelgood');

  // await releasePage.signName('Testy McTesterson');
  //await releasePage.clickAcknowledge();

  await page
    .locator('section')
    .filter({
      hasText: 'Thank you for your consent to participate in this research study. To complete th'
    })
    .click();

  await page
    .locator('section')
    .filter({
      hasText: 'Thank you for your consent to participate in this research study. To complete th'
    })
    .click();

  await page.getByText('I have already read and signed the informed consent document for this study, whi').click();
  await page.getByLabel('Full Name').click();

  await page.getByRole('combobox', { name: 'Full Name' }).fill('Andrew Zimmer');

  await consentPage.submit();

  const aboutYourOsteosarcoma = new AboutYourOsteosarcoma(page, 'Survey: About Your Osteosarcoma');
  await aboutYourOsteosarcoma.waitForReady();

  await page.getByText('Please tell us more about your experience with osteosarcoma by answering the que').click();
  await aboutYourOsteosarcoma.next();

  await page.getByRole('combobox').first().selectOption('2');
  await page.getByRole('combobox').nth(1).selectOption('2009');
  await page.locator('#mat-input-24').selectOption('SIX_TO_TWELVE_MONTHS');
  await page.getByText('When you were first diagnosed with osteosarcoma, where in your body was it found').click();
  await page.locator('.mat-checkbox-inner-container').first().click();
  await page.getByText('Other').nth(1).click();
  await page.getByLabel('Please provide details').click();
  await page.getByLabel('Please provide details').fill('A different part of my body');
  await page.getByText('Please select all the places in your body that you currently have osteosarcoma, ').click();
  await page.locator('.picklist-answer-CURRENT_BODY_LOC').getByText('Lung (both)').click();
  await page.locator('.picklist-answer-HAD_RADIATION').getByText('No', { exact: true }).click();

  await page.locator('.picklist-answer-THERAPIES_RECEIVED').getByText('Cisplatin').click();
  await page.locator('.picklist-answer-THERAPIES_RECEIVED').getByText('Methotrexate').click();
  await page.locator('.picklist-answer-CURRENTLY_TREATED').getByText('Yes').click();
  await page.locator('.picklist-answer-OTHER_CANCERS').scrollIntoViewIfNeeded();
  await page.locator('.picklist-answer-OTHER_CANCERS').getByText('Yes').click();

  // would be class and class
  const cancerSelector = new CancerSelector(page, '.activity-text-input-OTHER_CANCER_NAME', '.date-answer-OTHER_CANCER_YEAR');
  await cancerSelector.chooseCancer(0, 'bone', 2, 'Giant Cell Tumor of the Bone (GCT)');
  await cancerSelector.chooseDiagnosisAt(0, '2000');

  await consentPage.submit();

  await page.getByRole('heading', { name: 'Survey: About you' }).click();
  await page.getByText('Please tell us more about you by answering the questions below. As you fill out ').click();
  await page.getByText('What sex were you assigned at birth? Sex assigned at birth is the assignment and').click();
  await page.getByText('Woman').click();
  await page.getByText('Hispanic, Latino, or Spanish (For example: Colombian, Cuban, Dominican, Mexican ').click();
  await page.getByText('Cuban', { exact: true }).click();
  await page.getByText('Dominican', { exact: true }).click();
  await page.getByText('3A. Do you consider yourself to be mixed race, that is belonging to more than on').click();
  await page.locator('.picklist-answer-MIXED_RACE').getByText('No', { exact: true }).click();
  await page.locator('.picklist-answer-MIXED_RACE').getByText('Yes', { exact: true }).click();

  await page
    .getByRole('paragraph')
    .filter({
      hasText: '3C. Do you consider yourself to be indigenous or Native American (such as Purepe'
    })
    .click();
  await page.locator('.picklist-answer-INDIGENOUS_NATIVE').getByText('No', { exact: true }).click();
  await page.getByTestId('answer:OTHER_COMMENTS').click();
  await page.getByTestId('answer:OTHER_COMMENTS').fill('testing comments!');
  await page.getByText('General internet/Online sources (search engines, patient advocacy group website,').click();
  await page.getByText('Patient advocacy group website', { exact: true }).click();
  await page.locator('.picklist-answer-READ_HOSPITAL_MATERIALS_ID').getByText('Most of the time').click();
  await page.getByText('How often do you have problems learning about your medical condition because of ').click();
  await page.locator('.picklist-answer-PROBLEM_UNDERSTANDING_WRITTEN_ID').getByText('A little of the time').click();
  await page.getByText('Occasionally').click();
  await page.getByText('High school graduate or equivalent').click();
  await page.getByText('English', { exact: true }).click();
  await page.getByRole('button', { name: 'Submit' }).hover();
  await consentPage.submit();
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
  await familyHistoryPage.finish();

  await page
    .getByRole('row', {
      name: 'Survey: Family History of Cancer Thank you for telling us more about your family history of cancer.'
    })
    .getByRole('button', { name: 'View Completed' })
    .click();
  await page.getByRole('link', { name: 'Dashboard' }).click();

  */

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
