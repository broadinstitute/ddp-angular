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

  public get title(): Locator {
    return this.page.locator('h1');
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async filterListByParticipantGUID(participantGUID: string): Promise<void> {
    const customizeViewPanel = this.filters.customizeViewPanel;
    await customizeViewPanel.open();
    await customizeViewPanel.selectColumns('Participant Columns', ['Participant ID']);

    const searchPanel = this.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.text('Participant ID', {textValue: participantGUID });
    await searchPanel.search();

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

  private async participantsCount(): Promise<number> {
    return await this.tableRowsLocator.count();
  }

  /* assertions */
  async assertPageTitle(): Promise<void> {
    await expect(this.title).toHaveText(this.PAGE_TITLE, { timeout: 30 * 1000 });
  }

  async assertParticipantsCountGreaterOrEqual(value: number): Promise<void> {
    await expect(await this.participantsCount()).toBeGreaterThanOrEqual(value);
  }

  async assertParticipantsCount(count: number) {
    await expect(this.tableRowsLocator).toHaveCount(count);
  }

  private get tableRowsLocator(): Locator {
    return this.page.locator('[role="row"]:not([mat-header-row]):not(mat-header-row), tbody tr');
  }
}
