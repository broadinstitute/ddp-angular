import { Locator, Page } from '@playwright/test';
import { Label } from 'dsm/enums';
import KitsPageBase from 'dsm/pages/kits-page-base';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class KitsWithErrorPage extends KitsPageBase {
  PAGE_TITLE = 'Kits with Error';
  TABLE_HEADERS = [
    Label.PRINT_KIT,
    Label.SHORT_ID,
    Label.SHIPPING_ID,
    Label.ERROR_REASON,
    Label.DDP_REALM,
    Label.TYPE,
    '',
    ''
  ];

  constructor(page: Page) {
    super(page);
  }

  get toLocator(): Locator {
    return this.page.locator('app-shipping');
  }
}
