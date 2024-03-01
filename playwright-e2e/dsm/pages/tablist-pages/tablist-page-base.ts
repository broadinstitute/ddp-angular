import { Locator, Page } from '@playwright/test';
import { Label } from 'dsm/enums';
import DsmPageBase from 'dsm/pages/dsm-page-base';

export default abstract class tablistPageBase extends DsmPageBase {
  constructor(page: Page) {
    super(page);
  }

  protected staticField(infoFieldName: Label): Locator {
    return this.rootLocator.locator(`xpath=//tr[not(.//input)][not(.//mat-checkbox)][td[text()[normalize-space()="${infoFieldName}"]]]/td[2]`);
  }

  protected dynamicField(infoFieldName?: Label): Locator {
    return infoFieldName
      ? this.rootLocator.locator(`xpath=//tr[.//textarea or .//input or .//mat-checkbox][td[normalize-space()="${infoFieldName}"]]/td`)
      : this.rootLocator.locator(`xpath=//tr[.//textarea or .//input or .//mat-checkbox]/td`);
  }
}
