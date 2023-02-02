import { expect, Locator, Page } from '@playwright/test';
import Table from 'lib/component/table';
import Button from 'lib/widget/button';
import { PancanPageBase } from 'pages/pancan/pancan-page-base';

export default class DashboardPage extends PancanPageBase {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1.dashboard-title-section__title span')).toHaveText('Participant Dashboard');
    await expect(this.page.locator('h1.dashboard-title-section__title')).toBeVisible();
    await expect(this.page.locator('.infobox.infobox_dashboard')).toBeVisible();
  }

  /**
   * Returns locator to the enrollment status text
   */
  status(): Locator {
    return this.page.locator('.enrollmentStatusCompleteText');
  }

  getDashboardTable(nth = 0): Table {
    return new Table(this.page, { ddpTestID: 'activitiesTable', nth });
  }

  /**
   * Returns locator to the "Enroll myself" button
   */
  getEnrollMyselfButton(): Locator {
    return this.page.locator('button', { hasText: 'Enroll myself' });
  }

  /**
   * Returns locator to the "Enroll my adult dependent" button
   */
  getEnrollMyAdultDependentButton(): Locator {
    return this.page.locator('button', { hasText: 'Enroll my adult dependent' });
  }

  /** Click "Enroll myself" button */
  async enrollMyself(): Promise<void> {
    await this.getEnrollMyselfButton().click();
  }

  /** Click "Enroll my adult dependent" button */
  async enrollMyAdultDependent(): Promise<void> {
    await this.getEnrollMyAdultDependentButton().click();
  }

  /**
   * Click Add Participant button
   * @returns {Promise<void>}
   */
  async addParticipant(): Promise<void> {
    const button = new Button(this.page, { root: 'section', label: 'Add Participant' });
    await button.click();
  }
}
