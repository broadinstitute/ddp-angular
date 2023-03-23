import {expect, Page} from "@playwright/test";
import {Response} from "playwright-core";

type inputField = 'Kit Label' | 'Short ID';

export default class InitialScanPage {
  private readonly PAGE_TITLE = 'Initial Scan';

  constructor(private readonly page: Page) {}

  public async fillInput(field: inputField, value: string): Promise<void> {
    await this.page.locator(this.inputFieldXPath(field)).fill(value);
  }

  public async save(): Promise<void> {
    await this.page.locator(this.saveButtonXPath).focus();
    await this.page.locator(this.saveButtonXPath).click()
    await this.page.waitForResponse(async (response: Response) => {
      const responseBody = await response.json();
      let isRequestFailed = false;
      if(responseBody instanceof Array && responseBody.length) {
        const [firstItem] = responseBody;
        isRequestFailed = firstItem !== null;
      }
      return response.url().includes('initialScan') && response.ok() && !isRequestFailed;
    }, {timeout: 10000});
  }

  /* Assertions */
  public async assertTitle() {
    await expect(this.page.locator('h1')).toHaveText(this.PAGE_TITLE);
  }

  /* XPaths */
  private inputFieldXPath(label: string): string {
    return `//form//mat-form-field[.//label[.//*[text()[normalize-space()='${label}']]]]//input`;
  }

  private get saveButtonXPath(): string {
    return `//form/button[.//*[text()[normalize-space()='Save Scan Pairs']]]`;
  }
}
