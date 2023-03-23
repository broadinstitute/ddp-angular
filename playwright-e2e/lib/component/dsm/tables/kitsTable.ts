import {Locator, Page} from '@playwright/test';

type shortOrShippingID = 'Short ID' | 'Shipping ID';

export class KitsTable {
  constructor(private readonly page: Page) {}

  public async searchBy(searchBy: shortOrShippingID, value: string): Promise<void> {
    await this.page.locator(this.searchByXPath(searchBy)).fill(value);
  }

  public async shippingId(shortId: string): Promise<string> {
    return this.page.locator(this.shippingIdByShortIdXPath(shortId)).innerText();
  }

  public get rows(): Locator {
    return this.page.locator(this.rowsXPath);
  }

  /* XPaths */
  private shippingIdByShortIdXPath(shortId: string): string {
    return (
      `(//table/tbody//td[position()=count(//table/thead/tr[1]/th[.//*[text()[normalize-space()='Shipping ID']]]` +
      `/preceding-sibling::th)+1])[count(//table/tbody//td[position()=count(//table/thead/tr[1]/th` +
      `[.//*[text()[normalize-space()='Short ID']]]/preceding-sibling::th)+1][text()[normalize-space()='${shortId}']]` +
      `/ancestor::tr/preceding-sibling::tr) + 1]`
    );
  }

  private searchByXPath(searchBy: shortOrShippingID): string {
    return `(//table/thead/tr[2]/th)[count(//table/thead/tr[1]/th[.//*[text()[normalize-space()='${searchBy}']]]` +
      `/preceding-sibling::th)+1]/input`
  }

  private get rowsXPath(): string {
    return `//table/tbody/tr`;
  }
}
