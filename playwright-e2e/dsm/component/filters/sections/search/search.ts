import { expect, Locator, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';
import { CheckboxConfig, DateConfig, RadioButtonConfig, TextConfig } from 'dsm/component/filters/sections/search/search-types';
import { AdditionalFilter, EnrollmentStatus, KitStatus, ParticipantColumns, SampleColumns } from 'dsm/component/filters/sections/search/search-enums';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { KitTypeEnum } from 'dsm/component/kitType/enums/kitType-enum';
import { ParticipantListTable } from 'dsm/component/tables/participant-list-table';

export class Search {
  private readonly enUSDateRegExp = new RegExp(/\b(0[1-9]|1[012])([/])(0[1-9]|[12]\d|3[01])\2(\d{4})/);

  private readonly todayTextInDateRegExp = new RegExp('^today$');

  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    const open = await this.isOpen();
    !open && await this.page.locator(this.openButtonXPath).click();
    await expect(async () => expect(await this.isOpen()).toBe(true)).toPass();
  }

  public async search(): Promise<void> {
    await Promise.all([
      waitForResponse(this.page, {uri: 'ui/filterList?'}),
      this.page.locator("//div[@id='searchTable']/button[1][span[text()='Search']]").click()
    ]);
    await waitForNoSpinner(this.page);
  }

  public async clear(): Promise<void> {
    await this.page.locator("//div[@id='searchTable']/button[.//span[text()='Clear']][1]").click(); // Two Clear buttons, use first one.
  }

  public async dates(columnName: string, { from: fromValue, to: toValue, additionalFilters }: Partial<DateConfig>): Promise<void> {
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
      toDate = new Intl.DateTimeFormat('en-US').format(toValue);
    } else if (toValue && this.enUSDateRegExp.test(toValue)) {
      toDate = toValue;
    } else if (toValue && this.todayTextInDateRegExp.test(toValue)) {
      await this.setTodayFor(columnName, 1);
    } else {
      toValue && console.warn(`'${toValue}' - is not valid date, therefore can't be set in '${columnName}' date field`);
    }

    // Click plus icon to expand Date fields
    //const expandDateRangeButton = this.page.locator(`xpath=${this.baseColumnXPath(columnName)}//button[.//*[@data-icon="plus-square"]]`);
    //await expandDateRangeButton.click();

    const dateInputFields = this.page.locator(this.dateInputFieldXPath(columnName));
    await expect(dateInputFields).toHaveCount(2); // synchronize with UI

    fromDate && (await dateInputFields.nth(0).fill(fromDate));
    toDate && (await dateInputFields.nth(1).fill(toDate));
  }

  public async text(columnName: string, { textValue, additionalFilters, exactMatch = true }: Partial<TextConfig>): Promise<void> {
    await this.setAdditionalFilters(columnName, additionalFilters, true);
    textValue && (await this.textInputLocator(columnName).fill(textValue));

    textValue && !exactMatch && (await this.setExactMatch(columnName, true));
  }

  public async radioButton(columnName: string, { radioButtonValue, additionalFilters}: Partial<RadioButtonConfig>): Promise<void> {
    await this.setAdditionalFilters(columnName, additionalFilters);
    radioButtonValue && (await this.radioBtnLocator(columnName, radioButtonValue).click());
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

  public async openDatePicker(column: string, opts: { open?: boolean } = {}): Promise<DatePicker> {
    const { open = true } = opts;
    const datePicker = new DatePicker(this.page, { root: this.baseColumnXPath(column) });
    if (open) {
      await datePicker.open();
    } else {
      await datePicker.close();
    }
    return datePicker;
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

    !(await this.isAdditionalFiltersOpen(columnName, isTextField)) && (await this.page.locator(baseColumnXPath + this.plusIconXPath).click());

    const additionalFilterCheckbox = this.additionalFilterCheckboxLocator(columnName, additionalFilter, isTextField);
    const isChecked = await this.isChecked(additionalFilterCheckbox);
    const isDisabled = await this.isDisabled(additionalFilterCheckbox);

    (!isChecked || !isDisabled) && (await additionalFilterCheckbox.click());
  }

  private async setExactMatch(columnName: string, isTextField = false): Promise<void> {
    const additionalFilterCheckbox = await this.additionalFilterCheckboxLocator(columnName, AdditionalFilter.EXACT_MATCH, isTextField);
    const isCheckedOrDisabled = await this.isChecked(additionalFilterCheckbox);

    isCheckedOrDisabled && (await additionalFilterCheckbox.click());
  }

  private async isAdditionalFiltersOpen(columnName: string, isTextField = false): Promise<boolean> {
    const baseColumnXPath = isTextField ? this.baseTextColumnXPath(columnName) : this.baseColumnXPath(columnName);
    return this.page.locator(baseColumnXPath + this.minusIconXPath)?.isVisible();
  }

  public async setTodayFor(columnName: string, nth = 0): Promise<void> {
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

  public async searchForParticipantsWithEnrollmentStatus(enrollmentStatuses: EnrollmentStatus[]): Promise<void> {
    await this.open();
    await this.checkboxes(ParticipantColumns.STATUS, { checkboxValues: enrollmentStatuses });
    await this.search();
  }

  public async searchForKitSampleStatus(kitTypes: KitTypeEnum[], kitStatus: KitStatus): Promise<void> {
    await this.open();
    await this.checkboxes(SampleColumns.SAMPLE_TYPE, { checkboxValues: kitTypes });
    await this.radioButton(SampleColumns.STATUS, { radioButtonValue: kitStatus });
    await this.search();
  }

  /**
   * Searches for the first instance of a participant that has no sent saliva kits
   * @returns the short id of the found participant
   */
  public async searchForParticipantWithUnsentSalivaKit(): Promise<string> {
    const [filterListReponse] = await Promise.all([
      this.page.waitForResponse(response => response.url().includes('/ui/filterList') && response.status() === 200),
      this.searchForKitSampleStatus([KitTypeEnum.SALIVA], KitStatus.WAITING_ON_GP),
    ]);
    let responseBody = JSON.parse(await filterListReponse.text());

    const participantListTable = new ParticipantListTable(this.page);
    const amountOfRowsDisplayed = await participantListTable.rowsCount;
    let validTestParticipantShortIDFound;

    //Check for a participant with a saliva kit that neither has scanDate or deactivatedDate
    for (let index = 0; index < amountOfRowsDisplayed; index++) {
      if (await participantListTable.onLastPage()) {
        console.log('On last page');
        break;
      }
      console.log(`Participant ${index}'s information: ${responseBody.participants[index].esData.profile.hruid}`);
      const kitInformation = responseBody.participants[index].kits;
      const amountOfKits = kitInformation.length;
      console.log(`Participant kit amount: ${kitInformation.length}`);
      for (let kitNumber = 0; kitNumber < amountOfKits; kitNumber++) {
        console.log(`Participant kit info: ${kitInformation[kitNumber].kitTypeName}`);
        if ((kitInformation[kitNumber].kitTypeName) === KitTypeEnum.SALIVA) {
          if (kitInformation[kitNumber].scanDate === undefined && kitInformation[kitNumber].deactivatedDate === undefined) {
            console.log(`ALERT: Valid participant found!`);
            validTestParticipantShortIDFound = responseBody.participants[index].esData.profile.hruid;
            break;
          }
        }
      }

      if (validTestParticipantShortIDFound) {
        break;
      }

      if (this.isReadyToGoToTheNextPage(index, amountOfRowsDisplayed)) {
        const [nextResponse] = await Promise.all([
          this.page.waitForResponse(response => response.url().includes('/ui/filterList') && response.status() === 200),
          await participantListTable.nextPage(),
        ]);
        await participantListTable.waitForReady();
        responseBody = JSON.parse(await nextResponse.text());
        index = -1;
        console.log('Should be on the next page now');
      }
    }
    return validTestParticipantShortIDFound;
  }

  /**
   * Determines if it's time to go to the next page based on the current index used in a for-loop & whether the last row was looked at
   * @param index Current index being used in a for-loop in a different method
   * @param amountOfRowsDisplayed The amount of rows currently displayed in the DSM Participant List
   * @returns if it's time to turn the page
   */
  private isReadyToGoToTheNextPage(index: number, amountOfRowsDisplayed: number): boolean {
    return (index > 0) && (index % (amountOfRowsDisplayed - 1) === 0);
  }

  /* Locators */

  private checkboxLocator(columnName: string, checkboxName: string): Locator {
    return this.page.locator(`${this.baseColumnXPath(columnName)}//mat-checkbox[label[.//*[text()[normalize-space()='${checkboxName}']]]]`);
  }

  private radioBtnLocator(columnName: string, radioButtonName: string): Locator {
    return this.page.locator(`${this.baseColumnXPath(columnName)}` +
      `//mat-radio-group//mat-radio-button[label[.//*[text()[normalize-space()="${radioButtonName}"]]]]`);
  }

  public textInputLocator(columnName: string): Locator {
    return this.page.locator(`${this.baseTextColumnXPath(columnName)}//mat-form-field//input`);
  }

  private async isOpen(): Promise<boolean> {
    return this.page.locator('#searchTable').isVisible();
  }

  private additionalFilterCheckboxLocator(columnName: string, checkboxName: AdditionalFilter, isTextField = false): Locator {
    return this.page.locator(
      `${
        isTextField ? this.baseTextColumnXPath(columnName) : this.baseColumnXPath(columnName)
      }/div[mat-checkbox[label[.//*[text()[normalize-space()='${checkboxName}']]]]]/mat-checkbox`
    );
  }

  /* XPaths */

  public get openButtonXPath(): string {
    return (
      "//div[text()[normalize-space()='Search'] and button[.//*[local-name()='svg' and @data-icon='search']/*[local-name()='path']]]/button"
    );
  }

  private baseColumnXPath(columnName: string): string {
    return `//app-filter-column[div[.//*[text()[normalize-space()="${columnName}"]]]]`;
  }

  private baseTextColumnXPath(columnName: string): string {
    return `//app-filter-column[.//*[text()[normalize-space()="${columnName}"]]]`;
  }

  private get plusIconXPath(): string {
    return "/button[.//*[local-name()='svg' and @data-icon='plus-square']/*[local-name()='path']]";
  }

  private get minusIconXPath(): string {
    return "/button[.//*[local-name()='svg' and @data-icon='minus-square']/*[local-name()='path']]";
  }

  private todayButtonXPath(columnName: string): string {
    return `${this.baseColumnXPath(columnName)}/app-field-datepicker/span/button[text()='Today']`;
  }

  private dateInputFieldXPath(columnName: string): string {
    return `${this.baseColumnXPath(columnName)}/app-field-datepicker/span/mat-form-field//input`;
  }
}
