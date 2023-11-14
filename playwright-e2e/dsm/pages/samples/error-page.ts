import { expect, Locator, Page } from '@playwright/test';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { KitType } from 'dsm/component/kitType/kitType';
import { KitsTable } from 'dsm/component/tables/kits-table';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { KitsColumnsEnum } from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';

export enum SearchByField {
  SHORT_ID = 'Short ID',
  TRACKING_NUMBER = 'Tracking Number (Blood kit return)',
  MANUFACTURE_BARCODE = 'Manufacturer Barcode'
}

export default class ErrorPage {
  private readonly kitType: KitType;
  private readonly kitsTable: KitsTable;
  private expectedKitTypes: KitTypeEnum[];

  constructor(private readonly page: Page) {
    this.kitType = new KitType(this.page)
    this.kitsTable = new KitsTable(this.page);
    this.expectedKitTypes = [];
  }

  public async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1')).toHaveText('Kits with Error');
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      waitForNoSpinner(this.page)
    ]);
    this.expectedKitTypes = await this.getAvailableKitTypes();
    for (const kit of this.expectedKitTypes) {
      await Promise.all([
        expect(this.kitType.displayedKitType(kit)).toBeVisible()
      ]);
    }
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

  public async reloadKitList(): Promise<void> {
    await this.reloadKitListButton.click();
    await waitForNoSpinner(this.page);
  }

  public get kitListTable(): KitsTable {
    return this.kitsTable;
  }

  public async deactivateKitsFor(shortId: string, shippingId?: string) {
    if (shippingId) {
      await this.kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortId, { column2Name: 'Shipping ID', value2: shippingId });
    } else {
      await this.kitsTable.searchByColumn(KitsColumnsEnum.SHORT_ID, shortId);
    }
    await expect(this.kitsTable.rowLocator()).toHaveCount(1);

    const deactivateButton = this.kitsTable.deactivateButtons.nth(0);
    await deactivateButton.click();

    const deactivateReasonInput = this.page.locator(this.deactivateReasonInputXPath);
    const deactivateReasonButton = this.page.locator(this.deactivateReasonBtnXPath);

    await expect(deactivateReasonInput,
      'Kits Without Label page - Deactivate reason input field is not visible')
      .toBeVisible();

    await expect(deactivateReasonButton,
      'Kits Without Label page - Deactivate reason button is not visible')
      .toBeVisible();

    await deactivateReasonInput.fill(`test-deactivate-${new Date().getTime()}`);
    await deactivateReasonButton.click();

    await Promise.all([
      waitForResponse(this.page, { uri: '/deactivateKit' }),
      waitForResponse(this.page, { uri: '/kitRequests' })
    ]);
    await expect(this.kitsTable.rowLocator()).toHaveCount(0)
  }

  private get deactivateReasonInputXPath(): string {
    return "//app-modal/div[@class='modal fade in']//table/tr"
      + "[td[1][text()[normalize-space()='Reason:']]]/td[2]/mat-form-field//input";
  }

  private get deactivateReasonBtnXPath(): string {
    return "//app-modal/div[@class='modal fade in']"
      + "//div[@class='app-modal-footer']/button[text()[normalize-space()='Deactivate']]";
  }

  private async getAvailableKitTypes(): Promise<KitTypeEnum[]> {
    const studyNameLocation = this.page.locator(`//app-navigation//a[@data-toggle='dropdown']//i`);
    const studyName = await studyNameLocation.innerText();
    //Most studies have Blood and Saliva kits; RGP has Blood and 'Blood & RNA' kits; Pancan has Blood, Saliva, and Stool kits
    let kitTypes;
    switch (studyName) {
      case StudyEnum.RGP:
        kitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.BLOOD_AND_RNA];
        break;
      case StudyEnum.PANCAN:
        kitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.SALIVA, KitTypeEnum.STOOL];
        break;
      default:
        kitTypes = [KitTypeEnum.BLOOD, KitTypeEnum.SALIVA];
        break;
    }
    return kitTypes;
  }
}
