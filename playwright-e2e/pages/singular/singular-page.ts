import { Locator, Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Project Singular base page.
 */
export abstract class SingularPage extends PageBase {
  protected constructor(page: Page) {
    super(page, process.env.singularBaseURL as string);
  }

  /**
   * Return "Back" button locator
   */
  getBackButton(): Locator {
    return this.page.locator('button', { hasText: 'Back' });
  }
}
