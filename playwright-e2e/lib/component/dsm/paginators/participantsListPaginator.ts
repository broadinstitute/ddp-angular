import {expect, Page} from '@playwright/test';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {rows} from './types/rowsPerPage';

export class ParticipantsListPaginator {
  constructor(private readonly page: Page) {}

  public async rowsPerPage(rows: rows): Promise<void> {
    const rowsPerPageLocator = this.page.locator(this.rowsPerPageXPath(rows));
    await expect(rowsPerPageLocator, `The row - ${rows} is not visible`).toBeVisible();
    const waitPromise = this.waitForReady();
    await rowsPerPageLocator.click();
    await waitPromise;
  }

  public async pageAt(page: number): Promise<void> {
    await this.paginateAt(page);
  }

  public async next(): Promise<void> {
    await this.paginate(this.nextXPath);
  }

  public async hasNext(): Promise<boolean> {
    const nextLocator = this.page.locator(this.nextXPath);
    const isvisible = await nextLocator.isVisible();
    const isDisabled = isvisible ? (await nextLocator.getAttribute('class'))?.includes('disabled') : true;
    return !isDisabled;
  }

  public async previous(): Promise<void> {
    await this.paginate(this.previousXPath);
  }

  private async paginate(xpath: string): Promise<void> {
    const paginatorLocator = this.page.locator(xpath);
    const isDisabled = (await paginatorLocator.getAttribute('class'))?.includes('disabled');
    if (isDisabled) {
      throw new Error('Table "Next Page" link is disabled.');
    }
    const waitPromise = this.waitForReady();
    await paginatorLocator.click();
    await waitPromise;
  }

  private async paginateAt(page: number): Promise<void> {
    const pageLocator = this.page.locator(this.pageAtXPath(page));
    await expect(pageLocator, `The page - ${page} is not visible`).toBeVisible();
    const waitPromise = this.waitForReady();
    await pageLocator.click();
    await waitPromise;
  }

  private async waitForReady(): Promise<void> {
    await Promise.race([
      waitForResponse(this.page, {uri: 'filterList'}),
      waitForResponse(this.page, {uri: 'applyFilter'})
    ]);
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
