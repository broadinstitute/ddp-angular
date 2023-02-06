import { expect, Locator, Page } from '@playwright/test';

export default class CohortTag {
  constructor(private readonly page: Page) {}

  public async add(tagName: string): Promise<void> {
    await this.inputField.fill(tagName);
    await this.inputField.blur();
  }

  public async remove(tagName: string): Promise<void> {
    await this.getRemoveButtonFor(tagName).click();
    await this.assertCohortTagToHaveCount(tagName, 0);
  }

  public async submitAndExit(): Promise<void> {
    await this.page.locator('text=Submit').click();
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('Escape');
  }

  private getRemoveButtonFor(tagName: string): Locator {
    return this.page.locator(`${this.getCohortXPathTagFor(tagName)}//button[@matchipremove]`);
  }

  private get inputField(): Locator {
    return this.page.locator('//mat-chip-list//input[@id=//*[@aria-label="Tag selection"]/@data-mat-chip-input]');
  }

  /* XPaths */
  private getCohortXPathTagFor(tagName: string): string {
    return `//mat-chip-list//mat-chip[normalize-space(text())='${tagName}']`;
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
