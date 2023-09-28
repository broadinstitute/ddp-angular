import { expect, Locator, Page } from '@playwright/test';
import { DynamicFieldsEnum, ProblemWithTissueEnum, TissueInformationEnum } from './enums/tissue-information-enum';
import DatePicker from 'dsm/component/date-picker';
import { waitForResponse } from 'utils/test-utils';
import { FillDate } from './interfaces/tissue-information-interfaces';
import Select from 'dss/component/select';
import TextArea from 'dss/component/textarea';
import Tissue from 'dsm/component/tissue';
import Checkbox from 'dss/component/checkbox';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import Modal from 'dsm/component/modal';


export default class TissueInformationPage {
  private readonly PAGE_TITLE = 'Tissue Request';

  constructor(private readonly page: Page) { }

  public async tissue(index = 0): Promise<Tissue> {
    await this.tissuesCountCheck(index);
    return new Tissue(this.page, index);
  }

  public async backToParticipantPage(): Promise<void> {
    await this.page.getByText('<< back to Participant Page').click();
    await this.page.waitForLoadState('load');
  }

  public async backToList(): Promise<void> {
    await this.page.getByText('<< back to List').click();
    await this.page.waitForLoadState('load');
  }

  public async addTissue(): Promise<Tissue> {
    const addTissueBtnLocator = this.addTissueButton;
    await expect(addTissueBtnLocator, `Add Tissue button is not visible`).toBeVisible();
    const button = new Button(this.page, { root: addTissueBtnLocator });
    const isDisabled = await button.isDisabled();

    if (isDisabled) {
      throw new Error('Add tissue button is disabled');
    }

    await button.click();
    const tissuesCount = await this.tissuesCount;
    return this.tissue(tissuesCount - 1);
  }

  public async deleteTissueAt(tissueIndex: number): Promise<void> {
    await this.tissuesCountCheck(tissueIndex);
    const deleteTissueBtnLocator = this.deleteTissueButton(tissueIndex);
    await expect(deleteTissueBtnLocator, `Tissue at index '${tissueIndex}' is not visible`).toBeVisible();

    const button = new Button(this.page, { root: deleteTissueBtnLocator });
    const isDisabled = await button.isDisabled();

    if (isDisabled) {
      throw new Error('Delete tissue button is disabled');
    }

    await button.click();
  }

  public async getParticipantInformation(name: TissueInformationEnum): Promise<string> {
    const participantInformation = this.participantInformation(name);
    await expect(participantInformation, `Data can't be found on - ${name}`).toBeVisible();

    const data = await participantInformation.textContent();
    return data?.trim() as string;
  }

  public async getFaxSentDate(dateIndex = 0): Promise<string> {
    const faxSentLocator = this.locatorFor(DynamicFieldsEnum.FAX_SENT).locator('app-field-datepicker')
      .nth(dateIndex);

    await expect(faxSentLocator, `Fax sent date is not visible at ${dateIndex} index`).toBeVisible();

    const inputField = new Input(this.page, { root: faxSentLocator });
    return inputField.currentValue();
  }

  public async getTissueReceivedDate(): Promise<string> {
    const tissueReceivedLocator = this.locatorFor(DynamicFieldsEnum.TISSUE_RECEIVED);

    await expect(tissueReceivedLocator, 'Tissue Received Date is not visible').toBeVisible();

    const inputField = new Input(this.page, { root: tissueReceivedLocator });
    return inputField.currentValue();
  }

  public async getNotes(): Promise<string> {
    const notesLocator = this.locatorFor(DynamicFieldsEnum.NOTES);
    await expect(notesLocator, 'Notes textarea is not visible').toBeVisible();

    const textarea = new TextArea(this.page, { root: notesLocator });
    return textarea.currentValue();
  }

  public async fillFaxSentDates(date1: FillDate, date2?: FillDate, date3?: FillDate): Promise<void> {
    await this.fillFaxSentDate(0, date1);
    date2 && await this.fillFaxSentDate(1, date2);
    date3 && await this.fillFaxSentDate(2, date3);
  }

