import { Locator, Page } from '@playwright/test';
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
    const checked = await checkbox.isChecked();
    if (deselect) {
      if (checked) {
        return checkbox.check();
      }
      return;
    }
    if (!checked) {
      return checkbox.check();
    }
  }

  private async openColumnsGroup(opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    const columnsGroupButton = this.columnsGroupButton({nth});
    !(await this.isExpanded(columnsGroupButton)) && (await columnsGroupButton.locator('.//*[@class="caret"]').click());
  }

  private async closeColumnsGroup(opts: { nth?: number } = {}): Promise<void> {
    const { nth } = opts;
    const columnsGroupButton = this.columnsGroupButton({nth});
    (await this.isExpanded(columnsGroupButton)) && (await columnsGroupButton.locator('.//*[@class="caret"]').click());
  }

  private async isExpanded(locator: Locator): Promise<boolean> {
    const isExpanded = await locator.getAttribute('aria-expanded');
    return isExpanded ? isExpanded === 'true' : false;
  }

  /* Locators */

  private columnsGroupButton(opts: { nth?: number } = {}): Locator {
    const { nth = 0 } = opts;
    return this.page.locator(`${this.columnsGroupXPath}/button`).nth(nth);
  }

  /* XPaths */
  private get openButtonXPath(): string {
    return `//*[text()[normalize-space()="Customize View"]]/button`;
  }

  private async isPanelOpen(): Promise<boolean> {
    const attr = await this.page.locator(this.columnsGroupXPath).getAttribute('class');
    return attr ? attr.indexOf('open') !== -1 : false;
  }

  private get columnsGroupXPath(): string {
    return `//div[button[@data-toggle="dropdown" and normalize-space()="${this.activeColumnsGroup}"]]`;
  }

  private columnCheckbox(columnName: string): Checkbox {
    return new Checkbox(this.page, { root: this.columnsGroupXPath, label: columnName })
    // return `/ul[@class="dropdown-menu"]//mat-checkbox[label[.//*[text()[normalize-space()="${columnName}"]]]]`;
  }
}
