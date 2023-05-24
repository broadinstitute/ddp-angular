import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { OsteoPageBase } from 'dss/pages/osteo/osteo-page-base';

export default class PrequalPage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h2');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Let's Get Started");
    await waitForNoSpinner(this.page);
  }

  async enrollChild(age: number, country: string, state: string): Promise<void> {
    await this.page.getByText('My child has been diagnosed').click();
    await this.page.getByRole('button').filter({ hasText: 'Next' }).click();
    await this.page.getByLabel('Enter age').fill(age.toString());
    await this.page.locator('#mat-input-2').selectOption({ label: country }); // picklist-answer-CHILD_COUNTRY
    await this.page.locator('#mat-input-3').selectOption({ label: state });
    await this.submit();
  }
}
