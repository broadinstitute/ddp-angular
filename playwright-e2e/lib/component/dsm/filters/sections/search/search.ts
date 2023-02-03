import { Locator, Page } from '@playwright/test';
import { CheckboxConfig, DateConfig, TextConfig } from './search-types';
import { AdditionalFilter } from './search-enums';

export class Search {
  private readonly enUSDateRegExp = new RegExp(/\b(0[1-9]|1[012])([/])(0[1-9]|[12]\d|3[01])\2(\d{4})/);
  private readonly todayTextInDateRegExp = new RegExp('^today$');

  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.locator(this.openButtonXPath).click();
  }

  public async search(): Promise<void> {
    await this.page.locator("//div[@id='searchTable']/button[1][span[text()='Search']]").click();
  }

  public async dates(
    columnName: string,
    { from: fromValue, to: toValue, additionalFilters }: Partial<DateConfig>
  ): Promise<void> {
    await this.setAdditionalFilters(columnName, additionalFilters);

    let fromDate!: string;
    let toDate!: string;

    if (fromValue instanceof Date) {
      fromDate = new Intl.DateTimeFormat('en-US').format(fromValue);
    } else if (fromValue && this.enUSDateRegExp.test(fromValue)) {
      fromDate = fromValue;
    } else if (fromValue && this.todayTextInDateRegExp.test(fromValue)) {
      await this.setTodayFor(columnName);
    } else {
      fromValue && console.warn(`'${fromValue}' - is not valid date, therefore can't be set in '${columnName}' date field`);
    }

    if (toValue instanceof Date) {
      fromDate = new Intl.DateTimeFormat('en-US').format(toValue);
    } else if (toValue && this.enUSDateRegExp.test(toValue)) {
      toDate = toValue;
    } else if (toValue && this.todayTextInDateRegExp.test(toValue)) {
      await this.setTodayFor(columnName, 1);
    } else {
      toValue && console.warn(`'${toValue}' - is not valid date, therefore can't be set in '${columnName}' date field`);
    }

    const dateInputFields = await this.page.locator(this.dateInputFieldXPath(columnName));

    fromDate && (await dateInputFields.nth(0).fill(fromDate));
    toDate && (await dateInputFields.nth(1).fill(fromDate));
  }

  public async text(columnName: string, { textValue, additionalFilters, exactMatch = true }: Partial<TextConfig>): Promise<void> {
    await this.setAdditionalFilters(columnName, additionalFilters, true);
    textValue && (await this.textInputLocator(columnName).fill(textValue));

    textValue && !exactMatch && (await this.setExactMatch(columnName, true));
  }

  public async checkboxes(columnName: string, { checkboxValues, additionalFilters }: Partial<CheckboxConfig>): Promise<void> {
    await this.setAdditionalFilters(columnName, additionalFilters);
    if (checkboxValues && checkboxValues.length) {
      for (const checkboxValue of checkboxValues) {
        const checkboxLocator = await this.checkboxLocator(columnName, checkboxValue);

        const isChecked = await this.isChecked(checkboxLocator);
        const isDisabled = await this.isDisabled(checkboxLocator);

        (!isChecked || !isDisabled) && (await checkboxLocator.click());
      }
    }
  }

  private async setAdditionalFilters(
    columnName: string,
    additionalFilters: AdditionalFilter[] | null | undefined,
    isTextField = false
  ): Promise<void> {
    if (additionalFilters && additionalFilters.length) {
      for (const additionalFilter of additionalFilters) {
        await this.setAdditionalFilter(columnName, additionalFilter, isTextField);
      }
    }
  }

  private async setAdditionalFilter(columnName: string, additionalFilter: AdditionalFilter, isTextField = false): Promise<void> {
    const baseColumnXPath = isTextField ? this.baseTextColumnXPath(columnName) : this.baseColumnXPath(columnName);

    !(await this.isAdditionalFiltersOpen(columnName, isTextField)) &&
      (await this.page.locator(baseColumnXPath + this.plusIconXPath).click());

    const additionalFilterCheckbox = await this.additionalFilterCheckboxLocator(columnName, additionalFilter, isTextField);
    const isChecked = await this.isChecked(additionalFilterCheckbox);
    const isDisabled = await this.isDisabled(additionalFilterCheckbox);

    (!isChecked || !isDisabled) && (await additionalFilterCheckbox.click());
  }

  private async setExactMatch(columnName: string, isTextField = false): Promise<void> {
    const additionalFilterCheckbox = await this.additionalFilterCheckboxLocator(
      columnName,
      AdditionalFilter.EXACT_MATCH,
      isTextField
    );
    const isCheckedOrDisabled = await this.isChecked(additionalFilterCheckbox);

    isCheckedOrDisabled && (await additionalFilterCheckbox.click());
  }

  private async isAdditionalFiltersOpen(columnName: string, isTextField = false): Promise<boolean> {
    const baseColumnXPath = isTextField ? this.baseTextColumnXPath(columnName) : this.baseColumnXPath(columnName);
    return await this.page.locator(baseColumnXPath + this.minusIconXPath)?.isVisible();
  }

  private async setTodayFor(columnName: string, nth = 0): Promise<void> {
    await this.page.locator(this.todayButtonXPath(columnName)).nth(nth).click();
  }

  private async isChecked(locator: Locator | undefined): Promise<boolean> {
    const isChecked = (await locator?.getAttribute('class'))?.includes('mat-checkbox-checked');
    return isChecked || false;
  }

  private async isDisabled(locator: Locator | undefined): Promise<boolean> {
    const isDisabled = (await locator?.getAttribute('class'))?.includes('mat-checkbox-disabled');
    return isDisabled || false;
  }

  /* Locators */

  private checkboxLocator(columnName: string, checkboxName: string): Locator {
    return this.page.locator(
      `${this.baseColumnXPath(columnName)}//mat-checkbox[label[.//*[text()[normalize-space()='${checkboxName}']]]]`
    );
  }

  private textInputLocator(columnName: string): Locator {
    return this.page.locator(`${this.baseTextColumnXPath(columnName)}/mat-form-field//input`);
  }

  private additionalFilterCheckboxLocator(columnName: string, checkboxName: AdditionalFilter, isTextField = false): Locator {
    return this.page.locator(
      `${
        isTextField ? this.baseTextColumnXPath(columnName) : this.baseColumnXPath(columnName)
      }/div[mat-checkbox[label[*[text()[normalize-space()='${checkboxName}']]]]]/mat-checkbox`
    );
  }

  /* XPaths */

  private get openButtonXPath(): string {
    return (
      "//div[text()[normalize-space()='Search'] and button[.//*[local-name()='svg' " +
      "and @data-icon='search']/*[local-name()='path']]]/button"
    );
  }

  private baseColumnXPath(columnName: string): string {
    return `//app-filter-column[div[.//*[text()[normalize-space()='${columnName}']]]]`;
  }

  private baseTextColumnXPath(columnName: string): string {
    return `//app-filter-column[mat-form-field//label[.//*[text()[normalize-space()='${columnName}']]]]`;
  }

  private get plusIconXPath(): string {
    return "/button[*[local-name()='svg' and @data-icon='plus-square']/*[local-name()='path']]";
  }

  private get minusIconXPath(): string {
    return "/button[*[local-name()='svg' and @data-icon='minus-square']/*[local-name()='path']]";
  }

  private todayButtonXPath(columnName: string): string {
    return `${this.baseColumnXPath(columnName)}/app-field-datepicker/span/button[text()='Today']`;
  }

  private dateInputFieldXPath(columnName: string): string {
    return `${this.baseColumnXPath(columnName)}/app-field-datepicker/span/mat-form-field//input`;
  }
}
