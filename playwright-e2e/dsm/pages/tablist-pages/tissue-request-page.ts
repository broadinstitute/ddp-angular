import { expect, Locator, Page } from '@playwright/test';
import DatePicker from 'dsm/component/date-picker';
import { waitForResponse } from 'utils/test-utils';
import { FillDate } from 'dsm/component/models/tissue-inputs-interface';
import Select from 'dss/component/select';
import TextArea from 'dss/component/textarea';
import Tissue from 'dsm/component/tissue';
import Checkbox from 'dss/component/checkbox';
import Button from 'dss/component/button';
import Input from 'dss/component/input';
import Modal from 'dsm/component/modal';
import tablistPageBase from 'dsm/pages/tablist-pages/tablist-page-base';
import { Label } from 'dsm/enums';


export enum ProblemWithTissueEnum {
  INSUFFICIENT_MATERIAL_PER_PATH = 'Insufficient material per path',
  INSUFFICIENT_MATERIAL_PER_SHL = 'Insufficient material per SHL',
  NO_E_SIGNATURES = 'No e signatures',
  PATH_DEPARTMENT_POLICY = 'Path department policy',
  PATH_DEPARTMENT_UNABLE_TO_LOCATE = 'Path department unable to locate',
  TISSUE_DESTROYED = 'Tissue destroyed',
  OTHER = 'Other',
  NO_PROBLEM = 'No Problem'
}


export default class TissueRequestPage extends tablistPageBase {
  protected PAGE_TITLE = 'Tissue Request';

  constructor(page: Page) {
    super(page);
  }

  protected get rootLocator(): Locator {
    return this.page.locator('app-tissue-page');
  }

  public tissue(index = 0): Tissue {
    const page = this.page;
    if (index < 0) {
      throw new Error(`Invalid index number: ${index}`);
    }
    return new Tissue(page, index);
  }

  public async addTissue(): Promise<Tissue> {
    const root = this.rootLocator.locator('//tr[.//text()[normalize-space()="Add another Block or set of Slides"]]');
    const addButton = new Button(this.page, { root });
    const isDisabled = await addButton.isDisabled();
    if (isDisabled) {
      throw new Error('"Add another Block or set of Slides" button is disabled');
    }
    await addButton.click();
    const tissuesCount = await this.page.locator('app-tissue').count();
    return this.tissue(tissuesCount - 1);
  }

  public async getParticipantInformation(name: Label): Promise<string> {
    const participantInformation = this.participantInformation(name);
    const data = await participantInformation.textContent();
    return data?.trim() as string;
  }

  public async getFaxSentDate(dateIndex = 0): Promise<string> {
    const faxSentLocator = this.dynamicField(Label.FAX_SENT).locator('app-field-datepicker').nth(dateIndex);
    const inputField = new Input(this.page, { root: faxSentLocator });
    return inputField.currentValue();
  }

  public async getTissueReceivedDate(): Promise<string> {
    const tissueReceivedLocator = this.dynamicField(Label.TISSUE_RECEIVED);
    const inputField = new Input(this.page, { root: tissueReceivedLocator });
    return inputField.currentValue();
  }

  public async getNotes(): Promise<string> {
    const notesLocator = this.dynamicField(Label.NOTES);
    const textarea = new TextArea(this.page, { root: notesLocator });
    return textarea.currentValue();
  }

  public async fillFaxSentDates(date1: FillDate, date2?: FillDate, date3?: FillDate): Promise<void> {
    await this.fillFaxSentDate(0, date1);
    date2 && await this.fillFaxSentDate(1, date2);
    date3 && await this.fillFaxSentDate(2, date3);
  }

  public async fillTissueReceivedDate(date: FillDate): Promise<void> {
    const tissueReceivedLocator = this.dynamicField(Label.TISSUE_RECEIVED);
    await this.fillDate(tissueReceivedLocator, date);
  }

  public async fillNotes(value: string): Promise<void> {
    const notesLocator = this.dynamicField(Label.NOTES);
    const textarea = new TextArea(this.page, { root: notesLocator });
    const isTextareaDisabled = await textarea.isDisabled();
    if (isTextareaDisabled) {
      throw new Error(`"${Label.NOTES}" textarea is disabled. Fill in new notes fail.`);
    }

    const existingValue = await textarea.currentValue();
    if (existingValue !== value) {
      const respPromise = waitForResponse(this.page, { uri: 'patch' });
      await textarea.fill(value, false);
      await textarea.blur();
      await respPromise;
    }
  }

