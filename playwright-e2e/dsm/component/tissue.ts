import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { expect, Locator, Page } from '@playwright/test';
import TextArea from 'dss/component/textarea';
import {
  FillDate,
  FillInMap,
  InputTypeMap
} from 'dsm/component/models/tissue-inputs-interface';
import Select from 'dss/component/select';
import DatePicker from './date-picker';
import Input from 'dss/component/input';
import { TissueInputs } from 'dsm/component/models/tissue-inputs';
import { InputTypeEnum, OncHistorySelectRequestEnum } from './tabs/enums/onc-history-input-columns-enum';
import Button from 'dss/component/button';
import SMID from './sm-id';
import { Label, SM_ID, TissueType } from 'dsm/enums';


export enum SequencingResultsEnum {
  FAILURE_AT_SHL = 'Failure at SHL',
  ABANDONED_AT_GP = 'Abandoned at GP',
  FAILED_PURITY = 'Failed Purity',
  EXTERNAL_PATH_REVIEW_FAILED = 'External Path Review Failed',
  SUCCESS = 'Success',
  EMPTY = ''
}

export enum TumorTypesEnum {
  PRIMARY = 'Primary',
  MET = 'Met',
  RECURRENT = 'Recurrent',
  UNKNOWN = 'Unknown'
}

export default class Tissue {
  private readonly SMIDModal: SMID;

  constructor(private readonly page: Page, private readonly nth = 0, private readonly root: Locator) {
    this.SMIDModal = new SMID(this.page, root);
  }

  get rootLocator(): Locator {
    return this.root.locator('app-tissue').nth(this.nth);
  }

  public async delete(): Promise<void> {
    const deleteButton = this.rootLocator.locator('//button[.//@data-icon="trash-alt"]');
    await Promise.all([
      waitForResponse(this.page, { uri: '/patch' }),
      deleteButton.click()
    ]);
    await waitForNoSpinner(this.page);
  }

  public async getFieldValue(dynamicField: Label): Promise<string> {
    const {
      inputType,
      byText
    } = TissueInputs.get(dynamicField) as InputTypeMap;

    let value: Promise<any>;
    const inputLocator = await this.getField(dynamicField, byText);

    switch (inputType) {
      case InputTypeEnum.INPUT:
        value = new Input(this.page, { root: inputLocator }).currentValue();
        break;
      case InputTypeEnum.DATE:
        value = new Input(this.page, { root: inputLocator }).currentValue();
        break;
      case InputTypeEnum.TEXTAREA:
        value = new TextArea(this.page, { root: inputLocator }).currentValue();
        break;
      case InputTypeEnum.SELECT:
        value = new Select(this.page, { root: inputLocator }).currentValue();
        break;
      default:
        throw new Error(`Incorrect input type - ${inputType}`)
    }

    return value;
  }

  public async fillSMIDs(SMID: SM_ID): Promise<SMID> {
    const SMIDLocator = await this.getField(SMID);
    const SMIDPlusBtn = new Button(this.page, { root: SMIDLocator });
    await SMIDPlusBtn.click();

    return this.SMIDModal;
  }

