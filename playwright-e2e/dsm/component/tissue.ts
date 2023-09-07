import {waitForResponse} from "../../utils/test-utils";
import {Locator, Page} from "@playwright/test";
import {
  SequencingResultsEnum,
  TissueDynamicFieldsEnum,
  TumorTypesEnum
} from "../pages/tissue-information-page/enums/tissue-information-enums";
import TextArea from "../../dss/component/textarea";
import {FillDate, MaterialsReceived} from "../pages/tissue-information-page/interfaces/tissue-information-interfaces";
import Select from "../../dss/component/select";
import DatePicker from "./date-picker";

export default class Tissue {
  constructor(private readonly page: Page, private readonly tissueIndex: number = 0) {
  }

  public async fillNotes(value: string): Promise<void> {
    const notes = this.findField(TissueDynamicFieldsEnum.NOTES);
    const textarea = new TextArea(this.page, {root: notes});
    const existingValue = await textarea.getText();
    if (existingValue.trim() !== value) {
      await textarea.fill(value, false);
      await textarea.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillMaterialsReceived({uss, block, he, scroll, tissueType}: MaterialsReceived): Promise<void> {
    if (uss) {
      const inputElement = this.tissue.getByText(TissueDynamicFieldsEnum.USS).locator(this.inputXPath);
      const existingValue = await inputElement.inputValue();
      const isEnabled = await inputElement.isEnabled();
      if (existingValue !== uss.toString() && isEnabled) {
        await inputElement.fill(uss.toString());
        await inputElement.blur();
        await waitForResponse(this.page, {uri: 'patch'});
      }
    }
    if (block) {
      const inputElement = this.tissue.getByText(TissueDynamicFieldsEnum.BLOCK).locator(this.inputXPath);
      const existingValue = await inputElement.inputValue();
      const isEnabled = await inputElement.isEnabled();
      if (existingValue !== block.toString() && isEnabled) {
        await inputElement.fill(block.toString());
        await inputElement.blur();
        await waitForResponse(this.page, {uri: 'patch'});
      }
    }
    if (he) {
      const inputElement = this.tissue.getByText(TissueDynamicFieldsEnum.H_E).locator(this.inputXPath);
      const existingValue = await inputElement.inputValue();
      const isEnabled = await inputElement.isEnabled();
      if (existingValue !== he.toString() && isEnabled) {
        await inputElement.fill(he.toString());
        await inputElement.blur();
        await waitForResponse(this.page, {uri: 'patch'});
      }
    }
    if (scroll) {
      const inputElement = this.tissue.getByText(TissueDynamicFieldsEnum.SCROLL).locator(this.inputXPath);
      const existingValue = await inputElement.inputValue();
      const isEnabled = await inputElement.isEnabled();
      if (existingValue !== scroll.toString() && isEnabled) {
        await inputElement.fill(scroll.toString());
        await inputElement.blur();
        await waitForResponse(this.page, {uri: 'patch'});
      }
    }
    if(tissueType) {
      const selectElement = new Select(this.page, {root: this.findField(TissueDynamicFieldsEnum.TISSUE_TYPE)});
      const existingValue = await this.activeSelectedListItem(this.findField(TissueDynamicFieldsEnum.TISSUE_TYPE)).textContent();
      if (existingValue !== tissueType) {
        await selectElement.selectOption(tissueType);
        await waitForResponse(this.page, {uri: 'patch'});
      }
    }
  }

  public async fillTissueSite(value: string): Promise<void> {
    const tissueSite = this.findField(TissueDynamicFieldsEnum.TISSUE_SITE);
    const inputElement = tissueSite.locator(this.inputXPath);
    const existingValue = await inputElement.inputValue();
    if (existingValue.trim() !== value) {
      await inputElement.fill(value);
      await inputElement.blur();
      await this.lookup();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillTumorCollaboratorSampleID(value: string): Promise<void> {
    const tumorCollaborator = this.findField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID);
    const inputElement = tumorCollaborator.locator(this.inputXPath);
    const existingValue = await inputElement.inputValue();
    if (existingValue.trim() !== value) {
      await inputElement.fill(value);
      await inputElement.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillSKID(value: string): Promise<void> {
    const skID = this.findField(TissueDynamicFieldsEnum.SK_ID);
    const inputElement = skID.locator(this.inputXPath);
    const existingValue = await inputElement.inputValue();
    if (existingValue.trim() !== value) {
      await inputElement.fill(value);
      await inputElement.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillFirstSMID(value: string): Promise<void> {
    const smID = this.findField(TissueDynamicFieldsEnum.FIRST_SM_ID);
    const inputElement = smID.locator(this.inputXPath);
    const existingValue = await inputElement.inputValue();
    if (existingValue.trim() !== value) {
      await inputElement.fill(value);
      await inputElement.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillSMIDForHE(value: string): Promise<void> {
    const smID = this.findField(TissueDynamicFieldsEnum.SM_ID_FOR_H_E);
    const inputElement = smID.locator(this.inputXPath);
    const existingValue = await inputElement.inputValue();
    if (existingValue.trim() !== value) {
      await inputElement.fill(value);
      await inputElement.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillDateSentToGP(fillDate: FillDate): Promise<void> {
    const dateSentToGP = this.findField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP);
    await this.fillDate(dateSentToGP, fillDate);
  }

  public async fillPathologyReport(pathologyReport: 'Yes' | 'No'): Promise<void> {
    const selectElement = new Select(this.page, {root: this.findField(TissueDynamicFieldsEnum.PATHOLOGY_REPORT)});
    const existingValue = await this.activeSelectedListItem(this.findField(TissueDynamicFieldsEnum.PATHOLOGY_REPORT)).textContent();
    if (existingValue !== pathologyReport) {
      await selectElement.selectOption(pathologyReport);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillTumorType(tumorType: TumorTypesEnum): Promise<void> {
    const selectElement = new Select(this.page, {root: this.findField(TissueDynamicFieldsEnum.TUMOR_TYPE)});
    const existingValue = await this.activeSelectedListItem(this.findField(TissueDynamicFieldsEnum.TUMOR_TYPE)).textContent();
    if (existingValue !== tumorType) {
      await selectElement.selectOption(tumorType);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async fillSequencingResults(sequencingResults: SequencingResultsEnum): Promise<void> {
    const selectElement = new Select(this.page, {root: this.findField(TissueDynamicFieldsEnum.SEQUENCING_RESULTS)});
    const existingValue = await this.activeSelectedListItem(this.findField(TissueDynamicFieldsEnum.SEQUENCING_RESULTS)).textContent();
    if (existingValue !== sequencingResults) {
      await selectElement.selectOption(sequencingResults);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }


  /* Helper Functions */
  private async fillDate(root: Locator, {date, today}: FillDate): Promise<void> {
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
    }
  }

  /* Locator */
  private activeSelectedListItem(root: Locator): Locator {
    return root.locator('mat-select').locator('span.mat-select-min-line');
  }

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

  private get inputXPath(): string {
    return '//mat-form-field//input'
  }

  private get pageXPath(): string {
    return '//app-tissue-page'
  }

  private get lookupListXPath(): string {
    return '//app-lookup/div/ul/li'
  }
}
