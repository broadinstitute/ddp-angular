import { Locator, Page, expect } from '@playwright/test';
import Checkbox from 'dss/component/checkbox';

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

  public async isColumnVisible(columns: string[]): Promise<boolean> {
    for (const column of columns) {
      const customizeViewColumn = this.page.getByRole('button', { name: column});
      try {
        await expect(customizeViewColumn.first()).toBeVisible({timeout: 5000});
      } catch (err) {
        return false;
      }
    }
    return true;
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
