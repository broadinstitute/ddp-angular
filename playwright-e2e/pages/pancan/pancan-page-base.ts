import { Locator, Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Project Pancan base page.
 */
export abstract class PancanPageBase extends PageBase {
  protected constructor(page: Page) {
    const { PANCAN_BASE_URL } = process.env;
    if (PANCAN_BASE_URL == null) {
      throw Error(`Invalid Pancan base URL: process.env.PANCAN_BASE_URL=${PANCAN_BASE_URL}`);
    }
    super(page, PANCAN_BASE_URL);
  }

  /**
   * Return "Back" button locator
   */
  getBackButton(): Locator {
    return this.page.locator('button', { hasText: 'Prev' });
  }
}
