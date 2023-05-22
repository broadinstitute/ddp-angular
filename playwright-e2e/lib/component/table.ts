import { expect, Locator, Page } from '@playwright/test';
import Button from 'lib/widget/button';
import { waitForNoSpinner } from 'utils/test-utils';

export enum SortOrder {
  DESC = 'desc',
  ASC = 'asc'
}

export default class Table {
  private readonly tableCss: string;
  private readonly headerCss: string;
  private readonly rowCss: string;
  private readonly cellCss: string;
  private readonly footerCss: string;
  private readonly nth: number;

  constructor(protected readonly page: Page, opts: { cssClassAttribute?: string; ddpTestID?: string; nth?: number } = {}) {
    const { cssClassAttribute, ddpTestID, nth = 0 } = opts;
    this.nth = nth;
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

  footerLocator(): Locator {
    return this.tableLocator().locator(this.footerCss);
  }

  /**
   *
   * @param {number} rowIndex 0-index
   * @param {number} columnIndex 0-index
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

    // Find the search column header index
    const columnNames = await this.getHeaderNames();
    const columnIndex = await this.getHeaderIndex(searchHeader, { exactMatch });
    if (columnIndex === -1) {
      return null; // Not found
    }

    // Find the result column header index
    const resultColumnIndex = await this.getHeaderIndex(resultHeader, { exactMatch });
    if (resultColumnIndex === -1) {
      return null; // Not found
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
   * Returns an array of string in a row
   * @param {number} row 0-indexed. 0 selects first row.
   * @returns {Promise<void>}
   */
  async getRowValues(row = 0): Promise<Array<string>> {
    return this.rowLocator().nth(row).allInnerTexts();
  }

  /**
   * Finds table column header names. Returns an array of string.
   * @returns {Array<string>}
   */
  async getHeaderNames(): Promise<Array<string>> {
    return this.headerLocator().allInnerTexts();
    /*
    const columns = await this.headerLocator().elementHandles();
    return await Promise.all(
      _.map(columns, async (column) => {
        return await column.innerText();
      })
    ); */
  }

  async getHeaderIndex(name: string, opts: { exactMatch?: boolean } = {}): Promise<number> {
    const { exactMatch = true } = opts;
    const allColumnNames = await this.getHeaderNames();
    return allColumnNames.findIndex((text: string) => exactMatch ? text === name : text.includes(name));
  }

  getHeaderByName(name: RegExp | string): Locator {
    return this.headerLocator().filter({hasText: name});
  }

  async getHeadersCount(): Promise<number> {
    return this.headerLocator().count();
  }

  async getRowsCount(): Promise<number> {
    return this.rowLocator().count();
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
    const header = this.getHeaderByName(RegExp(column));
    await header.click();
    let ariaLabel = await header.locator('span').last().getAttribute('aria-label');
    if (ariaLabel) {
      if (ariaLabel !== order) {
        await header.locator('a').click();
      }
      await waitForNoSpinner(this.page);
      await expect(header.locator('span')).toHaveAttribute('aria-label', order);
    } else {
      let icon;
      switch (order) {
        case SortOrder.DESC:
          icon = 'sort-alpha-down';
          break;
        case SortOrder.ASC:
          icon = 'sort-alpha-up';
          break;
      }
      ariaLabel = await header.locator('svg[data-icon]').getAttribute('data-icon');
      if (ariaLabel !== icon) {
        await header.locator('svg[data-icon]').click();
      }
      await waitForNoSpinner(this.page);
      await expect(header.locator('svg[data-icon]')).toHaveAttribute('data-icon', icon);
    }
  }

  async getTableRowsTotal(searchString: RegExp | string): Promise<number | null> {
    const footer = await this.footerLocator().locator('td', { hasText: searchString }).innerText();
    return this.parseForNumber(footer);
  }

  /**
   * Returns a random row index
   * @returns {Promise<number>}
   */
  async getRandomRowIndex(): Promise<number> {
    const rowsCount = await this.getRowsCount();
    return Math.floor(Math.random() * rowsCount);
  }

  private parseForNumber(text: string): number | null {
    const numericalStr = text.match(/(\d|\.)+/g);
    if (numericalStr) {
      return parseInt(numericalStr[0]);
    }
    return null;
  }
}
