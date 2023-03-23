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

  public async getParticipantDataBy(columnName: string, columnValue: string, xColumnName: string): Promise<string> {
    return await this.page.locator(this.participantDataByXPath(columnName, columnValue, xColumnName)).innerText();
  }

  public async getParticipantDataAt(position: number, columnName: string): Promise<string> {
    return await this.page.locator(this.getParticipantDataAtXPath(position, columnName)).innerText();
  }

  public async selectCheckboxForParticipantAt(position: number): Promise<void> {
    return await this.getParticipantAt(position).nth(0).locator('mat-checkbox').click();
  }

  private getParticipantAt(position: number): Locator {
    return this.page.locator(`//table/tbody/tr`).nth(position);
  }

  /* XPaths */
  private participantDataByXPath(columnName: string, columnValue: string, xColumnName: string): string {
    return (
      `//table/tbody//td[position()=count(//table/thead/th[text()[normalize-space()='${xColumnName}']]/preceding-sibling::th)+1]` +
      `[count(//table/tbody//td[position()=count(//table/thead/th[text()[normalize-space()='${columnName}']]` +
      `/preceding-sibling::th)+1][.//*[text()[normalize-space()='${columnValue}']]]/ancestor::tr/preceding-sibling::tr) + 1]`
    )
  }

  private getParticipantDataAtXPath(position: number, columnName: string) {
    return `//table/tbody/tr[${position + 1}]//td[position()=${this.theadCount(columnName)}]`;
  }

  private theadCount(columnName: string): string {
    return `count(//table/thead/th[text()[normalize-space()='${columnName}']]/preceding-sibling::th)+1`;
  }
}
