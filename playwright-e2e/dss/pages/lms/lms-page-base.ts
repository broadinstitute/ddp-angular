import { Page } from '@playwright/test';
import PageBase from 'dss/pages/page-base';

/**
 * Leiomyosarcoma Project (LMS) page base
 */
export abstract class LmsPageBase extends PageBase {
  protected constructor(page: Page) {
    const { LMS_BASE_URL } = process.env;
    if (LMS_BASE_URL == null) {
      throw Error(`Invalid LMS base URL: process.env.LMS_BASE_URL=${LMS_BASE_URL}`);
    }
    super(page, LMS_BASE_URL);
  }
}
