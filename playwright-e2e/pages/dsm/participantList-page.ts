import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { Filters } from 'lib/component/dsm/filters/filters';
import { ParticipantListTable } from 'lib/component/dsm/tables/participantListTable';
import {rows} from "lib/component/dsm/paginators/types/rowsPerPage";

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';

  private readonly _filters: Filters = new Filters(this.page);
  private readonly _table: ParticipantListTable = new ParticipantListTable(this.page);

  constructor(private readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public get filters(): Filters {
    return this._filters;
  }

  public async goToPage(page: number): Promise<void> {
    await this._table.goToPage(page);
  }

  public async nextPage(): Promise<void> {
    await this._table.nextPage();
  }

  public async previousPage(): Promise<void> {
    await this._table.previousPage();
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this._table.rowsPerPage(rows);
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
