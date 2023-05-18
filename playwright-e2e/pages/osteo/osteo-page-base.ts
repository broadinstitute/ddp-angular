import { Page } from '@playwright/test';
import PageBase from 'pages/page-base';

const { OSTEO_BASE_URL } = process.env;

export abstract class OsteoPageBase extends PageBase {
  protected constructor(page: Page) {
    if (OSTEO_BASE_URL == null) {
      throw Error(`Invalid Osteo base URL: process.env.OSTEO_BASE_URL=${OSTEO_BASE_URL}`);
    }
    super(page, OSTEO_BASE_URL);
  }
}
