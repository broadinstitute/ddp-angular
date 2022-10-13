import { expect, Locator, Page } from '@playwright/test';
import Table from 'lib/widget/table';
import PageBase from 'lib/page-base';

export default class MyDashboardPage extends PageBase {
  private readonly _enrollMyselfButton: Locator;
  private readonly _enrollMyChildButton: Locator;
  private readonly viewFamilyEnrollmentMessageButton: Locator;

  constructor(page: Page) {
    super(page);
    this._enrollMyselfButton = this.page.locator('button', { hasText: 'Enroll myself' });
    this._enrollMyChildButton = this.page.locator('button', { hasText: 'Enroll my child' });
    this.viewFamilyEnrollmentMessageButton = this.page.locator('button', { hasText: 'View Family Enrollment Message' });
  }

  async waitForReady() {
    await expect(this.page.locator('h1.title')).toHaveText('My Dashboard');
    await expect(this.page.locator('h1.title')).toBeVisible();
    await expect(this.viewFamilyEnrollmentMessageButton).toBeVisible();
    await expect(this.page.locator('.family-enrollment-description-message')).toBeVisible();
  }

  status(): Locator {
    return this.page.locator('.enrollmentStatusCompleteText');
  }

  getDashboardTable(): Table {
    return new Table(this.page, { classAttribute: '.dashboard-table' });
  }

  async viewFamilyEnrollmentMessage(): Promise<void> {
    await this.clickHelper(this.viewFamilyEnrollmentMessageButton, { waitForNav: true });
  }

  enrollMyselfButton(): Locator {
    return this._enrollMyselfButton;
  }

  enrollMyChildButton(): Locator {
    return this._enrollMyChildButton;
  }

  /** Click "Enroll myself" button */
  async enrollMyself(): Promise<void> {
    await this.enrollMyselfButton().click();
  }

  /** Click "Enroll my child" button */
  async enrollMyChild(): Promise<void> {
    await this.enrollMyChildButton().click();
  }
}
