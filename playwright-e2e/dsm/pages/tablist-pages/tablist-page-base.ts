import { Locator, Page } from '@playwright/test';
import { Label } from 'dsm/enums';
import DsmPageBase from 'dsm/pages/dsm-page-base';

export default abstract class tablistPageBase extends DsmPageBase {
  constructor(page: Page) {
    super(page);
  }

  protected staticField(fieldLabel: Label): Locator {
    return this.rootLocator.locator(`xpath=//tr[not(.//input)][not(.//mat-checkbox)][td[text()[normalize-space()="${fieldLabel}"]]]/td[2]`);
  }

  protected dynamicField(fieldLabel?: Label): Locator {
    return fieldLabel
      ? this.rootLocator.locator(
          `xpath=//tr[.//textarea or .//input or .//mat-checkbox or .//mat-select][td[normalize-space()="${fieldLabel}"]]/td`)
      : this.rootLocator.locator(
          `xpath=//tr[.//textarea or .//input or .//mat-checkbox or .//mat-select]/td`);
  }
}
