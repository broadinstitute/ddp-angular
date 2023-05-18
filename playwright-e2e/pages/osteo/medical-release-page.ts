import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';

import { OsteoPageBase } from 'pages/osteo/osteo-page-base';

export default class MedicalReleasePage extends OsteoPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.activity-header');
  }

  async chooseInstitutionInList(
    index: number,
    searchText: string,
    pressArrowDownTimes: number,
    expectedHit: string,
    city: string,
    state: string,
    country: string
  ): Promise<void> {
    // type the search into the institution typeahead
    await this.page.getByRole('combobox', { name: 'Institution (if any)' }).type(searchText, { delay: 200 });
    await this.page.waitForTimeout(1000);
    for (let i = 0; i < pressArrowDownTimes; i++) {
      await this.page.getByRole('combobox', { name: 'Institution (if any)' }).press('ArrowDown');
    }
    await this.page.getByRole('combobox', { name: 'Institution (if any)' }).press('Enter');
    await expect(this.page.getByLabel('Institution ').nth(index)).toHaveValue(expectedHit);
  }

  async setPhysician(index: number, physicianName: string): Promise<void> {
    await this.page.getByLabel('Physician Name').nth(index).fill(physicianName);
  }

  async addAnotherPhysician(): Promise<void> {
    await this.page.getByRole('button', { name: '+ Add another physician' }).click();
  }

  async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Medical Release Form');
    await waitForNoSpinner(this.page);
  }
}
