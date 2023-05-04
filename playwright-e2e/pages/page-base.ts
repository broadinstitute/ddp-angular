import { expect, Locator, Page, Response } from '@playwright/test';
import Address from 'lib/component/address';
import Institution from 'lib/component/institution';
import Question from 'lib/component/Question';
import Checkbox from 'lib/widget/checkbox';
import Input from 'lib/widget/input';
import { assertSelectedOption } from 'utils/assertion-helper';
import { generateRandomPhoneNum } from 'utils/faker-utils';
import { waitForNoSpinner } from 'utils/test-utils';
import { PageInterface } from './page-interface';
import * as user from 'data/fake-user.json';

/**
 * Labels for the mailing address widget, which can be
 * set differently for different studies
 */
interface MailingAddressLabels {
  city: string;
  country: string;
  phone: string;
  state: string;
  zip: string;
}
interface PhysicianInstitutionAddressLabels extends MailingAddressLabels {
  hospital?: string | RegExp;
  physicianName?: string | RegExp;
}

const defaultMailingAddressLabels: { phone: string, hospital: string, country: string, state: string, city: string, zip: string } = {
  phone: 'Phone',
  hospital: 'Institution',
  country: 'Country',
  state: 'State',
  city: 'City',
  zip: 'Zip Code'
};

export default abstract class PageBase implements PageInterface {
  protected readonly page: Page;
  protected readonly baseUrl: string | undefined;

