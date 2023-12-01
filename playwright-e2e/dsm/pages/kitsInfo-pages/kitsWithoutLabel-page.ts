import {expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';


export default class KitsWithoutLabelPage extends KitsPageBase {
  PAGE_TITLE = 'Kits without label';
  TABLE_HEADERS = [
    KitsColumnsEnum.PRINT_KIT,
    KitsColumnsEnum.SHORT_ID,
    KitsColumnsEnum.PREFERRED_LANGUAGE,
    KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.DDP_REALM,
    KitsColumnsEnum.TYPE,
    ''
  ];
  // the last item is empty string because the deactivate buttons columns doesn't have one


  constructor(page: Page) {
    super(page);
  }

  public async goToPage(page: number): Promise<void> {
    await this.kitsTable.goToPage(page);
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.kitsTable.rowsPerPage(rows);
  }

  public async waitUntilAllKitLabelCreationRequestsAreProcessed(): Promise<void> {
    //Wait until all instances seen instances of kit label creation has been processed
    const pendingKitLabelCreation = await this.page.locator('[data-icon="cog"]').all();
    for (const pendingKit of pendingKitLabelCreation) {
      await expect(async () => {
        await this.reloadKitList();
        await expect(pendingKit).not.toBeVisible();
      }).toPass({ timeout: 5 * 60 * 1000 });
    }
  }

  public async search(columnName: KitsColumnsEnum, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  public async clickCreateLabels(): Promise<void> {
    await Promise.all([
      waitForResponse(this.page, { uri: '/kitLabel' }),
      this.createLabelsButton.click()
    ]);
    await waitForNoSpinner(this.page);
    await expect(this.page.locator('h3')).toHaveText(/Triggered label creation/i);
  }

  /* Assertions */
  public async assertReloadKitListBtn(): Promise<void> {
    await expect(this.getReloadKitListBtn,
      'Kits Without Label page - Reload Kit List Button is not visible').toBeVisible();
  }

  public async assertCreateLabelsBtn(): Promise<void> {
    await expect(this.page.locator(this.createLabelsBtnXPath),
      'Kits Without Label page - Create Labels button is not visible')
      .toBeVisible();
  }

  public get createLabelsButton(): Locator {
    return this.page.locator(this.createLabelsBtnXPath);
  }

  /* XPaths */
  private get createLabelsBtnXPath(): string {
    return '//button[normalize-space()="Create Labels"]';
  }
}
