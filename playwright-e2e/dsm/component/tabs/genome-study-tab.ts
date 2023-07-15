import { Locator, Page } from '@playwright/test';

export default class GenomeStudyTab {
  constructor(private readonly page: Page) {
  }

  async setValue(field: string, value: string): Promise<void> {
    await this.getField(field).locator('input').fill(value);
  }

  async clearSelection(field: string): Promise<void> {
    await this.getField(field).locator('button', { hasText: 'Clear Selection' }).click();
  }

  async clearValue(field: string): Promise<void> {
    await this.getField(field).getByRole('textbox').clear();
  }

  async setNotesAboutPreviousSampleKits(value: string): Promise<void> {
    await this.getField('Notes about previous sample kits').locator('textarea').fill(value);
  }

  getField(field: string): Locator {
    return this.page.locator('tab.active[role="tabpanel"]').locator(`xpath=//tr[td[normalize-space()="${field}"]]`);
  }
}
