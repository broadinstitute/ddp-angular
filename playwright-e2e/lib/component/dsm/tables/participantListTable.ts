import { Locator, Page } from '@playwright/test';
import ParticipantPage from 'pages/dsm/participant-page';

export class ParticipantListTable {
  private readonly _participantPage: ParticipantPage = new ParticipantPage(this.page);

  constructor(private readonly page: Page) {}

  public async openParticipantPageAt(position: number): Promise<ParticipantPage> {
    await this.getParticipantAt(position).click();
    await this._participantPage.assertPageTitle();
    return this._participantPage;
  }

  public async openParticipantPageBy(columnName: string, columnValue: string, position = 0): Promise<ParticipantPage> {
    await this.page.locator(this.getParticipantXPathBy(columnName, columnValue)).nth(position).click();
    return this._participantPage;
  }

  public async getParticipantDataAtBy(position: number, columnName: string): Promise<string> {
    return await this.page.locator(this.getParticipantDataXPathAtBy(position, columnName)).innerText();
  }

  public async selectParticipantAt(position: number): Promise<void> {
    return await this.getParticipantAt(position).nth(0).locator('mat-checkbox').click();
  }

  private getParticipantAt(position: number): Locator {
    return this.page.locator(`//table/tbody/tr`).nth(position);
  }

  /* XPaths */
  private getParticipantXPathBy(columnName: string, columnValue: string): string {
    return (
      `//table/thead/th[text()[normalize-space()='${columnName}']]` +
      `/ancestor::table/tbody//td[position()=${this.theadCount(columnName)}]` +
      `[.//*[text()[normalize-space()='${columnValue}']]]/ancestor::tr`
    );
  }

  private getParticipantDataXPathAtBy(position: number, columnName: string) {
    return `//table/tbody/tr[${position + 1}]//td[position()=${this.theadCount(columnName)}]`;
  }

  private theadCount(columnName: string): string {
    return `count(//table/thead/` + `th[text()[normalize-space()='${columnName}']]/preceding-sibling::th)+1`;
  }
}
