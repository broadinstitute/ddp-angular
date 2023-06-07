import { APIRequestContext, expect, Locator, Page } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { WelcomePage } from 'dsm/pages/welcome-page';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { Filters } from 'dsm/component/filters/filters';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { getDateInMonthDayYearFormat } from 'utils/faker-utils';
import * as user from 'data/fake-user.json';

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';
  private readonly _filters: Filters = new Filters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  static async goto(page: Page, study: string, request: APIRequestContext): Promise<ParticipantListPage> {
      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(study);

      const navigation = new Navigation(page, request);
      const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
      await participantListPage.waitForReady();
      await participantListPage.assertPageTitle();

      const participantsTable = participantListPage.participantListTable;
      const rowsTotal = await participantsTable.rowLocator().count();
      expect(rowsTotal).toBeGreaterThanOrEqual(1); // Participant List table has loaded
      return participantListPage;
  }

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  /**
 * Filters the participant list to search for a specific participant when given their guid
 * @param participantGUID the guid of the specific participant to search for
 */
  public async filterListByParticipantGUID(participantGUID: string): Promise<void> {
    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.text('Participant ID', {textValue: participantGUID });
    await searchPanel.search();
  }

  /**
   * Selects a specific participant from the participant list when given their guid
   * @param participantGUID the guid of the specific participant to search for
   */
  public async selectParticipant(participantGUID: string): Promise<void> {
    await this.page.getByRole('cell', { name: participantGUID }).click()
    await expect(this.page.getByRole('heading', { name: 'Participant Page' })).toBeVisible();
    await expect(this.page.getByRole('cell', { name: participantGUID })).toBeVisible();
  }

  public async getGuidOfMostRecentAutomatedParticipant(isRGPStudy?: boolean): Promise<string> {
    //Select the columns to be used to help find the most recent automated participant
    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID', 'Registration Date', 'First Name']);

    //Only RGP has a default filter with a different First Name field - make sure to deselect it before continuing
    if (isRGPStudy) {
      await customizeViewPanel.deselectColumns('Participant Info Columns', ['First Name']);
    }

    //First filter the participant list to only show participants registered today and that have the name E2E (usual playwright first name)
    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();

    await searchPanel.setTodayFor('Registration Date');
    const registrationDateField = this.page.locator("//app-filter-column[contains(., 'Registration Date')]//input");
    const today = getDateInMonthDayYearFormat(new Date());
    await expect(registrationDateField, `Registration Date field does not have today's date`).toHaveValue(today);

    await searchPanel.text('First Name', {textValue: user.patient.firstName});
    await searchPanel.search();

    const participantGuid = this.getCellDataForColumn('Participant ID', 1); //Get the participant guid from the first returned row
    return participantGuid;
  }

  /**
   * Given a column name and a row number, return the contents of the cell in the participant list
   * @param columnName the column name e.g. Participant ID
   * @param rowNumber the row number
   * @returns the contents of the specified column in the specified row
   */
  private async getCellDataForColumn(columnName: string, rowNumber: number): Promise<string> {
    const numberOfPrecedingColumns = await this.page.locator(`//table/thead/th[contains(., '${columnName}')]/preceding-sibling::*`).count();
    const columnIndex = numberOfPrecedingColumns + 1;
    //Find the cell in a specific row and column
    const cell = this.page.locator(`((//tbody/tr)[${rowNumber}]/descendant::td)[${columnIndex}]`);
    const cellContent = await cell.innerText();
    return cellContent;
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public get filters(): Filters {
    return this._filters;
  }

  public get participantListTable(): ParticipantListTable {
    return this._table;
  }

  public async participantsCount(): Promise<number> {
    return await this.tableRowsLocator.count();
  }

  /* assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.locator('h1'),
      "Participant List page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE, { timeout: 30 * 1000 });
  }

  public async assertParticipantsCountGreaterOrEqual(count: number): Promise<void> {
    await expect(await this.participantsCount(),
      `Participant List page - Displayed participants count is not greater or equal to ${count}`)
      .toBeGreaterThanOrEqual(count);
  }

  public async assertParticipantsCount(count: number) {
    await expect(this.tableRowsLocator,
      `Participant List page - Displayed participants count is not  ${count}`)
      .toHaveCount(count);
  }

  public async reloadWithDefaultFilter(): Promise<void> {
    await this.page.locator('button').filter({ has: this.page.locator('[data-icon="sync-alt"]')}).click();
    await waitForNoSpinner(this.page);
  }

  public async saveNewView(viewName: string): Promise<void> {
    const saveButton = this.page.locator('button').filter({ has: this.page.locator('[data-icon="save"]')});
    await saveButton.click();

    const saveModal = new Modal(this.page);
    expect(await saveModal.getHeader()).toEqual('Please enter a name for your filter');
    await saveModal.getInput({ label: 'Filter Name' }).fill(viewName);
    await saveModal.getButton({ label: /Save Filter/ }).click();
    await Promise.all([
      waitForNoSpinner(this.page),
      waitForResponse(this.page, {uri: '/ui/saveFilter?'})
    ]);
  }

  /* Locators */
  private get tableRowsLocator(): Locator {
    return this.page.locator('[role="row"]:not([mat-header-row]):not(mat-header-row), tbody tr');
  }

  public get savedFilters() {
    const page = this.page;
    return new class {
      public async open(viewName: string): Promise<void> {
        await this.openPanel();
        await this.findPanel(viewName).locator('span.clickable').click();
        await waitForNoSpinner(page);
      }

      public async delete(viewName: string): Promise<void> {
        await this.openPanel();
        await this.findPanel(viewName).locator('[data-icon="trash-alt"]').click();
        await waitForNoSpinner(page);
        await expect(this.findPanel(viewName)).toHaveCount(0);
      }

      public async exists(viewName: string): Promise<boolean> {
        return await this.findPanel(viewName).count() === 1;
      }

      findPanel(viewName: string | RegExp, options?: {exact?: boolean | undefined} | undefined): Locator {
        return page.locator('#savedFiltersPanel tr').filter({ has: page.getByText(viewName, options) });
      }

      findFilterButton(): Locator {
        return page.locator('button').filter({ has: page.locator('[data-icon="filter"]')});
      }

      async _isFilterPanelOpen(): Promise<boolean> {
        return await page.locator('#savedFiltersPanel').count() === 1;
      }

      async openPanel(): Promise<void> {
        if (!await this._isFilterPanelOpen()) {
          await this.findFilterButton().click();
        }
      }
    }
  }
}
