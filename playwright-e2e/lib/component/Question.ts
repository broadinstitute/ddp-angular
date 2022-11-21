import { Locator, Page } from '@playwright/test';

export default class Question {
  private readonly page: Page;
  private readonly locator: Locator;

  constructor(page: Page, opts: { prompt: string | RegExp; parentSelector?: Locator }) {
    const { prompt, parentSelector } = opts;
    this.page = page;
    const rootLocator = parentSelector ? parentSelector : this.page.locator('ddp-activity-question');
    // Look for text somewhere inside element. Text matching is case-insensitive and searches for a substring or regex.
    // Caution: If text contains a punctuation colon or/and single quote, find is likely to fail.
    this.locator = rootLocator.filter({ hasText: prompt });
  }

  toLocator(): Locator {
    return this.locator;
  }

  errorMessage(): Locator {
    return this.toLocator().locator('.ErrorMessage');
  }

  /**
   * A dropdown.
   * <br> Tag name: mat-select or select
   * @param value
   */
  select(value?: string): Locator {
    if (value === undefined) {
      return this.toLocator().locator('mat-select, select');
    }
    return this.toLocator().locator(
      `//*[.//*[contains(normalize-space(.),"${value}")]]/mat-select` +
        ` | //*[.//*[contains(normalize-space(.),"${value}")]]/select`
    );
  }

  /**
   * <br> Tag name: input (text or number)
   */
  input(): Locator {
    return this.toLocator().locator('input');
  }

  /**
   * <br> Tag name: input (text or number) (get by its label)
   * @param value
   */
  inputByLabel(value?: string | RegExp): Locator {
    if (value === undefined) {
      return this.input();
    }
    return this.toLocator()
      .locator('mat-form-field')
      .filter({ has: this.page.locator('label', { hasText: value }) })
      .locator('input');
  }

  /**
   * <br> Tag name: mat-checkbox
   * @param value
   */
  checkbox(value: string | RegExp): Locator {
    return this.toLocator()
      .locator('mat-checkbox')
      .filter({ has: this.page.locator('label', { hasText: value }) });
  }

  /**
   * <br> Tag name: mat-radio-button
   * @param value
   */
  radioButton(value: string | RegExp): Locator {
    return this.toLocator()
      .locator('mat-radio-button')
      .filter({ has: this.page.locator('label', { hasText: value }) });
  }

  /**
   * Typing text or numerical value
   * @param value
   */
  async fill(value: string): Promise<void> {
    await this.input().fill(value);
    await this.input().press('Tab');
  }

  /**
   * Check a checkbox or radiobutton. Waits for triggered request to finish successfully.
   * If there is no request from checking checkbox, set parameter "waitRequestAfter" to false. For example, check('Yes', { waitRequestAfter: false });
   * @param value
   * @param opts
   */
  async check(
    value: string | RegExp,
    opts: { exactMatch?: boolean; waitRequestAfter?: boolean; requestStatus?: number; requestURL?: string } = {}
  ): Promise<void> {
    // For majority of checkboxes, a "PATCH /answers" request is triggered when checked
    const { exactMatch = false, waitRequestAfter = true, requestStatus = 200, requestURL = '/answers' } = opts;
    let locator = this.toLocator().locator('mat-radio-button, mat-checkbox');
    locator = exactMatch
      ? locator.filter({ has: this.page.locator(`text="${value}"`) })
      : locator.filter({ has: this.page.locator('label', { hasText: value }) });
    const isChecked = await Question.isChecked(locator);
    if (!isChecked) {
      const responsePromise = waitRequestAfter
        ? this.page.waitForResponse(
            (response) => response.url().includes(requestURL) && response.status() === requestStatus,
            { timeout: 10 * 1000 } // More time for retries. UI will resend failed requests
          )
        : Promise.resolve();

      await Promise.all([responsePromise, locator.click()]);
    }
  }

  /**
   * Uncheck a checkbox or radiobutton
   * @param value
   */
  async uncheck(value: string | RegExp): Promise<void> {
    const loc = this.toLocator()
      .locator('mat-radio-button, mat-checkbox')
      .filter({ has: this.page.locator('label', { hasText: value }) });
    const isChecked = await Question.isChecked(loc);
    if (isChecked) {
      await loc.click();
    }
  }

  /**
   * <br> Tag name: ddp-date
   */
  date(): Locator {
    return this.toLocator().locator('ddp-date');
  }

  static async isChecked(locator: Locator): Promise<boolean> {
    const tagName = await locator.evaluate((elem) => elem.tagName);
    let isChecked: boolean | undefined;
    switch (tagName) {
      case 'MAT-RADIO-BUTTON':
        isChecked = (await locator.getAttribute('class'))?.includes('mat-radio-checked');
        break;
      case 'MAT-CHECKBOX':
        isChecked = (await locator.getAttribute('class'))?.includes('mat-checkbox-checked');
        break;
      default:
        throw Error(`Tag name "${tagName}" not implemented for isChecked().`);
    }
    return isChecked ? isChecked : false;
  }
}
