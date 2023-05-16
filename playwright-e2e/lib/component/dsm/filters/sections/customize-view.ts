import { Locator, Page } from '@playwright/test';

export class CustomizeView {
  private activeColumnsGroup = '';
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.locator(this.openButtonXPath).click();
  }

  public async selectColumns(columnsGroupName: string, columns: string[]): Promise<void> {
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup();
    await this.select(columns);
    await this.closeColumnsGroup();
  }

  public async deselectColumns(columnsGroupName: string, columns: string[]): Promise<void> {
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup();
    await this.select(columns, true);
    await this.closeColumnsGroup();
  }

  private async select(columns: string[], deselect = false): Promise<void> {
    for (const column of columns) { await this.selectOrDeselect(column, deselect); }
  }

  private async selectOrDeselect(columnName: string, deselect = false): Promise<void> {
    const columnXPath = this.columnsGroupXPath + this.columnPathXPath(columnName);
    const column = this.page.locator(columnXPath);

    if(!deselect) {
      if(!(await this.isChecked(column))) {
        await this.page.locator(columnXPath).click()
      }
    } else {
      if(await this.isChecked(column)) {
        await this.page.locator(columnXPath).click()
      }
    }
  }

  private async openColumnsGroup(): Promise<void> {
    const columnsGroupButton = this.columnsGroupButton;
    !(await this.isExpanded(columnsGroupButton)) && (await columnsGroupButton.click());
  }

  private async closeColumnsGroup(): Promise<void> {
    const columnsGroupButton = this.columnsGroupButton;
    (await this.isExpanded(columnsGroupButton)) && (await columnsGroupButton.click());
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

  private get columnsGroupButton(): Locator {
    return this.page.locator(`${this.columnsGroupXPath}/button`);
  }

  /* XPaths */
  private get openButtonXPath(): string {
    return (
      "//div[text()[normalize-space()='Customize View'] and " +
      "button[.//*[local-name()='svg' and @data-icon='server']/*[local-name()='path']]]/button"
    );
  }

  private get columnsGroupXPath(): string {
    return `//div[button[@data-toggle='dropdown'] and button[.//*[text()[normalize-space()='${this.activeColumnsGroup}']]]]`;
  }

  private columnPathXPath(columnName: string): string {
    return `/ul/li/mat-checkbox[label[.//*[text()[normalize-space()='${columnName}']]]]`;
  }
}
