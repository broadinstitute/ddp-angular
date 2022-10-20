import { expect, Locator, Page } from '@playwright/test';
import Table from 'lib/widget/table';
import { SingularPage } from 'pages/singular/singular-page';

export default class MyDashboardPage extends SingularPage {
  private readonly _enrollMyselfButton: Locator;
  private readonly _enrollMyChildButton: Locator;
  private readonly _enrollMyAdultDependentButton: Locator;
  private readonly viewFamilyEnrollmentMessageButton: Locator;

  constructor(page: Page) {
    super(page);
    this._enrollMyselfButton = this.page.locator('button', { hasText: 'Enroll myself' });
    this._enrollMyChildButton = this.page.locator('button', { hasText: 'Enroll my child' });
    this._enrollMyAdultDependentButton = this.page.locator('button', { hasText: 'Enroll my adult dependent' });
    this.viewFamilyEnrollmentMessageButton = this.page.locator('button', { hasText: 'View Family Enrollment Message' });
  }

  async waitForReady() {
    await expect(this.page.locator('h1.title')).toHaveText('My Dashboard');
    await expect(this.page.locator('h1.title')).toBeVisible();
    await expect(this.viewFamilyEnrollmentMessageButton).toBeVisible();
    await expect(this.page.locator('.family-enrollment-description-message')).toBeVisible();
  }

  /**
   * Returns locator to the enrollment status text
   */
  status(): Locator {
    return this.page.locator('.enrollmentStatusCompleteText');
  }

  getDashboardTable(): Table {
    return new Table(this.page, { classAttribute: '.dashboard-table' });
  }

  async viewFamilyEnrollmentMessage(): Promise<void> {
    await this.clickAndWaitForNav(this.viewFamilyEnrollmentMessageButton, { waitForNav: true });
  }

  /**
   * Returns locator to the "Enroll myself" button
   */
  enrollMyselfButton(): Locator {
    return this._enrollMyselfButton;
  }

  /**
   * Returns locator to the "Enroll my child" button
   */
  enrollMyChildButton(): Locator {
    return this._enrollMyChildButton;
  }

  /**
   * Returns locator to the "Enroll my adult dependent" button
   */
  enrollMyAdultDependentButton(): Locator {
    return this._enrollMyAdultDependentButton;
  }

  /** Click "Enroll myself" button */
  async enrollMyself(): Promise<void> {
    await this.enrollMyselfButton().click();
  }

  /** Click "Enroll my child" button */
  async enrollMyChild(): Promise<void> {
    await this.enrollMyChildButton().click();
  }

  /** Click "Enroll my adult dependent" button */
  async enrollMyAdultDependent(): Promise<void> {
    await this.enrollMyAdultDependentButton().click();
  }
}
