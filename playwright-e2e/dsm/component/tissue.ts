import {waitForResponse} from '../../utils/test-utils';
import {expect, Locator, Page} from '@playwright/test';
import {
  SequencingResultsEnum,
  SMIdEnum,
  TissueDynamicFieldsEnum,
  TissueTypesEnum,
  TumorTypesEnum
} from '../pages/tissue-information-page/enums/tissue-information-enum';
import TextArea from '../../dss/component/textarea';
import {
  FillDate,
  TissueInputsMapValue
} from '../pages/tissue-information-page/interfaces/tissue-information-interfaces';
import Select from '../../dss/component/select';
import DatePicker from './date-picker';
import Input from '../../dss/component/input';
import {FillTissue} from '../pages/tissue-information-page/interfaces/fill-tissue-interface';
import {tissueInputs} from '../pages/tissue-information-page/models/tissue-inputs';
import {InputTypeEnum} from './tabs/enums/onc-history-input-columns-enum';
import Button from '../../dss/component/button';
import SMID from './smid';

export default class Tissue {
  private readonly SMIDModal: SMID = new SMID(this.page, this.tissueIndex);

  constructor(private readonly page: Page, private readonly tissueIndex: number = 0) {
  }

  public async getFieldValue(dynamicField: TissueDynamicFieldsEnum): Promise<string> {
    const {
      type: inputType,
      byText
    } = tissueInputs.get(dynamicField) as TissueInputsMapValue;

    let value: Promise<any>;

    switch (inputType) {
      case InputTypeEnum.INPUT: {
        const inputLocator = await this.getField(dynamicField, byText);
        value = new Input(this.page, {root: inputLocator}).currentValue;
        break;
      }
      case InputTypeEnum.DATE: {
        const inputLocator = await this.getField(dynamicField);
        value = new Input(this.page, {root: inputLocator}).currentValue;
        break;
      }
      case InputTypeEnum.TEXTAREA: {
        const textAreaLocator = await this.getField(dynamicField);
        value = new TextArea(this.page, {root: textAreaLocator}).currentValue;
        break;
      }
      case InputTypeEnum.SELECT: {
        const selectLocator = await this.getField(dynamicField);
        value = new Select(this.page, {root: selectLocator}).currentValue;
        break;
      }
      default:
        throw new Error(`Incorrect input type - ${inputType}`)
    }

    return value;
  }

  public async fillSMIDs(SMID: SMIdEnum): Promise<SMID> {
    const SMIDLocator = await this.getField(SMID);
    const SMIDPlusBtn = new Button(this.page, {root: SMIDLocator});
    await SMIDPlusBtn.click();

    return this.SMIDModal;
  }

  public async fillField(dynamicField: TissueDynamicFieldsEnum, {
    inputValue,
    select,
    dates
  }: FillTissue): Promise<void> {
    const {
      type: inputType,
      hasLookup,
      byText
    } = tissueInputs.get(dynamicField) as TissueInputsMapValue;

    switch (inputType) {
      case InputTypeEnum.DATE: {
        dates && await this.fillDateFields(dynamicField, dates);
        break;
      }
      case InputTypeEnum.INPUT: {
        inputValue && await this.fillInputField(dynamicField, inputValue, byText, hasLookup);
        break;
      }
      case InputTypeEnum.TEXTAREA: {
        inputValue && await this.fillTextareaField(dynamicField, inputValue);
        break;
      }
      case InputTypeEnum.SELECT: {
        select && await this.selectField(dynamicField, select);
        break;
      }
      default:
        throw new Error(`Incorrect input type - ${inputType}`)
    }
  }

