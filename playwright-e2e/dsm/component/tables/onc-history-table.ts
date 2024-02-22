import { expect, Locator, Page, Response } from '@playwright/test';
import Table from 'dss/component/table';
import DatePicker from 'dsm/component/date-picker';
import TextArea from 'dss/component/textarea';
import {
  InputTypeEnum,
  OncHistoryInputColumnsEnum,
  OncHistorySelectRequestEnum
} from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { OncHistoryInputs } from 'dsm/component/tabs/model/onc-history-inputs';
import {
  OncHistoryInputsMapValue,
  OncHistoryInputsTypes
} from 'dsm/component/tabs/interfaces/onc-history-inputs-types';
import { waitForResponse } from 'utils/test-utils';
import Select from 'dss/component/select';
import TissueInformationPage from 'dsm/pages/tissue/tissue-information-page';
import Button from 'dss/component/button';
import { FillDate } from 'dsm/pages/tissue/interfaces/tissue-information-interfaces';
import Input from 'dss/component/input';
import Checkbox from 'dss/component/checkbox';

export default class OncHistoryTable extends Table {
  private readonly tissueInformationPage: TissueInformationPage;

  constructor(protected readonly page: Page) {
    super(page, { cssClassAttribute: '.table', root: 'app-onc-history-detail' });
    this.tissueInformationPage = new TissueInformationPage(this.page);
  }

  public async openTissueInformationPage(index: number): Promise<TissueInformationPage> {
    const button = new Button(this.page, { root: this.firstRequestColumn(index) });
    await button.click();
    return this.tissueInformationPage;
  }

  public async selectRowAt(index: number): Promise<void> {
    const checkbox = new Checkbox(this.page, { root: this.firstRequestColumn(index) });
    await checkbox.click();
  }

  public async deleteRowAt(index: number): Promise<void> {
    const deleteRowBtn = this.deleteRowButton(index);
    await expect(deleteRowBtn, 'Delete row button is not visible').toBeVisible();
    await Promise.all([
      waitForResponse(this.page, { uri: 'patch' }),
      deleteRowBtn.click()
    ]);
  }

  public async getFieldValue(columnName: OncHistoryInputColumnsEnum, rowIndex = 0): Promise<string> {
    const cell = await this.checkColumnAndCellValidity(columnName, rowIndex);
    const {
      type: inputType,
    }: OncHistoryInputsMapValue = OncHistoryInputs.get(columnName) as OncHistoryInputsMapValue;

    let value: Promise<any>;
    switch (inputType) {
      case InputTypeEnum.INPUT:
        value = new Input(this.page, { root: cell }).currentValue();
        break;
      case InputTypeEnum.DATE:
        value = new Input(this.page, { root: cell }).currentValue();
        break;
      case InputTypeEnum.TEXTAREA:
        value = new TextArea(this.page, { root: cell }).currentValue();
        break;
      case InputTypeEnum.SELECT:
        value = new Select(this.page, { root: cell }).currentValue();
        break;
      default:
        throw new Error(`Incorrect input type - ${inputType}`)
    }
    return value;
  }

  public async fillNotes(note: string, index = 0): Promise<void> {
    const notesIcon = this.notesIconButton(index);
    await expect(notesIcon, `Notes icon at ${index} index is not visible`).toBeVisible();
    await notesIcon.click();
    const notesModalContent = this.notesModalContent;
    await expect(notesModalContent, `Notes modal at ${index} index is not visible`).toBeVisible();
    const textarea = new TextArea(this.page, { root: notesModalContent });
    const currentValue = await textarea.currentValue();
    if (currentValue.trim() !== note) {
      await Promise.all([
        waitForResponse(this.page, { uri: '/patch' }),
        textarea.fill(note)
      ]);
    }
    const saveAndCloseBtn = new Button(this.page, { root: notesModalContent, label: 'Save & Close' });
    await saveAndCloseBtn.click();
  }

