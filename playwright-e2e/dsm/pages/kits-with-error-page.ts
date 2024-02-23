import { Page } from '@playwright/test';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { KitsColumnsEnum } from 'dsm/pages/kits-info/enums/kitsColumns-enum';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class KitsWithErrorPage extends KitsPageBase {
  protected PAGE_TITLE = 'Kits with Error';
  TABLE_HEADERS = [
    KitsColumnsEnum.PRINT_KIT,
    KitsColumnsEnum.SHORT_ID,
    KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.ERROR_REASON,
    KitsColumnsEnum.DDP_REALM,
    KitsColumnsEnum.TYPE,
    '',
    ''
  ];

  constructor(page: Page) {
    super(page);
  }
}
