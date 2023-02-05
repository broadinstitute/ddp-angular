import { test, expect } from '@playwright/test';
import { setAuth0UserEmailVerified } from 'utils/api-utils';
import { APP } from 'data/constants';
import * as auth from 'authentication/auth-base';
import { generateEmailAlias, generateUserName } from 'utils/faker-utils';
import * as testutils from 'utils/test-utils';
import * as email from 'utils/email-utils'
import HomePage from 'pages/brain/home-page';
import PrequalPage from 'pages/brain/prequal-page';
import ResearchConsentPage from 'pages/brain/consent-page';

const { BRAIN_USER_EMAIL, BRAIN_USER_PASSWORD, MIN_EMAIL_WAIT_TIME, BRAIN_BASE_URL, SITE_PASSWORD } = process.env;

test('Brain statics', async ({page}) => {
    await page.goto(BRAIN_BASE_URL!);
    
    testutils.fillSitePassword(page, SITE_PASSWORD);
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Brain Tumor Project logo Brain Tumor Project' }).click();
    await page.getByRole('banner').getByRole('listitem').filter({ hasText: 'FAQs' }).click();
    await page.getByRole('heading', { name: 'Frequently Asked Questions' }).click();
    await page.getByText('The Brain Tumor Project (BTp) takes a new approach to cancer research in which p').click();
    await page.getByRole('heading', { name: 'General FAQ' }).click();
    await page.getByRole('button', { name: 'What is the goal of this project?' }).click();
    await page.getByText('The goal of this project is to generate a large dataset that includes genomic, c').click();
    await page.getByRole('button', { name: 'Who is conducting this research?' }).click();
    await page.getByText('This project is being conducted by Count Me In. Our team is made up of cancer re').click();
    await page.getByRole('button', { name: 'What are the genomic and molecular research aspects of this project?' }).click();
    await page.getByText('This study involves genomic and molecular research to better define the genes an').click();
    await page.getByRole('button', { name: 'Are there any costs for me to participate?' }).click();
    await page.getByText('No, there are no costs to you. All associated costs related to acquiring medical').click();
    await page.getByRole('button', { name: 'How has the brain tumor community been involved in the design of this project?' }).click();
    await page.getByText('We have worked closely with patients, parents, and patient advocates within the ').click();
    await page.getByRole('button', { name: 'If I am asked to share a tissue sample, will my tissue be used up?' }).click();
    await page.getByText('If you do elect to share tissue as part of the study, we will take every measure').click();
    await page.getByText('In order to get a sense of what archived samples are available for request, the ').click();
    await page.getByRole('button', { name: 'Is this study a clinical trial?' }).click();
    await page.getByText('This study is not a clinical trial. Participation will not have any impact on yo').click();
    await page.getByRole('heading', { name: 'I/my child have been diagnosed with a brain tumor' }).click();
    await page.getByRole('button', { name: 'How does this project work?' }).click();
    await page.getByText('Click "Count Me In" and complete a simple online form to tell us about yourself/').click();
    await page.getByText('If you are in the United States or Canada after you fill out the initial survey,').click();
    await page.getByText('We\'ll also send you a simple kit to collect a saliva sample from you/your child,').click();
    await page.getByRole('button', { name: 'What happens when my child with a brain tumor becomes an adult?' }).click();
    await page.getByText('When your child reaches the age of consenting for themselves, they need to conse').click();
    await page.getByText('If your child remains in the study when they reach the age of consenting for the').click();
    await page.getByRole('button', { name: 'How can I spread the word about the Brain Tumor Project?' }).click();
    await page.getByText('If you would like to learn more about how to spread the word about the project, ').click();
    await page.getByRole('button', { name: 'How can I receive updates on the Brain Tumor Project?' }).click();
    await page.getByText('If you would like updates on the project, please sign up for our mailing list.').click();
    await page.getByRole('banner').getByRole('link', { name: 'About Us' }).click();
    await page.getByText('Brain Tumor Project', { exact: true }).click();
    await page.getByText('brings together patients and researchers').click();
    await page.getByText('The Brain Tumor Project is part of Count Me In, a nonprofit organization that br').click();
    await page.getByText('is stewarded by four leading organizations: the Broad Institute of MIT and Harva').click();
    await page.getByText('The Brain Tumor Project has been designed and implemented collaboratively with b').click();
    await page.getByText('The Brain Tumor Project Advisory Council (PAC) is made up of patients, advocates').click();
    await page.getByRole('heading', { name: 'Project Advisory Council' }).click();
    await page.getByRole('img', { name: 'Charlie Blotner photo' }).click();
    await page.getByText('Charlie Blotner Charlie Blotner is a hospice social worker in Seattle, WA. Inter').click();
    await page.getByText('Amanda Haddock Amanda Haddock’s son died from brain cancer at the age of 18. Sin').click();
    await page.getByRole('img', { name: 'Adam Hayden photo' }).click();
    await page.getByText('Adam Hayden is a philosopher of science, a champion of humanities-informed pract').click();
    await page.getByRole('img', { name: 'Meta Laabs photo' }).click();
    await page.getByRole('heading', { name: 'Meta Laabs' }).click();
    await page.getByText('Meta Laabs is a retired university administrator, living now in Asheville North ').click();
    await page.getByRole('img', { name: 'Sabine Schwab photo' }).click();
    await page.getByRole('heading', { name: 'Sabine Schwab' }).click();
    await page.getByText('Sabine Schwab is a former researcher with a Ph.D. in Economics and Social Scienc').click();
    await page.getByRole('img', { name: 'Susie Wilson and Guy Lipof photo' }).click();
    await page.getByRole('heading', { name: 'Susie Wilson and Guy Lipof' }).click();
    await page.getByText('Susie and Guy live in Austin, TX. Their experience with brain cancer started in ').click();
    await page.getByRole('img', { name: 'Terri S. Armstrong photo' }).click();
    await page.getByRole('img', { name: 'Pratiti (Mimi) Bandopadhayay photo' }).click();
    await page.getByRole('img', { name: 'Rameen Beroukhim photo' }).click();
    await page.getByRole('img', { name: 'Bradley E. Bernstein photo' }).click();
    await page.getByRole('img', { name: 'Wenya Linda Bi photo' }).click();
    await page.getByRole('img', { name: 'Mariella G. Filbin photo' }).click();
    await page.getByRole('img', { name: 'Jason T. Huse photo' }).click();
    await page.getByRole('img', { name: 'Alexandra Golby photo' }).click();
    await page.getByRole('img', { name: 'Keith Ligon photo' }).click();
    await page.getByRole('img', { name: 'Roel Verhaak photo' }).click();
    await page.getByRole('img', { name: 'W. K. Alfred Yung photo' }).click();
    await page.getByRole('img', { name: 'Patrick Y. Wen photo' }).click();
    await page.getByText('Brain TumorProject FAQs About Us Join Mailing List Data Log In Count Me In Menu').click();
    await page.getByRole('banner').getByRole('listitem').filter({ hasText: 'Data' }).click();
    await page.getByRole('heading', { name: 'We’re in the process of collecting data from participants across the United States and Canada.' }).click();
    await page.getByRole('heading', { name: 'Snapshots' }).click();
    await page.getByRole('img', { name: 'Brain tumor diagnosis type diagram' }).click();
    await page.getByRole('button').filter({ hasText: 'clear' }).click();
    await page.getByRole('img', { name: 'Age at initial brain tumor diagnosis diagram' }).click();
    await page.getByRole('button').filter({ hasText: 'clear' }).click();
    await page.getByRole('heading', { name: 'What does a data release look like?' }).click();
    await page.getByText('Below are links out to datasets from other Count Me In projects. This is what we').click();
    await page.getByRole('img', { name: 'The Metastatic Breast Cancer Project data release diagram' }).click();
    await page.getByRole('img', { name: 'The Metastatic Prostate Cancer Project data release diagram' }).click();
    await page.getByRole('img', { name: 'The Angiosarcoma Project data release diagram' }).click();
  
});

