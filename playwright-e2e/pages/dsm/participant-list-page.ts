import { APIRequestContext, expect, Locator, Page } from '@playwright/test';
import Modal from 'lib/component/dsm/modal';
import { StudyNavEnum } from 'lib/component/dsm/navigation/enums/studyNav-enum';
import { Navigation } from 'lib/component/dsm/navigation/navigation';
import { WelcomePage } from 'pages/dsm/welcome-page';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { Filters } from 'lib/component/dsm/filters/filters';
import { ParticipantListTable } from 'lib/component/dsm/tables/participantListTable';

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
      waitForResponse(this.page, { uri: '/ui/saveFilter?', requestMethod: 'PATCH' })
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
