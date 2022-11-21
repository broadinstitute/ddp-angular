import { Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Project Singular base page.
 */
export abstract class SingularPage extends PageBase {
  protected constructor(page: Page) {
    const { SINGULAR_BASE_URL } = process.env;
    if (SINGULAR_BASE_URL == null) {
      throw Error(`Invalid Singular base URL: process.env.SINGULAR_BASE_URL=${SINGULAR_BASE_URL}`);
    }
    super(page, SINGULAR_BASE_URL);
  }
}
