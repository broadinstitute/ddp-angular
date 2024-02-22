import {Locator, Page} from '@playwright/test';
import {Kit} from 'dsm/enums';
import Checkbox from 'dss/component/checkbox';

export class KitType {
  constructor(private readonly page: Page) {}

  public async selectKitType(kitType: Kit): Promise<void> {
    await this.kitTypeCheckbox(kitType).check();
  }

  /* Locators */
  public displayedKitType(kitType: Kit): Locator {
    return this.kitTypeCheckbox(kitType).toLocator();
  }

  /* XPaths */
  public kitTypeCheckbox(kitType: Kit): Checkbox {
    return new Checkbox(this.page, { label: kitType, root: 'app-root' });
  }
}
