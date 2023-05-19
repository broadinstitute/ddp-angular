import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { Filters } from 'lib/component/dsm/filters/filters';
import { ParticipantListTable } from 'lib/component/dsm/tables/participantListTable';
import { DSMPageBase } from './page-base';

export enum SearchFieldLabel {
  ShortId = 'Short ID',
  ParticipantID = 'Participant ID'
}

export default class ParticipantListPage extends DSMPageBase {
  private readonly PAGE_TITLE: string = 'Participant List';

  private readonly _filters: Filters = new Filters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  constructor(protected readonly page: Page) {
    super(page);
  }

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

  /* Locators */
  private get tableRowsLocator(): Locator {
    return this.page.locator('[role="row"]:not([mat-header-row]):not(mat-header-row), tbody tr');
  }
}
