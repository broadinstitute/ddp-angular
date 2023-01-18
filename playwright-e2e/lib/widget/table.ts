import { expect, Locator, Page } from '@playwright/test';
import _ from 'lodash';

export default class Table {
  private readonly page: Page;
  private readonly tableCss: string;
  private readonly headerCss: string;
  private readonly rowCss: string;
  private readonly cellCss: string;
  private readonly footerCss: string;

  constructor(page: Page, opts: { cssClassAttribute?: string; ddpTestID?: string } = {}) {
    const { cssClassAttribute, ddpTestID } = opts;
    this.page = page;
    // prettier-ignore
    this.tableCss = ddpTestID
        ? `[data-ddp-test="${ddpTestID}"]`
        : cssClassAttribute
            ? `table${cssClassAttribute}, mat-table${cssClassAttribute}`
            : 'table, mat-table, [role="table"]';
    this.headerCss = '[role="columnheader"], th[class]';
    this.rowCss = '[role="row"]:not(mat-header-row), tbody tr';
    this.cellCss = 'td, [role="cell"]';
    this.footerCss = 'tfoot tr';
  }

  async waitForReady() {
    await expect(this.tableLocator().locator(this.headerCss).first()).toBeVisible();
    expect(await this.rowLocator().count()).toBeGreaterThanOrEqual(1);
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
    return this.rowLocator().nth(rowIndex).locator(this.cellCss).nth(columnIndex);
  }

  /**
   * In table, find the cell value in one column based on the cell value in another column.
   * Two cells have to be in the same row.
   *
   * @param searchHeader Column header: Search for cell value in this column. The row that contains this cell is
   *   used to find the other cell in resultColumnHeader
   * @param searchCellValue Cell value: Cell text to search for in searchColumnHeader
   * @param resultHeader Column header: Find the cell in this column in the same row
   *
   * @returns Cell locator
   */
  async findCell(searchHeader: string, searchCellValue: string, resultHeader: string): Promise<Locator | null> {
    // Find the searchColumnHeader index
    const columnNames = await this.getHeaderNames();
    const columnIndex = columnNames.findIndex((text) => text === searchHeader);
    if (columnIndex === -1) {
      return null;
    }
    const resultColumnIndex = columnNames.findIndex((text) => text === resultHeader);
    if (resultColumnIndex === -1) {
      return null;
    }

    // Find the row which contains the searchCellValue
    const allRows = await this.rowLocator().elementHandles();
    const allCellValues = await Promise.all(
      allRows.map(async (row) => {
        const cells = await row.$$(this.cellCss);
        return await cells[columnIndex].innerText();
      })
    );
    const searchRowIndex = allCellValues.findIndex((cellValue) => cellValue === searchCellValue);
    if (searchRowIndex === -1) {
      return null;
    }
    return this.cell(searchRowIndex, resultColumnIndex);
  }

  /**
   * Finds table column header names. Returns an array of string.
   * @returns {Array<string>}
   */
  async getHeaderNames(): Promise<Array<string>> {
    const columns = await this.headerLocator().elementHandles();
    return await Promise.all(
      _.map(columns, async (column) => {
        return await column.innerText();
      })
    );
  }
}
