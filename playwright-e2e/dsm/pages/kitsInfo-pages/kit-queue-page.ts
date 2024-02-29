import { Locator, Page } from '@playwright/test';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { Label } from 'dsm/enums';

export default class KitsQueuePage extends KitsPageBase {
  protected PAGE_TITLE = 'Kit Queue';
  TABLE_HEADERS = [
    Label.PRINT_KIT,
    Label.SHORT_ID,
    Label.PREFERRED_LANGUAGE,
    Label.SHIPPING_ID,
    Label.DDP_REALM,
    Label.TYPE,
    '',
    ''
  ]; //'Deactivate' and 'Generate Express Label' do not have column header names

  constructor(page: Page) {
    super(page);
  }

  protected get rootLocator(): Locator {
    return this.page.locator('app-shipping');
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

  public async search(columnName: Label, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: Label): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }
}
