import {Locator, Page} from "@playwright/test";

export class CustomizeView {
  private activeColumnsGroup: string = '';
  constructor(private readonly page: Page) {};

  public async open(): Promise<void> {
    await this.page.locator(this.openButtonXPath).click();
  }

  public async selectColumns(columnsGroupName: string, columns: string[]): Promise<void> {
    this.activeColumnsGroup = columnsGroupName;
    await this.openColumnsGroup();
    for(let column of columns) {
      await this.selectColumn(column);
    }
    await this.closeColumnsGroup();
  }

  private async selectColumn(columnName: string): Promise<void> {
    const columnXPath = this.columnsGroupXPath + this.columnPathXPath(columnName);
    const column = this.locator(columnXPath);

    !await this.isChecked(column) && await this.locator(columnXPath).click();
  }


  private async openColumnsGroup(): Promise<void> {
    const columnsGroupButton = this.columnsGroupButton;
    !await this.isExpanded(columnsGroupButton) && await columnsGroupButton.click();
  }

  private async closeColumnsGroup(): Promise<void> {
    const columnsGroupButton = this.columnsGroupButton;
    await this.isExpanded(columnsGroupButton) && await columnsGroupButton.click();
  }

  private get columnsGroupButton(): Locator {
    return this.locator(`${this.columnsGroupXPath}/button`);
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

  private locator(XPath: string): Locator {
    return this.page.locator(XPath);
  }
  /* XPaths */
  private get openButtonXPath(): string {
    return `//div[text()[normalize-space()='Customize View'] and button[.//*[local-name()='svg' and @data-icon='server']/*[local-name()='path']]]/button`
  }

  private get columnsGroupXPath(): string {
    return `//div[button[@data-toggle='dropdown'] and button[text()[normalize-space()='${this.activeColumnsGroup}']]]`;
  }

  private columnPathXPath(columnName: string): string {
    return `/ul/li/mat-checkbox[label[*[text()[normalize-space()='${columnName}']]]]`
  }
}
