import { expect, Locator, Page } from '@playwright/test';

export default class CohortTag {
  constructor(private readonly page: Page) {}

  async add(tagName: string): Promise<void> {
    await this.inputField.fill(tagName);
    await this.inputField.blur();
  }

  async submitAndExit(): Promise<void> {
    await this.page.locator('text=Submit').click();
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('Escape');
  }

  async removeAllTags(): Promise<void> {
    const removeButtons = await this.page.locator(`//mat-form-field//mat-chip//button[contains(@class, 'mat-chip-remove')]`);
    const removeButtonsCount = await removeButtons.count();
    if (removeButtonsCount > 0) {
      for (let i = 0; i < removeButtonsCount; i++) {
        await removeButtons.nth(i).click();
      }
    }
  }

  async remove(tagName: string): Promise<void> {
    await this.getRemoveButtonFor(tagName).click();
  }

  public getRemoveButtonFor(tagName: string): Locator {
    return this.page.locator(`//mat-chip[normalize-space(text())='${tagName}']//button[contains(@class, 'mat-chip-remove')]`);
  }

  public get inputField(): Locator {
    return this.page.locator('//mat-form-field//input[@id=//*[@aria-label="Tag selection"]/@data-mat-chip-input]');
  }

  /* assertions */
  public async assertCohortTagToHaveCount(tagName: string, count: number) {
    await expect(await this.page.locator(`text=${tagName}`)).toHaveCount(count);
  }
}
