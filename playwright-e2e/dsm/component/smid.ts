import {expect, Locator, Page} from "@playwright/test";
import Button from "../../dss/component/button";
import Input from "../../dss/component/input";
import {waitForResponse} from "../../utils/test-utils";

interface InputData {
  value: string;
  selectCheckbox?: boolean;
}

export default class SMID {
  constructor(private readonly page: Page, private readonly tissueIndex: number) {
  }

  public async getValueAt(index: number): Promise<string> {
    const input = await this.getInputAt(index);
    return input.currentValue;
  }

  public async fillInputs(inputData: (InputData|string)[]): Promise<void> {
    for(let i = 0; i < inputData.length; i++) {
        const field = inputData[i];
        const value = typeof field === "object" ? field.value : field;
        const selectCheckbox = typeof field === "object" ? field.selectCheckbox : false;

        const isInputVisible = await this.isInputVisible(i);
        if(isInputVisible) {
          await this.fillField(value, i);
          selectCheckbox && await this.selectCheckbox(i);
        } else {
          await this.addField();
          await this.fillField(value, i);
          selectCheckbox && await this.selectCheckbox(i);
        }
    }
  }

  public async deleteInputAt(index: number): Promise<void> {
    const deleteBtnLocator = this.fields.nth(index).locator('//td/button');
    await expect(deleteBtnLocator, `Delete button is not visible at index ${index}`).toBeVisible();

    await deleteBtnLocator.click();
  }

  public async close(): Promise<void> {
    const closeBtnLocator = this.modal.locator("//div[@class='modal-footer']/div");
    await expect(closeBtnLocator, `Close button is not visible`).toBeVisible();

    const closeBtn = new Button(this.page, {root: closeBtnLocator, label: 'close'});
    await closeBtn.click();
  }

  public async onlyKeepSelectedSMIDs(): Promise<void> {
    const closeBtnLocator = this.modal.locator("//div[@class='modal-footer']/div");
    await expect(closeBtnLocator, `Only Keep Selected SM-IDs button is not visible`).toBeVisible();

    const closeBtn = new Button(this.page, {root: closeBtnLocator, label: 'Only keep selected SM-IDs'});
    await closeBtn.click();
    await waitForResponse(this.page, {uri: 'patch'});
  }

  /* Helper Functions */
  private isInputVisible(index: number): Promise<boolean> {
    return this.fields.nth(index).isVisible();
  }

  private async addField(): Promise<void> {
    await this.addBtn.click();
  }

  private async fillField(value: string, index: number): Promise<void> {
    const fieldInput = await this.getInputAt(index);
    const currentValue = await fieldInput.currentValue;
    if (currentValue.trim() !== value) {
      await fieldInput.fillSimple(value);
      await waitForResponse(this.page, {uri: 'patch'});
    }
  }

  private async selectCheckbox(index: number): Promise<void> {
    const checkboxLocator = this.fields.nth(index).locator('//td/mat-checkbox');
    await expect(checkboxLocator, `Checkbox is not visible at index ${index}`).toBeVisible();
    await checkboxLocator.click();
  }

  private async getInputAt(index: number): Promise<Input> {
    const fieldLocator = this.fields.nth(index).locator('//td/md-input-container');
    await expect(fieldLocator, `Input field is not visible at index ${index}`).toBeVisible();
    return new Input(this.page, {root: fieldLocator});
  }


  /* Locators */
  private get modal(): Locator {
    return this.page.locator(`(//app-tissue)[${this.tissueIndex + 1}]/app-modal`);
  }

  private get fields(): Locator {
    return this.modal.locator('//table/tr[td[md-input-container]]');
  }

  private get addBtn(): Locator {
    return this.modal.locator(`//div[@class='app-modal-body']/button`);
  }
}
