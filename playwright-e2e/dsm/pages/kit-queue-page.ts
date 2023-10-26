import { Page, expect } from '@playwright/test';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { KitType } from 'dsm/component/kitType/kitType';
import { KitsTable } from 'dsm/component/tables/kits-table';
import { waitForNoSpinner } from 'utils/test-utils';

export default class KitQueuePage {
  private readonly defaultKitTypes = [KitTypeEnum.SALIVA, KitTypeEnum.BLOOD];

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page) {}

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
      await expect(this.kitType.displayedKitType(kitType)).toBeVisible()
    }
  }
}
