import { expect, Locator, Page } from '@playwright/test';
import { waitForResponseByURL } from '../../utils/test-utils';

export default class ParticipantPage {
  private readonly PAGE_TITLE: string = 'Participant Page';

  constructor(private readonly page: Page) {}

  public async fillParticipantNotes(value: string): Promise<void> {
    const textArea = await this.participantNotes;
    await textArea.fill(value);
    await textArea.blur();
    await waitForResponseByURL(this.page, { url: '/ui/patch', status: 200 });
  }

  public async backToList(): Promise<void> {
    await this.page.locator('//div/a[.//*[contains(text(), "<< back to \'List\' ")]]').click();
  }

  /* Locators */
  private get participantNotes(): Locator {
    return this.page.locator('//table[.//td[contains(normalize-space(),"Participant Notes")]]//td/textarea');
  }

  private get title(): Locator {
    return this.page.locator('h1');
  }

  /* assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.title).toHaveText(this.PAGE_TITLE, { timeout: 5 * 1000 });
  }

  public async assertParticipantNotesToBe(value: string): Promise<void> {
    await expect(await this.participantNotes.inputValue()).toBe(value);
  }
}
