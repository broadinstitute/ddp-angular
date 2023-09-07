import {expect, Locator, Page} from "@playwright/test";
import {
  DynamicFieldsEnum,
  ProblemWithTissueEnum,
  TissueInformationEnums
} from "./enums/tissue-information-enums";
import DatePicker from "../../component/date-picker";
import {waitForResponse} from "../../../utils/test-utils";
import {FillDate} from "./interfaces/tissue-information-interfaces";
import Select from "../../../dss/component/select";
import TextArea from "../../../dss/component/textarea";
import Tissue from "../../component/tissue";


export default class TissueInformationPage {
  private readonly PAGE_TITLE = 'Tissue Request';

  constructor(private readonly page: Page) {}

  public tissue(index: number = 0): Tissue {
    return new Tissue(this.page, index);
  }

  public async addTissue(): Promise<Tissue> {
    const addTissueBtn = this.addTissueButton();
    await expect(addTissueBtn, `Add Tissue button is not visible`).toBeVisible();
    await addTissueBtn.click();
    const tissuesCount = await this.page.locator(this.tissueXPath).count();
    return this.tissue(tissuesCount - 1);
  }

  public async deleteTissueByIndex(tissueIndex: number): Promise<void> {
    const deleteTissueBtn = this.deleteTissueButton(tissueIndex);
    await expect(deleteTissueBtn, `Tissue at index '${tissueIndex}' is not visible`).toBeVisible();
    await deleteTissueBtn.click();
  }

  public async getParticipantInformation(name: TissueInformationEnums): Promise<string> {
    const participantInformation = this.participantInformation(name);
    await expect(participantInformation, `Data can't be found on - ${name}`).toBeVisible();
    const data = await participantInformation.textContent();
    return data?.trim() as string;
  }

  public async fillFaxSentDates(date1: FillDate, date2?: FillDate, date3?: FillDate): Promise<void> {
    const firstDatePicker = this.faxSentDatePickers.nth(0);
    await expect(firstDatePicker, 'Fax Sent First date picker is not visible').toBeVisible();
    await this.fillDate(firstDatePicker, date1);

    if(date2) {
      const secondDatePicker = this.faxSentDatePickers.nth(1);
      await expect(secondDatePicker, 'Fax Sent Second date picker is not visible').toBeVisible();
      await this.fillDate(secondDatePicker, date2);
    }

    if(date3) {
      const thirdDatePicker = this.faxSentDatePickers.nth(2);
      await expect(thirdDatePicker, 'Fax Sent Third date picker is not visible').toBeVisible();
      await this.fillDate(thirdDatePicker, date3);
    }

  }

  public async fillTissueReceivedDate(date: FillDate): Promise<void> {
    const datePicker = this.tissueReceivedDatePicker;
    await expect(datePicker, 'Tissue Received Date picker is not visible').toBeVisible();
    await this.fillDate(datePicker, date);
    await waitForResponse(this.page, {uri: 'patch'});
  }

  public async fillNotes(value: string): Promise<void> {
    const notes = this.notes;
    await expect(notes, 'Notes textarea is not visible').toBeVisible();
    const textarea = new TextArea(this.page, {root: notes});
    await textarea.fill(value, false);
    await textarea.blur();
    await waitForResponse(this.page, {uri: 'patch'});
  }

