import { Locator, Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Project LMS base page.
 */
export abstract class LmsPage extends PageBase {
  protected constructor(page: Page) {
    const { LMS_BASE_URL } = process.env;
    if (LMS_BASE_URL == null) {
      throw Error(`Invalid LMS base URL: process.env.LMS_BASE_URL=${LMS_BASE_URL}`);
    }
    super(page, LMS_BASE_URL);
  }

  /**
   * Return "Back" button locator
   */
  getBackButton(): Locator {
    return this.page.locator('button', { hasText: 'Prev' });
  }
}
