import {expect, Page} from "@playwright/test";
import {KitType} from "../../lib/component/dsm/kitType/kitType";
import {KitTypes} from "../../lib/component/dsm/kitType/kitType-enum";
import {waitForNoSpinner} from "../../utils/test-utils";
import {Response} from "playwright-core";

type inputField = 'Kit Label' | 'DSM Label';


export default class FinalScanPage {
  private readonly PAGE_TITLE = 'Final Scan';

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
      console.log(responseBody)
      //@TODO MAKE ASSERTIONS ABOUT FINAL SCAN PAGE
      return response.url().includes('finalScan') && response.ok() && !isRequestFailed;
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
