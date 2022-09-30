import { expect, Locator, Page } from '@playwright/test';

export default class ConsentFormPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly nextButton: Locator;
  private readonly backButton: Locator;
  private readonly dob: Locator; // Date of Birth
  private readonly foundSecondaryFinding: Locator;
  private readonly agreeButton: Locator; // I agree button
  private readonly yourSignatureInput: Locator;
  private readonly authorizationSignatureInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nextButton = page.locator('button', { hasText: 'Next' });
    this.backButton = page.locator('button', { hasText: 'Back' });
    this.agreeButton = page.locator('button', { hasText: 'I agree' });
    this.firstNameInput = page.locator('input[data-placeholder="First Name"]');
    this.lastNameInput = page.locator('input[data-placeholder="Last Name"]');
    this.dob = page.locator('.ddp-activity-question').filter({ hasText: 'Your Date of Birth' });
    this.foundSecondaryFinding = page
      .locator('.ddp-activity-question')
      .filter({ hasText: 'If a secondary finding is found in my genes:*' });
    this.yourSignatureInput = page
      .locator('.ddp-activity-question')
      .filter({ hasText: 'Your Signature (Study Participant):*' });
    this.authorizationSignatureInput = page
      .locator('.ddp-activity-question')
      .filter({ hasText: 'AUTHORIZATION SIGNATURE*' });
  }

  async waitForReady() {
    await expect(this.nextButton).toBeEnabled();
    // Add additional checks here
  }

  async clickNextButton(): Promise<void> {
    await this.nextButton.click();
  }

  async clickIAgreeButton(): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), this.agreeButton.click()]);
  }

  async fillFirstName(fname: string): Promise<void> {
    await this.firstNameInput.fill(fname);
  }

  async fillLastName(lname: string): Promise<void> {
    await this.lastNameInput.fill(lname);
  }

  async fillYourSignature(name: string): Promise<void> {
    await this.yourSignatureInput.locator('input').fill(name);
  }

  async fillAuthorizationSignature(name: string): Promise<void> {
    await this.authorizationSignatureInput.locator('input').fill(name);
  }

  async enterDateOfBirth(month: number, date: number, year: number): Promise<void> {
    await this.dob.locator('input[data-placeholder="MM"]').fill(month.toString());
    await this.dob.locator('input[data-placeholder="DD"]').fill(date.toString());
    await this.dob.locator('input[data-placeholder="YYYY"]').fill(year.toString());
  }

  async checkIWantToKnowSecondaryFinding(yes: boolean): Promise<void> {
    if (yes) {
      const checkbox = this.foundSecondaryFinding.locator('label', {
        has: this.page.locator('css=input[type="checkbox"]'),
        hasText: 'I want to know.'
      });
      return await checkbox.check();
    }
    const checkbox = this.foundSecondaryFinding.locator('label', {
      has: this.page.locator('css=input[type="checkbox"]'),
      hasText: 'I do not want to know.'
    });
    await checkbox.check();
  }
}
