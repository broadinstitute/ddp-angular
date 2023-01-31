import { expect, Locator, Page, Response } from '@playwright/test';
import Address from 'lib/component/address';
import Question from 'lib/component/Question';
import Input from 'lib/widget/Input';
import { generateRandomPhoneNum } from 'utils/faker-utils';
import { waitForNoSpinner } from 'utils/test-utils';
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
    return this.page.locator('button:visible', { hasText: 'Back' });
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
    return this.page.locator('button:visible', { hasText: 'Next' });
  }

  /**
   * Returns "Submit" button locator
   */
  getSubmitButton(): Locator {
    return this.page.locator('button:visible', { hasText: 'Submit' });
  }

  /**
   * Returns "I Agree" button locator
   */
  getIAgreeButton(): Locator {
    return this.page.locator('button:visible', { hasText: 'I agree' });
  }

  /**
   * Returns "I'm not ready to agree" button
   */
  getIAmNotReadyToAgreeButton(): Locator {
    return this.page.locator('button:visible', { hasText: 'I am not ready to agree' });
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
      await expect(this.page.locator('.error-message')).toBeHidden();
    }
    waitForNav ? await this.waitForNavAfter(() => locator.click()) : await locator.click();
  }

  protected async waitForNavAfter(fn: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForNavigation({ waitUntil: 'load' }), fn()]);
    await waitForNoSpinner(this.page);
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
  async submit(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = true } = opts;
    await this.clickAndWaitForNav(this.getSubmitButton(), { waitForNav });
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

  /**
   * Filling out address form.
   * @param opts
   */
  async fillInContactAddress(opts: {
    fullName: string;
    country?: string;
    state?: string;
    street?: string;
    city?: string;
    zipCode?: string;
    telephone?: string | number;
    phoneLabel?: string;
  }): Promise<void> {
    const {
      fullName,
      country = 'UNITED STATES',
      state = 'MASSACHUSETTS',
      street = '415 MAIN ST',
      city = 'CAMBRIDGE',
      zipCode = '02142',
      telephone = generateRandomPhoneNum(),
      phoneLabel = 'Telephone Contact Number'
    } = opts;

    const mailAddressForm = new Address(this.page, { label: new RegExp(/contact information|Mailing Address/) });
    await mailAddressForm.input('Full Name').fill(fullName);
    await mailAddressForm.select('Country').selectOption(country);
    await mailAddressForm.select('State').selectOption(state);
    // Wait for data saved to database after fill out Street, City and Zip Code.
    await Promise.all([
      mailAddressForm.input('Street Address').fill(street.toUpperCase()),
      this.page.waitForResponse((resp) => {
        return (
          resp.request().method() === 'PUT' &&
          resp.url().includes('/profile/address/') &&
          resp.status() === 204 &&
          resp.request().postDataJSON().street1 === street.toUpperCase()
        );
      })
    ]);
    await Promise.all([
      mailAddressForm.input('City').fill(city.toUpperCase()),
      // Wait until data saved
      this.page.waitForResponse((resp) => {
        return (
          resp.request().method() === 'PUT' &&
          resp.url().includes('/profile/address/') &&
          resp.status() === 204 &&
          resp.request().postDataJSON().city === city.toUpperCase()
        );
      })
    ]);
    await Promise.all([
      mailAddressForm.input('Zip Code').fill(zipCode),
      this.page.waitForResponse((resp) => {
        return (
          resp.request().method() === 'PUT' &&
          resp.url().includes('/profile/address/') &&
          resp.status() === 204 &&
          resp.request().postDataJSON().zip === zipCode.toUpperCase()
        );
      }),
      this.page.waitForResponse((resp) => {
        return resp.request().method() === 'POST' && resp.url().includes('/address/verify') && resp.status() === 200;
      })
    ]);
    await mailAddressForm.input(phoneLabel).fill(telephone.toString());
    // Wait for Address Suggestion card
    await mailAddressForm.addressSuggestion().radioButton('As Entered:').check();
  }

  /**
   * COMMON UI FIELDS
   */

  /**
   * <br> Question: How old are you?
   * <br> Type: Input
   */
  age(): Input {
    return new Input(this.page, { ddpTestID: 'answer:AGE' });
  }

  /**
   * Select country.
   * <br> Question: Where do you live? or What country do you live in?
   * <br> Type: Select
   */
  country(): Question {
    return new Question(this.page, { prompt: new RegExp(/(Choose Country)|(Select Country)/i) }); // classAttr: 'picklist-answer-COUNTRY'
  }

  /**
   * Select State.
   * <br> Question: Select State (US and Canada)
   * <br> Type: Select
   */
  state(): Question {
    return new Question(this.page, { prompt: new RegExp(/(Choose State)|(Select State)/i) });
  }

  /**
   * COMMON USER ACTIONS
   */

  async fillInCountry(opts: { country: string; state?: string }): Promise<void> {
    const { country, state } = opts;

    await this.country().select().selectOption(country);
    /*
    // assert in V1.29. Uncomment after upgrade Playwright
    await expect(async () => {
      const selectedOption = await this.country().select().evaluate<string, HTMLSelectElement>((node) => node.value);
      expect(selectedOption).toEqual(country);
    }).toPass();
    */

    if (state) {
      await this.state().select().selectOption(state);
    }
  }
}
