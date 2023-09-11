import {expect, Locator, Page} from "@playwright/test";
import Table from "dss/component/table";
import DatePicker from "../date-picker";
import TextArea from "../../../dss/component/textarea";
import {
  InputTypeEnum,
  OncHistoryInputColumnsEnum,
  OncHistorySelectRequestEnum
} from "../tabs/enums/onc-history-input-columns-enum";
import {OncHistoryInputs} from "../tabs/models/onc-history-inputs";
import {
  OncHistoryDateInput,
  OncHistoryInputsMapValue,
  OncHistoryInputsTypes
} from "../tabs/interfaces/onc-history-inputs-types";
import {waitForResponse} from "../../../utils/test-utils";
import Select from "../../../dss/component/select";
import TissueInformationPage from "../../pages/tissue-information-page/tissue-information-page";
import Button from "../../../dss/component/button";

export default class OncHistoryTable extends Table {
  private readonly tissueInformationPage = new TissueInformationPage(this.page);

  constructor(private readonly page: Page) {
    super(page, {cssClassAttribute: '.table'});
  }

  public async openTissueInformationPage(index: number): Promise<TissueInformationPage> {
    await this.tissueRequestPageButton(index).click();
    return this.tissueInformationPage;
  }

  public async selectDeselectRow(index: number): Promise<void> {
    const selectRowCheckbox = this.selectRowCheckbox(index);
    await expect(selectRowCheckbox, 'Select row checkbox is not visible').toBeVisible();
    await selectRowCheckbox.click();
  }

  public async deleteRow(index: number): Promise<void> {
    const deleteRowBtn = await this.deleteRowButton(index);
    await expect(deleteRowBtn, 'Delete row button is not visible').toBeVisible();
    await deleteRowBtn.click();
    await waitForResponse(this.page, {uri: 'patch'});
  }

  public async getFieldValue(columnName: OncHistoryInputColumnsEnum, rowIndex: number = 0): Promise<string> {
    const cell = await this.checkColumnAndCellValidity(columnName, rowIndex);

    const {
      type: inputType,
    }: OncHistoryInputsMapValue = OncHistoryInputs.get(columnName) as OncHistoryInputsMapValue;

    let value: Promise<any>;

    switch (inputType) {
      case InputTypeEnum.INPUT: {
        const inputLocator = this.input(cell);
        value = inputLocator.inputValue();
        break;
      }
      case InputTypeEnum.DATE: {
        const inputLocator = this.input(cell);
        value = inputLocator.inputValue();
        break;
      }
      case InputTypeEnum.TEXTAREA: {
        const textArea = new TextArea(this.page, {root: cell});
        value = textArea.currentValue;
        break;
      }
      case InputTypeEnum.SELECT: {
        value = this.activeSelectedRequestListItem(cell).textContent();
        break;
      }
      default:
        throw new Error(`Incorrect input type - ${inputType}`)
    }

    return value;
  }

  public async fillNotes(note: string, index: number = 0): Promise<void> {
    const notesIcon = this.notesIconButton(index);
    await expect(notesIcon, `Notes icon at ${index} index is not visible`).toBeVisible();
    await notesIcon.click();
    const notesModalContent = this.notesModalContent;
    await expect(notesModalContent, `Notes modal at ${index} index is not visible`).toBeVisible();
    const textarea = new TextArea(this.page, {root: notesModalContent});
    await textarea.fill(note);
    await waitForResponse(this.page, {uri: 'patch'});
    const saveAndCloseBtn = new Button(this.page, {root: notesModalContent, label: 'Save & Close'});
    await saveAndCloseBtn.click();
  }

  public async fillField(columnName: OncHistoryInputColumnsEnum, {
    date,
    select,
    value,
    force = true
  }: OncHistoryInputsTypes, rowIndex: number = 0): Promise<void> {
    const cell = await this.checkColumnAndCellValidity(columnName, rowIndex);

    const {
      type: inputType,
      hasLookup
    }: OncHistoryInputsMapValue = OncHistoryInputs.get(columnName) as OncHistoryInputsMapValue;

    switch (inputType) {
      case InputTypeEnum.DATE: {
        await this.fillDate(cell, date as OncHistoryDateInput, hasLookup, force);
        break;
      }
      case InputTypeEnum.INPUT: {
        await this.fillInput(cell, String(value), hasLookup, force);
        break;
      }
      case InputTypeEnum.TEXTAREA: {
        await this.fillTextArea(cell, String(value), hasLookup, force);
        break;
      }
      case InputTypeEnum.SELECT: {
        await this.selectRequest(cell, select as OncHistorySelectRequestEnum);
        break;
      }
      default:
        throw new Error(`Incorrect input type - ${inputType}`)
    }
  }

