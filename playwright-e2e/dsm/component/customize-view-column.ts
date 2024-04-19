import { Locator, Page } from '@playwright/test';
import { CustomizeView, CustomizeViewID, Label } from 'dsm/enums';

export default class ColumnGroup {
  private readonly page: Page;
  private locator: Locator;
  //Some column group names are broken apart by other html tags
  private columnGroupsUnableToUseExactName = [
    CustomizeView.BIRTH_PARENT_FEMALE,
    CustomizeView.BIRTH_PARENT_MALE,
  ];

  private exactLocator: Locator;
  private approximateLocator: Locator;

  constructor(page: Page, opts: { groupName: CustomizeView, stableID: CustomizeViewID }) {
    const { groupName, stableID} = opts;
    this.page = page;
    this.approximateLocator = this.page.locator(`//button[contains(.,"${groupName}")]/following-sibling::ul[@id='${stableID}']`);
    this.exactLocator = this.page.getByRole('button', { name: groupName, exact: true })
        .locator(`//following-sibling::ul[contains(@id, '${stableID}')]`);

    this.locator = this.columnGroupsUnableToUseExactName.includes(groupName) ? this.approximateLocator : this.exactLocator;
  }
}
