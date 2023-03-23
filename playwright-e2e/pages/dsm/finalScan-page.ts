import {expect, Page} from "@playwright/test";
import {waitForResponse} from "utils/test-utils";

type inputField = 'Kit Label' | 'DSM Label';

export default class FinalScanPage {
  private readonly PAGE_TITLE = 'Final Scan';

  constructor(private readonly page: Page) {}

  public async fillInput(field: inputField, value: string): Promise<void> {
    await this.page.locator(this.inputFieldXPath(field)).fill(value);
  }

  public async save(): Promise<void> {
    await this.page.locator(this.saveButtonXPath).focus();
    await this.page.locator(this.saveButtonXPath).click();

    const response = await waitForResponse(this.page, {uri: 'finalScan'});
    const responseBody = await response.json();

    //@TODO MAKE ASSERTIONS ABOUT FINAL SCAN PAGE
    console.log(responseBody, 'FINAL_SCAN_RESPONSE')
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
