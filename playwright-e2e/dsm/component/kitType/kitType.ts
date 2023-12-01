import {Locator, Page} from '@playwright/test';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import Checkbox from 'dss/component/checkbox';

export class KitType {
  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: KitTypeEnum): Promise<void> {
    await this.kitTypeCheckbox(kitType).check();
  }

  /* Locators */
  public displayedKitType(kitType: KitTypeEnum): Locator {
    return this.kitTypeCheckbox(kitType).toLocator();
  }

  /* XPaths */
  public kitTypeCheckbox(kitType: KitTypeEnum): Checkbox {
    return new Checkbox(this.page, { label: kitType, root: 'app-root' });
  }
}
