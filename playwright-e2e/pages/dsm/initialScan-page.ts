import {expect, Page} from '@playwright/test';
import {waitForResponse} from 'utils/test-utils';

type inputField = 'Kit Label' | 'Short ID';

export default class InitialScanPage {
  private readonly PAGE_TITLE = 'Initial Scan';

  constructor(private readonly page: Page) {}

  public async fillScanPairs(fieldsInputs: string[]): Promise<void> {
    let extractValueIndex = -1;
    for (let i = 0; i < fieldsInputs.length / 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (extractValueIndex >= fieldsInputs.length - 1) { break; }
        const inputFieldToFill: inputField = !j ? 'Kit Label' : 'Short ID' ;
        const inputField = await this.page.locator(this.inputFieldXPath(inputFieldToFill)).nth(i);
        await inputField.fill(fieldsInputs[++extractValueIndex]);
        await inputField.blur();
      }
    }
  }

  public async save(): Promise<void> {
    const saveButton = await this.page.locator(this.saveButtonXPath);
    await expect(saveButton).not.toBeDisabled();

    await saveButton.focus();
    await saveButton.click();

    const response = await waitForResponse(this.page, {uri: 'initialScan'});
    const responseBody = await response.json();

    const [firstItem] = responseBody.length && responseBody;
    await expect(firstItem).toBeNull();

    const message = await this.page.locator('h3').innerText();
    await expect(message).toEqual('Data saved');
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
