import { expect, Locator, Page } from '@playwright/test';

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
  private readonly title: Locator;
  private readonly status: Locator;
  private readonly enrollMyselfButton: Locator;
  private readonly whoHasVentricleHeartDefect: Locator;
  private readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1.title');
    this.status = page.locator('.enrollmentStatusCompleteText');
    this.enrollMyselfButton = page.locator('button', { hasText: 'Enroll myself' });
    this.nextButton = page.locator('button', { hasText: 'Next' });
    this.whoHasVentricleHeartDefect = page
      .locator('.ddp-activity-question')
      .filter({ hasText: 'Who in your family has single ventricle heart defect?' });
  }

  async waitForReady() {
    await expect(this.title).toEqual('My Dashboard');
    await expect(this.enrollMyselfButton).toBeVisible();
    // Add additional checks here
  }

  get enrollMyselfLocator() {
    return this.enrollMyselfButton;
  }

  get titleLocator() {
    return this.title;
  }

  get statusTextLocator() {
    return this.status;
  }

  async checkWhoHasVentricHeartDefect(who: WHO): Promise<void> {
    const checkbox = this.whoHasVentricleHeartDefect.locator('label', {
      has: this.page.locator('css=input[type="checkbox"]'),
      hasText: who
    });
    await checkbox.check();
  }

  async clickNextButton(): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), this.nextButton.click()]);
  }
}
