import { Locator, Page, expect } from '@playwright/test';
import { StudyName } from 'dsm/navigation';
import Checkbox from 'dss/component/checkbox';
import { CustomizeView as ColumnGroup, CustomizeViewID, Label } from 'dsm/enums';
import { COLUMN } from 'dsm/pages/mailing-list-page';

export class CustomizeView {
  private activeColumnsGroup = '';
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    const isOpen = await this.isPanelOpen();
    if (!isOpen) {
      await this.page.locator(this.openButtonXPath).click();
    }
  }

  public async close(): Promise<void> {
    const isOpen = await this.isPanelOpen();
    if (isOpen) {
      await this.page.locator(this.openButtonXPath).click();
    }
  }

  public async selectColumns(columnsGroupName: string, columns: string[], opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup({nth});
    await this.select(columns);
    await this.closeColumnsGroup();
  }

  public async selectColumnsByID(columnsGroupName: string, columns: string[], id: string, opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup({nth});
    for (const column of columns) {
      const columnOption = this.page.locator(`//ul[@id='${id}']//mat-checkbox[contains(.,'${column}')]`);
      await columnOption.scrollIntoViewIfNeeded();
      await columnOption.click({ force: true });
    }
    await this.closeColumnsGroup();
  }

  public async deselectColumns(columnsGroupName: string, columns: string[], opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup({nth});
    await this.select(columns, true);
    await this.closeColumnsGroup();
  }

  private async select(columns: string[], deselect = false): Promise<void> {
    for (const column of columns) { await this.selectOrDeselect(column, deselect); }
  }

  private async selectOrDeselect(columnName: string, deselect = false): Promise<void> {
    const checkbox = this.columnCheckbox(columnName);
    deselect ? await checkbox.uncheck() : await checkbox.check();
  }

  private async openColumnsGroup(opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    const columnsGroupButton = this.columnsGroupButton({nth});
    const expanded = await this.isExpanded(columnsGroupButton);
    if (!expanded) {
      await columnsGroupButton.focus();
      await columnsGroupButton.click();
    }
  }

  private async closeColumnsGroup(opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    const columnsGroupButton = this.columnsGroupButton({nth});
    const expanded = await this.isExpanded(columnsGroupButton);
    if (expanded) {
      await columnsGroupButton.focus();
      await columnsGroupButton.click();
    }
  }

  public async isColumnVisible(columns: string[] | ColumnGroup[]): Promise<boolean> {
    for (const column of columns) {
      console.log(`Checking for column group: ${column}`);
      const customizeViewColumn = this.page.getByRole('button', { name: column});
      try {
        await expect(customizeViewColumn.first()).toBeVisible({timeout: 5000});
      } catch (err) {
        return false;
      }
    }
    return true;
  }

  public getColumnOption(opts: { columnGroupName: ColumnGroup, groupId: CustomizeViewID, columnOption: Label }): Locator {
    const {columnGroupName, groupId, columnOption} = opts;
    const option = this.page.locator(
      `//button[.//text()[normalize-space()='${columnGroupName}']]` +
      `/following-sibling::ul[contains(@id, '${groupId}')]` +
      `//mat-checkbox[.//text()[normalize-space()='${columnOption}']]`
    );
    return option;
  }

  public async openColumnGroup(opts: { columnSection: ColumnGroup, stableID: CustomizeViewID }): Promise<void> {
    const { columnSection, stableID } = opts; //use stable id to reduce the need for using nth
    const button = this.page.locator(`//ul[@id='${stableID}']/preceding-sibling::button[.//text()[normalize-space()='${columnSection}']]`);
    await expect(button).toBeVisible();
    const isOpen = await this.dropdownOptionsDisplayed(button);
    if (!isOpen) {
      await button.click();
    }
  }

  public async closeColumnGroup(opts: { columnSection: ColumnGroup, stableID: CustomizeViewID }): Promise<void> {
    const { columnSection, stableID } = opts; //use stable id to reduce the need for using nth
    const button = this.page.locator(`//ul[@id='${stableID}']/preceding-sibling::button[.//text()[normalize-space()='${columnSection}']]`);
    await expect(button).toBeVisible();
    const isOpen = await this.dropdownOptionsDisplayed(button);
    if (isOpen) {
      await button.click();
    }
  }

  private async dropdownOptionsDisplayed(button: Locator): Promise<boolean> {
    const dropdownOptions = button.locator(`//following-sibling::ul`);
    return dropdownOptions.isVisible();
  }

  public async assertColumnOptionDisplayed(columnSection: ColumnGroup, stableID: CustomizeViewID, columnName: Label): Promise<void> {
    const option = this.getColumnOption({ columnGroupName: columnSection, groupId: stableID, columnOption: columnName});
    console.log(`Checking for ${columnSection} \t->\t ${columnName}`);
    await expect(option).toHaveCount(1);
    await expect(option).toBeVisible();
  }

  private async isChecked(locator: Locator | undefined): Promise<boolean> {
    const isChecked = (await locator?.getAttribute('class'))?.includes('mat-checkbox-checked');
    return isChecked || false;
  }

  private async isExpanded(locator: Locator | undefined): Promise<boolean> {
    const isExpanded = await locator?.getAttribute('aria-expanded');
    return isExpanded === 'true' || false;
  }

  /* Locators */

  private columnsGroupButton(opts: { nth?: number } = {}): Locator {
    const { nth = 0 } = opts;
    return this.page.locator(`${this.columnsGroupXPath}/button`).nth(nth);
  }

  /* XPaths */
  private get openButtonXPath(): string {
    return `xpath=//*[text()[normalize-space()="Customize View"]]/button`;
  }

  private async isPanelOpen(): Promise<boolean> {
    return await this.page.locator('.btn-group').count() >= 1;
  }

  private get columnsGroupXPath(): string {
    return `xpath=//div[button[@data-toggle="dropdown" and normalize-space()="${this.activeColumnsGroup}"]]`
  }

  private columnCheckbox(columnName: string): Checkbox {
    return new Checkbox(this.page, { root: this.columnsGroupXPath, label: columnName, exactMatch: true });
  }
}
