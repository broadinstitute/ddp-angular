import { Page } from '@playwright/test';
import PageBase from 'pages/page-base';

/**
 * Data Study Manager (DSM) page base
 */
export abstract class DSMPageBase extends PageBase {
  protected constructor(page: Page) {
    const { DSM_BASE_URL } = process.env;
    if (DSM_BASE_URL == null) {
      throw Error(`Invalid DSM base URL: process.env.DSM_BASE_URL=${DSM_BASE_URL}`);
    }
    super(page, DSM_BASE_URL);
  }
}
