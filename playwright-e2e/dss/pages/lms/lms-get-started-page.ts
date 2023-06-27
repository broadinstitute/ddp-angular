import { expect, Locator, Page } from '@playwright/test';
import Question from 'dss/component/Question';
import { LmsPageBase } from 'dss/pages/lms/lms-page-base';

export default class LmsGetStartedPage extends LmsPageBase {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1');
  }

  async waitForReady(): Promise<void> {
    await super.waitForReady();
    await expect(this.pageTitle).toHaveText('Lets get started');
    await expect(this.getNextButton()).toBeVisible();
  }

  /**
   * Question: First, who is signing up for the LMS Project?
   * Type: multi-checkbox
   * @returns {Question}
   */
  whoIsSigningUP(): Question {
    return new Question(this.page, { cssClassAttribute: '.picklist-answer-WHO_ENROLLING' });
  }
}
