import { expect, Locator, Page } from '@playwright/test';

export default class CohortTag {
  constructor(private readonly page: Page) {}

  async add(tagName: string): Promise<void> {
    await this.inputField.fill(tagName);
    await this.page.keyboard.press('Enter');
  }

  async submitAndExit(): Promise<void> {
    await this.page.locator('text=Submit').click();
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('Escape');
  }

  async delete(tagName: string): Promise<void> {
    await (await this.get(tagName)).click();
    await this.page.keyboard.press('Backspace');
  }

  public get(tagName: string): Locator {
    return this.page.locator(`//mat-chip[normalize-space(text())='${tagName}']`);
  }

  public get inputField(): Locator {
    return this.page.locator('//mat-form-field//input[@id=//*[@aria-label="Tag selection"]/@data-mat-chip-input]');
  }

  /* assertions */
  public async assertCohortTagToHaveCount(tagName: string, count: number) {
    await expect(await this.page.locator(`text=${tagName}`)).toHaveCount(count);
  }
}
