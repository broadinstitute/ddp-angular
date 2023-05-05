import { Page } from '@playwright/test';
import PageBase from 'pages/page-base';

const { BRAIN_BASE_URL } = process.env;

export abstract class BrainBasePage extends PageBase {
  protected constructor(page: Page) {
    if (BRAIN_BASE_URL == null) {
      throw Error(`Invalid Brain base URL: process.env.BRAIN_BASE_URL=${BRAIN_BASE_URL}`);
    }
    super(page, BRAIN_BASE_URL);
  }
}
