import { Locator, Page, expect } from '@playwright/test';
import DsmPageBase from 'dsm/pages/dsm-page-base';
import { waitForResponse } from 'utils/test-utils';

export enum QuickFilterEnum {
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

export default class QuickFilte extends DsmPageBase {
  constructor(page: Page) {
    super(page);
  }

  public getLocator(quickFilter: QuickFilterEnum): Locator {
    return this.page.locator(`//button[.//*[@data-icon="${quickFilter}"] | .//*[contains(@class,"${quickFilter}")]]`);
  }

  public async isFocused(quickFilter: QuickFilterEnum): Promise<boolean> {
    await expect(this.getLocator(quickFilter)).toBeVisible();
    const cls = await this.getLocator(quickFilter).getAttribute('class');
    if (cls) {
      return cls.includes('mat-primary');
    }
    return false;
  }

  public async click(quickFilter: QuickFilterEnum): Promise<void> {
    await Promise.all([
      waitForResponse(this.page, { uri: '/applyFilter'}),
      this.getLocator(quickFilter).click()
    ]);
    await expect(async () => {
      expect(await this.isFocused(quickFilter)).toBeTruthy();
    }).toPass();
  }
}
