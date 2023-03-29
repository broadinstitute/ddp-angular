import { expect, Locator, Page } from '@playwright/test';
import Button from 'lib/widget/button';
import _ from 'lodash';

export enum SortOrder {
 DESC = 'desc',
  ASC = 'asc'
}

export default class Table {
  private readonly page: Page;
  private readonly tableCss: string;
  private readonly headerCss: string;
  private readonly rowCss: string;
  private readonly cellCss: string;
  private readonly footerCss: string;
  private readonly nth: number;

  constructor(page: Page, opts: { cssClassAttribute?: string; ddpTestID?: string; nth?: number } = {}) {
    const { cssClassAttribute, ddpTestID, nth = 0 } = opts;
    this.page = page;
    this.nth = nth;
    // prettier-ignore
    this.tableCss = ddpTestID
        ? `[data-ddp-test="${ddpTestID}"]`
        : cssClassAttribute
            ? `table${cssClassAttribute}, mat-table${cssClassAttribute}`
            : 'table, mat-table, [role="table"]';
    this.headerCss = 'th, [role="columnheader"]';
    this.rowCss = '[role="row"]:not([mat-header-row]):not(mat-header-row), tbody tr';
    this.cellCss = '[role="cell"], td';
    this.footerCss = 'tfoot tr';
  }

  async waitForReady() {
    await expect(this.tableLocator().locator(this.headerCss).first()).toBeVisible();
    expect(await this.rowLocator().count()).toBeGreaterThanOrEqual(1);
  }

  tableLocator(): Locator {
    return this.page.locator(this.tableCss).nth(this.nth);
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
   * @param opts
   * @returns Cell locator
   */
  async findCell(searchHeader: string, searchCellValue: string, resultHeader: string, opts: { exactMatch?: boolean} = {}): Promise<Locator | null> {
    const { exactMatch = true } = opts;

    // Find the searchColumnHeader index
    const columnNames = await this.getHeaderNames();
    const columnIndex = columnNames.findIndex((text) => text === searchHeader);
    console.log('columnIndex', columnIndex)
    if (columnIndex === -1) {
      return null;
    }
    const resultColumnIndex = columnNames.findIndex((text: string) => exactMatch ? text === resultHeader : text.includes(resultHeader));
    console.log('resultColumnIndex', resultColumnIndex)
    if (resultColumnIndex === -1) {
      return null;
    }

    // Find the row which contains the searchCellValue
    const allRows = await this.rowLocator().elementHandles();
    console.log('allRows size', allRows.length)
    const allCellValues = await Promise.all(
      allRows.map(async (row) => {
        const cells = await row.$$(this.cellCss);
        return await cells[columnIndex].innerText();
      })
    );
    console.log('allCellValues',allCellValues)
    const searchRowIndex = allCellValues.findIndex((cellValue) => cellValue === searchCellValue);
    console.log('searchRowIndex',searchRowIndex)
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

  getHeaderByName(name: string): Locator {
    return this.headerLocator().filter({hasText: name});
  }

  /**
   * Find a button in a cell
   */
  findButtonInCell(cellLocator: Locator, opts: { label?: string }): Button {
    const { label } = opts;
    return new Button(this.page, { root: cellLocator, label });
  }

  async show(): Promise<void> {
    await this.tableLocator()
      .locator('xpath=/ancestor::mat-expansion-panel')
      .locator('mat-icon', { hasText: /expand_more/ })
      .click();
  }

  async hide(): Promise<void> {
    await this.tableLocator()
      .locator('xpath=/ancestor::mat-expansion-panel')
      .locator('mat-icon', { hasText: /expand_less/ })
      .click();
  }

  async sort(column: string, order: SortOrder): Promise<void> {
    const header = await this.getHeaderByName(column);
    await header.locator('a').click();
    const ariaLabel = await header.locator('span').getAttribute('aria-label')
    if (ariaLabel !== order) {
      await header.locator('a').click();
    }
    await expect(header.locator('span')).toHaveAttribute('aria-label', order);
  }
}
