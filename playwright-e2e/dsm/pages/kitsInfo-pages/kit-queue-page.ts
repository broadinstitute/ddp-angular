import { KitsColumnsEnum } from './enums/kitsColumns-enum';
import { Locator, Page } from '@playwright/test';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';

export default class KitsQueuePage extends KitsPageBase {
  PAGE_TITLE = 'Kit Queue';
  TABLE_HEADERS = [
    KitsColumnsEnum.PRINT_KIT,
    KitsColumnsEnum.SHORT_ID,
    KitsColumnsEnum.PREFERRED_LANGUAGE,
    KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.DDP_REALM,
    KitsColumnsEnum.TYPE,
    '',
    ''
  ]; //'Deactivate' and 'Generate Express Label' do not have column header names

  constructor(page: Page) {
    super(page);
  }

  public async goToPage(page: number): Promise<void> {
    await this.kitsTable.goToPage(page);
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.kitsTable.rowsPerPage(rows);
  }

  public async getAllSamplesOnPage(): Promise<Locator[]> {
    return this.page.locator('//table//tbody//tr').all();
  }

  public async getAmountOfSamplesOnPage(): Promise<number> {
    return await this.page.locator('//table//tbody//tr').count();
  }

  public async search(columnName: KitsColumnsEnum, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }
}
