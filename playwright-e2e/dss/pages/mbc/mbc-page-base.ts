import PageBase from '../page-base';
import {Page} from '@playwright/test';

export class MBCPageBase extends PageBase {
  protected constructor(page: Page) {
    const { MBC_BASE_URL } = process.env;
    if (MBC_BASE_URL == null) {
      throw Error(`Invalid MBC base URL: process.env.MBC_BASE_URL=${MBC_BASE_URL}`);
    }
    super(page, MBC_BASE_URL);
  }
}
