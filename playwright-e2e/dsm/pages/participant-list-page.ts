import { APIRequestContext, Download, expect, Locator, Page } from '@playwright/test';
import Modal from 'dsm/component/modal';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { FileFormatEnum, TextFormatEnum } from 'dsm/pages/participant-page/enums/download-format-enum';
import { WelcomePage } from 'dsm/pages/welcome-page';
import Checkbox from 'dss/component/checkbox';
import { shuffle, waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { Filters } from 'dsm/component/filters/filters';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';
import { SortOrder } from 'dss/component/table';
import QuickFilters from 'dsm/component/filters/quick-filters';

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';
  private readonly _filters: Filters = new Filters(this.page);
  private readonly _quickFilters: QuickFilters = new QuickFilters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  static async goto(page: Page, study: string, request: APIRequestContext): Promise<ParticipantListPage> {
    const welcomePage = new WelcomePage(page);
    await welcomePage.selectStudy(study);

    const navigation = new Navigation(page, request);
    const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
    await participantListPage.waitForReady();

    const participantsTable = participantListPage.participantListTable;
    const rowsTotal = await participantsTable.rowLocator().count();
    expect(rowsTotal).toBeGreaterThanOrEqual(1); // Participant List table has loaded
    return participantListPage;
  }

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await this.assertPageTitle();
    await waitForNoSpinner(this.page);
    await expect(this.page.locator(this.filters.searchPanel.openButtonXPath)).toBeVisible();
  }

  public async selectAll(): Promise<void> {
    const checkbox = new Checkbox(this.page, { label: 'Select all', root: '//*'});
    await checkbox.check({ timeout: 30 * 1000 }); // long delay
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public get filters(): Filters {
    return this._filters;
  }

  public get quickFilters(): QuickFilters {
    return this._quickFilters;
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
    expect(await this.participantsCount(),
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
    expect(await saveModal.getHeader()).toBe('Please enter a name for your filter');
    await saveModal.getInput({ label: 'Filter Name' }).fill(viewName);
    await saveModal.getButton({ label: /Save Filter/ }).click();
    await Promise.all([
      waitForNoSpinner(this.page),
      waitForResponse(this.page, {uri: '/ui/saveFilter?'})
    ]);
  }

  /**
   * Click Download button to download participant list.
   * @param {{fileFormat?: FileFormatEnum, textFormat?: TextFormatEnum, includeCompletionOfActivity?: boolean, timeout?: number}} opts
   * @returns {Promise<Download>}
   */
  public async downloadParticipant(opts: {
      fileFormat?: FileFormatEnum,
      textFormat?: TextFormatEnum,
      includeCompletionOfActivity?: boolean,
      timeout?: number
    } = {}): Promise<Download> {
    const {
      fileFormat = FileFormatEnum.XLSX,
      textFormat = TextFormatEnum.HUMAN_READABLE,
      includeCompletionOfActivity = true,
      timeout = 3 * 60 * 1000
    } = opts;

    const button = this.page.locator('button').filter({has: this.page.locator('[data-icon="file-download"]')});
    await button.click();

    const modal = new Modal(this.page);
    await expect(modal.headerLocator()).toHaveText('Configure export');

    const fileFormatRadio = modal.getRadiobutton(new RegExp('File format:'));
    await fileFormatRadio.check(fileFormat);

    const textFormatRadio = modal.getRadiobutton(new RegExp('Option text format:'));
    await textFormatRadio.check(textFormat);

    const booleanText = includeCompletionOfActivity ? 'Yes' : 'No';
    const includeAllCompletionOfActivityRadio = modal.getRadiobutton(new RegExp('Include all completions of an activity:'));
    await includeAllCompletionOfActivityRadio.check(booleanText);

    // exporting participant list may take several minutes
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout }),
      modal.getButton({ label: 'Download' }).click()
    ]);
    return download;
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

  public async filterListByShortId(shortId: string, opts: { resultsCount?: number } = {}): Promise<void> {
    if (!shortId) {
      throw new Error('shortId cannot be null');
    }
    const { resultsCount = 1 } = opts;
    const participantsTable = this.participantListTable;
    await this.waitForReady();

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.clear();
    await searchPanel.text('Short ID', { textValue: shortId });
    await searchPanel.search();

    await expect(participantsTable.footerLocator().first()).toBeVisible();
    expect(await participantsTable.rowsCount).toBe(resultsCount);
  }

  public async addColumnsToParticipantList(columnGroup: string, columnOptions: string[]): Promise<void> {
    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(columnGroup, columnOptions);
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

  async showParticipantWithdrawnButton(): Promise<void> {
    const button = this.page.locator('button').filter({has: this.page.locator('[data-icon="quidditch"]')});
    await button.click();
    await waitForNoSpinner(this.page);
  }

  async findParticipantForKitUpload(firstNameSubstring?: string): Promise<number> {
    const normalCollaboratorSampleIDColumn = 'Normal Collaborator Sample ID';
    const registrationDateColumn = 'Registration Date';
    const validColumn = 'Valid';

    // Match data in First Name, Valid and Collaborator Sample ID columns. If no match, returns -1.
    const compareForMatch = async (index: number): Promise<number> => {
      const fname = await participantListTable.getTextAt(index, 'First Name');
      const normalCollaboratorSampleID = await participantListTable.getTextAt(index, normalCollaboratorSampleIDColumn);
      const [isAddressValid] = await participantListTable.getTextAt(index, validColumn);
      let isMatch = true;
      if (firstNameSubstring) {
        isMatch = fname.indexOf(firstNameSubstring) !== -1
      }
      if (isMatch && normalCollaboratorSampleID.length <= 5 && isAddressValid.toLowerCase() === 'true') {
        return index;
      }
      return -1;
    };

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', [registrationDateColumn]);
    await customizeViewPanel.selectColumns('Sample Columns', [normalCollaboratorSampleIDColumn]);
    await customizeViewPanel.selectColumns('Contact Information Columns', [validColumn]);
    await customizeViewPanel.close();

    expect(participantListTable.getHeaderIndex(registrationDateColumn)).not.toBe(-1);
    expect(participantListTable.getHeaderIndex(normalCollaboratorSampleIDColumn)).not.toBe(-1);
    expect(participantListTable.getHeaderIndex(validColumn)).not.toBe(-1);
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    let participantsCount = await participantListTable.rowsCount;
    expect(participantsCount).toBeGreaterThanOrEqual(1);

    // Sort by Registration Date to pick newest participants
    await participantListTable.sort(registrationDateColumn, SortOrder.ASC);
    const endTime = Date.now() + 90 * 1000;
    while (participantsCount > 0 && Date.now() < endTime) {
      let rowIndex = -1;
      // Iterate rows in random order
      const array = shuffle([...Array(participantsCount).keys()]);
      for (const index of array) {
        rowIndex = await compareForMatch(index);
        if (rowIndex !== -1) {
          return rowIndex;
        }
      }
      const hasNextPage = await participantListTable.paginator.hasNext();
      if (hasNextPage) {
        await participantListTable.nextPage();
        participantsCount = await participantListTable.rowsCount;
      } else {
        participantsCount = 0;
      }
    }
    throw new Error(`Failed to find a suitable participant for Kit Upload within max waiting time 90 seconds.`);
  }

  async findParticipantFor(columnGroup: string, columnName: string, opts: {value?: string, nth?: number} = {}): Promise<number> {
    const { value, nth = 1 } = opts;

    const compareForMatch = async (index: number): Promise<number> => {
      const columnText = await participantListTable.getTextAt(index, columnName);
      if (value) {
        return columnText.some(text => text.indexOf(value) !== -1) ? index : -1;
      }
      return columnText.length === 1 && columnText[0].trim().length === 0 ? index : -1;
    };

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
    await searchPanel.search();

    const participantListTable = this.participantListTable;
    await expect(participantListTable.rowLocator().first()).toBeVisible();

    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns(columnGroup, [columnName], {nth});
    await customizeViewPanel.close();

    let participantsCount = await participantListTable.rowsCount;
    expect(participantsCount).toBeGreaterThanOrEqual(1);

    const endTime = Date.now() + 90 * 1000;
    while (participantsCount > 0 && Date.now() < endTime) {
      let rowIndex = -1;
      // Iterate rows in random order
      const array = shuffle([...Array(participantsCount).keys()]);
      for (const index of array) {
        rowIndex = await compareForMatch(index);
        if (rowIndex !== -1) {
          return rowIndex;
        }
      }
      // Next page in table
      const hasNextPage = await participantListTable.paginator.hasNext();
      if (hasNextPage) {
        await participantListTable.nextPage();
        participantsCount = await participantListTable.rowsCount;
      } else {
        participantsCount = 0;
      }
    }
    throw new Error(`Failed to find a suitable participant for ${columnGroup}: ${columnName} = "${value}" within max waiting time 90 seconds.`);
  }
}
