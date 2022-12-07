import { expect, Locator, Page } from '@playwright/test';
import Checkbox from 'lib/widget/checkbox';
import Select from 'lib/widget/select';

export default class Question {
  private readonly page: Page;
  private readonly locator: Locator;
  private readonly rootLocator: Locator;

  constructor(page: Page, opts: { prompt: string | RegExp; parentSelector?: Locator }) {
    const { prompt, parentSelector } = opts;
    this.page = page;
    this.rootLocator = parentSelector ? parentSelector : this.page.locator('ddp-activity-question');
    // Look for text somewhere inside element. Text matching is case-insensitive and searches for a substring or regex.
    // Caution: If text contains a punctuation colon or/and single quote, find is likely to fail.
    this.locator = this.rootLocator.filter({ hasText: prompt });
  }

  toLocator(): Locator {
    return this.locator;
  }

  errorMessage(): Locator {
    return this.toLocator().locator('.ErrorMessage');
  }

  /**
   * A dropdown. Use For tag Select.
   * <br> For tag "mat-select", use toSelect().
   * @param label
   */
  select(label?: string): Locator {
    if (label === undefined) {
      return this.toLocator().locator('select');
    }
    return this.toLocator().locator('select', {
      has: this.page.locator(`//*[contains(normalize-space(.),"${label}")]`)
    });
  }

  toSelect(): Select {
    return new Select(this.page, { root: this.toLocator() });
  }

  /**
   * <br> Tag name: input (text or number)
   */
  input(): Locator {
    return this.toLocator().locator('mat-form-field').locator('input');
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
   * Check a checkbox or radiobutton.
   * @param {string | RegExp} value
   * @param {{exactMatch?: boolean}} opts exactMatch: If set to true, match by exact string or substring
   * @returns {Promise<void>}
   */
  async check(value: string | RegExp, opts: { exactMatch?: boolean } = {}): Promise<void> {
    const { exactMatch = false } = opts;
    let loc = this.toLocator().locator('mat-radio-button, mat-checkbox');
    loc = exactMatch
      ? loc.filter({ has: this.page.locator(`text="${value}"`) })
      : loc.filter({ has: this.page.locator('label', { hasText: value }) });
    const isChecked = await Question.isChecked(loc);
    if (!isChecked) {
      await loc.click();
      await expect(loc).toHaveClass(/checkbox-checked|radio-checked/);
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
      await expect(loc).not.toHaveClass(/checkbox-checked|radio-checked/);
    }
  }

  /**
   * <br> Tag name: ddp-date
   */
  date(): Locator {
    return this.toLocator().locator('ddp-date');
  }

  async checkAndFillInInput(value: string, opts: { inputText?: string } = {}): Promise<void> {
    const { inputText } = opts;
    const checkbox = new Checkbox(this.page, { label: value, root: this.toLocator() });
    await checkbox.check();
    await checkbox.fill(inputText);
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