  protected constructor(page: Page, baseURL?: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  async waitForReady(): Promise<void> {
    await waitForNoSpinner(this.page);
    await expect(this.page).toHaveTitle(/\D+/);
  }

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

  getFinishButton(): Locator {
    return this.page.getByRole('button', { name: 'Finish' });
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
    return this.page.locator('button:visible', {
      hasText: 'I am not ready to agree'
    });
  }

  async gotoURL(url = '/'): Promise<Response | null> {
    return this.page.goto(url, { waitUntil: 'load' });
  }

  async gotoURLPath(urlPath = ''): Promise<Response | null> {
    if (this.baseUrl == null) {
      throw Error('Parameter baseUrl is undefined');
    }
    if (urlPath.startsWith('https')) {
      throw Error('Parameter urlPath is not valid');
    }
    return this.page.goto(`${this.baseUrl}${urlPath}`, { waitUntil: 'load' });
  }

  /**
   *
   * @param {Locator} locator
   * @param {{waitForNav?: boolean, forceClick?: boolean}} opts
   *  <br> - forceClick: Whether to skip error message check before click. If set to true, click regardless any error on page. Defaults to false.
   *  <br> - waitForNav: Whether to wait for page navigation to start after click. Defaults to false.
   * @returns {Promise<void>}
   * @protected
   */
  protected async clickAndWaitForNav(locator: Locator, opts: { waitForNav?: boolean; forceClick?: boolean } = {}): Promise<void> {
    const { waitForNav = false, forceClick = false } = opts;
    if (!forceClick && waitForNav) {
      await expect(this.page.locator('.error-message')).toBeHidden();
    }
    if (waitForNav) {
      await Promise.all([
        locator.click(),
        this.page.waitForResponse(response => response.status() === 200)
      ]);
    } else {
      await locator.click();
    }
  }

  /**
   * <br> Question: By completing this information, you are agreeing to allow us to contact these physician(s) and hospital(s) / institution(s) to obtain your records.
   *
   * @returns {Checkbox}
   */
  async agreeToAllowUsToContactPhysicians(): Promise<void> {
    await new Checkbox(this.page, { label: 'I have already read and signed the informed consent document' }).check();
  }

  async finish(): Promise<void> {
    await Promise.all([
      waitForNoSpinner(this.page),
      this.getFinishButton().click()
    ]);
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
    await this.getLogOutButton().click();
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
    labels?: MaillingAddressLabels;
  }): Promise<void> {
    const {
      fullName,
      country = 'UNITED STATES',
      state = 'MASSACHUSETTS',
      street = '415 MAIN ST',
      city = 'CAMBRIDGE',
      zipCode = '02142',
      telephone = generateRandomPhoneNum()
    } = opts;

    let labels;
    if (!opts.labels) {
      labels = {
        phone: 'Phone',
        country: 'Country',
        state: 'State',
        zip: 'Zip Code',
        city: 'City'
      };
    } else {
      labels = opts.labels;
    }

    const mailAddressForm = new Address(this.page, {
      label: new RegExp(/Your contact information|Contact Information|Mailing Address/)
    });
    await mailAddressForm.toInput('Full Name').fill(fullName);
    await mailAddressForm.toSelect(labels.country).selectOption(country);
    await mailAddressForm.toSelect(labels.state).selectOption(state);
    // Wait for data saved to database after fill out Street, City and Zip Code.
    await Promise.all([
      mailAddressForm.toInput('Street Address').fill(street.toUpperCase()),
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
      mailAddressForm.toInput(labels.city).fill(city.toUpperCase()),
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
      mailAddressForm.toInput(labels.zip).fill(zipCode),
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
    await mailAddressForm.toInput(labels.phone).fill(telephone.toString());
    // Wait for Address Suggestion card
    await mailAddressForm.addressSuggestion()
      .toRadioButton()
      .check('As Entered');
  }

  /**
   * Fill in Country and State if needed.
   * @param {string} country
   * @param {{state?: string}} opts
   * @returns {Promise<void>}
   */
  async fillInCountry(country: string, opts: { state?: string } = {}): Promise<void> {
    const { state } = opts;

    await this.country().toSelect().selectOption(country);
    await assertSelectedOption(this.country().toSelect().toLocator(), country);

    if (state) {
      await this.state().toSelect().selectOption(state);
      await assertSelectedOption(this.state().toSelect().toLocator(), state);
    }
  }

  /**
   *
   * @param {string} fName First name
   * @param {string} lName Last name
   * @param {{firstNameTestId?: string, lastNameTestId?: string}} opts
   * @returns {Promise<void>}
   */
  async fillInName(fName: string, lName: string, opts?: { firstNameTestId: string; lastNameTestId: string }): Promise<void> {
    if (!opts) {
      await this.page.getByRole('combobox', { name: /First Name/ }).fill(fName);
      await this.page.getByRole('combobox', { name: /Last Name/ }).fill(lName);
      return;
    }
    const { firstNameTestId, lastNameTestId } = opts;
    await this.page.getByTestId(firstNameTestId).fill(fName);
    await this.page.getByTestId(lastNameTestId).fill(lName);
  }

  async fillInFullName(fullName: string, opts?: { testId: string }): Promise<void> {
    if (!opts) {
      return this.page.getByRole('combobox', { name: 'Full Name' }).fill(fullName);
    }
    await this.page.getByTestId(opts.testId).fill(fullName);
  }

  async fillInPhysicianInstitution(
    opts: {
      physicianName?: string;
      institutionName?: string;
      city?: string;
      state?: string;
      country?: string;
      nth?: number;
      labels?: Partial<PhysicianInstitutionAddressLabels>;
    } = {}
  ): Promise<void> {
    const {
      physicianName = user.doctor.name,
      institutionName = user.doctor.hospital,
      city = user.doctor.city,
      state = user.doctor.state,
      country = user.patient.country.name,
      nth = 0,
      labels = { ...defaultMailingAddressLabels }
    } = opts;

    labels.physicianName = 'Physician Name';
    labels.hospital = new RegExp(/Institution/);

    const institution = new Institution(this.page, { label: /Physician/, nth });
    await institution.toInput(labels.physicianName).fill(physicianName);
    await institution.toInput(labels.hospital).fill(institutionName);
    await institution.toInput(labels.city!).fill(city);
    await institution.toInput(labels.state!).fill(state);
    await institution.toInput(labels.country!).fill(country);
  }

  /**
   * COMMON UI FIELDS
   */

  /**
   * <br> Question: How old are you?
   * <br> Type: Input
   */
  age(opts?: { testId: string}): Input {
    if (!opts) {
      return new Input(this.page, { label: 'Enter age' });
    }
    // 'answer:AGE'
    return new Input(this.page, { ddpTestID: opts.testId });
  }

  /**
   * Select country.
   * <br> Question: Where do you live? or What country do you live in?
   * <br> Type: Select
   */
  country(): Question {
    return new Question(this.page, {
      prompt: new RegExp(/((?:choose|select) country\b)|(country\b)/i)
    });
  }

  /**
   * Select State.
   * <br> Question: Select State (US and Canada)
   * <br> Type: Select
   */
  state(): Question {
    return new Question(this.page, {
      prompt: new RegExp(/((?:choose|select) (state\b|province\b))|(state\b)/i)
    });
  }

  signature(opts?: {testId: string}): Input {
    return opts
      ? new Input(this.page, { ddpTestID: opts.testId })
      : new Question(this.page, { prompt: 'Signature' }).toInput();
  }
}
