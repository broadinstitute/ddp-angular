import { Locator, Page, expect } from '@playwright/test';
import { CustomizeView, CustomizeViewID, Label } from 'dsm/enums';

export default class ColumnGroup {
  private readonly page: Page;
  private rootLocator: Locator;
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

    this.rootLocator = this.columnGroupsUnableToUseExactName.includes(groupName) ? this.approximateLocator : this.exactLocator;
  }

  public getColumnOption(opts: { columnOption: Label, instance?: number }): Locator {
    const { columnOption, instance = 0 } = opts;
    const checkbox = this.rootLocator.locator('//mat-checkbox');
    const option = checkbox.getByText(columnOption, { exact: true }).nth(instance);
    return option;
  }

  public async assertColumnNameDisplayed(opts: { columnName: Label, nth?: number }): Promise<void> {
    const { columnName, nth = 0 } = opts;
    const column = this.getColumnOption({ columnOption: columnName, instance: nth });
    console.log(`Now checking: ${this.rootLocator} \t->\t ${column}`);
    await expect(column).toHaveCount(1);
    await column.scrollIntoViewIfNeeded();
    await expect(column).toBeVisible();
  }
}
