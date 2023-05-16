import {expect, Locator, Page} from '@playwright/test';
import {KitsColumnsEnum} from 'pages/dsm/kitsInfo-pages/enums/kitsColumns-enum';


export class KitsTable {
  constructor(private readonly page: Page) {}

  public async searchBy(columnName: KitsColumnsEnum, value: string): Promise<void> {
    const column = this.column(columnName);
    const searchInputHeader = this.searchHeader(columnName);

    await expect(column, `Kits Table - the column ${columnName} doesn't exist`)
      .toBeVisible();
    await expect(searchInputHeader, `Kits Table - you can't search by ${columnName} column`)
      .toBeVisible();

    await searchInputHeader.fill(value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    const column = this.column(columnName);
    await expect(column, `Kits Table - the column ${columnName} doesn't exist`)
      .toBeVisible();

    const td = await this.td(columnName);
    await expect(td, 'Kits Table - more than one data was found').toHaveCount(1);

    return await td.textContent() || '';
  }

  public async getHeaderTexts(): Promise<string[]> {
    const headers = await this.header.locator('th');
    const headersCount = await headers.count();
    const actualHeadersTexts = [];
    for (let i = 0; i < headersCount; i++) {
      const headerText = await headers.nth(i).innerText();
      actualHeadersTexts.push(headerText.trim());
    }
    return actualHeadersTexts;
  }

  /* Locators */
  public searchHeader(columnName: KitsColumnsEnum): Locator {
    return this.page.locator(this.searchByXPath(columnName));
  }

  public column(columnName: KitsColumnsEnum): Locator {
    return this.page.locator(this.columnXPath(columnName));
  }

  public td(columnName: KitsColumnsEnum): Locator {
    return this.page.locator(this.tdXPath(columnName));
  }

  public get deactivateButtons(): Locator {
    return this.page.locator(this.deactivateButtonXPath);
  }

  public get rows(): Locator {
    return this.page.locator(this.rowsXPath);
  }

  public get header(): Locator {
    return this.page.locator(this.headerXPath);
  }

  /* XPaths */
  private searchByXPath(columnName: KitsColumnsEnum): string {
    return `(//table/thead/tr[2]/th)[${this.columnPositionXPath(columnName)}]/input`;
  }

  private tdXPath(columnName: KitsColumnsEnum): string {
    return `//table/tbody//td[position()=${this.columnPositionXPath(columnName)}]`;
  }

  private columnPositionXPath(columnName: KitsColumnsEnum): string {
    return `count(${this.columnXPath(columnName)}/preceding-sibling::th)+1`;
  }

  private columnXPath(columnName: KitsColumnsEnum): string {
    return `${this.headerXPath}/th[descendant-or-self::*[text()[normalize-space()='${columnName}']]]`;
  }

  private get deactivateButtonXPath(): string {
    return `${this.rowsXPath}/td[button[@type='button'][text()[normalize-space()='Deactivate']]]/button`;
  }

  private get rowsXPath(): string {
    return `//table/tbody/tr`;
  }

  private get headerXPath(): string {
    return '//table/thead/tr[1]'
  }
}
