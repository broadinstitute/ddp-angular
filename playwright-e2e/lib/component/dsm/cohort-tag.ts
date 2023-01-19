import { expect, Locator, Page } from '@playwright/test';

export default class CohortTag {
  constructor(private readonly page: Page) {}

  async add(value: string): Promise<void> {
    await this.page.fill('[placeholder="New tag..."]', value);
    await this.page.keyboard.press('Enter');
  }

  async submitAndExit(): Promise<void> {
    await this.page.locator('text=Submit').click();
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('Escape');
  }

  async delete(value: string): Promise<void> {
    await this.page.locator(value).click();
    await this.page.keyboard.press('Backspace');
  }

  public getAllTags(value: string): Locator {
    return this.page.locator(value);
  }

  /* assertions */
  public async assertCohortTagToHaveCount(tagName: string, count: number) {
    await expect(this.getAllTags(tagName)).toHaveCount(count);
  }
}
