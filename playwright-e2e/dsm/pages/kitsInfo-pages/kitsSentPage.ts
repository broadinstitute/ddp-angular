import {expect, Locator, Page} from '@playwright/test';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import {waitForNoSpinner} from 'utils/test-utils';
import {assertTableHeaders} from 'utils/assertion-helper';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';
import {Label} from 'dsm/enums';

export default class KitsSentPage extends KitsPageBase {
  protected PAGE_TITLE = 'Kits Sent';
  protected TABLE_HEADERS = [Label.SHORT_ID, Label.SHIPPING_ID,
    Label.TRACKING_NUMBER, Label.TRACKING_RETURN,
    Label.SENT, Label.MF_CODE, Label.DDP_REALM,
    Label.TYPE, Label.SAMPLE_TYPE];

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

  public async search(columnName: Label, value: string, opts: { count?: number } = {}): Promise<void> {
    const { count } = opts;
    if (count) {
      await this.kitsTable.searchBy(columnName, value);
      await this.assertDisplayedRowsCount(count);
    } else {
      await this.kitsTable.searchBy(columnName, value);
    }
  }

  public async getData(columnName: Label): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  /* Assertions */

  public async assertReloadKitListBtn() {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      'Kits Sent page - Reload Kit List Button is not visible')
      .toBeVisible();
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kits Sent page - Displayed kit types checkboxes are wrong').toBeVisible()
    }
  }

  public async assertTableHeader(): Promise<void> {
    assertTableHeaders(await this.kitsTable.getHeaderTexts(), this.TABLE_HEADERS);
  }

  public async assertDisplayedRowsCount(count: number): Promise<void> {
    await expect(async () => {
      await this.reloadKitList();
      await expect(this.kitsTable.rows,
        "Kits Sent page - displayed rows count doesn't match the provided one")
        .toHaveCount(count, { timeout: 20 * 1000 });
    }).toPass({ timeout: 60 * 1000 });
  }

  /* XPaths */
  private get reloadKitListBtnXPath(): string {
    return "//button[span[text()[normalize-space()='Reload Kit List']]]"
  }
}
