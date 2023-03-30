import { expect } from '@playwright/test';
import { test } from 'fixtures/osteo-fixture';
import HomePage from 'pages/osteo/home-page';
import PrequalPage from 'pages/osteo/prequal-page';
import ConsentAssentPage from 'pages/osteo/consent-assent-page';
import * as auth from 'authentication/auth-angio';

const { OSTEO_USER_EMAIL, OSTEO_USER_PASSWORD } = process.env;

test('Osteo enroll self and kid together @osteo', async ({ page }) => {
  test.slow();

  const homePage = new HomePage(page);
  await homePage.waitForReady();
  await homePage.clickCountMeIn();

  // do some basic content checkx
  await page.getByText("Thank you for your interest in the Osteosarcoma Project. Here's what sign up and").click();
  await page.getByText('First, who is signing up for the Osteosarcoma Project? Check all that apply').click();

  const prequalPage = new PrequalPage(page);
  await prequalPage.enrollChild(10, 'United States', 'Idaho');

  await auth.createAccountWithEmailAlias(page, {
    email: OSTEO_USER_EMAIL,
    password: OSTEO_USER_PASSWORD
  });

  await page.waitForURL('**/consent**');
  await page.getByRole('heading', { name: 'Research Consent & Assent Form' }).click();
  await page.getByText('What is the purpose of this study?').click();
  await page.getByText('What if I have questions?').click();
  await page.getByText('If you have any questions, please send an email to info@osproject.org or call 65').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Introduction').click();
  await page.getByText('You are being invited to have your child participate in this research study beca').click();
  await page.getByText('Will I or my child be paid to take part in this research study?').click();
  await page.getByText('If you/your child complete an interview about your experiences with participatin').click();

  const consentAssentPage = new ConsentAssentPage(page);
  await consentAssentPage.waitForReady();
  await consentAssentPage.next();

  // await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('heading', { name: 'Q. Documentation of Consent' }).click();

  await consentAssentPage.bloodAndTissue(true, true);
  await consentAssentPage.fillInParentAndMinor('KidFirst', 'KidLast', 'ParentFirst', 'ParentLast');
  await consentAssentPage.fillInDateOfBirth('01', '01', '2006');

  await page.getByText('Parent', { exact: true }).click();

  await consentAssentPage.fillInContactAddress({
    fullName: 'The Parent',
    country: 'UNITED STATES',
    street: '75 Ames Street',
    city: 'Cambridge',
    state: 'MASSACHUSETTS',
    zipCode: '02476',
    telephone: '5555551212'
  });

  await page.getByText('Suggested:').click();

  await consentAssentPage.next();

  await page.getByRole('heading', { name: 'Message for the Parent/Guardian:' }).click();
  await page.getByText('This assent form is for your child to read and type their name to sign, if they ').click();
  await page.getByRole('heading', { name: 'Message for the Participant:' }).click();
  await page.getByText('Your parent or guardian has informed the research team that it is okay for you t').click();

  await consentAssentPage.enterChildAssent('KidFirst KidLast');
  await consentAssentPage.submit();

  await page.getByText('Introduction').click();
  await page.getByText('This consent addendum gives new information about the research study in which yo').click();

  await page.locator('span').filter({ hasText: 'Yes' }).click();
  await expect(page.getByTestId('answer:SOMATIC_SINGATURE_PEDIATRIC')).toBeVisible();
  await page.getByTestId('answer:SOMATIC_SINGATURE_PEDIATRIC').fill('Playwright Parent');
  await page.getByTestId('answer:SOMATIC_SINGATURE_PEDIATRIC').blur({ timeout: 2000 });

  await consentAssentPage.next();

  await page.getByText('Consent Form Addendum: Learning About Your Child').click();
  await page.getByText('Assent Form Addendum: Learning About Your Tumor').click();
  await page.getByText('The form below will tell you more about another part of the research study that ').click();
  await page.getByText('Yes').click();
  await page.locator('#mat-input-16').click();
  await page.locator('.mat-form-field-infix').click();
  await page.locator('#mat-input-16').fill('A name?');
  await page.waitForTimeout(1000);

  await consentAssentPage.submit();

  await page.getByRole('heading', { name: 'Medical Release Form – Parent or Guardian' }).click();
  await page.getByText('Thank you for your consent to have your child participate in this research study').click();
  await page.getByLabel('Physician Name').click();
  await page.getByLabel('Physician Name').fill('Dr. Jones');
  await page.getByLabel('Physician Name').press('Tab');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).fill('institute of');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('ArrowDown');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('Enter');
  await page.getByText('By completing this information, you are agreeing to allow us to contact these ph').click();
  await page.getByText('I have already read and signed the informed consent document for this study, whi').click();
  await page.getByLabel('Full Name').click();
  await page.getByRole('combobox', { name: 'Full Name' }).fill('Playwright McTestsAlot');

  await consentAssentPage.submit();

  await page.getByRole('heading', { name: "Survey: About Your Child's Osteosarcoma" }).click();
  await page.getByText("Please tell us more about your child's experience with osteosarcoma by answering").click();
  await page.getByText('My child has been diagnosed with osteosarcoma, and we are filling out this surve').click();
  await page.getByText('My child has been diagnosed with osteosarcoma, and I am filling out this survey ').click();
  await page.getByText('My child has been diagnosed with osteosarcoma, and we are filling out this surve').click();

  await consentAssentPage.next();

  await page.getByRole('combobox').first().selectOption({ label: 'December' });
  await page.locator('#mat-input-23').selectOption({ label: '6-12 months before diagnosis' });
  await page.locator('.picklist-answer-INITIAL_BODY_LOC').getByText('Pelvis').click();
  await page.locator('.picklist-answer-HAD_RADIATION').getByText('No', { exact: true }).click();
  await page.getByText('Sorafenib').click();
  await page.getByText('Regorafenib').click();
  await page.locator('.picklist-answer-EVER_RELAPSED').getByText('No', { exact: true }).click();

  await consentAssentPage.submit();

  await page.getByRole('heading', { name: 'Survey: About your child' }).click();
  await page.getByText('Please tell us more about your child by answering the questions below. As you fi').click();
  await page.getByText('Two-spirit').click();
  await page.getByText('Middle Eastern or North African (For examle: Algerian, Egyptian, Iranian, Lebane').click();
  await page.getByText('Egyptian', { exact: true }).click();
  await page.getByText('Event (patient conference, science or research symposium, networking event, etc.').click();
  await page.getByText('Science or research talk, conference, or symposium').click();
  await page.getByText('A little of the time').nth(1).click();
  await page.getByText('A little of the time').nth(1).click();
  await page.getByText('Occasionally').click();

  await consentAssentPage.submit();

  await page.getByText('Thank you for providing information regarding your chid’s experiences with osteo').click();
  await page.getByText('A Message from the Osteosarcoma Project').click();
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
