import { Page } from '@playwright/test';
import PageBase from 'pages/page-base';

const { ANGIO_BASE_URL } = process.env;

/**
 * Angiosarcoma Project (Angio) page base
 */
export abstract class AngioPageBase extends PageBase {
  protected constructor(page: Page) {
    if (ANGIO_BASE_URL == null) {
      throw Error(`Invalid Angio base URL: process.env.ANGIO_BASE_URL=${ANGIO_BASE_URL}`);
    }
    super(page, ANGIO_BASE_URL);
  }
}
