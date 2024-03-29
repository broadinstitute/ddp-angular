import { expect, Locator, Page } from '@playwright/test';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import { getDate } from 'utils/date-utils';
import { waitForResponse } from 'utils/test-utils';

export default class DatePicker {
  locator: Locator;


  constructor(private readonly page: Page, opts: { nth?: number, root?: Locator | string } = {}) {
    const { nth = 0, root } = opts;

    this.locator = root
      ? typeof root === 'string'
        ? this.page.locator(root)
        : root
      : this.page.locator('app-root');

    this.locator.locator('app-field-datepicker').nth(nth);
  }

  get toLocator(): Locator {
    return this.locator;
  }

  input(): Input {
    return new Input(this.page, { root: this.toLocator });
  }

  dayPicker(): Locator {
    return this.calendar().locator('daypicker table');
  }

  monthPicker(): Locator {
    return this.calendar().locator('monthpicker table');
  }

  yearPicker(): Locator {
    return this.calendar().locator('yearpicker table');
  }

  /**
   * Parameter month is 0-indexed
   * @param {{yyyy?: number, month?: number, dayOfMonth?: number}} opts
   * @returns {Promise<string>}
   */
  public async pickDate(opts: {
    yyyy?: number,
    month?: number,
    dayOfMonth?: number,
    isToday?: boolean,
  } = {}): Promise<string> {
    const today = new Date();
    const { yyyy = today.getFullYear(), month = today.getMonth(), dayOfMonth = today.getDate(), isToday = false } = opts;

    const todayBtn = new Button(this.page, { root: this.toLocator, exactMatch: true, label: 'Today' });
    const isEnabled = await todayBtn.isVisible() && !(await todayBtn.isDisabled());
    if (isToday && isEnabled) {
      await Promise.all([
        waitForResponse(this.page, { uri: '/patch' }),
        todayBtn.click()
      ]);
      return `${yyyy}/${month}/${dayOfMonth}`;
    }

    const selectDate = new Date(yyyy, month, dayOfMonth);
    const date = getDate(selectDate).split('/')[1]; // get date with a leading zero if date < 10
    const monthName = selectDate.toLocaleString('default', { month: 'long' }); // get name of month

    // pick year first
    await this.dayPicker().locator('th button[id]').click();
    await this.monthPicker().locator('th button[id]').click();
    await expect(this.yearPicker()).toBeVisible();

    // find year. Can go back in Year Picker upto 10 times
    const tryTotal = 10;
    for (let i = 0; i < tryTotal; i++) {
      const firstYearShown = await this.yearPicker().locator(this.clickableCell()).first().innerText();
      const lastYearShown = await this.yearPicker().locator(this.clickableCell()).last().innerText();
      if (yyyy < parseInt(firstYearShown)) {
        await this.yearPicker().locator('th button.pull-left').click();
      } else if (yyyy > parseInt(lastYearShown)) {
        await this.yearPicker().locator('th button.pull-right').click();
      } else {
        break;
      }
      await this.page.waitForTimeout(500);
    }
    await this.yearPicker().locator(this.clickableCell(), { hasText: yyyy.toString() }).click();

    // pick month second
    await this.monthPicker().locator(this.clickableCell(), { hasText: monthName }).click();

    // pick day of month
    const networkIdlePromise = this.page.waitForLoadState('networkidle');
    await this.dayPicker().locator(this.clickableCell(), { hasText: date }).first().click();
    await networkIdlePromise;

    // calendar close automatically
    return getDate(new Date(yyyy, month, parseInt(date)));
  }

  public async open(): Promise<DatePicker> {
    const isVisible = await this.isVisible();
    if (!isVisible) {
      await this.calendarButton().click();
    }
    return this;
  }

  public async close(): Promise<DatePicker> {
    const isVisible = await this.isVisible();
    if (isVisible) {
      await this.calendarButton().click();
    }
    return this;
  }

  async isVisible(timeout?: number): Promise<boolean> {
    return this.calendar().isVisible({ timeout });
  }

  private calendarButton(): Locator {
    return this.toLocator.locator('button').filter({ has: this.page.locator('[data-icon="calendar-alt"]')});
  }

  private calendar(): Locator {
    return this.toLocator.locator('.Calendar--Popup');
  }

  private clickableCell(): string {
    return 'td[role="gridcell"] button';
  }
}