  public async fillTissueReceivedDate(date: FillDate): Promise<void> {
    const tissueReceivedLocator = this.locatorFor(DynamicFieldsEnum.TISSUE_RECEIVED);
    await expect(tissueReceivedLocator, 'Tissue Received Date picker is not visible').toBeVisible();

    await this.fillDate(tissueReceivedLocator, date);
  }

  public async fillNotes(value: string): Promise<void> {
    const notesLocator = this.locatorFor(DynamicFieldsEnum.NOTES);
    await expect(notesLocator, 'Notes textarea is not visible').toBeVisible();

    const textarea = new TextArea(this.page, { root: notesLocator });
    const isTextareaDisabled = await textarea.isDisabled();
    const existingValue = await textarea.currentValue();

    if (!isTextareaDisabled && existingValue !== value) {
      await textarea.fill(value, false);
      await textarea.blur();
      await waitForResponse(this.page, { uri: 'patch' });
    }
  }

  public async fillDestructionPolicy(value: number, keptIndefinitelySelection = false, applyToAll = false): Promise<void> {
    const destructionPolicyLocator = this.locatorFor(DynamicFieldsEnum.DESTRUCTION_POLICY);
    await expect(destructionPolicyLocator, 'Destruction Policy Years is not visible').toBeVisible();

    const destructionPolicyYears = new Input(this.page, { root: destructionPolicyLocator });
    const isInputDisabled = await destructionPolicyYears.isDisabled();

    await this.checkCheckbox(destructionPolicyLocator, keptIndefinitelySelection);

    const existingValue = await destructionPolicyYears.currentValue();
    const isAllowedToEnterValue = !keptIndefinitelySelection && !isInputDisabled && existingValue.trim() !== value.toString();

    if (isAllowedToEnterValue) {
      await destructionPolicyYears.fillSimple(value.toString());
      await waitForResponse(this.page, { uri: 'patch' });
    }

    applyToAll && await this.applyToAll(destructionPolicyLocator);
  }

  public async problemsWithTissue(newValue: ProblemWithTissueEnum, unableToObtainSelection = false): Promise<void> {
    const problemsWithTissueLocator = this.locatorFor(DynamicFieldsEnum.PROBLEM_WITH_TISSUE);
    await expect(problemsWithTissueLocator, 'Problems with Tissue selection is not visible')
      .toBeVisible();

    const selectElement = new Select(this.page, { root: problemsWithTissueLocator });
    const selectedValue = await selectElement.currentValue();
    const isDisabled = await selectElement.isSelectDisabled();
    const allowSelection = !isDisabled && selectedValue?.trim() !== newValue;

    if (allowSelection) {
      await selectElement.selectOption(newValue);
      await waitForResponse(this.page, { uri: 'patch' });
    }

    await this.checkCheckbox(this.problemsWithTissueUnableToObtainCheckbox, unableToObtainSelection);
  }

  public async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    const genderLocator = this.locatorFor(DynamicFieldsEnum.GENDER);
    await expect(genderLocator, 'Gender selection is not visible')
      .toBeVisible();

    const selectElement = new Select(this.page, { root: genderLocator });
    const selectedValue = await selectElement.currentValue();
    const isDisabled = await selectElement.isSelectDisabled();

