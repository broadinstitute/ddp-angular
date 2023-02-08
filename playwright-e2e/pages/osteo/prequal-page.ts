import { expect, Locator, Page } from '@playwright/test';
import { AngioPageBase } from 'pages/angio/angio-page-base';
import { waitForNoSpinner } from 'utils/test-utils';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { OsteoPageBase } from './osteo-base-page';
import { stat } from 'fs';

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
    await this.page.getByRole('button').filter({hasText: 'Next'}).click();
    await this.page.getByLabel('Enter age').fill(age.toString());
    await this.page.locator('#mat-input-2').selectOption(country); // picklist-answer-CHILD_COUNTRY
    await this.page.locator('#mat-input-3').selectOption(state);
    this.submit();
  }
}
