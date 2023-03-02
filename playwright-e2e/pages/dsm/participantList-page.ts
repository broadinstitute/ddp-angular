import { expect, Locator, Page } from '@playwright/test';

export enum SearchFieldLabel {
  ShortId = 'Short ID',
  ParticipantID = 'Participant ID'
}
import { waitForNoSpinner } from 'utils/test-utils';
import { Filters } from 'lib/component/dsm/filters/filters';
import { ParticipantListTable } from 'lib/component/dsm/tables/participantListTable';

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';

  private readonly _filters: Filters = new Filters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  constructor(private readonly page: Page) {}

  public get title(): Locator {
    return this.page.locator('h1');
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async filterListByParticipantGUID(participantGUID: string): Promise<void> {
    await this.page.locator('text=Customize View >> button').click();
    await this.page.locator('text=Participant Columns').click();
    await this.page.locator(`//mat-checkbox/label[span[normalize-space(text()) = 'Participant ID']]`).check();
    await this.page.locator('text=Search >> button').click();
    await this.page.locator(`//input[@data-placeholder='Participant ID']`).fill(participantGUID);
    await this.page.locator("button:has-text('Search') >> nth=0").click();
    await this.page.getByRole('cell', {name: participantGUID}).click();
    await expect(this.page.getByRole('heading', {name: 'Participant Page'})).toBeVisible();
    await expect(this.page.getByRole('cell', {name: participantGUID})).toBeVisible();
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