test('Brain enroll kid on their behalf', async ( {page}) => {
    await page.goto(BRAIN_BASE_URL!);
    const userEmail = generateEmailAlias(BRAIN_USER_EMAIL);
    testutils.fillSitePassword(page, SITE_PASSWORD)
    
    await page.waitForTimeout(1000);
    await page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();
    await page.getByText('My child has been diagnosed with a brain tumor').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByLabel('Enter age').click();
    await page.getByLabel('Enter age').fill('10');
    await page.locator('#mat-input-2').selectOption('US');
    await page.locator('#mat-input-3').selectOption('GA');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByPlaceholder('yours@example.com').click();
    await page.getByPlaceholder('yours@example.com').fill(userEmail);
    await page.getByPlaceholder('yours@example.com').press('Tab');
    await page.getByPlaceholder('your password').fill(BRAIN_USER_PASSWORD!);
    await page.getByPlaceholder('your password').press('Enter');
    await page.getByRole('heading', { name: 'Consent & Assent Form' }).click();
    await page.getByText('Please read through the consent form text below and click Next when you are done').click();
    await page.getByRole('heading', { name: 'Does my child have to participate in this study?' }).click();
    await page.getByText('No. Taking part in this study is voluntary. Even if you decide to have your chil').click();
    await page.getByRole('heading', { name: 'What if my child or I have questions?' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('heading', { name: 'Consent & Assent Form' }).click();
    await page.getByRole('heading', { name: 'Introduction' }).click();
    await page.getByText('You are being invited to enroll your child in a research study that will collect').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('heading', { name: 'Consent & Assent Form' }).click();
    await page.getByRole('heading', { name: 'Documentation of Consent' }).click();
    await page.locator('#mat-radio-2').getByText('Yes').click();
    await page.locator('#mat-radio-5').getByText('Yes').click();
    await page.locator('#mat-input-0').click();
    await page.locator('#mat-input-0').fill('Kid');
    await page.locator('#mat-input-0').press('Tab');
    await page.locator('#mat-input-1').fill('Zimmer');
    await page.getByLabel('MM').click();
    await page.getByLabel('MM').fill('01');
    await page.getByLabel('DD').fill('01');
    await page.getByLabel('YYYY').fill('2013');
    await page.locator('#mat-input-5').fill('A');
    await page.locator('#mat-input-5').click();
    await page.locator('#mat-input-5').fill('Andrew');
    await page.locator('div:nth-child(9) > .ddp-single-question > div > ddp-activity-question > .ddp-activity-question > ddp-activity-answer > ddp-activity-text-answer > ddp-activity-text-input > .activity-text-input > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
    await page.locator('#mat-input-6').fill('Zimmer');
    await page.getByLabel('Full Name').click();
    await page.getByRole('combobox', { name: 'Full Name' }).fill('Andrew Zimmer');
    await page.getByText('Parent', { exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('heading', { name: 'Consent & Assent Form' }).click();
    await page.getByRole('heading', { name: 'Research Assent Form – Child/Adolescent' }).click();
    await page.getByText('We want to tell you about a research study we are doing. A research study is a w').click();
    await page.locator('div').filter({ hasText: 'Full Name' }).nth(2).click();
    await page.getByRole('combobox', { name: 'Full Name' }).fill('Kid Zimmer');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('heading', { name: 'Medical Release Form' }).click();
    await page.getByText('Thank you very much for your consent to have your child participate in this rese').click();
    await page.getByLabel('Full Name *').click();
    await page.getByLabel('Full Name *').fill('KID ZIMMEr');
    await page.getByLabel('Full Name *').press('Tab');
    await page.getByRole('combobox', { name: 'Country/Territory Country/Territory' }).getByText('Country/Territory').click();
    await page.getByText('UNITED STATES', { exact: true }).click();
    await page.getByPlaceholder('Enter a location').click();
    await page.getByPlaceholder('Enter a location').fill('75 AMES St');
    await page.getByPlaceholder('Enter a location').click();
    await page.getByRole('combobox', { name: 'State State' }).getByText('State').click();
    await page.getByText('MASSACHUSETTS').click();
    await page.locator('div').filter({ hasText: 'City *' }).nth(2).click();
    await page.getByLabel('City *').fill('CAMBRIDGe');
    await page.getByLabel('Zip Code *').click();
    await page.getByLabel('Zip Code *').fill('02476');
    await page.getByText('Suggested:').click();
    await page.getByText('Suggested:').click();
    await page.getByText('Your Child\'s Physicians\' Names').click();
    await page.getByLabel('Physician Name').click();
    await page.getByLabel('Physician Name').fill('Dr. Teeth');
    await page.getByLabel('Physician Name').press('Tab');
    await page.getByRole('combobox', { name: 'Institution (if any)' }).fill('Muppet Medical');
    await page.getByRole('combobox', { name: 'Institution (if any)' }).press('Tab');
    await page.locator('#mat-input-17').fill('Muppetville');
    await page.locator('#mat-input-17').press('Tab');
    await page.locator('#mat-input-18').fill('Muppet');
    await page.getByRole('paragraph').filter({ hasText: 'I have already read and signed the informed consent document for this study, whi' }).click();
    await page.getByText('By completing this information, you are agreeing to allow us to contact these ph').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('heading', { name: 'Join the movement: tell us about your child' }).click();
    await page.getByText('My child has been diagnosed with a primary brain tumor, and I am filling out thi').click();
    await page.getByRole('combobox').first().selectOption('2014');
    await page.getByRole('combobox').nth(1).selectOption('6');
    await page.getByLabel('Type your answer here...').click();
    await page.getByRole('combobox', { name: 'Type your answer here...' }).fill('some kind');
    await page.getByText('Some tumors are given a grade (e.g. High grade, low grade, grade I, II, III, or ').click();
    await page.locator('#mat-input-27').selectOption('GRADE-III');
    await expect(page.getByText('$')).toHaveCount(0);
    await page.locator('#mat-radio-17').getByText('Yes').click();
    await page.locator('#mat-input-29').click();
    await page.locator('#mat-input-29').fill('type a');
    await page.locator('select').nth(3).selectOption('2008');
    await page.locator('select').nth(4).selectOption('7');
    await page.locator('#mat-radio-22').getByText('No').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('heading', { name: 'Please tell us more about your child' }).click();
    await page.getByText('Biopsy', { exact: true }).click();
    await page.locator('#mat-radio-25').getByText('Yes').click();
    await page.getByText('Whole-brain radiation therapy (WBRT)').click();
    await page.getByText('Proton beam radiation therapy').click();
    await page.locator('#mat-radio-29').getByText('Yes').click();
    await page.getByLabel('Choose medication/chemotherapy...').click();
    await page.getByRole('combobox', { name: 'Choose medication/chemotherapy...' }).fill('nab');
    await page.getByText('NAB-PACLITAXEL', { exact: true }).click();
    await page.locator('#mat-radio-34').getByText('No').click();
    await page.getByText('Female').click();
    await page.getByText('Transgender').click();
    await page.getByText('Transgender girl').click();
    await page.locator('div').filter({ hasText: 'Asian' }).nth(1).click();
    await page.getByText('Asian').click();
    await page.locator('#mat-checkbox-38').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('My Dashboard').click();
    await page.getByText('A Message from the Brain Tumor Project').click();
    await page.getByText('Thank you for saying "Count Me In" and providing information regarding your expe').click();
    await page.getByRole('cell', { name: 'Thank you for signing the research consent form.' }).click();
    await page.getByRole('cell', { name: 'Thank you for providing your child\'s mailing address and contact information for your child\'s physician(s) and hospital(s).' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us about your child\'s experiences with a brain tumor.' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us additional details about your child\'s experience with a brain tumor.' }).click();
    await page.getByRole('button', { name: 'View', exact: true }).click();
  
});

test('Brain enroll self', async ({ page}) => {
    await page.goto(BRAIN_BASE_URL!);
    const checkForEmailsAfter = Date.now() + Number.parseInt(MIN_EMAIL_WAIT_TIME!);
    await testutils.fillSitePassword(page);
   
    const homePage = new HomePage(page);
    await homePage.waitForReady();
    await homePage.clickCountMeIn();
    
    const prequalPage = new PrequalPage(page);
    await prequalPage.startSelfEnrollment(30, 'US', 'FL')
   
    const userEmail = await auth.createAccountWithEmailAlias(page, { email: BRAIN_USER_EMAIL, password: BRAIN_USER_PASSWORD });
    const firstName = generateUserName('BR');
    const lastName = generateUserName('BR');
    const fullName = firstName + ' ' + lastName;

    const consentPage = new ResearchConsentPage(page);
  
    await page.getByRole('heading', { name: 'Research Consent Form' }).click();
    await page.getByText('Please read through the consent form text below and click Next when you are done').click();
    await page.getByRole('heading', { name: 'What if I have questions?' }).click();
    await page.getByText('If you have any questions, please send an email to info@braintumorproject.org or').click();
    await page.getByRole('heading', { name: 'Can I stop taking part in this research study?' }).click();
    await page.getByText('Yes, you can withdraw from this research study at any time, although any of your').click();

    await prequalPage.next();

    await page.getByRole('heading', { name: 'Research Consent Form' }).click();
    await page.getByRole('heading', { name: 'Introduction' }).click();
    await page.getByText('You are being invited to participate in a research study that will collect and a').click();
    await page.getByRole('heading', { name: 'Authorization to use your health information for research purposes' }).click();
    await page.getByText('Because information about you and your health is personal and private, it genera').click();

    await prequalPage.next();

    await page.getByRole('heading', { name: 'Research Consent Form' }).click();
    await page.getByRole('heading', { name: 'Documentation of Consent' }).click();

    await consentPage.clickTissue(true); 
    await consentPage.clickBlood(true); 
    await consentPage.enterName(firstName, lastName);
    await consentPage.enterDOB('01','01','2000'); 
    await consentPage.enterSignature(fullName); 
    await consentPage.submit();

    await page.getByRole('heading', { name: 'Medical Release Form' }).click();
    await page.getByText('Thank you very much for providing your consent to participate in this research s').click();

    await consentPage.fillInContactAddress({fullName: fullName,
        country: 'CANADA',
        street:'845 RUE SHERBROOKE OUES',
        city: 'MONTREAL', 
        state: 'QUEBEC', 
        zipCode:'H3A 0G', // leave off full zip so the "as entered" button can be clicked
        telephone:'5555551212',
        labels: { phone: 'Telephone Contact Number',country: 'Country/Territory',state:'Province',zip:'Postal Code', city:'City'}
    });

        /*
    await page.getByLabel('Full Name *').fill('ANDREW ZIMMEr');
    await page.getByRole('combobox', { name: 'Country/Territory Country/Territory' }).getByText('Country/Territory').click();
    await page.getByText('UNITED STATES', { exact: true }).click();
    await page.getByPlaceholder('Enter a location').click();
    await page.getByPlaceholder('Enter a location').fill('320 CHARLES St');
    await page.getByPlaceholder('Enter a location').press('Tab');
    await page.getByLabel('Apt/Floor #').press('Tab');
    await page.getByLabel('City *').click();
    await page.getByLabel('City *').fill('CAMBRIDGe');
    await page.getByRole('combobox', { name: 'State State' }).getByText('State').click();
    await page.getByText('MASSACHUSETTS').click();
    await page.locator('div').filter({ hasText: 'Zip Code *' }).nth(2).click();
    await page.getByLabel('Zip Code *').fill('02476');
    await page.getByText('Suggested:').click();

    */

    // fill these in with components
    await page.getByLabel('Physician Name').click();
    await page.getByLabel('Physician Name').fill('Dr. Teeth');
    await page.getByLabel('Physician Name').press('Tab');
    await page.getByRole('combobox', { name: 'Institution (if any)' }).fill('Muppet Memorial Hospital');
    await page.getByRole('combobox', { name: 'Institution (if any)' }).press('Tab');
    await page.locator('#mat-input-14').fill('Sesame St Township');
    await page.locator('#mat-input-14').press('Tab');
    await page.locator('#mat-input-15').click();
    await page.locator('#mat-input-15').fill('Sesame St');
    await page.getByLabel('Institution', { exact: true }).click();
    await page.getByRole('combobox', { name: 'Institution', exact: true }).fill('Muppet Institute');
    await page.getByRole('combobox', { name: 'Institution', exact: true }).press('Tab');
    await page.locator('#mat-input-18').fill('Muppetville');
    await page.locator('#mat-input-19').click();
    await page.locator('#mat-input-19').fill('Muppet');
    await page.getByText('I have already read and signed the informed consent document for this study, whi').click();
   
    await consentPage.submit();

    await page.getByRole('heading', { name: 'Join the movement: tell us about yourself' }).click();
    await page.getByText('Thank you for providing your consent for research. The Brain Tumor Project is op').click();
    await page.getByRole('combobox').first().selectOption('1990');
    await page.getByRole('combobox').first().press('Meta+0');
    await page.getByRole('combobox').nth(1).selectOption('5');
    await page.getByLabel('Type your answer here...').click();
    await page.getByRole('combobox', { name: 'Type your answer here...' }).fill('type 1');
    await page.locator('#mat-input-21').selectOption('GRADE-I');
    await page.locator('#mat-radio-11').getByText('Yes').click();
    await page.getByText('What type did your brain tumor change to and when?').click();
    await page.locator('.activity-text-input-OTHER_BRAIN_CANCER_TYPE').click();
    await page.locator('.activity-text-input-OTHER_BRAIN_CANCER_TYPE').type('type 5');
    await page.locator('select').nth(3).selectOption('2009');
    await page.locator('select').nth(4).selectOption('10');
    await page.locator('#mat-radio-16').getByText('No').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('heading', { name: 'Please tell us more about yourself' }).click();
    await page.getByText('Thank you for joining the movement. Please help us understand more about your ex').click();
    await page.locator('.mat-checkbox-inner-container').first().click();
    await page.locator('#mat-radio-19').click();
    await page.locator('#mat-radio-19').getByText('Yes').click();
    await page.getByText('Focal radiation (examples include CyberKnife, gamma knife radiosurgery, and ster').click();
    await page.getByText('Proton beam radiation therapy').click();
    await page.locator('#mat-radio-23').getByText('Yes').click();
    await page.getByLabel('Choose medication/chemotherapy...').click();
    await page.getByRole('combobox', { name: 'Choose medication/chemotherapy...' }).fill('nib');
    await page.getByRole('option', { name: 'AFATINIB', exact: true }).locator('span').first().click();
    await page.locator('#mat-radio-28').click();
    await page.locator('#mat-radio-28').getByText('No').click();
    await page.getByText('Female').click();
    await page.getByText('Transgender').click();
    await page.getByText('Transgender woman').click();
    await page.getByText('Asian').click();
    await page.getByText('Cambodian').click();
    await page.getByText('Native Hawaiian or other Pacific Islander').click();
    await page.getByText('Chuukese').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByText('My Dashboard').click();
    await page.getByText('Thank you for providing your consent for this study, and for providing informati').click();
    await page.getByText('We\'ll stay in touch with you so that you can see the progress that we are making').click();
    await page.getByRole('cell', { name: 'Thank you for signing the research consent form.' }).click();
    await page.getByRole('cell', { name: 'Thank you for providing your mailing address and contact information for your physician(s) and hospital(s).' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us about your experiences with a brain tumor.' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us additional details about your experience with a brain tumor.' }).click();
    await page.getByRole('row', { name: 'Medical Release Form Thank you for providing your mailing address and contact information for your physician(s) and hospital(s)' }).getByRole('button', { name: 'View/Edit' }).click();
    await page.getByRole('heading', { name: 'Medical Release Form' }).click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    
    const waitMessage = 'Waiting for ' + (checkForEmailsAfter - Date.now()) + 'additional ms to check emails';
    await test.step(waitMessage, async () => {
        await page.waitForTimeout(checkForEmailsAfter - Date.now());
    });

    await email.checkUserReceivedEmails(userEmail, [
        { subject: 'Thank you for submitting your information', textProbe: "Thank you for joining the Brain Tumor Project. We are now asking if you would be willing to sign our research consent form, where we ask your permission to obtain copies of your medical records"},
        { subject: 'Thank you for providing your consent', textProbe: "Thank you for joining The Brain Tumor Project and for giving us your consent for research"},
    ]);

});
