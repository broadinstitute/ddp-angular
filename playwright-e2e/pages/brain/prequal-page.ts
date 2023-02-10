import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { BrainBasePage } from './brain-base-page';

export default class PrequalPage extends BrainBasePage {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.page.getByText('First, how will you be participating in the Brain Tumor Project?')).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  async startSelfEnrollment(age: number, country: string, state: string): Promise<void> {
    await this.page.getByText('I have been diagnosed with a brain tumor.').click();
    await this.page.getByRole('button').filter({ hasText: 'Next' }).click();
    await this.page.getByTestId('answer:SELF_CURRENT_AGE').fill(age.toString());
    await this.page.locator('.picklist-answer-SELF_COUNTRY').getByRole('combobox').selectOption(country);
    await this.page.locator('.picklist-answer-SELF_STATE').getByRole('combobox').selectOption(state);
    this.submit();
  }
}
