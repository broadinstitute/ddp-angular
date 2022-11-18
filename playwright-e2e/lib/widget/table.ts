import { expect, Locator, Page } from '@playwright/test';
import _ from 'lodash';

export default class Table {
  private readonly page: Page;
  private readonly tableCss: string;
  private readonly headerCss: string;
  private readonly rowCss: string;
  private readonly cellCss: string;
  private readonly footerCss: string;

  constructor(page: Page, opts: { classAttribute?: string; ddpTestID?: string } = {}) {
    const { classAttribute, ddpTestID } = opts;
    this.page = page;
    // prettier-ignore
    this.tableCss = ddpTestID
      ? `mat-table[data-ddp-test="${ddpTestID}"], table[data-ddp-test="${ddpTestID}"]`
      : classAttribute
        ? `table${classAttribute}`
        : 'table, [role="table"]';
    this.headerCss = '[role="columnheader"], th[class]';
    this.rowCss = '[role="row"]:not(mat-header-row), tbody tr';
    this.cellCss = 'td, [role="cell"]';
    this.footerCss = 'tfoot tr';
  }

  async waitForReady() {
    await expect(this.page.locator(this.headerCss)).toBeVisible();
    // Add additional checks here
  }

  tableLocator(): Locator {
    return this.page.locator(this.tableCss);
  }

  rowLocator(): Locator {
    return this.tableLocator().locator(this.rowCss);
  }

  headerLocator(): Locator {
    return this.tableLocator().locator(this.headerCss);
  }

  /**
   *
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @returns {Locator}
   */
  cell(rowIndex: number, columnIndex: number): Locator {
    console.log('rowIndex: ', rowIndex, 'columnIndex: ', columnIndex)
    return this.rowLocator()
      .nth(rowIndex)
      .locator(this.cellCss)
      .nth(columnIndex);
  }

  async findCell(searchHeader: string, searchCellValue: string, resultHeader: string): Promise<Locator | null> {
    // Find the searchColumnHeader index
    await this.page.pause();
    const columnNames = await this.getHeaderNames();
    console.log('columnNames: ', columnNames)
    const columnIndex = columnNames.findIndex((text) => text === searchHeader);
    if (columnIndex === -1) {
      console.info(`Table column: ${searchHeader} not found.`);
      return null;
    }
    console.log('columnIndex: ', columnIndex)
    const resultColumnIndex = columnNames.findIndex((text) => text === resultHeader);
    if (resultColumnIndex === -1) {
      console.info(`Table column: ${resultHeader} not found.`);
      return null;
    }
    console.log('resultColumnIndex: ', resultColumnIndex)

    // Find the row which contains the searchCellValue
    console.log('this.rowLocator(): ', this.rowLocator())
    const allRows = await this.rowLocator().elementHandles();
    const allCellValues = await Promise.all(
      allRows.map(async (row) => {
        const cells = await row.$$(this.cellCss);
        return await cells[columnIndex].innerText();
      })
    );
    console.log(`allCellValues in columnIndex ${columnIndex}: `, allCellValues)
    const searchRowIndex = allCellValues.findIndex((cellValue) => cellValue === searchCellValue);
    if (searchRowIndex === -1) {
      console.info(`Table cell value: ${searchCellValue} not found.`);
      return null;
    }
    return this.cell(searchRowIndex, resultColumnIndex);
  }

  cellLocator(rowIndex: number, columnIndex: number): Locator {
    return this.page.locator(
      `${this.tableCss} [role="row"]:nth-child(${rowIndex}) [role="cell"]:nth-child(${columnIndex}), ` +
        `${this.tableCss} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`
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
  async getHeaderNames(): Promise<Array<string>> {
    const columns = await this.headerLocator().elementHandles();
    // const columns = await this.page.locator(this.headerCss).elementHandles();
    return await Promise.all(
      _.map(columns, async (column) => {
        return await column.innerText();
      })
    );
  }
}
