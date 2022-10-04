import { expect, Locator, Page } from '@playwright/test';
import Question from 'tests/lib/widget/Question';
import Table from 'tests/lib/widget/table';

export enum WHO {
  Me = 'Me',
  MyBirthMother = 'My birth mother',
  MyBirthFather = 'My birth father',
  MyBirthSister = 'My birth sister',
  MyBirthBrother = 'My birth brother',
  MyBirthDaughter = 'My birth daughter',
  MyBirthSon = 'My birth son',
  SomeoneElse = 'Someone else'
}

export default class MyDashboardPage {
  private readonly page: Page;
  readonly enrollMyself: Locator;
  readonly next: Locator;
  readonly viewFamilyEnrollmentMessageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.enrollMyself = this.page.locator('button', { hasText: 'Enroll myself' });
    this.next = this.page.locator('button', { hasText: 'Next' });
    this.viewFamilyEnrollmentMessageButton = this.page.locator('button', { hasText: 'View Family Enrollment Message' });
  }

  async waitForReady() {
    await expect(this.title()).toHaveText('My Dashboard');
    await expect(this.viewFamilyEnrollmentMessageButton).toBeVisible();
  }

  title(): Locator {
    return this.page.locator('h1.title');
  }

  status(): Locator {
    return this.page.locator('.enrollmentStatusCompleteText');
  }

  whoHasVentricleHeartDefect(who: WHO): Locator {
    return new Question(this.page, 'Who in your family has single ventricle heart defect?').checkbox(
      new RegExp(`^${who}$`)
    );
    /*
    const checkbox = this.whoHasVentricleHeartDefect.locator('label', {
      has: this.page.locator('css=input[type="checkbox"]'),
      hasText: who
    });
    await checkbox.check(); */
  }

  getDashboardTable(): Table {
    return new Table(this.page, { classAttribute: '.dashboard-table' });
  }

  async viewFamilyEnrollmentMessage(): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), this.viewFamilyEnrollmentMessageButton.click()]);
  }
}
