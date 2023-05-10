import {Locator, Page} from '@playwright/test';

type shortOrShippingID = 'Short ID' | 'Shipping ID';

export class KitsTable {
  constructor(private readonly page: Page) {}

  public async searchBy(searchBy: shortOrShippingID, value: string): Promise<void> {
    await this.page.locator(this.searchByXPath(searchBy)).fill(value);
  }

  public async searchByMFCode(value: string): Promise<void> {
    await this.page.locator(this.searchByMFCodeXPath).fill(value);
  }

  public async shippingId(shortId: string): Promise<string> {
    return this.page.locator(this.shippingIdByShortIdXPath(shortId)).innerText();
  }

  /* Locators */
  public get deactivateButtons(): Locator {
    return this.page.locator(this.deactivateButtonXPath);
  }

  public get rows(): Locator {
    return this.page.locator(this.rowsXPath);
  }

  public get header(): Locator {
    return this.page.locator(this.headerXPath);
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

  private get searchByMFCodeXPath(): string {
    return `(//table/thead/tr[2]/th)[count(//table/thead/tr[1]/th[text()[normalize-space()='MF code']]` +
    `/preceding-sibling::th)+1]/input`
  }

  private get deactivateButtonXPath(): string {
    return `${this.rowsXPath}/td[button[@type='button'][text()[normalize-space()='Deactivate']]]/button`
  }

  private get rowsXPath(): string {
    return `//table/tbody/tr`;
  }

  private get headerXPath(): string {
    return '//table/thead/tr[1]'
  }
}
