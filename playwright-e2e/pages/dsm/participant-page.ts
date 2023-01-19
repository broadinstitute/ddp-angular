import { expect, Locator, Page } from '@playwright/test';

export default class ParticipantPage {
  private readonly pageTitle: string = 'Participant Page';

  constructor(private readonly page: Page) {}

  public get getTitle(): Locator {
    return this.page.locator('h1');
  }

  async fillParticipantNotes(value: string): Promise<void> {
    await this.page.fill('textarea:right-of(:text("Participant Notes"))', value);
    await this.page.keyboard.press('Tab');
  }

  async backToList(): Promise<void> {
    await this.page.locator("text=<< back to 'List'").click();
  }

  /* assertions */
  async assertPageTitle(): Promise<void> {
    await expect(this.getTitle).toHaveText(this.pageTitle, { timeout: 5 * 1000 });
  }

  async assertParticipantNotesToHaveCount(value: string): Promise<void> {
    await expect(await this.page.locator('textarea:right-of(:text("Participant Notes"))').inputValue()).toBe(value);
  }
}
