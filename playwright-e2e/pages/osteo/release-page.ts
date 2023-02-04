import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';

export default class ReleasePage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async chooseInstitutionInList(index: number, searchText: string, pressArrowDownTimes: number, expectedHit: string, 
    city: string, state: string, country: string): Promise<void> {
        // type the search into the institution typeahead
        await this.page.getByRole('combobox', { name: 'Institution (if any)' }).type(searchText, {delay: 200});
        await this.page.waitForTimeout(1000); 
        for (var i = 0; i < pressArrowDownTimes; i++) {
            await this.page.getByRole('combobox', { name: 'Institution (if any)' }).press('ArrowDown');
        }
        await this.page.getByRole('combobox', { name: 'Institution (if any)' }).press('Enter');
        await expect(this.page.getByLabel('Institution ').nth(index)).toHaveValue(expectedHit)
  }
  
  async setPhysician(index: number, physicianName: string): Promise<void> {
    await this.page.getByLabel('Physician Name').nth(index).fill(physicianName);
  }

  async addAnotherPhysician(): Promise<void> {
    await this.page.getByRole('button', { name: '+ Add another physician' }).click();
  }
  
  /*



  await releasePage.chooseInstituteInList(0, 'Pittsburgh', 3, "Children's Institute Of Pittsburgh", 'Pittsburgh', 'PA', 'USA' );
  await releasePage.setPhysician(0, 'Dr. Teeth');
  await releasePage.addAnotherPhysician();

  await releasePage.typeNewInstitute(0, 'Motley Crue Hospital', "Partyville", "Los Angeles", "Califoooornia" );
  await releasePage.setPhysician(0, 'Dr. Feelgood');
  await releasePage.signName('Testy McTesterson');
  
  await releasePage.clickAcknowledge();

  await page.locator('section').filter({ hasText: 'Thank you for your consent to participate in this research study. To complete th' }).click();
  await page.locator('section').filter({ hasText: 'Thank you for your consent to participate in this research study. To complete th' }).click();
 

  await page.getByLabel('Physician Name').nth(0).click();
  await expect(page.getByLabel('Institution ').nth(0)).toHaveValue("Children's Institute Of Pittsburgh")
  await page.getByLabel('Physician Name').fill('Dr. Teeth');
  await page.getByLabel('Physician Name').press('Tab');
  await page.getByRole('combobox', { name: 'Institution (if any)' }).fill('pittsburgh');
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
  
  */

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ visible: true });
    await expect(this.pageTitle).toHaveText('Medical Release');
    await waitForNoSpinner(this.page);
  }

  async bloodAndTissue(agreeToBlood: boolean, agreeToTissue: boolean) : Promise<void> {
    const blood = agreeToBlood ? 'Yes' : 'No';
    const tissue = agreeToTissue? 'Yes' : 'No';
    await this.page.getByTestId('answer:CONSENT_ASSENT_BLOOD').getByText(blood).click();
    await this.page.getByTestId('answer:CONSENT_ASSENT_TISSUE').getByText(tissue).click();
  }

  async enterChildAssent(childName: string) : Promise<void> {
    await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_SIGNATURE').click();
    await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_SIGNATURE').fill(childName);
    await this.page.waitForTimeout(1000);

  }

  async fillInParentAndMinor(minorFirstName: string,
    minorLastName: string,
    parentFirstName: string,
    parentLastName: string) : Promise<void> {
        await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_FIRSTNAME').click();
        await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_FIRSTNAME').fill(minorFirstName);
        await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_LASTNAME').click();
        await this.page.getByTestId('answer:CONSENT_ASSENT_CHILD_LASTNAME').fill(minorLastName);
    
        await this.page.getByTestId('answer:CONSENT_ASSENT_FIRSTNAME').click();
        await this.page.getByTestId('answer:CONSENT_ASSENT_FIRSTNAME').fill(parentFirstName);
        await this.page.getByTestId('answer:CONSENT_ASSENT_LASTNAME').click();
        await this.page.getByTestId('answer:CONSENT_ASSENT_LASTNAME').fill(parentLastName);
        
    }

    async fillInMinorDOB(mm: string, dd: string, yyyy: string):  Promise<void> {
      await this.page.locator('input[data-placeholder="MM"]').fill(mm);
      await this.page.locator('input[data-placeholder="DD"]').fill(dd);
      await this.page.locator('input[data-placeholder="YYYY"]').fill(yyyy);

    }

}