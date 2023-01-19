import { expect, Locator, Page } from '@playwright/test';
import Input from 'lib/widget/Input';
import { waitForNoSpinner } from 'utils/test-utils';
import Table from 'lib/widget/table';
import Checkbox from 'lib/widget/checkbox';
import ParticipantPage from './participant-page';

export enum SearchFieldLabel {
  ShortId = 'Short ID'
}

export default class ParticipantListPage {
  private readonly table: Table = new Table(this.page);
  private readonly pageTitle: string = 'Participant List';

  constructor(private readonly page: Page) {}

  openSearchButton(): Locator {
    return this.page.locator('text=Search >> button');
  }

  searchButton(): Locator {
    return this.page.locator('button:has-text("Search") >> nth=0');
  }

  public get getTitle(): Locator {
    return this.page.locator('h1');
  }

  public async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    await expect(this.openSearchButton()).toBeEnabled();
  }

  public async selectParticipant(): Promise<any> {
    await new Checkbox(this.page, { root: this.table.cell(0, 0) }).check();
  }

  public async search(searchField: SearchFieldLabel, searchString: string): Promise<void> {
    const input = new Input(this.page, { label: searchField, root: this.page.locator('//app-filter-column') });
    await input.toLocator().type(searchString);
    await Promise.all([this.page.locator('.fa-spinner').waitFor({ state: 'visible' }), this.searchButton().click()]);
  }

  public async filterMedicalRecordParticipants(): Promise<void> {
    await this.page.locator('text=Customize View >> button').click();
    await this.page.locator('text=Medical Record Columns').click();
    await this.page.locator('text=Initial MR Received').check();
    await this.page.locator('text=Search >> button').click();
    await this.page.locator('text=Initial MR Received mm/dd/yyyy * Today >> button >> nth=2').click();
    await this.page.locator('text=Not Empty').check();
    await this.page.locator("button:has-text('Search') >> nth=0").click();
  }

  public async addBulkCohortTags(): Promise<void> {
    await this.page.locator('button:right-of(:text("Initial MR Received"))').nth(17).click();
  }

  public async clickParticipantAt(rowIndex: number): Promise<ParticipantPage> {
    await this.table.cell(rowIndex, 2).click();
    return new ParticipantPage(this.page);
  }

  public async getParticipantShortIdAt(rowIndex: number): Promise<string> {
    return await this.table.cell(rowIndex, 2).innerText();
  }

  private async participantsCount(): Promise<number> {
    return await this.table.rowLocator().count();
  }

  /* assertions */
  async assertPageTitle(): Promise<void> {
    await expect(this.getTitle).toHaveText(this.pageTitle, { timeout: 30 * 1000 });
  }

  async assertParticipantsCountGreaterOrEqual(value: number): Promise<void> {
    await expect(await this.participantsCount()).toBeGreaterThanOrEqual(value);
  }

  async assertParticipantsCount(count: number) {
    await expect(this.table.rowLocator()).toHaveCount(count);
  }
}
