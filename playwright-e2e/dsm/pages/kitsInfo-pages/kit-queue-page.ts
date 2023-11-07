import { KitType } from 'dsm/component/kitType/kitType';
import { KitsColumnsEnum } from './enums/kitsColumns-enum';
import { expect, Locator, Page } from '@playwright/test';
import { KitsTable } from 'dsm/component/tables/kits-table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { assertTableHeaders } from 'utils/assertion-helper';

export default class KitsQueuePage {
  private readonly PAGE_TITLE = 'Kit Queue';
  private readonly TABLE_HEADERS = [KitsColumnsEnum.PRINT_KIT,
    KitsColumnsEnum.SHORT_ID, KitsColumnsEnum.PREFERRED_LANGUAGE,
    KitsColumnsEnum.SHIPPING_ID, KitsColumnsEnum.DDP_REALM,
    KitsColumnsEnum.TYPE, '', '']; //'Deactivate' and 'Generate Express Label' do not have column header names

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {}

  public get getKitsTable(): KitsTable {
    return this.kitsTable;
  }

  public async goToPage(page: number): Promise<void> {
    await this.kitsTable.goToPage(page);
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.kitsTable.rowsPerPage(rows);
  }

  public async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await waitForNoSpinner(this.page);
  }

  public async hasExistingKitRequests(): Promise<boolean> {
    const noCurrentKitRequests = this.page.getByText('There are no kit requests');
    if (await noCurrentKitRequests.isVisible()) {
      return false;
    }
    return true;
  }

  public async getAllSamplesOnPage(): Promise<Locator[]> {
    return this.page.locator('//table//tbody//tr').all();
  }

  public async getAmountOfSamplesOnPage(): Promise<number> {
    return await this.page.locator('//table//tbody//tr').count();
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await waitForNoSpinner(this.page);
    await this.kitType.selectKitType(kitType);
    await waitForResponse(this.page, {uri: '/kitRequests'});
    await waitForNoSpinner(this.page);
  }

  public async search(columnName: KitsColumnsEnum, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  public async reloadKitList(): Promise<void> {
    await this.getReloadKitListButton().click();
    await waitForNoSpinner(this.page);
  }

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.locator('h1'),
      'Kits Received page - page title is wrong')
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertReloadKitListBtn(): Promise<void> {
    const reloadKitListButton = this.getReloadKitListButton();
    await expect(reloadKitListButton,
      'Kits Received page - Reload Kit List Button is not visible')
      .toBeVisible();
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kits Received page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async assertTableHeader(): Promise<void> {
    assertTableHeaders(await this.kitsTable.getHeaderTexts(), this.TABLE_HEADERS);
  }

  /* Locators */
  private getReloadKitListButton(): Locator {
    return this.page.getByRole('button', { name: 'Reload Kit List'});
  }
}
