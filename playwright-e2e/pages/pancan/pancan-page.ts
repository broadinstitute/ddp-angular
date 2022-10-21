import { Locator, Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Project Pancan base page.
 */
export abstract class PancanPage extends PageBase {
  protected constructor(page: Page) {
    super(page, process.env.pancanBaseURL as string);
  }

  /**
   * Return "Back" button locator
   */
  getBackButton(): Locator {
    return this.page.locator('button', { hasText: 'Prev' });
  }
}
