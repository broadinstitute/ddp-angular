import { Locator, Page } from '@playwright/test';
import Table from 'dss/component/table';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import {ParticipantsListPaginator} from 'lib/component/dsm/paginators/participantsListPaginator';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';

export class ParticipantListTable extends Table {
  private readonly _participantPage: ParticipantPage = new ParticipantPage(this.page);
  private readonly _paginator: ParticipantsListPaginator = new ParticipantsListPaginator(this.page);

  constructor(page: Page) {
    super(page, { cssClassAttribute: '.table' });
  }

  public async goToPage(page: number): Promise<void> {
    await this._paginator.pageAt(page);
  }

  public async nextPage(): Promise<void> {
    await this._paginator.next();
  }

  public async previousPage(): Promise<void> {
    await this._paginator.previous();
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this._paginator.rowsPerPage(rows);
  }

  public async openParticipantPageAt(position: number): Promise<ParticipantPage> {
    await this.getParticipantAt(position).click();
    await this._participantPage.assertPageTitle();
    return this._participantPage;
  }

  public async getParticipantDataBy(columnName: string, columnValue: string, xColumnName: string): Promise<string> {
    return await this.page.locator(this.participantDataByXPath(columnName, columnValue, xColumnName)).innerText();
  }

  public async getParticipantDataAt(position: number, columnName: string): Promise<string> {
    const columnIndex = await this.getHeaderIndex(columnName);
    return this.cell(position, columnIndex).innerText();
  }

  public async selectCheckboxForParticipantAt(position: number): Promise<void> {
    return await this.getParticipantAt(position).nth(0).locator('mat-checkbox').click();
  }

  public async numOfParticipants(): Promise<number> {
    const total = await this.getTableRowsTotal('# of participants');
    if (total) {
      return total;
    }
    throw new Error('Failed to get Total number of participants in Participant List table');
  }

  private getParticipantAt(position: number): Locator {
    return this.page.locator(`//table/tbody/tr`).nth(position);
  }

  /* Locators */
  public get rowsCount(): Promise<number> {
    return this.page.locator(this.rowsXPath).count();
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

  private get rowsXPath(): string {
    return '//table/tbody/tr';
  }
}
