import { expect, Locator, Page } from '@playwright/test';
import WidgetBase from 'dss/component/widget-base';
import { logError } from 'utils/log-utils';
import { waitForResponse } from 'utils/test-utils';

export default class Input extends WidgetBase {
  /**
   * @param {Page} page
   * @param {{label?: string, ddpTestID?: string, root?: Locator | string, exactMatch?: boolean}} opts
   */
  constructor(page: Page, opts: {
    label?: string | RegExp;
    ddpTestID?: string;
    root?: Locator | string;
    exactMatch?: boolean;
    nth?: number;
  } = {}) {
    const { label, ddpTestID, root = 'mat-form-field', exactMatch = false, nth } = opts;
    super(page, { root, testId: ddpTestID, nth });

    if (!ddpTestID) {
      const partialXpath = 'input[contains(@class, "mat-input-element")]';
      if (label) {
        if (typeof label === 'string') {
          this.element = exactMatch
            /* eslint-disable max-len */
            ? this.root.locator(
              `xpath=.//${partialXpath}[@id=(//label[.//text()[normalize-space()="${label}"]]/@for)] | .//${partialXpath}[@data-placeholder="${label}"]`
            )
            : this.root.locator(
              `xpath=.//${partialXpath}[@id=(//label[contains(normalize-space(.),"${label}")]/@for)] | .//${partialXpath}[contains(@data-placeholder,"${label}")]`
            );
        } else {
          this.element = this.root.filter({ has: this.page.locator(`text=${label}`) }).locator(`xpath=.//${partialXpath}`);
        }
      } else {
        this.element = this.root.locator(`xpath=.//${partialXpath}`);
      }
    }
  }

  /**
   * Enter a text string. If value already exists, no action taken.
   * @param {string} value
   * @param opts
   * @returns {Promise<void>}
   */
  async fill(value: string | number, opts: {
    dropdownOption?: string;
    type?: boolean;
    nth?: number;
    waitForSaveRequest?: boolean;
    overwrite?: boolean
  } = {}): Promise<void> {
    const { dropdownOption, type, nth, waitForSaveRequest = false, overwrite = false } = opts;
    const useType = type ? type : false;
    nth ? this.nth = nth : this.nth;

    const doAfterFill = async (): Promise<void> => {
      const pressTab = this.toLocator().press('Tab');
      if (waitForSaveRequest) {
        await Promise.all([
          waitForResponse(this.page, { uri: '/answers'}),
          pressTab
        ]);
      } else {
        await pressTab;
        await this.page.waitForTimeout(200); // short delay to detect triggered saving request
      }
    }

    // Is Saving button visible before typing? tests could become flaky if saving is in progress before adding another new patch request
    await expect(this.page.locator('button:visible', { hasText: 'Saving' })).toBeHidden();

    await this.toLocator().scrollIntoViewIfNeeded().catch(err => logError(`${err}\n${this.toLocator()}`));
    const oldValue: string = (await this.toLocator().inputValue()).trim();

    // safety check: prevent unintented overwrite value in wrong input field.
    if (!overwrite && oldValue.length > 0) {
      throw new Error(`Overwriting an existing value: "${oldValue}". If intentional, set overwrite to true. ${this.toLocator()}`);
    }

    if (typeof value === 'string' && value.length === 0) {
      // clear the input field
      await this.toLocator().fill(value);
      await doAfterFill();
      return;
    }

    if (oldValue !== value) {
      const autocomplete = await this.getAttribute('aria-autocomplete');
      useType
        ? await this.toLocator().pressSequentially(value as string, { delay: 200 })
        : await this.toLocator().fill(value as string);

      const expanded = await this.getAttribute('aria-expanded');
      if (autocomplete === 'list' && expanded === 'true') {
        const dropdown = this.page.locator('.mat-autocomplete-visible[role="listbox"][id]');
        await dropdown.waitFor({ state: 'visible', timeout: 30 * 1000 });
        const option = dropdownOption ? dropdownOption : value;
        await dropdown
          .locator('[role="option"]') //, { has: this.page.locator(`span.mat-option-text:text("${dropdownOption}")`) })
          .filter({ hasText: option.toString() })
          .first()
          .click();
      }
      await doAfterFill();
    }

    await expect(this.page.locator('button:visible', { hasText: 'Saving' })).toBeHidden();
  }

  public async fillSimple(value: string): Promise<void> {
    await this.toLocator().fill(value);
    await this.toLocator().blur();
  }

  public async currentValue(): Promise<string> {
    return this.toLocator().inputValue();
  }

  public async blur(): Promise<void> {
    await this.toLocator().blur();
  }

  public async focus(): Promise<void> {
    await this.toLocator().focus();
    await this.toLocator().click();
  }

  public async maxLength(): Promise<string | null> {
    return this.toLocator().getAttribute('maxlength');
  }

  public async clear(): Promise<void> {
    await this.toLocator().clear();
  }
}
