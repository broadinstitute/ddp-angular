import { expect, Locator, Page } from '@playwright/test';
import { waitForResponseByURL } from '../../../utils/test-utils';

export default class CohortTag {
  constructor(private readonly page: Page) {}

  public async add(tagName: string): Promise<void> {
    await this.inputField.fill(tagName);
    await this.inputField.blur();
  }

  public async remove(tagName: string): Promise<void> {
    await this.getRemoveButtonFor(tagName).click();
    await this.assertCohortTagToHaveCount(tagName, 0);
    await this.waitForOKResponse('deleteCohortTag');
  }

  public async submitAndExit(): Promise<void> {
    const submitButton = await this.page.locator(this.getSubmitButtonXPath);
    !await submitButton.isDisabled() && await submitButton.click()
    await this.waitForOKResponse('bulkCreateCohortTags')
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
    await waitForResponseByURL(this.page, { url: `/ui/${url}`, status: 200 });
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
    await expect(this.page.locator('//app-cohort-tag//mat-form-field/following-sibling::div')).toHaveText(
      'Duplicate tag! Not saved!'
    );
  }
}
