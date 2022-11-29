import { Locator, Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Project Osteo base page.
 */
export abstract class OsteoPage extends PageBase {
  protected constructor(page: Page) {
    const { OSTEO_BASE_URL } = process.env;
    if (OSTEO_BASE_URL == null) {
      throw Error(`Invalid Osteo base URL: process.env.OSTEO_BASE_URL=${OSTEO_BASE_URL}`);
    }
    super(page, OSTEO_BASE_URL);
  }

  /**
   * Return "Back" button locator
   */
  getBackButton(): Locator {
    return this.page.locator('button', { hasText: 'Prev' });
  }
}
