import { expect, Locator, Page } from '@playwright/test';
import _ from 'lodash';

export default class Table {
  private readonly page: Page;
  private readonly tableCss: string;
  private readonly headerCss: string;
  private readonly rowCss: string;
  private readonly footerCss: string;

  constructor(page: Page, opts: { classAttribute?: string; ddpTestID?: string } = {}) {
    const { classAttribute, ddpTestID } = opts;
    this.page = page;
    // prettier-ignore
    this.tableCss = ddpTestID
      ? `mat-table[data-ddp-test="${ddpTestID}"], table[data-ddp-test="${ddpTestID}"]`
      : classAttribute
        ? `table${classAttribute}`
        : 'table';
    this.headerCss = `${this.tableCss} [role="columnheader"], ${this.tableCss} th[class]`;
    this.rowCss = `${this.tableCss} tbody [role="row"], ${this.tableCss} tbody tr`;
    this.footerCss = `${this.tableCss} tfoot tr`;
  }

  async waitForReady() {
    await expect(this.page.locator(this.headerCss)).toBeVisible();
    // Add additional checks here
  }

  tableLocator(): Locator {
    return this.page.locator(this.tableCss);
  }

  rowLocator(): Locator {
    return this.page.locator(this.rowCss);
  }

  headerLocator(): Locator {
    return this.page.locator(this.headerCss);
  }

  cellLocator(rowIndex: number, columnIndex: number): Locator {
    return this.page.locator(
      `${this.tableCss} tbody [role="row"]:nth-child(${rowIndex}) [role="cell"]:nth-child(${columnIndex}), ` +
        `${this.tableCss} tbody tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`
    );
  }

  /**
   * In table, find the cell value in one column based on the cell value in another column.
   * Two table cells have to be in the same row.
   *
   * @param searchColumnHeader Column header: Search for cell value in this column. The row that contains this cell is
   *   used to find the other cell in resultColumnHeader
   * @param searchCellValue Cell value: Cell text to search for in searchColumnHeader
   * @param resultColumnHeader Column header: Find the cell in this column in the same row
   *
   * @returns Cell locator
   */
  async findCellLocator(
    searchColumnHeader: string,
    searchCellValue: string,
    resultColumnHeader: string
  ): Promise<Locator | null> {
    // Find the searchColumnHeader index
    const columns = await this.page.locator(this.headerCss).elementHandles();
    const columnText = await Promise.all(columns.map((column) => column.innerText()));
    const columnIndex = columnText.findIndex((text) => text === searchColumnHeader);

    const resultColumnIndex = columnText.findIndex((text) => text === resultColumnHeader);
    if (columnIndex === -1) {
      console.info(`Table column: ${searchColumnHeader} not found.`);
      return null;
    }
    if (resultColumnIndex === -1) {
      console.info(`Table column: ${resultColumnHeader} not found.`);
      return null;
    }

    // Find the row which contains the searchCellValue
    const allRows = await this.page.locator(this.rowCss).elementHandles();
    const searchColumnTdValues = await Promise.all(
      allRows.map(async (row) => {
        const cells = await row.$$('[role="cell"]');
        return await cells[columnIndex].innerText();
      })
    );
    const searchRowIndex = searchColumnTdValues.findIndex((cellValue) => cellValue === searchCellValue);
    if (searchRowIndex === -1) {
      console.info(`Table cell value: ${searchCellValue} not found.`);
      return null;
    }

    return this.cellLocator(searchRowIndex + 1, resultColumnIndex + 1);
  }

  /**
   * Finds table column header names. Returns an array of string.
   * @returns {Array<string>}
   */
  async getColumnNames(): Promise<Array<string>> {
    const columns = await this.page.locator(this.headerCss).elementHandles();
    return await Promise.all(
      _.map(columns, async (column) => {
        return await column.innerText();
      })
    );
  }
}
