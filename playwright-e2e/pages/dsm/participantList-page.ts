import { expect, Locator, Page } from '@playwright/test';

import { waitForNoSpinner } from 'utils/test-utils';
import { Filters } from 'lib/component/dsm/filters/filters';
import { Table } from 'lib/component/dsm/table/table';

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';

  private readonly _filters: Filters = new Filters(this.page);
  private readonly _table: Table = new Table(this.page);

  constructor(private readonly page: Page) {}

  public get title(): Locator {
    return this.page.locator('h1');
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public get filters(): Filters {
    return this._filters;
  }

  public get participantListTable(): Table {
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
