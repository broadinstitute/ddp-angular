import {expect, Page} from '@playwright/test';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {rows} from './types/rowsPerPage';

export class ParticipantsListPaginator {
  constructor(private readonly page: Page) {}

  public async rowsPerPage(rows: rows): Promise<void> {
    const rowsPerPageLocator = this.page.locator(this.rowsPerPageXPath(rows));
    await expect(rowsPerPageLocator, `The row - ${rows} is not visible`).toBeVisible();
    await rowsPerPageLocator.click();
    await this.waitForReady();
  }

  public async pageAt(page: number): Promise<void> {
    await this.paginateAt(page);
  }

  public async next(): Promise<void> {
    await this.paginate(this.nextXPath);
  }

  public async previous(): Promise<void> {
    await this.paginate(this.previousXPath);
  }

  public async hasNext(): Promise<boolean> {
    const nextLocator = this.page.locator(this.nextXPath);
    const isVisible = await nextLocator.isVisible();
    return isVisible ? !!(await nextLocator.getAttribute('class'))?.includes('disabled') : false;
  }

  private async paginate(xpath: string): Promise<void> {
    const paginatorLocator = this.page.locator(xpath);
    const isDisabled = (await paginatorLocator.getAttribute('class'))?.includes('disabled');
    if (!isDisabled) {
      await paginatorLocator.click();
      await this.waitForReady();
    }
  }

  private async paginateAt(page: number): Promise<void> {
    const pageLocator = this.page.locator(this.pageAtXPath(page));
    await expect(pageLocator, `The page - ${page} is not visible`).toBeVisible();
    await pageLocator.click();
    await this.waitForReady();
  }

  private async waitForReady(): Promise<void> {
    await waitForResponse(this.page, {uri: 'filterList'});
    await waitForNoSpinner(this.page);
  }

  /* XPaths */
  private pageAtXPath(page: number): string {
    return `${this.paginatorXPath}[a[span[2][text()[normalize-space()='${page}']]]]`
  }

  private get previousXPath(): string {
    return `${this.paginatorXPath}[*[text()[normalize-space()='Previous']]]`
  }

  private get nextXPath(): string {
    return `${this.paginatorXPath}[*[text()[normalize-space()='Next']]]`
  }

  private get paginatorXPath(): string {
    return '//tfoot/tr[1]/td[1]/pagination-controls/pagination-template/ul/li';
  }

  private rowsPerPageXPath(rows: rows): string {
    return `//tfoot/tr[1]/td[2]/div/button[text()[normalize-space()='${rows}']]`;
  }
}
