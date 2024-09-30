import { Locator, Page, Response, expect } from '@playwright/test';
import Table from 'dss/component/table';
import ParticipantPage from 'dsm/pages/participant-page';
import { rows } from 'lib/component/dsm/paginators/types/rowsPerPage';
import { isCMIStudy, shuffle } from 'utils/test-utils';
import { Label } from 'dsm/enums';
import { StudyName } from 'dsm/navigation';
import { logInfo } from 'utils/log-utils';

export class ParticipantListTable extends Table {
  private readonly _participantPage: ParticipantPage;

  constructor(page: Page) {
    super(page, { cssClassAttribute: '.table' });
    this._participantPage = new ParticipantPage(this.page);
  }

  public async goToPage(page: number): Promise<void> {
    await this.paginator.pageAt(page);
  }

  public async nextPage(): Promise<Response> {
    return await this.paginator.next();
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

  public async openParticipantPageAt(opts: { position: number, isCMIStudy?: boolean, cmiColumn?: string }): Promise<ParticipantPage> {
    const { position, isCMIStudy = true, cmiColumn = 'DDP' } = opts;
    let participantRow = this.getParticipantAt(position);
    const cellPosition = this.theadCount(cmiColumn);
    if (isCMIStudy) {
      //Below method is to make sure that a column that leads to the Tissue Request page is not clicked - DDP column is usually displayed
      participantRow = this.page.locator(`//table/tbody/tr//td[position()=${cellPosition}]`).nth(position);
    }
    await participantRow.click();
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
  public async getCellDataForColumn(columnName: Label, rowNumber: number): Promise<string> {
    await this.waitForReady(); //Note: Tests in some studies occasionally goes to fast when getting data - this line is neccessary for the below to do as intended
    const numberOfPrecedingColumns = await this.page.locator(`//table/thead/th[contains(., '${columnName}')]/preceding-sibling::th`).count();
    const columnIndex = numberOfPrecedingColumns + 1;
    //Find the cell in a specific row and column
    const cell = this.page.locator(`((//tbody/tr)[${rowNumber}]/descendant::td)[${columnIndex}]`);
    return cell.innerText();
  }

  /**
   * Use to verify that certain headers are currently displayed in the participant list
   * @param checkDefaultFilterOfStudy choose whether to check for the default filter of a given study - use in combination with studyName param
   * @param studyName the name of the study whose default filter should be checked
   * @param customFilter for use to check display of custom filters - this is a given list of column headers that make up the given filter
   */
  public async assertDisplayedHeaders(opts: { checkDefaultFilterOfStudy?: boolean, studyName?: StudyName, customFilter?: Label[] }): Promise<void> {
    const { checkDefaultFilterOfStudy = false, studyName, customFilter } = opts;
    let participantListColumnHeaders: Label[] = [];

    if (checkDefaultFilterOfStudy && studyName && (studyName !== StudyName.RGP)) {
      participantListColumnHeaders = this.getDefaultFilter();
    } else if (customFilter) {
      participantListColumnHeaders = customFilter;
    } else if (!checkDefaultFilterOfStudy && !customFilter) {
      throw new Error('No column headers were given to check');
    }

    for (const header of participantListColumnHeaders) {
      let columnHeader;
      if (header === Label.PARTICIPANT_LIST_CHECKBOX_HEADER) {
        columnHeader = this.page.locator('//th[not(text())]');
      } else {
        columnHeader = this.page.locator(`//th[normalize-space(text())='${header}']`);
      }
      logInfo(`Checking that the ${header} column is displayed`);
      await expect(columnHeader, `Column ${header} is not visible in the participant list`).toBeVisible();
    }
    logInfo(`\n`); //just to add a space between above log and other logs that might be used
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

  /**
   * Returns the default filter that is used for most studies (except rgp)
   * @returns a list of Labels that make up the default filter for most studies
   */
  private getDefaultFilter(): Label[] {
    const defaultFilterColumnHeaders = [];
    defaultFilterColumnHeaders.push(Label.PARTICIPANT_LIST_CHECKBOX_HEADER);
    defaultFilterColumnHeaders.push(Label.DDP);
    defaultFilterColumnHeaders.push(Label.SHORT_ID);
    defaultFilterColumnHeaders.push(Label.FIRST_NAME);
    defaultFilterColumnHeaders.push(Label.LAST_NAME);
    defaultFilterColumnHeaders.push(Label.STATUS);
    return defaultFilterColumnHeaders;
  }
}
