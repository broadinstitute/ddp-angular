import { Locator, Page, expect } from '@playwright/test';
import DsmPageBase from './dsm-page-base';
import { KitsTable } from 'dsm/component/tables/kits-table';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { KitType } from 'dsm/component/kitType/kitType';
import { logInfo } from 'utils/log-utils';
import { KitsColumnsEnum } from './kitsInfo-pages/enums/kitsColumns-enum';
import Modal from 'dsm/component/modal';
import { assertTableHeaders } from 'utils/assertion-helper';

export default abstract class KitsPageBase extends DsmPageBase {
  protected abstract PAGE_TITLE: string;
  protected abstract TABLE_HEADERS: string[];
  protected readonly kitType: KitType;
  protected readonly kitsTable: KitsTable;

  constructor(readonly page: Page) {
    super(page);
    this.kitType = new KitType(this.page);
    this.kitsTable = new KitsTable(this.page);
  }

  public get getKitsTable(): KitsTable {
    return this.kitsTable;
  }

  public async waitForReady(): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState(),
      expect(this.page.locator('h1')).toHaveText(this.PAGE_TITLE),
    ]);
    await expect(async () => expect(await this.page.locator('mat-checkbox[id]').count()).toBeGreaterThanOrEqual(1)).toPass({ timeout: 60000 });
    const kits = await this.getStudyKitTypes()
    for (const kit of kits) {
      await expect(this.kitType.displayedKitType(kit)).toBeVisible();
    }
    await waitForNoSpinner(this.page);
  }

  public async reloadKit(kitType: KitTypeEnum): Promise<void> {
    await this.page.reload();
    await this.waitForReady();
    await this.selectKitType(kitType);
  }

  public async selectKitType(kitType: KitTypeEnum): Promise<boolean> {
    await waitForNoSpinner(this.page);
    await Promise.all([
      waitForResponse(this.page, { uri: 'ui/kitRequests' }),
      this.kitType.selectKitType(kitType)
    ]);
    await waitForNoSpinner(this.page);
    return await this.hasKitRequests();
  }

  public async deactivateKitFor(opts: { shortId?: string, shippingId?: string } = {}): Promise<string> {
    let { shortId, shippingId } = opts;
    expect(shortId || shippingId).toBeTruthy(); // At least one param must be provided

    expect(await this.kitsTable.exists()).toBeTruthy();
    const kitsCount = await this.kitsTable.rowLocator().count();
    expect(kitsCount).toBeGreaterThanOrEqual(1);

    let rowIndex = 0;
    if (shortId) {
      await this.kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortId, { column2Name: KitsColumnsEnum.SHIPPING_ID, value2: shippingId });
      expect(await this.kitsTable.rowLocator().count()).toBeGreaterThanOrEqual(1);
      const [actualShortId] = await this.kitsTable.getTextAt(rowIndex, KitsColumnsEnum.SHORT_ID);
      expect(actualShortId).toStrictEqual(shortId);
      [shippingId] = await this.kitsTable.getTextAt(rowIndex, KitsColumnsEnum.SHIPPING_ID);
    } else {
      // Selects a random Short ID
      rowIndex = await this.kitsTable.getRandomRowIndex();
      [shortId] = await this.kitsTable.getTextAt(rowIndex, KitsColumnsEnum.SHORT_ID);
      [shippingId] = await this.kitsTable.getTextAt(rowIndex, KitsColumnsEnum.SHIPPING_ID);
    }
    expect(shortId.length).toBeTruthy();
    expect(shippingId.length).toBeTruthy();

    await this.deactivate(rowIndex);
    logInfo(`Deactivated kit. Short ID: ${shortId}, Shipping ID: ${shippingId}`);
    return shippingId;
  }

  public async deactivateAllKitsFor(shortId?: string): Promise<void> {
    if (!shortId) {
      // Selects a random Short ID
      const rowIndex = await this.kitsTable.getRandomRowIndex();
      [shortId] = await this.kitsTable.getTextAt(rowIndex, KitsColumnsEnum.SHORT_ID);
    }
    expect(shortId.length).toBeTruthy();

    await this.kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortId);
    await waitForNoSpinner(this.page);

    const hasKitRequests = await this.hasKitRequests();
    if (hasKitRequests) {
      const kitsCount = await this.kitsTable.rowLocator().count();
      for (let i = 0; i < kitsCount; i++) {
        await this.deactivate(i);
        await this.kitsTable.rows.count() && await this.deactivateAllKitsFor(shortId);
      }
    }

    await expect(this.kitsTable.rowLocator()).toHaveCount(0);
    const selectedKit = await this.getSelectKitType();
    logInfo(`Deactivated all ${selectedKit} kits. Short ID: ${shortId}`);
  }

  public async hasKitRequests(): Promise<boolean> {
    const pageText = this.page.getByText('There are no kit requests');
    await Promise.race([
      expect(pageText).toBeVisible(),
      expect(this.kitsTable.tableLocator()).toBeVisible(),
    ]);
    const existsText = await pageText.isVisible();
    if (existsText) {
      return false;
    }
    return true;
  }

  public async getSelectKitType(): Promise<KitTypeEnum | null> {
    const kits = await this.getStudyKitTypes();
    for (const kit of kits) {
      const isSelected = await this.kitType.kitTypeCheckbox(kit).isChecked();
      if (isSelected) {
        return kit;
      }
    }
    return null;
  }

  public async getStudyKitTypes(): Promise<KitTypeEnum[]> {
    const studyNameLocation = this.page.locator(`//app-navigation//a[@data-toggle='dropdown']//i`);
    const studyName = await studyNameLocation.innerText();
    // Most studies have Blood and Saliva kits; RGP has Blood and 'Blood & RNA' kits; Pancan has Blood, Saliva, and Stool kits
    let kitTypes;
    switch (studyName) {
      case StudyEnum.RGP:
        kitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA];
        break;
      case StudyEnum.PANCAN:
        kitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.SALIVA, KitTypeEnum.STOOL];
        break;
      default:
        kitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];
        break;
    }
    return kitTypes;
  }

  public async reloadKitList(): Promise<void> {
    const waitPromise = waitForResponse(this.page, {uri: '/kitRequests'});
    await this.getReloadKitListBtn.click();
    await waitPromise;
    await waitForNoSpinner(this.page);
  }

  private async deactivate(row = 0): Promise<string> {
    const deactivateButton = this.kitsTable.deactivateButtons.nth(row);
    await deactivateButton.click();

    await expect(this.deactivateReasonInput).toBeVisible();
    await expect(this.deactivateReasonBtn).toBeVisible();

    const reason = `testDeactivate-${new Date().getTime()}`;
    await Promise.all([
      waitForResponse(this.page, {uri: '/deactivateKit'}),
      waitForResponse(this.page, {uri: '/kitRequests'}),
      this.deactivateReasonInput.fill(reason),
      this.deactivateReasonBtn.click(),
    ]);

    await expect(new Modal(this.page).toLocator()).not.toBeVisible();
    await waitForNoSpinner(this.page);
    return reason;
  }

  public get deactivateReasonInput(): Locator {
    return this.page.locator("//app-modal/div[@class='modal fade in']//table/tr"
      + "[td[1][text()[normalize-space()='Reason:']]]/td[2]/mat-form-field//input");
  }

  public get deactivateReasonBtn(): Locator {
    return this.page.locator('//app-modal/div[@class="modal fade in"]'
      + '//div[@class="app-modal-footer"]/button[text()[normalize-space()="Deactivate"]]');
  }

  public get getReloadKitListBtn(): Locator {
    return this.page.getByRole('button', {name: 'Reload Kit List'});
  }
}
