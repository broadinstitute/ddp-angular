import { Page, expect } from '@playwright/test';
import DsmPageBase from './dsm-page-base';
import { KitsTable } from 'dsm/component/tables/kits-table';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import Checkbox from 'dss/component/checkbox';
import { waitForNoSpinner } from 'utils/test-utils';

export default abstract class KitPageBase extends DsmPageBase {
  protected abstract defaultKitTypes: KitTypeEnum[];
  private readonly kitsQueueTable = new KitsTable(this.page);

  constructor(readonly page: Page) {
    super(page);
  }

  public get kitsTable(): KitsTable {
    return this.kitsQueueTable;
  }

  public async waitForReady(kitTypes?: KitTypeEnum[]): Promise<void> {
    const knownKitTypes = kitTypes ?? this.defaultKitTypes;
    await Promise.all([
      this.page.waitForLoadState(),
      expect(this.page.locator('h1')).toHaveText('Kit Queue')
    ]);
    await expect(async () => expect(await this.page.locator('mat-checkbox[id]').count()).toBeGreaterThanOrEqual(1)).toPass({ timeout: 60000 });
    await this.assertDisplayedKitTypes(knownKitTypes);
    await waitForNoSpinner(this.page);
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    for (const kitType of kitTypes) {
      await expect(this.getKitCheckbox(kitType).toLocator()).toBeVisible();
    }
  }

  public getKitCheckbox(buttonLabel: KitTypeEnum): Checkbox {
    return new Checkbox(this.page, { label: buttonLabel });
  }

  public async selectKitType(buttonLabel: KitTypeEnum): Promise<void> {
    await this.getKitCheckbox(buttonLabel).check();
  }
}