  public async fillField(columnName: OncHistoryInputColumnsEnum, {
    date,
    select,
    value,
    lookupSelectIndex
  }: OncHistoryInputsTypes, rowIndex = 0): Promise<void> {
    const cell = await this.checkColumnAndCellValidity(columnName, rowIndex);

    const {
      type: inputType,
      hasLookup
    }: OncHistoryInputsMapValue = OncHistoryInputs.get(columnName) as OncHistoryInputsMapValue;

    switch (inputType) {
      case InputTypeEnum.DATE: {
        date && await this.fillDate(cell, date);
        break;
      }
      case InputTypeEnum.INPUT: {
        await this.fillInput(cell, String(value), hasLookup, lookupSelectIndex);
        break;
      }
      case InputTypeEnum.TEXTAREA: {
        await this.fillTextArea(cell, String(value), hasLookup, lookupSelectIndex);
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
  private async fillInput(root: Locator, value: string | number, hasLookup: boolean, lookupSelectIndex = 0): Promise<Response | null> {
    const input = new Input(this.page, { root });
    const currentValue = await this.getCurrentValue(input);
    let actualValue = typeof value === 'number' ? value.toString() : value;
    const maxLength = await input.maxLength();
    if (maxLength && actualValue.length > Number(maxLength)) {
      actualValue = actualValue.slice(0, Number(maxLength));
    }

    if (currentValue !== actualValue) {
      const [resp] = await Promise.all([
        waitForResponse(this.page, { uri: '/patch' }),
        input.fillSimple(actualValue)
      ]);
      if (hasLookup && lookupSelectIndex >= 0) {
        await this.lookup(input.toLocator(), lookupSelectIndex, true);
      }
      return resp;
    }
    return null;
  }

  public async fillDate(root: Locator, { date, today }: FillDate): Promise<string> {
    const datePicker = new DatePicker(this.page, { root });

    if (today || date === undefined) {
      await datePicker.today();
    } else {
      await datePicker.open();
      await datePicker.pickDate(date)
      await datePicker.close();
    }

    return datePicker.input().currentValue();
  }

  private async fillTextArea(root: Locator, value: string | number, hasLookup: boolean, lookupSelectIndex = 0): Promise<Response | null> {
    const textarea = new TextArea(this.page, { root });
    const currentValue = await this.getCurrentValue(textarea);
    let actualValue = typeof value === 'number' ? value.toString() : value;
    const maxLength = await textarea.maxLength();
    if (maxLength && actualValue.length > Number(maxLength)) {
      actualValue = actualValue.slice(0, Number(maxLength));
    }

    if (currentValue !== actualValue) {
      const respPromise = waitForResponse(this.page, { uri: '/patch' });
      await textarea.fill(actualValue, false);
      await textarea.blur();
      const resp = await respPromise;
      if (hasLookup && lookupSelectIndex >= 0) {
        await this.lookup(textarea.toLocator(), lookupSelectIndex);
      }
      return resp;
    }
    return null;
  }

  private async selectRequest(root: Locator, selectRequest: OncHistorySelectRequestEnum): Promise<Response | null> {
    const matSelect = this.activeSelectedRequestListItem(root);
    const selectedValue = await matSelect.textContent();

    if (selectedValue?.trim() !== selectRequest) {
      const selectInput = new Select(this.page, { root });
      const [resp] = await Promise.all([
        waitForResponse(this.page, { uri: '/patch' }),
        selectInput.selectOption(selectRequest)
      ]);
      return resp;
    }
    return null;
  }

  private async lookup(root: Locator, selectIndex = 0, isFacility = false): Promise<string> {
    const lookupList = this.lookupList(root);
    const count = await lookupList.count();
    if (count > 0 && selectIndex < count) {
      if (isFacility) {
        const isComplete = (await lookupList.nth(selectIndex).locator('span').count()) === 3;
        expect(isComplete, `Lookup value is not complete at provided index - ${selectIndex}`)
          .toBeTruthy()
      }
      const text = await lookupList.nth(selectIndex).innerText();
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        lookupList.nth(selectIndex).click()
      ]);
      return text;
    }
    return '';
  }

  private async getCurrentValue(element: Input | Select | TextArea): Promise<string> {
    const currentValue = await element.currentValue();
    const isDisabled = await element.isDisabled();
    expect(isDisabled, `Input field is disabled`).toBeFalsy();
    return currentValue?.trim();
  }

  /* Assertions */
  public async assertRowSelectionCheckbox(index = 0): Promise<void> {
    const checkbox = this.firstRequestColumn(index).locator('//mat-checkbox');
    await expect(checkbox, 'Row selection checkbox is not visible').toBeVisible();
  }


  /* Locators */
  public lookupList(root: Locator): Locator {
    return root.locator(this.lookupListXPath);
  }

  private activeSelectedRequestListItem(root: Locator): Locator {
    return root.locator('mat-select').locator('span.mat-select-min-line');
  }

  private notesIconButton(index = 0): Locator {
    return this.row(index).locator('td').locator('//button[.//*[name()="svg" and @data-icon="comment-alt"]]');
  }

  private get notesModalContent(): Locator {
    return this.page.locator('app-onc-history-detail').locator('app-modal').locator('.modal-content');
  }

  private deleteRowButton(index: number): Locator {
    return this.row(index).locator('td').last().getByRole('button');
  }

  private firstRequestColumn(index: number): Locator {
    return this.row(index).locator('td').first();
  }

  public row(index: number): Locator {
    return this.rowLocator().nth(index);
  }

  public rowLocator(): Locator {
    return this.page.locator(this.tableXPath + this.rowXPath);
  }

  private column(columnName: OncHistoryInputColumnsEnum): Locator {
    return this.page.locator(this.columnXPath(columnName));
  }

  private td(columnName: OncHistoryInputColumnsEnum): Locator {
    return this.page.locator(this.tdXPath(columnName));
  }

  /* Assertions */
  public async checkColumnAndCellValidity(columnName: OncHistoryInputColumnsEnum, rowIndex: number): Promise<Locator> {
    let column = this.column(columnName);
    if (await column.count() > 1) {
      column = column.nth(1);
    }
    await expect(column, `Onc History Table - the column ${columnName} doesn't exist`)
      .toBeVisible();

    const cell: Locator = this.td(columnName).nth(rowIndex);
    await expect(cell, `Kits Table - more than one or no column was found with the name ${columnName}`)
      .toHaveCount(1);

    return cell;
  }


  /* XPaths */
  private get tableXPath(): string {
    return `//app-onc-history-detail//table[contains(@class,"table")]`
  }

  private get rowXPath(): string {
    return '/tbody/tr'
  }

  private get lookupListXPath(): string {
    return '//ancestor-or-self::td//app-lookup/div/ul/li'
  }

  private tdXPath(columnName: OncHistoryInputColumnsEnum): string {
    return `${this.tableXPath}${this.rowXPath}//td[position()=${this.columnPositionXPath(columnName)}]`;
  }

  private columnPositionXPath(columnName: OncHistoryInputColumnsEnum): string {
    return `count(${this.columnXPath(columnName)}/preceding-sibling::th)+1`;
  }

  private columnXPath(columnName: OncHistoryInputColumnsEnum): string {
    return `${this.headerXPath}/th[descendant-or-self::*[text()[normalize-space()="${columnName}"]]]`;
  }

  private get headerXPath(): string {
    return '//table/thead/tr[1]'
  }
}
