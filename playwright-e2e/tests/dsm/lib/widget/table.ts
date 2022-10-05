import { ElementHandle, expect, Locator, Page } from '@playwright/test';
import _ from 'lodash';

export default class Table {
  private readonly page: Page;
  private readonly tableCss: string;
  private readonly headerCss: string;
  private readonly rowCss: string;
  private readonly footerCss: string;

  constructor(page: Page) {
    this.page = page;
    this.tableCss = 'table.table';
    this.headerCss = `${this.tableCss} th[class]`;
    this.rowCss = `${this.tableCss} tbody tr`;
    this.footerCss = `${this.tableCss} tfoot tr`;
  }

  async waitForReady() {
    await expect(this.page.locator(this.tableCss)).toBeVisible();
    // Add additional checks here
  }

  async getAllColumns(): Promise<Array<ElementHandle>> {
    return await this.page.locator(this.headerCss).elementHandles();
  }

  getRows(): Locator {
    return this.page.locator(this.rowCss);
  }

  async getAllRows(): Promise<Array<ElementHandle>> {
    return await this.page.locator(this.rowCss).elementHandles();
  }

  getCellLocator(rowIndex: number, columnIndex: number): Locator {
    return this.page.locator(`${this.rowCss}:nth-child(${rowIndex}) td:nth-child(${columnIndex})`);
  }

  /**
   * In table, find the cell value in one column based on the cell value in another column.
   * Two table cells have to be in the same row.
   *
   * @param searchColumnHeader Column header: Search for cell value in this column. The row that contains this cell is
   *   used to find the other cell in resultColumnHeader
   * @param searchCellValue Cell value: Text to search for in searchColumnHeader
   * @param resultColumnHeader Column header: Find the cell in this column in the same row
   *
   * @returns Cell locator
   */
  async findCellByRowValue(
    searchColumnHeader: string,
    searchCellValue: string,
    resultColumnHeader: string
  ): Promise<Locator | null> {
    // Find the searchColumnHeader index
    const allColumns = await this.getAllColumns();
    const columnText = await Promise.all(allColumns.map((column) => column.innerText()));
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
    const allRows = await this.getAllRows();
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

    return this.getCellLocator(searchRowIndex + 1, resultColumnIndex + 1);
  }

  /**
   * Finds table column header names. Returns an array of string.
   * @returns {Array<string>}
   */
  async getColumnHeaderNames(): Promise<Array<string>> {
    const columns = await this.getAllColumns();
    return await Promise.all(
      _.map(columns, async (column) => {
        return await column.innerText();
      })
    );
  }
}
