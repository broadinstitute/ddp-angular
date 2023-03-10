import { expect, Locator, Page } from '@playwright/test';
import Question from 'lib/component/Question';
import { OsteoPageBase } from 'pages/osteo/osteo-page-base';
import { waitForNoSpinner } from 'utils/test-utils';

export default class GetStartedPage extends OsteoPageBase {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h2');
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText("Let's Get Started");
    await expect(this.getSubmitButton()).toBeVisible();
    await waitForNoSpinner(this.page);
  }

  /**
   * Question: First, who is signing up for the Osteosarcoma Project?
   * Type: multi-checkbox
   * @returns {Question}
   */
  whoIsSigningUP(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-PREQUAL_SELF_DESCRIBE' });
  }
}
