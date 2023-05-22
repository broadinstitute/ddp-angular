import {expect, Page} from "@playwright/test";
import {rows} from "./types/rowsPerPage";

export class KitsPaginator {
  constructor(private readonly page: Page) {
  }

  public async pageAt(page: number): Promise<void> {
    const paginatorLocator = this.page.locator(this.pageXPath(page));
    await expect(paginatorLocator, `The page number - ${page} is not visible`).toBeVisible()
    return paginatorLocator.click();
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    const rowsPerPageLocator = this.page.locator(this.rowsPerPageXPath(rows));
    await expect(rowsPerPageLocator, `The row - ${rows} is not visible`).toBeVisible();
    return rowsPerPageLocator.click();
  }

  /* XPaths */
  private pageXPath(page: number): string {
    return `//mfbootstrappaginator/mfpaginator/ul[1]/li/a[text()[normalize-space()='${page}']]`
  }

  private rowsPerPageXPath(page: rows): string {
    return `//mfbootstrappaginator/mfpaginator/ul[2]/li/a[text()[normalize-space()='${page}']]`
  }
}