  public async fillDestructionPolicy(value: number, keptIndefinitelySelection = false, applyToAll = false): Promise<void> {
    const destructionPolicyLocator = this.dynamicField(Label.DESTRUCTION_POLICY);
    const destructionPolicyYears = new Input(this.page, { root: destructionPolicyLocator });
    const isInputDisabled = await destructionPolicyYears.isDisabled();

    await this.checkCheckbox(destructionPolicyLocator, keptIndefinitelySelection);

    const existingValue = await destructionPolicyYears.currentValue();
    const isAllowedToEnterValue = !keptIndefinitelySelection && !isInputDisabled && existingValue.trim() !== value.toString();

    if (isAllowedToEnterValue) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        destructionPolicyYears.fillSimple(value.toString())
      ]);
    }

    applyToAll && await this.applyToAll(destructionPolicyLocator);
  }

  public async problemsWithTissue(newValue: ProblemWithTissueEnum, unableToObtainSelection = false): Promise<void> {
    const problemsWithTissueLocator = this.dynamicField(Label.PROBLEM_WITH_TISSUE);
    const selectElement = new Select(this.page, { root: problemsWithTissueLocator });
    const selectedValue = await selectElement.currentValue();
    const isDisabled = await selectElement.isSelectDisabled();
    const allowSelection = !isDisabled && selectedValue?.trim() !== newValue;

    if (allowSelection) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        selectElement.selectOption(newValue)
      ]);
    }

    await this.checkCheckbox(this.problemsWithTissueUnableToObtainCheckbox(), unableToObtainSelection);
  }

  public async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    const genderLocator = this.dynamicField(Label.GENDER);
    const selectElement = new Select(this.page, { root: genderLocator });
    const selectedValue = await selectElement.currentValue();

    await expect(async () => {
      const isDisabled = await selectElement.isSelectDisabled();
      expect(isDisabled).toBe(false); //Test goes too fast, it still thinks dropdown is disabled after inputting Tissue Received Date
   }).toPass({ intervals: [10_000], timeout: 30_000 });

    if (selectedValue?.trim() !== gender) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        selectElement.selectOption(gender),
      ]);
    }
  }

  /* Assertions */
  public async assertFaxSentDatesCount(count: number): Promise<void> {
    const faxSentDates = this.dynamicField(Label.FAX_SENT).locator('app-field-datepicker');
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

    await Promise.all([
      waitForResponse(this.page, { uri: '/institutions' }),
      yesBtn.click(),
    ]);

    // After click Yes button, a second dialog window should open automatically and handled by Playwright automatically.
    // However, if it isn't (sometimes) closed, then close it manually.
    // Don't delete sleep of 5 seconds.
    await this.page.waitForTimeout(5000);
    try {
      const okBtn = modal.getButton({ label: 'Ok' }).toLocator();
      await expect(okBtn).toBeVisible({ timeout: 1000 });
      await okBtn.click();
    } catch (e) {
      // alert was closed by Playwright
    }

    await expect(modal.toLocator()).not.toBeVisible();
  }

  private async fillFaxSentDate(dateIndex: number, date: FillDate): Promise<void> {
    const faxSentLocator = this.dynamicField(Label.FAX_SENT).locator('app-field-datepicker').nth(dateIndex);
    await this.fillDate(faxSentLocator, date);
  }

  private async fillDate(root: Locator, { date, today }: FillDate): Promise<void> {
    if (today) {
      const todayBtn = new Button(this.page, { root, exactMatch: true, label: 'Today' });
      try {
        await expect(todayBtn.toLocator()).toBeEnabled();
        await Promise.all([
          waitForResponse(this.page, { uri: 'patch' }),
          todayBtn.click()
        ]);
        return;
      } catch (err) {
        // button is not visible or enabled. continue to select date from calendar.
      }
    }

    const datePicker = new DatePicker(this.page, { root });
    await datePicker.open();
    await datePicker.pickDate(date);
    await datePicker.close();
  }

  private async checkCheckbox(root: Locator, check: boolean): Promise<void> {
    const checkbox = new Checkbox(this.page, { root });
    const isChecked = await checkbox.isChecked();
    const isDisabled = await checkbox.isDisabled();
    if (check && !isChecked && !isDisabled) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        checkbox.check()
      ]);
    }
    if (!check && isChecked && !isDisabled) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        checkbox.uncheck()
      ]);
    }
  }

  /* Locators */

  private participantInformation(name: Label) {
    return this.staticField(name);
  }

  private problemsWithTissueUnableToObtainCheckbox(): Locator {
    return this.dynamicField(Label.PROBLEM_WITH_TISSUE)
  }
}
