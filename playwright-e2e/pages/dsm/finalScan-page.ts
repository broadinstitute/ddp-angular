import {expect, Page} from '@playwright/test';
import {waitForResponse} from 'utils/test-utils';

type inputField = 'Kit Label' | 'DSM Label';

export default class FinalScanPage {
  private readonly PAGE_TITLE = 'Final Scan';

  constructor(private readonly page: Page) {}

  public async fillScanPairs(fieldsInputs: string[]): Promise<void> {
    let extractValueIndex = -1;
    for (let i = 0; i < fieldsInputs.length / 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (extractValueIndex >= fieldsInputs.length - 1) { break; }
        const inputFieldToFill: inputField = !j ? 'Kit Label' : 'DSM Label' ;
        const inputField = await this.page.locator(this.inputFieldXPath(inputFieldToFill)).nth(i);
        await inputField.fill(fieldsInputs[++extractValueIndex]);
        await inputField.blur();
      }
    }
  }

  public async save(): Promise<void> {
    const saveButton = await this.page.locator(this.saveButtonXPath);
    await expect(saveButton, 'Save Scan Pairs button is not enabled').toBeEnabled();

    await saveButton.focus();
    await saveButton.click();

    await waitForResponse(this.page, {uri: 'finalScan'});

    const textUnderScanPair = this.page.locator(this.textUnderScanPairXPath);
    const textUnderScanPairCount = await textUnderScanPair.count();
    for(let t = 0; t < textUnderScanPairCount; t++) {
      await expect(await textUnderScanPair.textContent(), 'All kits have not been scanned successfully')
        .toContain('Scanned successfully for');
    }
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

  private get textUnderScanPairXPath(): string {
    return "//form/div[contains(@class, 'formsGroup')][position() != last()]/p"
  }
}
