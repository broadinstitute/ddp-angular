import { expect, Locator, Page, Response } from '@playwright/test';
import Question from 'lib/component/Question';
import { waitUntilRemoved } from 'utils/test-utils';
import { PageInterface } from './page-interface';

export default abstract class PageBase implements PageInterface {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  protected constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  abstract waitForReady(): Promise<void>;

  /**
   * Return "Back" button locator
   */
  getBackButton(): Locator {
    return this.page.locator('button', { hasText: 'Back' });
  }

  /**
   * Returns "Log In" button locator
   */
  getLogInButton(): Locator {
    return this.page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")');
  }

  /**
   * Returns "Log Out" button locator
   */
  getLogOutButton(): Locator {
    return this.page.locator('.header button[data-ddp-test="signOutButton"]:has-text("Log Out")');
  }

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

  async gotoURL(url = '/'): Promise<Response | null> {
    return this.page.goto(url, { waitUntil: 'load' });
  }

  async gotoURLPath(urlPath = ''): Promise<Response | null> {
    if (urlPath.startsWith('https')) {
      throw Error('Parameter urlPath is not valid.');
    }
    return this.page.goto(`${this.baseUrl}${urlPath}`, { waitUntil: 'load' });
  }

  /**
   *
   * @param {Locator} locator
   * @param {{waitForNav?: boolean, forceClick?: boolean}} opts
   *  <br> - forceClick: Whether to skip error message check before click. If set to true, click regardless any error on page. Defaults to false.
   *  <br> - waitForNav: Whether to wait for page navigation to complete after click. Defaults to false.
   * @returns {Promise<void>}
   * @protected
   */
  protected async clickAndWaitForNav(locator: Locator, opts: { waitForNav?: boolean; forceClick?: boolean } = {}): Promise<void> {
    const { waitForNav = false, forceClick = false } = opts;
    if (!forceClick && waitForNav) {
      await waitUntilRemoved(this.page.locator('.error-message'));
    }
    waitForNav ? await this.waitForNavAfter(() => locator.click()) : await locator.click();
  }

  protected async waitForNavAfter(fn: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'load' }), fn()]);
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
    await expect(this.getIAgreeButton()).toBeEnabled();
    await this.clickAndWaitForNav(this.getIAgreeButton(), { waitForNav: true });
  }

  /** Click "I am not ready to agree" button */
  async notReadyToAgree(): Promise<void> {
    await this.clickAndWaitForNav(this.getIAmNotReadyToAgreeButton(), { waitForNav: true });
  }

  /** Click "Log Out" button */
  async logOut(): Promise<void> {
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'load' }), this.getLogOutButton().click()]);
  }

  /**
   * <br> Question: Date of Birth
   * <br> Type: Input
   * @param month
   * @param date
   * @param year
   */
  async fillInDateOfBirth(month: number | string, date: number | string, year: number | string): Promise<void> {
    const dob = new Question(this.page, { prompt: 'Date of Birth' });
    await dob.date().locator('input[data-placeholder="MM"]').fill(month.toString());
    await dob.date().locator('input[data-placeholder="DD"]').fill(date.toString());
    await dob.date().locator('input[data-placeholder="YYYY"]').fill(year.toString());
  }
}