  public async fillDestructionPolicy(value: number, keptIndefinitelySelection: boolean = false, applyToAll: boolean = false): Promise<void> {
    const destructionPolicyYears = this.destructionPolicy.locator('mat-form-field').locator('input');
    await expect(destructionPolicyYears, 'Destruction Policy Years is not visible').toBeVisible();

    if(keptIndefinitelySelection) {
      const keptIndefinitelyCheckbox = this.destructionPolicy.locator('span mat-checkbox');
      await expect(keptIndefinitelyCheckbox, 'Kept Indefinitely checkbox is not visible').toBeVisible();
      await keptIndefinitelyCheckbox.click();
      await waitForResponse(this.page, {uri: 'patch'});
    }

    if(await destructionPolicyYears.isEnabled() && (await destructionPolicyYears.inputValue()).trim() !== value.toString()) {
      await destructionPolicyYears.fill(value.toString());
      await destructionPolicyYears.blur();
      await waitForResponse(this.page, {uri: 'patch'});
    }

    if(applyToAll) {
      const applyToALlBtn = this.destructionPolicy.getByRole('button', {name: 'APPLY TO ALL'});
      await expect(applyToALlBtn, 'APPLY TO ALL button is not visible').toBeVisible();
      await applyToALlBtn.click();
      const modalBtn = this.page.locator('app-modal').getByRole('button', {name: 'Yes'});
      await modalBtn.click();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async problemsWithTissue(select: ProblemWithTissueEnum, unableToObtainSelection: boolean = false): Promise<void> {
    const problemsWithTissueSelection = this.problemsWithTissueSelection;
    await expect(problemsWithTissueSelection, 'Problems with Tissue selection is not visible')
      .toBeVisible();

    const selectedValue = await this.activeSelectedListItem(problemsWithTissueSelection).textContent();

    if (selectedValue?.trim() !== select) {
      const selectElement = new Select(this.page, {root: problemsWithTissueSelection});
      await selectElement.selectOption(select);
      await waitForResponse(this.page, {uri: 'patch'});
    }

    if(unableToObtainSelection) {
      const problemsWithTissueUnableToObtainCheckbox = this.problemsWithTissueUnableToObtainCheckbox;
      await expect(problemsWithTissueUnableToObtainCheckbox,
        'Problems with Tissue Unable to Obtain checkbox is not visible')
        .toBeVisible();
      await problemsWithTissueUnableToObtainCheckbox.click();
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  public async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    const genderSelection = this.gender;
    await expect(genderSelection, 'Gender selection is not visible')
      .toBeVisible();
    const selectedValue = await this.activeSelectedListItem(genderSelection).textContent();
    if(selectedValue?.trim() !== gender) {
      const selectElement = new Select(this.page, {root: genderSelection});
      await selectElement.selectOption(gender);
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

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    const pageTitle = await this.pageTitle.textContent();
    expect(pageTitle?.trim()).toEqual(this.PAGE_TITLE);
  }

  /* Locators */
  private get pageTitle(): Locator {
    return this.page.locator(this.pageTitleXPath);
  }

  private participantInformation(name: TissueInformationEnums) {
    return this.page.locator(this.participantInformationXpath(name));
  }

  private get faxSentDatePickers(): Locator {
    return this.page.locator(this.faxSentDatePickersXPath);
  }

  private get tissueReceivedDatePicker(): Locator {
    return this.page.locator(this.tissueReceivedDatePickerXPath);
  }

  private get problemsWithTissueSelection(): Locator {
    return this.page.locator(this.problemWithTissueSelectionXpath);
  }

  private get problemsWithTissueUnableToObtainCheckbox(): Locator {
    return this.page.locator(this.problemWithTissueUnableToObtainCheckboxXPath);
  }

  private get notes(): Locator {
    return this.page.locator(this.notesXPath);
  }

  private get destructionPolicy(): Locator {
    return this.page.locator(this.destructionPolicyXPath);
  }

  private get gender(): Locator {
    return this.page.locator(this.genderXPath);
  }

  private activeSelectedListItem(root: Locator): Locator {
    return root.locator('mat-select').locator('span.mat-select-min-line');
  }

  private deleteTissueButton(tissueIndex: number): Locator {
    return this.page.locator(this.tissueXPath).nth(tissueIndex)
      .locator('tr')
      .nth(0)
      .getByRole('button');
  }

  private addTissueButton(): Locator {
    return this.page.locator(this.participantDynamicInformationTableXPath)
      .locator('tr')
      .last()
      .getByRole('button')
  }

  /* XPaths */
  private participantInformationXpath(name: TissueInformationEnums) {
    return `${this.participantInformationTableXPath}/tr[td[text()[normalize-space()='${name}']]]/td[2]`
  }

  private get genderXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.GENDER)}`;
  }

  private get destructionPolicyXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.DESTRUCTION_POLICY)}`;
  }

  private get notesXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.NOTES)}`;
  }

  private get problemWithTissueSelectionXpath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.PROBLEM_WITH_TISSUE)}`;
  }

  private get tissueXPath(): string {
    return `${this.participantDynamicInformationTableXPath}//td[app-tissue]/app-tissue/div/table`;
  }

  private get problemWithTissueUnableToObtainCheckboxXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.PROBLEM_WITH_TISSUE, 3)}/mat-checkbox`;
  }

  private get faxSentDatePickersXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.FAX_SENT)}/app-field-datepicker`;
  }

  private get tissueReceivedDatePickerXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.TISSUE_RECEIVED)}/app-field-datepicker`
  }

  private dynamicField(dynamicField: DynamicFieldsEnum, index: number = 2): string {
    return `${this.participantDynamicInformationTableXPath}/tr[td[1][text()[normalize-space()='${dynamicField}']]]/td[${index}]`
  }

  private get participantInformationTableXPath(): string {
    return `${this.pageXPath}//table[contains(@class, 'table-condensed')]/tbody`
  }

  private get participantDynamicInformationTableXPath(): string {
    return `${this.pageXPath}/div/div[last()]/table[not(contains(@class, 'table'))]`
  }

  private get pageTitleXPath(): string {
    return `${this.pageXPath}/h1`
  }

  private get pageXPath(): string {
    return '//app-tissue-page'
  }

}
