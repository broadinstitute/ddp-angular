import {waitForResponse} from "../../utils/test-utils";
import {expect, Locator, Page} from "@playwright/test";
import {
  SequencingResultsEnum,
  TissueDynamicFieldsEnum, TissueTypesEnum,
  TumorTypesEnum
} from "../pages/tissue-information-page/enums/tissue-information-enum";
import TextArea from "../../dss/component/textarea";
import {FillDate, MaterialsReceived} from "../pages/tissue-information-page/interfaces/tissue-information-interfaces";
import Select from "../../dss/component/select";
import DatePicker from "./date-picker";
import Input from "../../dss/component/input";

export default class Tissue {
  constructor(private readonly page: Page, private readonly tissueIndex: number = 0) {
  }

  public async getValueFor(dynamicFieldsEnum: TissueDynamicFieldsEnum): Promise<string> {

  }


  public async fillNotes(value: string): Promise<void> {
    await this.fillTextareaField(TissueDynamicFieldsEnum.NOTES, value);
  }

  public async fillMaterialsReceived({uss, block, he, scroll, tissueType}: MaterialsReceived): Promise<void> {
    uss &&  await this.fillInputField(TissueDynamicFieldsEnum.USS, uss.toString(), true);
    block &&  await this.fillInputField(TissueDynamicFieldsEnum.USS, block.toString(), true);
    he &&  await this.fillInputField(TissueDynamicFieldsEnum.USS, he.toString(), true);
    scroll &&  await this.fillInputField(TissueDynamicFieldsEnum.USS, scroll.toString(), true);
    tissueType && await this.selectField(TissueDynamicFieldsEnum.TISSUE_TYPE, tissueType);
  }

  public async fillTissueSite(value: string): Promise<void> {
    await this.fillInputField(TissueDynamicFieldsEnum.TISSUE_SITE, value);
    await this.lookup();
  }

  public async fillTumorCollaboratorSampleID(value: string): Promise<void> {
    await this.fillInputField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, value);
  }

  public async fillSKID(value: string): Promise<void> {
    await this.fillInputField(TissueDynamicFieldsEnum.SK_ID, value);
  }

  public async fillFirstSMID(value: string): Promise<void> {
    await this.fillInputField(TissueDynamicFieldsEnum.FIRST_SM_ID, value);
  }

  public async fillSMIDForHE(value: string): Promise<void> {
    await this.fillInputField(TissueDynamicFieldsEnum.SM_ID_FOR_H_E, value);
  }

  public async fillDateSentToGP(fillDate: FillDate): Promise<void> {
    await this.fillDateFields(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, fillDate);
  }

  public async selectPathologyReport(pathologyReport: 'Yes' | 'No'): Promise<void> {
    await this.selectField(TissueDynamicFieldsEnum.PATHOLOGY_REPORT, pathologyReport);
  }

  public async selectTumorType(tumorType: TumorTypesEnum): Promise<void> {
    await this.selectField(TissueDynamicFieldsEnum.TUMOR_TYPE, tumorType);
  }

  public async selectSequencingResults(sequencingResults: SequencingResultsEnum): Promise<void> {
    await this.selectField(TissueDynamicFieldsEnum.SEQUENCING_RESULTS, sequencingResults);
  }


  /* Helper Functions */
  private async fillTextareaField(dynamicFieldsEnum: TissueDynamicFieldsEnum, value: string): Promise<void> {
    const textAreaLocator = this.findField(dynamicFieldsEnum);
    await expect(textAreaLocator, `${dynamicFieldsEnum} is not visible`).toBeVisible();

    const textarea = new TextArea(this.page, {root: textAreaLocator});
    const existingValue = await textarea.getText();
    const isDisabled = await textarea.isDisabled();

    if (!isDisabled && existingValue.trim() !== value) {
      await textarea.fill(value, false);
      await textarea.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async selectField(dynamicFieldsEnum: TissueDynamicFieldsEnum, selection: TumorTypesEnum | TissueTypesEnum | SequencingResultsEnum | 'Yes' | 'No'): Promise<void> {
    const selectLocator = this.findField(dynamicFieldsEnum);
    await expect(selectLocator, `${dynamicFieldsEnum} is not visible`).toBeVisible();

    const selectElement = new Select(this.page, {root: selectLocator});
    const existingValue = await selectElement.selectedOption;
    const isDisabled = await selectElement.isSelectDisabled();

    if (!isDisabled && existingValue !== selection) {
      await selectElement.selectOption(selection);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async fillInputField(dynamicFieldsEnum: TissueDynamicFieldsEnum, value: string, byText: boolean = false): Promise<void> {
    const inputLocator = byText ? this.tissue.getByText(dynamicFieldsEnum) : this.findField(dynamicFieldsEnum);
    await expect(inputLocator, `${dynamicFieldsEnum} is not visible`).toBeVisible();

    const inputElement = new Input(this.page, {root: inputLocator});
    const existingValue = await inputElement.inputValue;
    const isDisabled = await inputElement.isDisabled();

    if (!isDisabled && existingValue !== value.toString()) {
      await inputElement.fillSimple(value.toString());
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async fillDateFields(dynamicFieldsEnum: TissueDynamicFieldsEnum, value: FillDate): Promise<void> {
    const dateLocator = this.findField(dynamicFieldsEnum);
    await expect(dateLocator, `${dynamicFieldsEnum} is not visible`).toBeVisible();

    await this.fillDates(dateLocator, value);
  }

  private async fillDates(root: Locator, {date, today}: FillDate): Promise<void> {
    if(today) {
      const todayBtn = root.getByRole('button', {name: 'Today'});
      await todayBtn.click();
      await waitForResponse(this.page, {uri: 'patch'});
      return;
    }
    if(date) {
      const datePicker = new DatePicker(this.page, {root: root});
      await datePicker.open();
      await datePicker.pickDate(date);
      await datePicker.close();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async lookup(selectIndex: number = 0): Promise<void> {
    await waitForResponse(this.page, {uri: 'lookup'});
    const lookupList = this.lookupList;
    const count = await lookupList.count();
    if (count > 0 && selectIndex < count) {
      await lookupList.nth(selectIndex).click();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  /* Locator */
  private findField(field: TissueDynamicFieldsEnum): Locator {
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
  private fieldXPath(fieldName: TissueDynamicFieldsEnum): string {
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
