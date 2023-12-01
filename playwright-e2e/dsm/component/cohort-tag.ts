import { expect, Locator, Page } from '@playwright/test';
import { waitForResponse } from 'utils/test-utils';

export default class CohortTag {
  constructor(private readonly page: Page) {}

  public async add(tagName: string, waitForResponse = true): Promise<void> {
    const waitPromise = waitForResponse ? this.waitForOKResponse('createCohortTag') : Promise.resolve();
    await this.inputField.fill(tagName);
    await this.inputField.blur();
    await waitPromise;
  }

  public async remove(tagName: string): Promise<void> {
    const waitPromise = this.waitForOKResponse('deleteCohortTag');
    await this.getRemoveButtonFor(tagName).click();
    await waitPromise;
    await this.assertCohortTagToHaveCount(tagName, 0);
  }

  public async submitAndExit(): Promise<void> {
    const submitButton = this.page.locator(this.getSubmitButtonXPath);
    const waitPromise = this.waitForOKResponse('bulkCreateCohortTags');
    await submitButton.click();
    await waitPromise;
    await this.page.keyboard.press('Escape');
  }

  private getRemoveButtonFor(tagName: string): Locator {
    return this.page.locator(`${this.getCohortXPathTagFor(tagName)}//button[@matchipremove]`);
  }

  private get inputField(): Locator {
    return this.page.locator('//mat-chip-list//input[@id=//*[@aria-label="Tag selection"]/@data-mat-chip-input]');
  }

  /* Wait For Response */
  private async waitForOKResponse(url: string): Promise<void> {
    await waitForResponse(this.page, {uri: `/ui/${url}`});
  }

  /* XPaths */
  private getCohortXPathTagFor(tagName: string): string {
    return `//mat-chip-list//mat-chip[normalize-space(text())='${tagName}']`;
  }

  private get getSubmitButtonXPath(): string {
    return "//mat-dialog-container//app-bulk-cohort-tag-modal//button[.//*[text()='Submit']]";
  }

  /* assertions */
  public async assertCohortTagToHaveCount(tagName: string, count: number): Promise<void> {
    await expect(this.page.locator(this.getCohortXPathTagFor(tagName))).toHaveCount(count);
  }

  public async assertDuplicateCohortTagMessage(): Promise<void> {
    await expect(this.page.locator('//app-cohort-tag//mat-form-field/following-sibling::div')).toHaveText('Duplicate tag! Not saved!');
  }
}
