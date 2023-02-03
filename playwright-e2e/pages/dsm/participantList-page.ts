import { expect, Locator, Page } from '@playwright/test';
import Input from 'lib/widget/Input';
import { waitForNoSpinner } from 'utils/test-utils';
import Table from 'lib/component/table';
import Checkbox from 'lib/widget/checkbox';
import ParticipantPage from './participant-page';
import {Search} from "../../lib/component/dsm/filters/sections/search/search";
import {CustomizeView} from "../../lib/component/dsm/filters/sections/customize-view";
import {Filters} from "../../lib/component/dsm/filters/filters";

export enum SearchFieldLabel {
  ShortId = 'Short ID'
}

export default class ParticipantListPage {
  private readonly PAGE_TITLE: string = 'Participant List';

  private readonly _table: Table = new Table(this.page);
  private readonly _filters: Filters = new Filters(this.page);

  constructor(private readonly page: Page) {}

  public get title(): Locator {
    return this.page.locator('h1');
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
  }

  public async selectParticipant(): Promise<any> {
    await new Checkbox(this.page, { root: this._table.cell(0, 0) }).check();
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('//button[.//*[@tooltip="Bulk Cohort Tag"]]').click();
  }

  public async clickParticipantAt(rowIndex: number): Promise<ParticipantPage> {
    await this._table.cell(rowIndex, 2).click();
    return new ParticipantPage(this.page);
  }

  public async getParticipantShortIdAt(rowIndex: number): Promise<string> {
    return await this._table.cell(rowIndex, 2).innerText();
  }

  public get filters(): Filters {
    return this._filters;
  }

  private async participantsCount(): Promise<number> {
    return await this._table.rowLocator().count();
  }

  /* assertions */
  async assertPageTitle(): Promise<void> {
    await expect(this.title).toHaveText(this.PAGE_TITLE, { timeout: 30 * 1000 });
  }

  async assertParticipantsCountGreaterOrEqual(value: number): Promise<void> {
    await expect(await this.participantsCount()).toBeGreaterThanOrEqual(value);
  }

  async assertParticipantsCount(count: number) {
    await expect(this._table.rowLocator()).toHaveCount(count);
  }
}