    if (!isDisabled && selectedValue?.trim() !== gender) {
      await selectElement.selectOption(gender);
      await waitForResponse(this.page, { uri: 'patch' });
    }
  }

  /* Assertions */
  public async assertFaxSentDatesCount(count: number): Promise<void> {
    const faxSentDates = this.locatorFor(DynamicFieldsEnum.FAX_SENT).locator('app-field-datepicker');
    const dateInputs = await faxSentDates.count();
    expect(dateInputs, `Fax sent dates count doesn't equal ${count}`).toEqual(count);
  }

  /* Helper Functions */
  private async applyToAll(root: Locator): Promise<void> {
    const applyToAllBtn = new Button(this.page, { root, label: 'APPLY TO ALL', exactMatch: true });
    await applyToAllBtn.click();

    const modal = new Modal(this.page);
    await expect(modal.bodyLocator()).toHaveText(/Are you sure you want to change the destruction policy for all of the tissues from this facility/);
    const yesBtn = modal.getButton({ label: 'Yes' }).toLocator();
    await yesBtn.click();

    // After click Yes button, a second dialog window should open automatically and handled by Playwright automatically.
    // However, if it isn't (sometimes) closed, then close it manually.
    // Don't delete.
    const okBtn = modal.getButton({ label: 'Ok' }).toLocator();
    await expect(okBtn).toBeVisible({ timeout: 5000 })
      .then(async () => await okBtn.click())
      .catch();

    await expect(modal.toLocator()).not.toBeVisible();
  }

  private async fillFaxSentDate(dateIndex: number, date: FillDate): Promise<void> {
    const faxSentLocator = this.locatorFor(DynamicFieldsEnum.FAX_SENT).locator('app-field-datepicker')
      .nth(dateIndex);
    if (await faxSentLocator.isVisible()) {
      await this.fillDate(faxSentLocator, date);
    }
  }

  private async fillDate(root: Locator, { date, today }: FillDate): Promise<void> {
    if (today) {
      const todayBtn = new Button(this.page, { root, exactMatch: true, label: 'Today' });
      const isDisabled = await todayBtn.isDisabled();
      if (!isDisabled) {
        await todayBtn.click();
        await waitForResponse(this.page, { uri: 'patch' });
        return;
      }
    }
    if (date) {
      const datePicker = new DatePicker(this.page, { root });
      await datePicker.open();
      await datePicker.pickDate(date);
      await datePicker.close();
      await waitForResponse(this.page, { uri: 'patch' });
    }
  }

  private async checkCheckbox(root: Locator, check: boolean): Promise<void> {
    const checkbox = new Checkbox(this.page, { root });
    const isChecked = await checkbox.isChecked();
    const isDisabled = await checkbox.isDisabled();
    if (check && !isChecked && !isDisabled) {
      await checkbox.check();
      await waitForResponse(this.page, { uri: 'patch' });
    }
    if (!check && isChecked && !isDisabled) {
      await checkbox.uncheck();
      await waitForResponse(this.page, { uri: 'patch' });
    }
  }

  private async tissuesCountCheck(index: number): Promise<void> {
    const tissuesCount = await this.tissuesCount;
    if (index > tissuesCount - 1 || index < 0) {
      throw new Error(`Incorrect index number - ${index}`);
    }
  }

  private get tissuesCount(): Promise<number> {
    return this.page.locator(this.tissueXPath).count();
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

  private participantInformation(name: TissueInformationEnum) {
    return this.page.locator(this.participantInformationXpath(name));
  }

  private locatorFor(dynamicFieldName: DynamicFieldsEnum): Locator {
    return this.page.locator(this.XPathFor(dynamicFieldName))
  }

  private get problemsWithTissueUnableToObtainCheckbox(): Locator {
    return this.page.locator(this.problemWithTissueUnableToObtainXPath);
  }

  private deleteTissueButton(tissueIndex: number): Locator {
    return this.page.locator(this.tissueXPath).nth(tissueIndex)
      .locator('tr')
      .nth(0);
  }

  private get addTissueButton(): Locator {
    return this.page.locator(this.participantDynamicInformationTableXPath)
      .locator('tr')
      .last();
  }

  /* XPaths */
  private participantInformationXpath(name: TissueInformationEnum) {
    return `${this.participantInformationTableXPath}/tr[td[text()[normalize-space()='${name}']]]/td[2]`
  }

  private XPathFor(dynamicFieldName: DynamicFieldsEnum): string {
    return this.dynamicField(dynamicFieldName)
  }

  private get tissueXPath(): string {
    return `${this.participantDynamicInformationTableXPath}//td[app-tissue]/app-tissue/div/table`;
  }

  private get problemWithTissueUnableToObtainXPath(): string {
    return `${this.dynamicField(DynamicFieldsEnum.PROBLEM_WITH_TISSUE, 3)}`;
  }

  private dynamicField(dynamicField: DynamicFieldsEnum, index = 2): string {
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
