import {expect, Locator, Page} from '@playwright/test';
import Input from 'dss/component/input';
import {waitForResponse} from 'utils/test-utils';

type inputField = 'Kit Label' | 'Short ID';

export default class KitsInitialScanPage {
  private readonly PAGE_TITLE = 'Initial Scan';

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await this.assertPageTitle();
  }

  public getInput(input: inputField, nth?: number): Input {
    return new Input(this.page, { label: input, nth });
  }

  public async fillScanPairs(fieldsInputs: string[]): Promise<void> {
    let extractValueIndex = -1;
    for (let i = 0; i < fieldsInputs.length / 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (extractValueIndex >= fieldsInputs.length - 1) { break; }
        const inputFieldToFill: inputField = !j ? 'Kit Label' : 'Short ID' ;
        // const inputField = this.page.locator(this.inputFieldXPath(inputFieldToFill)).nth(i);
        const inputField = new Input(this.page, { label: inputFieldToFill, nth: i });
        await inputField.fill(fieldsInputs[++extractValueIndex]);
        await inputField.blur();
      }
    }
  }

  public async save(opts: { verifySuccess?: boolean } = {}): Promise<void> {
    const { verifySuccess = true } = opts;
    const saveButton = this.saveButtonLocator;
    await expect(saveButton, 'Initial Scan page - Save Scan Pairs button is not enabled').toBeEnabled();

    const respPromise = waitForResponse(this.page, {uri: '/initialScan'});
    await saveButton.focus();
    await saveButton.click();
    const response = await respPromise;
    const responseBody = await response.json();

    if (verifySuccess) {
      expect(responseBody.every((d: any) => d === null),
        `Initial Scan page - Error while uploading initial scan pairs: ${await response.text()}`)
        .toBeTruthy();
      const message = await this.page.locator('h3').textContent();
      expect(message, 'Initial Scan page - All kits have not been scanned successfully').toBe('Data saved');
    }
  }

  /* Assertions */
  public async assertPageTitle() {
    await expect(this.page.locator('h1'),
      `Initial Scan page - The page title doesn't match the expected one - ${this.PAGE_TITLE}`)
      .toHaveText(this.PAGE_TITLE);
  }

  public get saveButtonLocator(): Locator {
    return this.page.locator('//form/button[.//*[text()[normalize-space()="Save Scan Pairs"]]]');
  }
}
