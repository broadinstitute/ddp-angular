import { Locator, Page, Response } from '@playwright/test';
import { PageInterface } from './page-interface';

export default abstract class PageBase implements PageInterface {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  protected constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  abstract waitForReady(): Promise<void>;
  abstract getBackButton(): Locator;

  /**
   * Return "Next" button locator
   */
  getNextButton(): Locator {
    return this.page.locator('button', { hasText: 'Next' });
  }

  /**
   * Returns "Submit" button locator
   */
  getSubmitButton(): Locator {
    return this.page.locator('button', { hasText: 'Submit' });
  }

  /**
   * Returns "I Agree" button locator
   */
  getIAgreeButton(): Locator {
    return this.page.locator('button', { hasText: 'I agree' });
  }

  /**
   * Returns "I'm not ready to agree" button
   */
  getIAmNotReadyToAgreeButton(): Locator {
    return this.page.locator('button', { hasText: 'I am not ready to agree' });
  }

  async gotoURL(url: string): Promise<Response | null> {
    return this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async gotoURLPath(urlPath = ''): Promise<Response | null> {
    if (urlPath.startsWith('https')) {
      throw Error('Parameter urlPath is not valid.');
    }
    return this.page.goto(`${this.baseUrl}${urlPath}`, { waitUntil: 'domcontentloaded' });
  }

  protected async clickAndWaitForNav(locator: Locator, opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = false } = opts;
    waitForNav ? await this.waitForNavAfter(() => locator.click()) : await locator.click();
  }

  protected async waitForNavAfter(fn: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), fn()]);
  }

  /** Click "Next" button */
  async next(opts: { waitForNav?: boolean } = {}): Promise<void> {
    await this.clickAndWaitForNav(this.getNextButton(), opts);
  }

  /** Click "Back" button */
  async back(): Promise<void> {
    await this.clickAndWaitForNav(this.getBackButton());
  }

  /** Click "Submit" button */
  async submit(): Promise<void> {
    await this.clickAndWaitForNav(this.getSubmitButton(), { waitForNav: true });
  }

  /** Click "Agree" button */
  async agree(): Promise<void> {
    await this.clickAndWaitForNav(this.getIAgreeButton(), { waitForNav: true });
  }

  /** Click "I am not ready to agree" button */
  async notReadyToAgree(): Promise<void> {
    await this.clickAndWaitForNav(this.getIAmNotReadyToAgreeButton(), { waitForNav: true });
  }
}
