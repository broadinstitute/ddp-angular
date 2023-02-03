import { test, expect } from '@playwright/test';
import { setAuth0UserEmailVerified } from 'utils/api-utils';
import { APP } from 'data/constants';
import { generateEmailAlias } from 'utils/faker-utils';
import * as testutils from 'utils/test-utils';
import ResearchConsentPage  from 'pages/osteo/consent-page';
import HomePage from 'pages/osteo/home-page';
import PrequalPage from 'pages/osteo/prequal-page';
import ConsentAddendumPage from 'pages/osteo/consent-addendump-page';
import ConsentAssentPage from 'pages/osteo/consent-assent-page';
import * as auth from 'authentication/auth-angio';

const { OSTEO_USER_EMAIL, OSTEO_USER_PASSWORD } = process.env;

test('Osteo enroll kid', async ({ page}) => {

    const userEmail = generateEmailAlias(OSTEO_USER_EMAIL);
    await page.goto('https://osteo.test.datadonationplatform.org/');
    await page.getByLabel('Password *').click();
    await page.getByLabel('Password *').press('Meta+a');
    await page.getByLabel('Password *').fill('broad_institute');
    await page.getByLabel('Password *').press('Enter');
    await page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('heading', { name: 'Let\'s Get Started' }).click();
    await page.getByText('Thank you for your interest in the Osteosarcoma Project. Here\'s what sign up and').click();
    await page.getByText('My child has been diagnosed with osteosarcoma and I\'m signing up with them or fo').click();
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
    await page.getByRole('paragraph').filter({ hasText: 'You can request my child’s stored tumor samples (e.g. tumor biopsies, surgical s' }).click();
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
    await page.getByRole('heading', { name: 'Consent Form Addendum: Learning About Your Child’s Tumor' }).click();
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
    await page.getByRole('heading', { name: 'Survey: About Your Child\'s Osteosarcoma' }).click();
    await page.getByText('Please tell us more about your child\'s experience with osteosarcoma by answering').click();
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
    await page.locator('.composite-answer-OTHER_CANCERS_LIST').getByRole('combobox', { name: 'Choose cancer...' }).type('doma', {delay: 200});
    
    page.waitForTimeout(1000);
    page.locator('.composite-answer-OTHER_CANCERS_LIST').getByRole('combobox', { name: 'Choose cancer...' }).press('ArrowDown');
    page.waitForTimeout(1000);
    page.locator('.composite-answer-OTHER_CANCERS_LIST').getByRole('combobox', { name: 'Choose cancer...' }).press('Enter');

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
    await page.getByRole('cell', { name: 'Thank you for signing the research consent and assent forms.' }).click();
    await page.getByRole('cell', { name: 'Thank you for completing these additional consent and assent forms.' }).click();
    await page.getByRole('cell', { name: 'Thank you for providing information about where your child has been treated for their cancer.' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us about your child\'s experiences with Osteosarcoma.' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us more about you.' }).click();
    await page.getByRole('cell', { name: 'Please complete this survey to tell us more about your child\'s family history of cancer.' }).click();
  
});

test('Osteo enroll self and kid together', async({ page}) => {
    await page.goto('https://osteo.test.datadonationplatform.org/');
    await page.getByLabel('Password *').click();
    await page.getByLabel('Password *').fill('broad_institute');
    await page.getByLabel('Password *').press('Enter');

    const homePage = new HomePage(page);
    await homePage.waitForReady();
    await homePage.clickCountMeIn();

    // do some basic content checkx
    await page.getByText('Thank you for your interest in the Osteosarcoma Project. Here\'s what sign up and').click();
    await page.getByText('First, who is signing up for the Osteosarcoma Project? Check all that apply').click();

    const prequalPage = new PrequalPage(page);
    await prequalPage.enrollChild(10,'United States','Idaho')

    //await page.getByText('My child has been diagnosed').click();
    //await page.getByRole('button', { name: 'Next' }).click();
    //await page.getByText('How old is your child?').click();
    const userEmail = auth.createAccountWithEmailAlias(page, { email: OSTEO_USER_EMAIL, password: OSTEO_USER_PASSWORD });


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
    await consentAssentPage.fillInMinorDOB('01','01','2006');
    
    await page.getByText('Parent', { exact: true }).click();

// todo arz consent page for address

  await consentAssentPage.fillInContactAddress({fullName: 'The Parent',
  country: 'UNITED STATES',
  street:'75 Ames Street',
  city: 'Cambridge', 
  state: 'MASSACHUSETTS', 
  zipCode:'02476', 
  telephone:'5555551212'})

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
    await expect(page.getByTestId('answer:SOMATIC_SINGATURE_PEDIATRIC')).toBeVisible( { visible: true});
    await page.getByTestId('answer:SOMATIC_SINGATURE_PEDIATRIC').fill('Playwright Parent');
    await page.getByTestId('answer:SOMATIC_SINGATURE_PEDIATRIC').blur( { timeout: 2000});
    
    await consentAssentPage.next();

    // todo arz isolate next click
    await page.getByText('Consent Form Addendum: Learning About Your Child').click();
    await page.getByText('Assent Form Addendum: Learning About Your Tumor').click();
    await page.getByText('The form below will tell you more about another part of the research study that ').click();
    await page.getByText('Yes').click();
    await page.locator('#mat-input-16').click();
    await page.locator('.mat-form-field-infix').click();
    await page.locator('#mat-input-16').fill('A name?');
    
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

    await page.getByRole('heading', { name: 'Survey: About Your Child\'s Osteosarcoma' }).click();
    await page.getByText('Please tell us more about your child\'s experience with osteosarcoma by answering').click();
    await page.getByText('My child has been diagnosed with osteosarcoma, and we are filling out this surve').click();
    await page.getByText('My child has been diagnosed with osteosarcoma, and I am filling out this survey ').click();
    await page.getByText('My child has been diagnosed with osteosarcoma, and we are filling out this surve').click();
    
    await consentAssentPage.next();

    await page.getByRole('combobox').first().selectOption('December');
    await page.locator('#mat-input-23').selectOption('6-12 months before diagnosis');
    await page.locator('.picklist-answer-INITIAL_BODY_LOC').getByText('Pelvis').click();
    await page.locator('.picklist-answer-HAD_RADIATION').getByText('No', {exact: true}).click();
    await page.getByText('Sorafenib').click();
    await page.getByText('Regorafenib').click();
    await page.locator('.picklist-answer-EVER_RELAPSED').getByText('No', {exact: true}).click();
    
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
   
    consentAssentPage.submit();

    await page.getByText('Thank you for providing information regarding your chid’s experiences with osteo').click();
    await page.getByText('A Message from the Osteosarcoma Project').click();
    await page.getByRole('cell', { name: 'Thank you for signing the research consent and assent forms.' }).click();
    await page.getByRole('cell', { name: 'Thank you for completing these additional consent and assent forms.' }).click();
    await page.getByRole('cell', { name: 'Thank you for providing information about where your child has been treated for their cancer.' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us about your child\'s experiences with Osteosarcoma.' }).click();
    await page.getByRole('cell', { name: 'Thank you for telling us more about you.' }).click();
    await page.getByRole('cell', { name: 'Please complete this survey to tell us more about your child\'s family history of cancer.' }).click();
  
});

test('Osteo self enroll', async ({ page }) => {
  const userEmail = generateEmailAlias(OSTEO_USER_EMAIL);
  await page.goto('https://osteo.test.datadonationplatform.org/');
  await page.getByLabel('Password *').click();
  await page.getByLabel('Password *').fill('broad_institute');
  await page.getByLabel('Password *').press('Enter');
  await page.waitForTimeout(1000);
  await page.getByRole('banner').getByRole('link', { name: 'Count Me In' }).click();

  await page.getByText('Thank you for your interest in the Osteosarcoma Project. Here\'s what sign up and').click();
  await page.getByText('First, who is signing up for the Osteosarcoma Project? Check all that apply').click();
  await page.getByText('I have been diagnosed with osteosarcoma and I\'m signing myself up').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter age').click();
  await page.getByLabel('Enter age').fill('30');

// wait for country selection to drive state/province
const requestPromise = page.waitForResponse(response => response.url().includes('https://pepper-test.datadonationplatform.org/pepper/v1/user') && response.status() === 200);
await page.locator('#mat-input-2').selectOption('US');
const request = await requestPromise;

  await page.locator('#mat-input-3').selectOption('CO');
  await page.waitForTimeout(2000);
    
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByPlaceholder('yours@example.com').click();
  await page.getByPlaceholder('yours@example.com').fill(userEmail);
  await page.getByPlaceholder('yours@example.com').press('Tab');
  await page.getByPlaceholder('your password').fill(OSTEO_USER_PASSWORD!);
  await page.getByPlaceholder('your password').press('Enter');
  await page.waitForURL('**/consent');
  await page.getByRole('heading', { name: 'Research Consent Form'}).click();
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
  await page.getByRole('combobox', { name: 'First Name' }).fill('Andrew');
  await page.getByRole('combobox', { name: 'First Name' }).press('Tab');
  await page.getByRole('combobox', { name: 'Last Name' }).fill('Zimmer');
  await page.getByLabel('MM').click();
  await page.getByLabel('MM').fill('01');
  await page.getByLabel('DD', { exact: true }).fill('01');
  await page.getByLabel('YYYY').fill('1991');

  const consentPage = new ResearchConsentPage(page);

  await consentPage.fillInContactAddress({fullName: 'Andrew Zimmer',
  country: 'UNITED STATES',
  street:'75 Ames Street',
  city: 'Cambridge', 
  state: 'MASSACHUSETTS', 
  zipCode:'02476', 
  telephone:'5555551212'})

  await consentPage.submit();
  
  await page.getByRole('heading', { name: 'Consent Form Addendum: Learning About Your Tumor' }).click();
  await page.getByText('Introduction').click();
  await page.getByText('This consent addendum gives new information about the research study in which yo').click();
  await page.getByText('This is what I agree to:').click();
  await page.getByText('You can share with me any available results from the sequencing of tumor sample[').click();
  await page.getByText('Yes').click();
  await page.locator('.mat-form-field-infix').click();
  await page.locator('#mat-input-12').fill('Andrew Zimmer');
  await page.getByRole('heading', { name: 'Date' }).click();
  
  consentPage.submit();

  await page.getByRole('heading', { name: 'Medical Release Form' }).click();
  await page.getByText('Thank you for your consent to participate in this research study.').click();
  await page.getByLabel('Physician Name').click();
  await page.getByLabel('Physician Name').fill('Dr. Teeth');
  await page.getByLabel('Physician Name').press('Tab');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).fill('institute');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('ArrowDown');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('ArrowDown');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('ArrowDown');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).press('Enter');
  await page.getByRole('button', { name: '+ Add another physician' }).click();
  await page.locator('#mat-input-22').click();
  await page.locator('#mat-input-22').fill('Dr. Feelgood');
  await page.locator('#mat-input-19').click();
  await page.locator('#mat-input-19').fill('Heavy Metal Hospital');
  await page.locator('#mat-input-20').click();
  await page.locator('#mat-input-20').fill('Big Hair');
  await page.locator('#mat-input-20').press('Tab');
  await page.locator('#mat-input-21').fill('MA');
  await page.locator('#mat-input-23').click();
  await page.locator('#mat-input-23').fill('USA');
  await page.locator('section').filter({ hasText: 'Thank you for your consent to participate in this research study. To complete th' }).click();
  await page.getByText('I have already read and signed the informed consent document for this study, whi').click();
  await page.getByLabel('Full Name').click();
  await page.getByRole('combobox', { name: 'Full Name' }).fill('Andrew Zimmer');
  
  consentPage.submit();

  await page.getByRole('heading', { name: 'Survey: About Your Osteosarcoma' }).click();
  await page.getByText('Please tell us more about your experience with osteosarcoma by answering the que').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox').first().selectOption('2');
  await page.getByRole('combobox').nth(1).selectOption('2009');
  await page.locator('#mat-input-24').selectOption('SIX_TO_TWELVE_MONTHS');
  await page.getByText('When you were first diagnosed with osteosarcoma, where in your body was it found').click();
  await page.locator('.mat-checkbox-inner-container').first().click();
  await page.getByText('Other').nth(1).click();
  await page.getByLabel('Please provide details').click();
  await page.getByLabel('Please provide details').fill('A different part of my body');
  await page.getByText('Please select all the places in your body that you currently have osteosarcoma, ').click();
  await page.locator('#mat-checkbox-17 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
  await page.locator('#mat-radio-12').getByText('No').click();
  await page.locator('#mat-radio-11').getByText('Yes').click();
  await page.locator('#mat-checkbox-24 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
  await page.locator('#mat-checkbox-25 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
  await page.locator('label').filter({ hasText: 'Cisplatin' }).click();
  await page.locator('#mat-checkbox-24 > .mat-checkbox-layout > .mat-checkbox-inner-container').click();
  await page.getByText('Methotrexate').click();
  await page.getByText('Cisplatin').click();
  await page.locator('#mat-radio-16 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click();
  await page.locator('#mat-radio-15').getByText('Yes').click();
  await page.locator('#mat-radio-19').getByText('Yes').click();
  await page.locator('#mat-radio-23').getByText('Yes').click();
  await page.getByLabel('Choose cancer...').click();
  await page.getByRole('combobox', { name: 'Choose cancer...' }).fill('cancer');
  await page.getByText('Bone Cancer').click();
  await page.getByRole('combobox', { name: 'Year' }).selectOption('2000');

  consentPage.submit();

  await page.getByRole('heading', { name: 'Survey: About you' }).click();
  await page.getByText('Please tell us more about you by answering the questions below. As you fill out ').click();
  await page.getByText('What sex were you assigned at birth? Sex assigned at birth is the assignment and').click();
  await page.getByText('Woman').click();
  await page.getByText('Hispanic, Latino, or Spanish (For example: Colombian, Cuban, Dominican, Mexican ').click();
  await page.getByText('Cuban', { exact: true }).click();
  await page.getByText('Dominican', { exact: true }).click();
  await page.getByText('3A. Do you consider yourself to be mixed race, that is belonging to more than on').click();
  await page.locator('#mat-radio-62').getByText('No').click();
  await page.locator('#mat-radio-66').getByText('Yes').click();
  await page.getByRole('paragraph').filter({ hasText: '3C. Do you consider yourself to be indigenous or Native American (such as Purepe' }).click();
  await page.locator('#mat-radio-72').getByText('No').click();
  await page.locator('#mat-input-28').click();
  await page.locator('#mat-input-28').fill('testing comments!');
  await page.getByText('General internet/Online sources (search engines, patient advocacy group website,').click();
  await page.getByText('Patient advocacy group website', { exact: true }).click();
  await page.locator('#mat-radio-33').getByText('Most of the time').click();
  await page.getByText('How often do you have problems learning about your medical condition because of ').click();
  await page.locator('#mat-radio-41').getByText('A little of the time').click();
  await page.getByText('Occasionally').click();
  await page.getByText('High school graduate or equivalent').click();
  await page.getByText('English', { exact: true }).click();  
  await page.getByRole('button', { name: 'Submit' }).hover();
  consentPage.submit();
  await page.goto('https://osteo.test.datadonationplatform.org/dashboard');
  await page.getByText('Thank you for providing information regarding your experiences with osteosarcoma').click();
  await page.getByRole('button', { name: 'Andrew Zimmer Hide' }).click();
  await page.getByRole('button', { name: 'Andrew Zimmer Show' }).click();
  await page.getByRole('button', { name: 'Research Consent Form' }).click();
  await page.getByRole('heading', { name: 'Research Consent Form' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Survey: Your Osteosarcoma' }).click();
  await page.getByRole('heading', { name: 'Survey: About Your Osteosarcoma' }).click();
  await page.getByText('Please tell us more about your experience with osteosarcoma by answering the que').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('heading', { name: 'Tell us about the history of cancer in your biological (blood-related) family' }).click();
  await page.getByText('2 Instructions').click();
  await page.getByText('Understanding the history of cancer in someone\'s biological family can help rese').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('mat-card-content').filter({ hasText: 'Biological / Birth Parent 1: Assigned Female at birth 1 questions answered' }).getByRole('button', { name: 'Edit' }).click();
  await page.locator('.mat-form-field-wrapper').first().click();
  await page.locator('#mat-input-30').fill('Mom');
  await page.locator('#mat-input-30').press('Tab');
  await page.locator('#mat-radio-76').getByText('Yes').click();
  await page.locator('#mat-input-32').selectOption('90-94');
  await page.locator('#mat-radio-80').getByText('Yes').click();
  await page.locator('#mat-radio-84').getByText('Yes').click();
  await page.getByText('Ashkenazi', { exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('mat-card-content').filter({ hasText: 'Biological / Birth Parent 2: Assigned Male at birth 1 questions answered' }).getByRole('button', { name: 'Edit' }).click();
  await page.locator('#mat-input-35').click();
  await page.locator('#mat-input-35').fill('Dad');
  await page.locator('#mat-radio-94').getByText('Yes').click();
  await page.locator('#mat-input-37').selectOption('90-94');
  await page.locator('#mat-radio-99').getByText('No').click();
  await page.locator('#mat-radio-103').getByText('No').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Add a Parent\'s Sibling Add a Parent\'s Sibling' }).click();
  await page.locator('#mat-input-38').click();
  await page.locator('#mat-input-38').fill('Mom\'s Sister');
  await page.locator('#mat-input-39').selectOption('PARENT1');
  await page.locator('#mat-input-40').selectOption('FEMALE');
  await page.locator('#mat-radio-107').getByText('No').click();
  await page.locator('#mat-input-41').selectOption('45-49');
  await page.locator('#mat-radio-110').getByText('Yes').click();
  await page.locator('#mat-input-42').click();
  await page.getByText('Atypical teratoid rhabdoid tumor (ATRT)').click();
  await page.locator('#mat-input-43').selectOption('5-9');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Add a Child Add a Child' }).click();
  await page.locator('#mat-input-44').click();
  await page.locator('#mat-input-44').fill('Kid');
  await page.locator('#mat-input-45').selectOption('INTERSEX');
  await page.locator('#mat-radio-114').getByText('Yes').click();
  await page.locator('#mat-input-46').selectOption('10-14');
  await page.locator('#mat-radio-119 label').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByRole('row', { name: 'Survey: Family History of Cancer Thank you for telling us more about your family history of cancer.' }).getByRole('button', { name: 'View Completed' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
});