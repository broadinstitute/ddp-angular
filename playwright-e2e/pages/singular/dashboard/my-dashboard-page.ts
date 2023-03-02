import { expect, Locator, Page } from '@playwright/test';
import { WHO } from 'data/constants';
import * as user from 'data/fake-user.json';
import Table from 'lib/component/table';
import EnrollMyChildPage from 'pages/singular/enrollment/enroll-my-child-page';
import { SingularPage } from 'pages/singular/singular-page';

export default class MyDashboardPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('h1.title')).toHaveText('My Dashboard');
    await expect(this.page.locator('h1.title')).toBeVisible();
    await expect(this.getViewFamilyEnrollmentMessageButton()).toBeVisible();
    await expect(this.page.locator('.family-enrollment-description-message')).toBeVisible();
  }

  /**
   * Returns locator to the enrollment status text
   */
  status(): Locator {
    return this.page.locator('.enrollmentStatusCompleteText');
  }

  getDashboardTable(): Table {
    return new Table(this.page, { cssClassAttribute: '.dashboard-table' });
  }

  getViewFamilyEnrollmentMessageButton(): Locator {
    return this.page.locator('button', { hasText: 'View Family Enrollment Message' });
  }

  async viewFamilyEnrollmentMessage(): Promise<void> {
    await this.clickAndWaitForNav(this.getViewFamilyEnrollmentMessageButton(), { waitForNav: true });
  }

  /**
   * Returns locator to the "Enroll myself" button
   */
  getEnrollMyselfButton(): Locator {
    return this.page.locator('button', { hasText: 'Enroll myself' });
  }

  /**
   * Returns locator to the "Enroll my child" button
   */
  getEnrollMyChildButton(): Locator {
    return this.page.locator('button', { hasText: 'Enroll my child' });
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

  /** Click "Enroll my child" button. Complete Enroll my child form. */
  async enrollMyChild(
    opts: { who?: string; age?: string; country?: string; state?: string; cognitiveImpairment?: string | null } = {}
  ): Promise<void> {
    const {
      who = WHO.TheChildBeingEnrolled,
      age = user.child.age,
      country = user.child.country.abbreviation,
      state = user.child.state.abbreviation,
      cognitiveImpairment = 'No'
    } = opts;
    await this.getEnrollMyChildButton().click();
    const enrollMyChildPage = new EnrollMyChildPage(this.page);
    await enrollMyChildPage.whoInChildFamilyHasVentricleHeartDefect().check(who);
    await enrollMyChildPage.howOldIsYourChild().fill(age);
    await enrollMyChildPage.fillInCountry(country, { state });
    if (cognitiveImpairment) {
      await enrollMyChildPage.doesChildHaveCognitiveImpairment().check(cognitiveImpairment, { exactMatch: true });
    }
  }

  /** Click "Enroll my adult dependent" button */
  async enrollMyAdultDependent(): Promise<void> {
    await this.getEnrollMyAdultDependentButton().click();
  }
}
