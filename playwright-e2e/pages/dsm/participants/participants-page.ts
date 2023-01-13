import { expect, Locator, Page } from '@playwright/test';
import Input from 'lib/widget/Input';
import { waitForNoSpinner } from 'utils/test-utils';

export enum SearchFieldLabel {
  ShortId = 'Short ID'
}

export default class ParticipantsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    await expect(this.openSearchButton()).toBeEnabled();
  }

  openSearchButton(): Locator {
    return this.page.locator('text=Search >> button');
  }

  reloadWithDefaultViewer(): Locator {
    return this.page.locator('text=Reload With Default Filter >> button');
  }

  customizeView(): Locator {
    return this.page.locator('text=Customize View >> button');
  }

  saveCurrentView(): Locator {
    return this.page.locator('text=Save Current View >> button');
  }

  saveFilters(): Locator {
    return this.page.locator('text=Save Filters >> button');
  }

  searchButton(): Locator {
    return this.page.locator('button:has-text("Search") >> nth=0');
  }

  MedicalRecordColumnsDropDown(): Locator {
    return this.page.locator('button.btn.btn-primary.dropdown-toggle >> nth=2');
  }

  async search(searchField: SearchFieldLabel, searchString: string): Promise<void> {
    const input = new Input(this.page, { label: searchField, root: this.page.locator('//app-filter-column') });
    await input.toLocator().type(searchString);
    await Promise.all([this.page.locator('.fa-spinner').waitFor({ state: 'visible' }), this.searchButton().click()]);
  }

  async filterMedicalRecordParticipants(): Promise<void> {
    await this.page.locator('text=Customize View >> button').click();
    await this.page.locator('text=Medical Record Columns').click();
    await this.page.locator('text=Initial MR Received').check();
    await this.page.locator('text=Search >> button').click();
    await this.page.locator('text=Initial MR Received mm/dd/yyyy * Today >> button >> nth=2').click();
    await this.page.locator('text=Not Empty').check();
    await this.page.locator("button:has-text('Search') >> nth=0").click();
  }
}
