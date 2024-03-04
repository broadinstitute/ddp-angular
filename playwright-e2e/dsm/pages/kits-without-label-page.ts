import {expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { Label } from 'dsm/enums';


export default class KitsWithoutLabelPage extends KitsPageBase {
  PAGE_TITLE = 'Kits without label';
  TABLE_HEADERS = [
    Label.PRINT_KIT,
    Label.SHORT_ID,
    Label.PREFERRED_LANGUAGE,
    Label.SHIPPING_ID,
    Label.DDP_REALM,
    Label.TYPE,
  ];

  constructor(page: Page) {
    super(page);
  }

  protected get toLocator(): Locator {
    return this.page.locator('app-shipping');
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

  public async search(columnName: Label, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: Label): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  public async clickCreateLabels(): Promise<void> {
    await Promise.all([
      waitForResponse(this.page, { uri: '/kitLabel' }),
      this.createLabelsButton.click()
    ]);
    await waitForNoSpinner(this.page);
    await expect(this.page.locator('h3')).toHaveText(/Triggered label creation/i);
    // Wait for pending kit label creation icon to appear
    await expect(this.page.locator('[data-icon="cog"]')).toBeVisible();
    // Wait for pending kit label creation icon to disappear
    await this.waitUntilAllKitLabelCreationRequestsAreProcessed();
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

  private get createLabelsButton(): Locator {
    return this.page.locator(this.createLabelsBtnXPath);
  }

  /* XPaths */
  private get createLabelsBtnXPath(): string {
    return '//button[normalize-space()="Create Labels"]';
  }
}
