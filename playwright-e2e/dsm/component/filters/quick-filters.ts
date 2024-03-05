import { Locator, Page, expect } from '@playwright/test';
import { waitForResponse } from 'utils/test-utils';

export enum QuickFiltersEnum {
  ABSTRACTION = 'question',
  UNDER_AGE = 'baby',
  PHI_REPORT = 'fa-laptop-medical',
  MEDICAL_RECORDS_NOT_REQUESTED_YET = 'building',
  MEDICAL_RECORDS_NOT_RECEIVED_YET = 'notes-medical',
  PAPER_CR_NEEDED = 'pen-fancy',
  TISSUE_NEEDS_REVIEW = 'book-reader',
  AOM_IN_NEXT_SIX_MONTHS = 'chalkboard-teacher',
  AOM_IN_LAST_SIX_MONTHS = 'user-clock',
}

export default class QuickFilters {
  public static async click(page: Page, quickFilter: QuickFiltersEnum): Promise<void> {
    await new QuickFilters(page).click(quickFilter);
  }

  constructor(private readonly page: Page) {}

  public getLocator(quickFilter: QuickFiltersEnum): Locator {
    return this.page.locator(`//button[.//*[@data-icon="${quickFilter}"] | .//*[contains(@class,"${quickFilter}")]]`);
  }

  public async click(quickFilter: QuickFiltersEnum): Promise<void> {
    const isFocused = await this.isFocused(quickFilter);
    if (!isFocused) {
      await Promise.all([
        waitForResponse(this.page, { uri: '/applyFilter'}),
        this.getLocator(quickFilter).click()
      ]);
      await expect(async () => {
        expect(await this.isFocused(quickFilter)).toBeTruthy();
      }).toPass();
    }
  }

  private async isFocused(quickFilter: QuickFiltersEnum): Promise<boolean> {
    await expect(this.getLocator(quickFilter)).toBeVisible();
    const clas = await this.getLocator(quickFilter).getAttribute('class');
    return clas ? clas?.includes('mat-primary') : false;
  }
}