  /* Helper Functions */
  private async fillTextareaField(dynamicField: TissueDynamicFieldsEnum, value: string | number): Promise<void> {
    const textAreaLocator = await this.getField(dynamicField);
    const textarea = new TextArea(this.page, {root: textAreaLocator});
    const currentValue = await this.getCurrentValue(dynamicField, textarea);
    let actualValue = typeof value === 'number' ? value.toString() : value;
    const maxLength = await textarea.maxLength;

    if (maxLength && actualValue.length > Number(maxLength)) {
      actualValue = actualValue.slice(0, Number(maxLength));
    }

    if (currentValue !== actualValue) {
      await textarea.fill(actualValue, false);
      await textarea.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async selectField(dynamicField: TissueDynamicFieldsEnum,
                            selection: TumorTypesEnum | TissueTypesEnum | SequencingResultsEnum | 'Yes' | 'No')
    : Promise<void> {
    const selectLocator = await this.getField(dynamicField);
    const selectElement = new Select(this.page, {root: selectLocator});
    const currentValue = await this.getCurrentValue(dynamicField, selectElement);

    if (currentValue !== selection) {
      await selectElement.selectOption(selection);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async fillInputField(dynamicField: TissueDynamicFieldsEnum, value: string | number, byText = false, hasLookup = false): Promise<void> {
    const inputLocator = await this.getField(dynamicField, byText);
    const inputElement = new Input(this.page, {root: inputLocator});
    const currentValue = await this.getCurrentValue(dynamicField, inputElement);
    let actualValue = typeof value === 'number' ? value.toString() : value;
    const maxLength = await inputElement.maxLength;

    if (maxLength && actualValue.length > Number(maxLength)) {
      actualValue = actualValue.slice(0, Number(maxLength));
    }

    if (currentValue !== actualValue) {
      if (!currentValue && dynamicField === TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID) {
        await inputElement.focus();
        const dropDown = this.page.locator("//ul[contains(@class, 'Lookup--Dropdown')]/li");
        await dropDown.nth(0).click();
      }
      await inputElement.fillSimple(actualValue);
      await waitForResponse(this.page, {uri: 'patch'});
      hasLookup && await this.lookup();
    }
  }

  private async fillDateFields(dynamicField: TissueDynamicFieldsEnum, value: FillDate): Promise<void> {
    const dateLocator = await this.getField(dynamicField);
    await this.fillDates(dateLocator, value);
  }

  private async fillDates(root: Locator, {date, today}: FillDate): Promise<void> {
    if (today) {
      const todayBtn = new Button(this.page, {root, label: 'Today'});
      await todayBtn.click();
      await waitForResponse(this.page, {uri: 'patch'});
    } else if (date) {
      const datePicker = new DatePicker(this.page, {root});
      await datePicker.open();
      await datePicker.pickDate(date);
      await datePicker.close();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async lookup(selectIndex = 0): Promise<void> {
    const lookupList = this.lookupList;
    const count = await lookupList.count();
    if (count > 0 && selectIndex < count) {
      await lookupList.nth(selectIndex).click();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async getCurrentValue(dynamicField: TissueDynamicFieldsEnum, element: Input | Select | TextArea): Promise<string> {
    const currentValue = await element.currentValue;
    const isDisabled = await element.isDisabled();

    await expect(isDisabled, `'${dynamicField}' is disabled`).toBeFalsy();

    return currentValue?.trim();
  }

  private async getField(dynamicField: TissueDynamicFieldsEnum | SMIdEnum, byText = false): Promise<Locator> {
    const fieldLocator = byText ? this.tissue.getByText(dynamicField) : this.findField(dynamicField);
    await expect(fieldLocator, `'${dynamicField}' is not visible`).toBeVisible();

    return fieldLocator;
  }

  /* Locator */
  private findField(field: TissueDynamicFieldsEnum | SMIdEnum): Locator {
    return this.tissue
      .locator(this.fieldXPath(field));
  }

  private get tissue(): Locator {
    return this.page.locator(this.tissueXPath)
      .nth(this.tissueIndex);
  }

  private get lookupList(): Locator {
    return this.page.locator(this.lookupListXPath);
  }

  /* XPaths */
  private fieldXPath(fieldName: TissueDynamicFieldsEnum | SMIdEnum): string {
    return `//td[text()[normalize-space()='${fieldName}']]/following-sibling::td[1]`
  }

  private get tissueXPath(): string {
    return `${this.participantDynamicInformationTableXPath}//td[app-tissue]/app-tissue/div/table`
  }

  private get participantDynamicInformationTableXPath(): string {
    return `${this.pageXPath}/div/div[last()]/table[not(contains(@class, 'table'))]`
  }

  private get pageXPath(): string {
    return '//app-tissue-page'
  }

  private get lookupListXPath(): string {
    return '//app-lookup/div/ul/li'
  }
}
