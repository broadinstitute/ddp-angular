import { Locator, Page } from '@playwright/test';
import Table from 'dss/component/table';
import ParticipantPage from 'dsm/pages/participant-page';
import { rows } from 'lib/component/dsm/paginators/types/rowsPerPage';
import { shuffle } from 'utils/test-utils';

export class ParticipantListTable extends Table {
  private readonly _participantPage: ParticipantPage;

  constructor(page: Page) {
    super(page, { cssClassAttribute: '.table' });
    this._participantPage = new ParticipantPage(this.page);
  }

  public async goToPage(page: number): Promise<void> {
    await this.paginator.pageAt(page);
  }

  public async nextPage(): Promise<void> {
    await this.paginator.next();
  }

  public async previousPage(): Promise<void> {
    await this.paginator.previous();
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.paginator.rowsPerPage(rows);
  }

  public async randomizeRows(): Promise<number[]> {
    const rowCount = await this.getRowsCount();
    return shuffle([...Array(rowCount).keys()]);
  }

  public async openParticipantPageAt(position: number): Promise<ParticipantPage> {
    await this.getParticipantAt(position).click();
    await this._participantPage.waitForReady();
    return this._participantPage;
  }

  public async getParticipantDataBy(columnName: string, columnValue: string, xColumnName: string): Promise<string> {
    return await this.page.locator(this.participantDataByXPath(columnName, columnValue, xColumnName)).innerText();
  }

  public async getParticipantDataAt(position: number, columnName: string, opts: { exactMatch?: boolean } = {}): Promise<string> {
    const columnIndex = await this.getHeaderIndex(columnName, opts);
    return this.cell(position, columnIndex).innerText();
  }

  public async selectCheckboxForParticipantAt(position: number): Promise<void> {
    await this.getParticipantAt(position).nth(0).locator('mat-checkbox').click();
  }

  public async numOfParticipants(): Promise<number> {
    const total = await this.getTableRowsTotal('# of participants');
    if (total != null) {
      return total;
    }
    throw new Error('Failed to get Total number of participants in Participant List table');
  }

  /**
  * Given a column name and a row number, return the contents of the cell in the participant list
  * @param columnName the column name e.g. Participant ID
  * @param rowNumber the row number
  * @returns the contents of the specified column in the specified row
  */
  public async getCellDataForColumn(columnName: string, rowNumber: number): Promise<string> {
    const numberOfPrecedingColumns = await this.page.locator(`//table/thead/th[contains(., '${columnName}')]/preceding-sibling::th`).count();
    const columnIndex = numberOfPrecedingColumns + 1;
    //Find the cell in a specific row and column
    const cell = this.page.locator(`((//tbody/tr)[${rowNumber}]/descendant::td)[${columnIndex}]`);
    return cell.innerText();
  }

  private getParticipantAt(position: number): Locator {
    return this.page.locator('//table/tbody/tr').nth(position);
  }

  /* Locators */
  public get rowsCount(): Promise<number> {
    return this.getRowsCount();
  }

  /* XPaths */
  private participantDataByXPath(columnName: string, columnValue: string, xColumnName: string): string {
    return (
      `//table/tbody//td[position()=count(//table/thead/th[text()[normalize-space()='${xColumnName}']]/preceding-sibling::th)+1]` +
      `[count(//table/tbody//td[position()=count(//table/thead/th[text()[normalize-space()='${columnName}']]` +
      `/preceding-sibling::th)+1][.//*[text()[normalize-space()='${columnValue}']]]/ancestor::tr/preceding-sibling::tr) + 1]`
    )
  }

  public getParticipantDataAtXPath(position: number, columnName: string) {
    return `//table/tbody/tr[${position + 1}]//td[position()=${this.theadCount(columnName)}]`;
  }

  private theadCount(columnName: string): string {
    return `count(//table/thead/th[text()[normalize-space()='${columnName}']]/preceding-sibling::th)+1`;
  }

  private get rowsXPath(): string {
    return '//table/tbody/tr';
  }
}
