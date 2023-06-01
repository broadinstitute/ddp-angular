import { Page } from '@playwright/test';
import PageBase from 'dss/pages/page-base';

/**
 * Rare Genomic Project (RGP) page base
 */
export abstract class RgpPageBase extends PageBase {
  protected constructor(page: Page) {
    const { RGP_BASE_URL } = process.env;
    if (RGP_BASE_URL == null) {
      throw Error(`Invalid RGP base URL: process.env.RGP_BASE_URL=${RGP_BASE_URL}`);
    }
    super(page, RGP_BASE_URL);
  }
}
