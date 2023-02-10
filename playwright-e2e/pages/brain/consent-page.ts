import { expect, Page } from '@playwright/test';
import { booleanToYesOrNo, waitForNoSpinner } from 'utils/test-utils';
import { BrainBasePage } from './brain-base-page';

export default class ResearchConsentPage extends BrainBasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Research Consent Form' })).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  async clickTissue(agree: boolean): Promise<void> {
    await this.page.getByTestId('answer:CONSENT_TISSUE').getByText(booleanToYesOrNo(agree)).click();
  }

  async clickBlood(agree: boolean): Promise<void> {
    await this.page.getByTestId('answer:CONSENT_BLOOD').getByText(booleanToYesOrNo(agree)).click();
  }

  async enterName(firstName: string, lastName: string): Promise<void> {
    await this.page.getByTestId('answer:CONSENT_FIRSTNAME').fill(firstName);
    await this.page.getByTestId('answer:CONSENT_LASTNAME').fill(lastName);
  }

  async enterSignature(fullName: string): Promise<void> {
    await this.page.getByTestId('answer:CONSENT_FULLNAME').fill(fullName);
  }

  // todo arz fix toBeVisble (visible:true) to drop param
}
