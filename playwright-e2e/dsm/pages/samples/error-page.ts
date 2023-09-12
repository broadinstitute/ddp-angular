import { expect, Locator, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { KitType } from 'dsm/component/kitType/kitType';
import { KitsTable } from 'dsm/component/tables/kits-table';
import Select from 'dss/component/select';
import Table from 'dss/component/table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class ErrorPage {
  private readonly kitType: KitType;
  private readonly kitsTable: KitsTable;

  constructor(private readonly page: Page) {
    this.kitType = new KitType(this.page)
    this.kitsTable = new KitsTable(this.page);
  }

  public async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1')).toHaveText('Kits with Error');
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      waitForNoSpinner(this.page)
    ]);
    await Promise.all([
      expect(this.kitType.displayedKitType(KitTypeEnum.BLOOD)).toBeVisible(),
      expect(this.kitType.displayedKitType(KitTypeEnum.SALIVA)).toBeVisible()
    ]);
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await Promise.all([
      waitForResponse(this.page, { uri: '/kitRequests' }),
      this.kitType.selectKitType(kitType)
    ]);
    await waitForNoSpinner(this.page);
    await expect(this.reloadKitListButton).toBeVisible();
  }

  public get reloadKitListButton(): Locator {
    return this.page.getByRole('button', {name: 'Reload Kit List'});
  }

  public get kitListTable(): KitsTable {
    return this.kitsTable;
  }
}
