import { expect, Locator, Page } from '@playwright/test';

import { waitForNoSpinner } from 'utils/test-utils';
import Checkbox from 'lib/widget/checkbox';
import ParticipantPage from './participant-page';
import { Filters } from '../../lib/component/dsm/filters/filters';

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';

  private readonly _filters: Filters = new Filters(this.page);

  constructor(private readonly page: Page) {}

  public get title(): Locator {
    return this.page.locator('h1');
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async selectParticipant(): Promise<any> {
    await new Checkbox(this.page, { root: this.tableRowsLocator.nth(0).locator('[role="cell"], td').nth(0) }).check();
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public async clickParticipantAt(rowIndex: number): Promise<ParticipantPage> {
    await this.tableRowsLocator.nth(rowIndex).locator('[role="cell"], td').nth(2).click();
    return new ParticipantPage(this.page);
  }

  public async getParticipantShortIdAt(rowIndex: number): Promise<string> {
    return this.tableRowsLocator.nth(rowIndex).locator('[role="cell"], td').nth(2).innerText();
  }

  public get filters(): Filters {
    return this._filters;
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