  /* Helper Functions */
  private async fillInput(root: Locator, value: string, hasLookup: boolean, force: boolean): Promise<void> {
    const inputLocator = this.input(root);
    const hasInputValue = await inputLocator.inputValue();
    if (hasInputValue && !force) {
      return;
    }
    if (hasInputValue && force) {
      const tempFillValue = hasLookup ? new Date().getTime().toString() : '';
      await inputLocator.fill(tempFillValue);
      await inputLocator.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
    await inputLocator.fill(value);
    await inputLocator.blur();
    hasLookup && await this.lookup(2);
    await waitForResponse(this.page, {uri: 'patch'});
  }

  private async fillDate(root: Locator, date: OncHistoryDateInput, hasLookup: boolean, force: boolean): Promise<void> {
    const inputLocator = this.input(root);
    const hasInputValue = await inputLocator.inputValue();
    if (hasInputValue && !force) {
      return;
    }
    const datePicker = new DatePicker(this.page, {root: root});
    await datePicker.open();
    await datePicker.pickDate(date);
    await datePicker.close();
    hasLookup && await this.lookup();
    await waitForResponse(this.page, {uri: 'patch'});
  }

  private async fillTextArea(root: Locator, value: string, hasLookup: boolean, force: boolean): Promise<void> {
    const textArea = new TextArea(this.page, {root: root});
    const hasValue = await textArea.currentValue;
    if (hasValue && !force) {
      return;
    }
    if (hasValue && force) {
      const tempFillValue = hasLookup ? new Date().getTime().toString() : '';
      await textArea.fill(tempFillValue, false);
      await textArea.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
    await textArea.fill(value, false);
    await textArea.blur();
    hasLookup && await this.lookup();
    await waitForResponse(this.page, {uri: 'patch'});
  }

  private async selectRequest(root: Locator, selectRequest: OncHistorySelectRequestEnum): Promise<void> {
    const matSelect = this.activeSelectedRequestListItem(root);
    const selectedValue = await matSelect.textContent();
    if(selectedValue?.trim() !== selectRequest) {
      const selectInput = new Select(this.page, {root: root});
      await selectInput.selectOption(selectRequest);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async lookup(selectIndex: number = 0): Promise<void> {
    await waitForResponse(this.page, {uri: 'lookup'});
    const lookupList = this.lookupList;
    const count = await lookupList.count();
    if (count > 0 && selectIndex < count) {
      await lookupList.nth(selectIndex).click();
    }
  }


  /* Locators */
  private get lookupList(): Locator {
    return this.page.locator(this.lookupListXPath);
  }

  private activeSelectedRequestListItem(root: Locator): Locator {
    return root.locator('mat-select').locator('span.mat-select-min-line');
  }

  private notesIconButton(index: number = 0): Locator {
    return this.row(index).locator('td').locator('//button[.//*[name()=\'svg\' and @data-icon=\'comment-alt\']]');
  }

  private get notesModalContent(): Locator {
    return this.page.locator('app-onc-history-detail').locator('app-modal').locator('.modal-content');
  }

  private deleteRowButton(index: number = 0): Locator {
    return this.row(index).locator('td').last().getByRole('button');
  }

  private selectRowCheckbox(index: number = 0): Locator {
    return this.firstRequestColumn(index).locator('mat-checkbox');
  }

  private tissueRequestPageButton(index: number): Locator {
    return this.firstRequestColumn(index).locator('button');
  }

  private firstRequestColumn(index: number): Locator {
    return this.row(index).locator('td').first();
  }

  private row(index: number): Locator {
    return this.page.locator(this.tableXPath + this.rowXPath).nth(index);
  }

  private column(columnName: OncHistoryInputColumnsEnum): Locator {
    return this.page.locator(this.columnXPath(columnName));
  }

  private td(columnName: OncHistoryInputColumnsEnum): Locator {
    return this.page.locator(this.tdXPath(columnName));
  }

  private input(root: Locator): Locator {
    return root.locator(this.inputXPath);
  }

  /* Assertions */
  private async checkColumnAndCellValidity(columnName: OncHistoryInputColumnsEnum, rowIndex: number): Promise<Locator> {
    let column = this.column(columnName);
    if(await column.count() > 1) {
      column = column.nth(1);
    }
    await expect(column, `Onc History Table - the column ${columnName} doesn't exist`)
      .toBeVisible();

    const cell: Locator = this.td(columnName).nth(rowIndex);
    await expect(cell, 'Kits Table - more than one column was found with the same name ' + columnName)
      .toHaveCount(1);

    return cell;
  }


  /* XPaths */
  private get tableXPath(): string {
    return `//app-onc-history-detail//table[contains(@class,'table')]`
  }

  private get rowXPath(): string {
    return '/tbody/tr'
  }

  private get lookupListXPath(): string {
    return '//app-lookup/div/ul/li'
  }

  private tdXPath(columnName: OncHistoryInputColumnsEnum): string {
    return `${this.tableXPath}${this.rowXPath}//td[position()=${this.columnPositionXPath(columnName)}]`;
  }

  private columnPositionXPath(columnName: OncHistoryInputColumnsEnum): string {
    return `count(${this.columnXPath(columnName)}/preceding-sibling::th)+1`;
  }

  private columnXPath(columnName: OncHistoryInputColumnsEnum): string {
    return `${this.headerXPath}/th[descendant-or-self::*[text()[normalize-space()='${columnName}']]]`;
  }

  private get headerXPath(): string {
    return '//table/thead/tr[1]'
  }

  private get inputXPath(): string {
    return '//mat-form-field//input'
  }

}
