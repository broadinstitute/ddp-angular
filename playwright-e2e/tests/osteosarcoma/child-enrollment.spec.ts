import { expect } from '@playwright/test';
import { test } from 'fixtures/osteo-fixture';
import { generateEmailAlias } from 'utils/faker-utils';
import ResearchConsentFormPage from 'pages/osteo/research-consent-page';
import HomePage from 'pages/osteo/home-page';
import PrequalPage from 'pages/osteo/prequal-page';
import ConsentAssentPage from 'pages/osteo/consent-assent-page';
import * as auth from 'authentication/auth-angio';
import MedicalReleasePage from 'pages/osteo/medical-release-page';
import AboutYourOsteosarcoma from 'pages/osteo/about-your-osteosarcoma-page';
import { logParticpantCreated } from 'utils/log-utils';
import { generateUserName } from 'utils/faker-utils';
import { CancerSelector } from 'pages/cancer-selector';
import { FamilyHistory } from 'pages/family-history';
// import { checkUserReceivedEmails } from 'utils/email-utils';

const { OSTEO_USER_EMAIL, OSTEO_USER_PASSWORD } = process.env;

test('Enroll kid @osteo', async ({ page }) => {
  test.slow();
  const userEmail = generateEmailAlias(OSTEO_USER_EMAIL);

  await page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: "Let's Get Started" }).click();
  await page.getByText("Thank you for your interest in the Osteosarcoma Project. Here's what sign up and").click();
  await page.getByText("My child has been diagnosed with osteosarcoma and I'm signing up with them or fo").click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter age').click();
  await page.getByLabel('Enter age').fill('4');
  await page.locator('#mat-input-2').selectOption('US');
  await page.locator('#mat-input-3').selectOption('DE');
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByPlaceholder('yours@example.com').click();
  await page.getByPlaceholder('yours@example.com').fill(userEmail);
  await page.getByPlaceholder('yours@example.com').press('Tab');
  await page.getByPlaceholder('your password').fill(OSTEO_USER_PASSWORD!);
  await page.getByPlaceholder('your password').press('Enter');
  await page.waitForTimeout(1000);
  await page.getByRole('heading', { name: 'Research Consent Form' }).click();
  await page.getByText('Please read through the consent form text below and click "Next" when you are do').click();
  await page.getByText('What is the purpose of this study?').click();
  await page.getByText('We want to better understand osteosarcoma so that researchers can develop more e').click();
  await page.getByText('Who will use my child’s samples and see my and their information?').click();
  await page.getByText('Your child’s samples and health information will be available to study staff and').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Introduction').click();
  await page.getByText('You are being invited to have your child participate in this research study beca').click();
  await page.getByText('What is involved in the research study?').click();
  await page.getByText('Provide consent and tell us where your child has been treated: After signing a c').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('heading', { name: 'Q. Documentation of Consent' }).click();
  await page.getByText('Please Check “Yes” or “No” for each point below: You can work with me to arrange').click();
  await page.locator('#mat-radio-2').getByText('Yes').click();
  await page
    .getByRole('paragraph')
    .filter({
      hasText: 'You can request my child’s stored tumor samples (e.g. tumor biopsies, surgical s'
    })
    .click();
  await expect(page.getByText('$')).toHaveCount(0);
  await page.locator('#mat-radio-5').getByText('Yes').click();
  await page.locator('#mat-input-0').click();
  await page.locator('#mat-input-0').fill('Kid');
  await page.locator('#mat-input-0').press('Tab');
  await page.locator('#mat-input-1').fill('Zimmer');
  await page.locator('#mat-input-1').press('Tab');
  await page.getByLabel('MM').fill('01');
  await page.getByLabel('DD', { exact: true }).fill('01');
  await page.getByLabel('YYYY').fill('2017');
  await page.locator('#mat-input-5').click();
  await page.locator('#mat-input-5').fill('Andrew');
  await page.locator('#mat-input-5').press('Tab');
  await page.locator('#mat-input-6').fill('Zimmer');
  await page.getByText('Parent', { exact: true }).click();
  await page.getByLabel('Full Name *').click();
  await page.getByLabel('Full Name *').fill('KID ZIMMEr');
  await page.getByLabel('Full Name *').press('Tab');
  await page.getByRole('combobox', { name: 'Country/Territory Country/Territory' }).getByText('Country/Territory').click();
  await page.getByText('UNITED STATES', { exact: true }).click();
  await page.getByPlaceholder('Enter a location').click();
  await page.getByPlaceholder('Enter a location').fill('75 AMES STREEt');
  await page.getByPlaceholder('Enter a location').press('Tab');
  await page.getByLabel('Apt/Floor #').press('Tab');
  await page.getByLabel('City *').fill('CAMBRIDGe');
  await page.getByLabel('City *').press('Tab');
  await page.getByRole('combobox', { name: 'State State' }).getByText('State').click();
  await page.getByText('MASSACHUSETTS').click();
  await page.getByLabel('Zip Code *').click();
  await page.getByLabel('Zip Code *').fill('02420');
  await page.getByText('Suggested:').click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('1. Consent Addendum').click();
  await page.getByText('1. Consent Addendum').click();
  await page
    .getByRole('heading', {
      name: 'Consent Form Addendum: Learning About Your Child’s Tumor'
    })
    .click();
  await page.getByText('Introduction').click();
  await page.getByText('This consent addendum gives new information about the research study in which yo').click();
  await page.getByText('Yes').click();
  await page.getByText('My signature below indicates:').click();
  await page.locator('#mat-input-14').click();
  await page.locator('#mat-input-14').fill('Andrew Zimmer');
  await page.getByText('I have had enough time to read the consent addendum and think about continuing ').click();
  await page.waitForTimeout(2000); // auto save
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('heading', { name: 'Medical Release Form – Parent or Guardian' }).click();
  await page.getByText('Thank you for your consent to have your child participate in this research study').click();
  await page.getByLabel('Physician Name').click();
  await page.getByLabel('Physician Name').fill('Dr. Feelgood');
  await page.getByLabel('Physician Name').press('Tab');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).fill('A fake institution of some renown');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('Tab');
  await page.getByLabel('City').fill('Muppetville');
  await page.getByLabel('State').click();
  await page.getByLabel('State').fill('Sesame St.');
  await page.getByLabel('State').press('Tab');
  await page.getByLabel('Country').fill('Sesame St.');
  await page.getByText('By completing this information, you are agreeing to allow us to contact these ph').click();
  await page.getByText('I have already read and signed the informed consent document for this study, whi').click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('div').filter({ hasText: 'Full Name' }).nth(3).click();
  await page.getByRole('combobox', { name: 'Full Name' }).fill('Andrew Zimmer');
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('heading', { name: "Survey: About Your Child's Osteosarcoma" }).click();
  await page.getByText("Please tell us more about your child's experience with osteosarcoma by answering").click();
  await page.getByText('My child has been diagnosed with osteosarcoma, and I am filling out this survey ').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox').first().selectOption('2');
  await page.getByRole('combobox').nth(1).selectOption('2019');
  // todo arz replace selections with user text
  await page.locator('#mat-input-21').selectOption({ label: '6-12 months before diagnosis' });
  // picklist-answer-INITIAL_BODY_LOC
  await page.locator('.picklist-answer-INITIAL_BODY_LOC').getByText('Leg -- above the knee (femur)').click();
  await page.locator('.picklist-answer-INITIAL_BODY_LOC').getByText('Pelvis').click();
  await page.locator('.picklist-answer-CURRENT_BODY_LOC').getByText('No Evidence of Disease (NED)', { exact: true }).click();
  await page.locator('.picklist-answer-HAD_RADIATION').getByText('Yes').click();
  await page.getByText('Methotrexate').click();
  await page.getByText('Carboplatin').click();
  await page.locator('.picklist-answer-THERAPIES_RECEIVED').getByText('Other').click();
  await page.locator('.picklist-answer-THERAPIES_RECEIVED').getByLabel('Please provide details').click();
  await page.locator('.picklist-answer-THERAPIES_RECEIVED').getByLabel('Please provide details').fill('Some drug');
  await page.locator('.picklist-answer-EVER_RELAPSED').getByText('Yes').click();
  await page.locator('.picklist-answer-CURRENTLY_TREATED').getByText('Yes').click();
  await page.locator('.picklist-answer-OTHER_CANCERS').getByText('Yes').click();
  await page.locator('.composite-answer-OTHER_CANCERS_LIST').getByLabel('Choose cancer...').click();
  await page
    .locator('.composite-answer-OTHER_CANCERS_LIST')
    .getByRole('combobox', { name: 'Choose cancer...' })
    .type('doma', { delay: 200 });

  await page.waitForTimeout(1000);
  await page
    .locator('.composite-answer-OTHER_CANCERS_LIST')
    .getByRole('combobox', { name: 'Choose cancer...' })
    .press('ArrowDown');
  await page.waitForTimeout(1000);
  await page.locator('.composite-answer-OTHER_CANCERS_LIST').getByRole('combobox', { name: 'Choose cancer...' }).press('Enter');

  await page.locator('.composite-answer-OTHER_CANCERS_LIST').getByRole('combobox', { name: 'Year' }).selectOption('2016');

  await page.getByText('I understand that the information I entered here will be stored in a secure data').click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('heading', { name: 'Survey: About your child' }).click();
  await page.getByText('Please tell us more about your child by answering the questions below. As you fi').click();
  await page.getByText('Male', { exact: true }).click();
  await page.getByText('Girl').click();
  await page.getByText('Native Hawaiian or other Pacific Islander (For example: Chamorro, Fijian, Marsha').click();
  await page.getByText('Palauan').click();
  await page.getByText('Native Hawaiian', { exact: true }).click();
  await page.getByText('Word of mouth (friend/family, study staff, study participants, patient, support ').click();
  await page.getByText('Friend/family member').click();
  await page.locator('#mat-radio-42').getByText('None of the time').click();
  await page.locator('#mat-radio-48').getByText('None of the time').click();
  await page.getByText('Never').click();
  await page.getByText('8th grade or less').click();
  await page.getByText('Spanish', { exact: true }).click();
  await page.getByText('I understand that the information I entered here will be stored in a secure data').click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('A Message from the Osteosarcoma Project').click();
  await page.getByText('Thank you for providing information regarding your chid’s experiences with osteo').click();
  await page
    .getByRole('cell', {
      name: 'Thank you for signing the research consent and assent forms.'
    })
    .click();
  await page
    .getByRole('cell', {
      name: 'Thank you for completing these additional consent and assent forms.'
    })
    .click();
  await page
    .getByRole('cell', {
      name: 'Thank you for providing information about where your child has been treated for their cancer.'
    })
    .click();
  await page
    .getByRole('cell', {
      name: "Thank you for telling us about your child's experiences with Osteosarcoma."
    })
    .click();
  await page.getByRole('cell', { name: 'Thank you for telling us more about you.' }).click();
  await page
    .getByRole('cell', {
      name: "Please complete this survey to tell us more about your child's family history of cancer."
    })
    .click();
});
