import { expect, Locator, Page } from '@playwright/test';
import Button from 'lib/widget/button';
import Checkbox from 'lib/widget/checkbox';
import Select from 'lib/widget/select';

export default class Question {
  private readonly page: Page;
  private readonly locator: Locator;
  private readonly rootLocator: Locator;

  constructor(page: Page, opts: { prompt?: string | RegExp; cssClassAttribute?: string; parentSelector?: Locator }) {
    const { prompt, cssClassAttribute, parentSelector } = opts;
    this.page = page;
    this.rootLocator = parentSelector ? parentSelector : this.page.locator('ddp-activity-question');
    // Look for text somewhere inside element. Text matching is case-insensitive and searches for a substring or regex.
    // Caution: If text contains a punctuation colon or/and single quote, find is likely to fail.
    this.locator = prompt
      ? this.rootLocator.filter({ hasText: prompt })
      : this.rootLocator.filter({ has: this.page.locator(`css=${cssClassAttribute}`) });
  }

  toLocator(): Locator {
    return this.locator;
  }

  errorMessage(): Locator {
    return this.toLocator().locator('.ErrorMessage');
  }

  button(label: string): Button {
    return new Button(this.page, {
      label,
      root: this.rootLocator
    });
  }

  /**
   * Tag Select.
   * <br> Note: use toSelect() for tag "mat-select".
   * @param label
   */
  select(label?: string): Locator {
    if (label === undefined) {
      return this.toLocator().locator('select');
    }
    return this.toLocator().locator('select', {
      has: this.page.locator(`xpath=//*[contains(normalize-space(.),"${label}")]`)
    });
  }

  toSelect(label: string): Select {
    return new Select(this.page, { label, root: this.toLocator() });
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
   * @param opts: {boolean} exactMatch
   */
  radioButton(value: string | RegExp, opts: { exactMatch?: boolean } = {}): Locator {
    const { exactMatch = false } = opts;
    return this.toLocator()
      .locator('mat-radio-button')
      .filter({ has: exactMatch ? this.page.locator(`text="${value}"`) : this.page.locator('label', { hasText: value }) });
  }

  /**
   * Typing text. If text triggers an autocomplete dropdown, automatically selects the first option.
   * @param value
   */
  async fill(value: string): Promise<void> {
    const input = this.input();
    const autocomplete = await input.getAttribute('aria-autocomplete');
    await input.fill(value);
    const expanded = await input.getAttribute('aria-expanded');
    if (autocomplete === 'list' && expanded === 'true') {
      const dropdown = this.page.locator('.mat-autocomplete-visible[role="listbox"][id]');
      await dropdown
        .locator('mat-option:visible', { hasText: new RegExp(value) })
        .first()
        .click();
    } else {
      await input.press('Tab');
    }
  }

  /**
   * Check a checkbox or radiobutton.
   * @param {string} label
   * @param {{exactMatch?: boolean}} opts exactMatch: If set to true, match by exact string or substring
   * @returns {Promise<void>}
   */
  async check(label?: string, opts: { exactMatch?: boolean } = {}): Promise<void> {
    const { exactMatch = false } = opts;

    const locator = this.toLocator().locator('mat-radio-button, mat-checkbox');
    const textLocator = exactMatch ? this.page.locator(`text="${label}"`) : this.page.locator('label', { hasText: label });

    const filterLocator = label ? locator.filter({ has: textLocator }) : locator;

    const isChecked = await Question.isChecked(filterLocator);

    if (!isChecked) {
      await filterLocator.locator('.mat-radio-label, .mat-checkbox-layout').click();
      await expect(filterLocator).toHaveClass(/checkbox-checked|radio-checked/);
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