  public async fillField(dynamicField: Label, {
    inputValue,
    lookupIndex,
    selection: select,
    date
  }: FillInMap): Promise<void> {
    const {
      inputType,
      byText,
      hasLookup
    } = TissueInputs.get(dynamicField) as InputTypeMap;

    switch (inputType) {
      case InputTypeEnum.DATE: {
        date && await this.fillDateFields(dynamicField, date);
        break;
      }
      case InputTypeEnum.INPUT: {
        inputValue && await this.fillInputField(dynamicField, inputValue, byText, hasLookup, lookupIndex);
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

  public async getTumorCollaboratorSampleIDSuggestedValue(): Promise<string> {
    const inputLocator = await this.getField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, false);
    const inputElement = new Input(this.page, { root: inputLocator });
    const currentValue = await inputElement.currentValue();

    await inputElement.focus();
    if (currentValue.length >= 0) {
      await inputElement.clear();
      await inputElement.blur();
      await inputElement.focus();
    }

    const dropDown = inputLocator.locator("//ul[contains(@class, 'Lookup--Dropdown')]/li");
    await expect(dropDown).toHaveCount(1);

    await dropDown.nth(0).click();
    return this.getCurrentValue(Label.TUMOR_COLLABORATOR_SAMPLE_ID, inputElement);
  }

  /* Helper Functions */
  private async fillTextareaField(dynamicField: Label, value: string | number): Promise<void> {
    const textAreaLocator = await this.getField(dynamicField);
    const textarea = new TextArea(this.page, { root: textAreaLocator });
    const currentValue = await this.getCurrentValue(dynamicField, textarea);
    let actualValue = typeof value === 'number' ? value.toString() : value;
    const maxLength = await textarea.maxLength();

    if (maxLength && actualValue.length > Number(maxLength)) {
      actualValue = actualValue.slice(0, Number(maxLength));
    }

    if (currentValue !== actualValue) {
      const respPromise = waitForResponse(this.page, { uri: 'patch' });
      await textarea.fill(actualValue, false);
      await textarea.blur();
      await respPromise;
    }
  }

  private async selectField(dynamicField: Label,
    selection: TumorTypesEnum | TissueType | SequencingResultsEnum | OncHistorySelectRequestEnum | 'Yes' | 'No')
    : Promise<void> {
    const selectLocator = await this.getField(dynamicField);
    const selectElement = new Select(this.page, { root: selectLocator });
    const currentValue = await this.getCurrentValue(dynamicField, selectElement);

    if (currentValue !== selection) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        selectElement.selectOption(selection)
      ]);
    }
  }

  private async fillInputField(dynamicField: Label, value: string | number, byText = false, hasLookup = false, lookupIndex = 0): Promise<void> {
    const inputLocator = await this.getField(dynamicField, byText);
    const inputElement = new Input(this.page, { root: inputLocator });
    const currentValue = await this.getCurrentValue(dynamicField, inputElement);
    let actualValue = typeof value === 'number' ? value.toString() : value.trim();
    const maxLength = await inputElement.maxLength();

    if (maxLength && actualValue.length > Number(maxLength)) {
      actualValue = actualValue.slice(0, Number(maxLength));
    }

    await inputElement.focus();
    if (currentValue !== actualValue) {
      if (!currentValue && dynamicField === Label.TUMOR_COLLABORATOR_SAMPLE_ID) {
        const dropDown = this.page.locator("//ul[contains(@class, 'Lookup--Dropdown')]/li");
        await dropDown.nth(0).click();
      }
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        inputElement.fillSimple(actualValue)
      ]);
      hasLookup && await this.lookup(lookupIndex);
    }
  }

  private async fillDateFields(dynamicField: Label, value: FillDate): Promise<void> {
    const dateLocator = await this.getField(dynamicField);
    await this.fillDates(dateLocator, value);
  }

  private async fillDates(root: Locator, { date, today }: FillDate): Promise<void> {
    if (today) {
      const todayBtn = new Button(this.page, { root, label: 'Today' });
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        todayBtn.click()
      ]);
    } else if (date) {
      const datePicker = new DatePicker(this.page, { root });
      await datePicker.open();
      const respPromise = waitForResponse(this.page, { uri: 'patch' });
      await datePicker.pickDate(date);
      await datePicker.close();
      await respPromise;
    }
  }

  private async lookup(selectIndex = 0): Promise<void> {
    const lookupList = this.lookupList;
    const count = await lookupList.count();
    if (count > 0 && selectIndex < count) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        lookupList.nth(selectIndex).click()
      ]);
    }
  }

  private async getCurrentValue(dynamicField: Label, element: Input | Select | TextArea): Promise<string> {
    const currentValue = await element.currentValue();
    const isDisabled = await element.isDisabled();

    expect(isDisabled, `'${dynamicField}' is disabled`).toBeFalsy();

    return currentValue?.trim();
  }

  private async getField(dynamicField: Label | SM_ID, byText = false): Promise<Locator> {
    const fieldLocator = byText ? this.rootLocator.getByText(dynamicField) : this.findField(dynamicField);
    await expect(fieldLocator, `'${dynamicField}' is not visible`).toBeVisible();

    return fieldLocator;
  }

  /* Locator */
  private findField(field: Label | SM_ID): Locator {
    return this.rootLocator.locator(this.fieldXPath(field));
  }

  private get lookupList(): Locator {
    return this.page.locator('xpath=//app-lookup/div/ul/li');
  }

  /* XPaths */
  private fieldXPath(fieldName: Label | SM_ID): string {
    return `//td[text()[normalize-space()='${fieldName}']]/following-sibling::td[1]`
  }
}
