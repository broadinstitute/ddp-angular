import { expect, Locator, Page } from '@playwright/test';
import { waitForResponseByURL } from '../../utils/test-utils';

export default class ParticipantPage {
  private readonly pageTitle: string = 'Participant Page';

  constructor(private readonly page: Page) {}

  public get getTitle(): Locator {
    return this.page.locator('h1');
  }

  public get getTextArea(): Locator {
    return this.page.locator('//table[.//td[contains(normalize-space(),"Participant Notes")]]//td/textarea');
  }

  async fillParticipantNotes(value: string): Promise<void> {
    const textArea = await this.getTextArea;
    await textArea.fill(value);
    await textArea.blur();
    await waitForResponseByURL(this.page, { url: '/ui/patch', status: 200 });
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
