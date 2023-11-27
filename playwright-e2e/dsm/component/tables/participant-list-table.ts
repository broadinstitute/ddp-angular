import { Locator, Page, expect } from '@playwright/test';
import Table from 'dss/component/table';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import { ParticipantsListPaginator } from 'lib/component/dsm/paginators/participantsListPaginator';
import { rows } from 'lib/component/dsm/paginators/types/rowsPerPage';
import { getDate, offsetDaysFromToday } from 'utils/date-utils';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import ParticipantListPage from 'dsm/pages/participant-list-page';

export class ParticipantListTable extends Table {
  private readonly _participantPage: ParticipantPage;
  private readonly _paginator: ParticipantsListPaginator;

  constructor(page: Page) {
    super(page, { cssClassAttribute: '.table' });
    this._paginator = new ParticipantsListPaginator(this.page);
    this._participantPage = new ParticipantPage(this.page);
  }

  public get paginator(): ParticipantsListPaginator {
    return this._paginator;
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
    return await this.getParticipantAt(position).nth(0).locator('mat-checkbox').click();
  }

  public async numOfParticipants(): Promise<number> {
    const total = await this.getTableRowsTotal('# of participants');
    if (total != null) {
      return total;
    }
    throw new Error('Failed to get Total number of participants in Participant List table');
  }

  /**
    * Returns the guid of the most recently created playwright participant
    * @param isRGPStudy mark as true or false if this is being ran in RGP - parameter is only needed if method is ran in RGP study
    * @returns the guid of the most recently registered playwright participant
  */
  public async getGuidOfMostRecentAutomatedParticipant(participantName: string, isRGPStudy?: boolean): Promise<string> {
    //Select the columns to be used to help find the most recent automated participant
    const participantListPage = new ParticipantListPage(this.page);
    await participantListPage.addColumnsToParticipantList('Participant Columns', ['Participant ID', 'Registration Date', 'First Name']);

    // Only RGP has a default filter with a different First Name field (in Participant Info Columns) - make sure to deselect it before continuing
    // otherwise there will be 2 different First Name fields in the search section (and in the Participant List)
    if (isRGPStudy) {
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.deselectColumns('Participant Info Columns', ['First Name']);
    }

    //First filter the participant list to only show participants registered within the past two weeks
    const searchPanel = participantListPage.filters.searchPanel;
    await searchPanel.open();
    const today = getDate(new Date());
    const previousWeek = offsetDaysFromToday(2 * 7);
    await searchPanel.dates('Registration Date', { from: previousWeek, to: today, additionalFilters: [AdditionalFilter.RANGE] });

    //Also make sure to conduct the search for participants with the given first name of the automated participant
    await searchPanel.text('First Name', { textValue: participantName });
    await searchPanel.search();

    //Get the first returned participant to use for testing - and verify at least one participant is returned
    const numberOfParticipants = await this.rowsCount;
    expect(numberOfParticipants, `No recent test participants were found with the given first name: ${participantName}`).toBeGreaterThanOrEqual(1);
    return this.getCellDataForColumn('Participant ID', 1);
  }

  /**
  * Given a column name and a row number, return the contents of the cell in the participant list
  * @param columnName the column name e.g. Participant ID
  * @param rowNumber the row number
  * @returns the contents of the specified column in the specified row
  */
  private async getCellDataForColumn(columnName: string, rowNumber: number): Promise<string> {
    const numberOfPrecedingColumns = await this.page.locator(`//table/thead/th[contains(., '${columnName}')]/preceding-sibling::th`).count();
    const columnIndex = numberOfPrecedingColumns + 1;
    //Find the cell in a specific row and column
    const cell = this.page.locator(`((//tbody/tr)[${rowNumber}]/descendant::td)[${columnIndex}]`);
    return cell.innerText();
  }

  private getParticipantAt(position: number): Locator {
    return this.page.locator(`//table/tbody/tr`).nth(position);
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
