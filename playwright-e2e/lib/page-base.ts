import { Locator, Page } from '@playwright/test';

export default abstract class PageBase {
  protected page: Page;
  protected _nextButton: Locator;

  protected constructor(page: Page) {
    this.page = page;
    this._nextButton = this.page.locator('button', { hasText: 'Next' });
  }

  nextButton(): Locator {
    return this._nextButton;
  }

  protected async clickHelper(locator: Locator, opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = false } = opts;
    const navigationPromise = waitForNav ? this.page.waitForNavigation() : Promise.resolve();
    await Promise.all([navigationPromise, this.page.waitForLoadState('domcontentloaded'), locator.click()]);
  }

  /** Click "Next" button */
  async next(opts: { waitForNav?: boolean } = {}): Promise<void> {
    await this.clickHelper(this.nextButton(), opts);
  }

  /** Click "Back" button */
  async back(): Promise<void> {
    const backButton = this.page.locator('button', { hasText: 'Back' });
    await this.clickHelper(backButton);
  }

  /** Click "Submit" button */
  async submit(): Promise<void> {
    const submitButton = this.page.locator('button', { hasText: 'Submit' });
    await this.clickHelper(submitButton, { waitForNav: true });
  }

  /** Click "Agree" button */
  async agree(): Promise<void> {
    const agreeButton = this.page.locator('button', { hasText: 'I agree' });
    await this.clickHelper(agreeButton, { waitForNav: true });
  }

  /** Click "I am not ready to agree" button */
  async notReadyToAgree(): Promise<void> {
    const notReadyButton = this.page.locator('button', { hasText: 'I am not ready to agree' });
    await this.clickHelper(notReadyButton, { waitForNav: true });
  }
}
