import { expect, Locator, Page } from '@playwright/test';
import Question from 'tests/lib/widget/Question';

export default class ConsentFormPage {
  private readonly page: Page;
  readonly next: Locator;
  readonly back: Locator;
  readonly dob: Locator; // Date of Birth

  constructor(page: Page) {
    this.page = page;
    this.next = page.locator('button', { hasText: 'Next' });
    this.back = page.locator('button', { hasText: 'Back' });
    this.dob = page.locator('.ddp-activity-question').filter({ hasText: 'Your Date of Birth' });
  }

  async waitForReady() {
    await this.next.waitFor({ state: 'visible' });
    await expect(this.next).toBeEnabled();
    // Add additional checks here
  }

  firstName(): Locator {
    return new Question(this.page, 'First Name').textInput();
  }

  lastName(): Locator {
    return new Question(this.page, 'Last Name').textInput();
  }

  signature(): Locator {
    return new Question(this.page, 'Your Signature (Study Participant)').textInput();
  }

  authorizationSignature(): Locator {
    return new Question(this.page, 'AUTHORIZATION SIGNATURE').textInput();
  }

  async enterDateOfBirth(month: number, date: number, year: number): Promise<void> {
    await this.dob.locator('input[data-placeholder="MM"]').fill(month.toString());
    await this.dob.locator('input[data-placeholder="DD"]').fill(date.toString());
    await this.dob.locator('input[data-placeholder="YYYY"]').fill(year.toString());
  }

  wantToKnowSecondaryFinding(answer: string): Locator {
    return new Question(this.page, 'If a secondary finding is found in my genes').checkbox(answer);
  }

  async agree(): Promise<void> {
    const agreeButton = this.page.locator('button', { hasText: 'I agree' });
    await Promise.all([this.page.waitForNavigation(), agreeButton.click()]);
  }
}
