import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { booleanToYesOrNo, waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { BrainBasePage } from './brain-base-page';

export default class ResearchConsentPage extends BrainBasePage {

  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Research Consent Form' })).toBeVisible({visible: true});
    await waitForNoSpinner(this.page);
  }

  async clickTissue(agree:boolean):Promise<void> {
    await this.page.getByTestId('answer:CONSENT_TISSUE').getByText(booleanToYesOrNo(agree)).click();
  }
  
  async clickBlood(agree:boolean):Promise<void> {
    await this.page.getByTestId('answer:CONSENT_BLOOD').getByText(booleanToYesOrNo(agree)).click();
  }
  
  async enterName(firstName:string, lastName:string): Promise<void> {
    await this.page.getByTestId('answer:CONSENT_FIRSTNAME').fill(firstName);
    await this.page.getByTestId('answer:CONSENT_LASTNAME').fill(lastName);
  }

  async enterSignature(fullName:string): Promise<void> {
    await this.page.getByTestId('answer:CONSENT_FULLNAME').fill(fullName);
  }

// todo arz use existing fill in DOB in base page
  async enterDOB(mm:string, dd: string, yyyy:string): Promise<void> {
    const dateLocator = '.date-answer-CONSENT_DOB';
    await this.page.locator(dateLocator).getByLabel('MM').fill(mm);
    await this.page.locator(dateLocator).getByLabel('DD').fill(dd);
    await this.page.locator(dateLocator).getByLabel('YYYY').fill(yyyy);
  }

  // todo arz fix toBeVisble (visible:true) to drop param

}
