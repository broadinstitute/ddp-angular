import { Locator, Page } from '@playwright/test';
import ParticipantPage from 'pages/dsm/participant-page';

export class Table {
  private readonly _participantPage: ParticipantPage = new ParticipantPage(this.page);

  constructor(private readonly page: Page) {}

  public async openParticipantPageAt(position: number): Promise<ParticipantPage | undefined> {
    position && (await this.getParticipantAt(position).click());
    await this._participantPage.assertPageTitle();
    return position ? this._participantPage : undefined;
  }

  public async openParticipantPageBy(
    columnName: string,
    columnValue: string,
    position = 1
  ): Promise<ParticipantPage | undefined> {
    const proceed = !!columnName && !!columnValue && !!position;
    proceed &&
      (await this.page
        .locator(this.getParticipantXPathBy(columnName, columnValue))
        .nth(position - 1)
        .click());
    return proceed ? this._participantPage : undefined;
  }

  public async getParticipantDataAtBy(position: number, columnName: string): Promise<string> {
    return position && columnName
      ? await this.page.locator(this.getParticipantDataXPathAtBy(position, columnName)).innerText()
      : '';
  }

  public async selectParticipantAt(position: number): Promise<void> {
    return position ? await this.getParticipantAt(position).nth(0).locator('mat-checkbox').click() : undefined;
  }

  private getParticipantAt(position: number): Locator {
    return this.page.locator(`//table/tbody/tr`).nth(position - 1);
  }

  /* XPaths */
  private getParticipantXPathBy(columnName: string, columnValue: string): string {
    return (
      `//table/thead/th[text()[normalize-space()='${columnName}']]` +
      `/ancestor::table/tbody//td[position()=` +
      `count(//table/thead/th[text()[normalize-space()='${columnName}']]` +
      `/preceding-sibling::th)+1][.//*[text()[normalize-space()='${columnValue}']]]/ancestor::tr`
    );
  }

  private getParticipantDataXPathAtBy(position: number, columnName: string) {
    return (
      `//table/tbody/tr[${position}]//td[position()=count(//table/thead/` +
      `th[text()[normalize-space()='${columnName}']]/preceding-sibling::th)+1]`
    );
  }
}
