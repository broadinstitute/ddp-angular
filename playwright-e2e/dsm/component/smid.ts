import { expect, Locator, Page } from '@playwright/test';
import Input from 'dss/component/input';
import { waitForResponse } from 'utils/test-utils';
import Modal from './modal';

interface InputData {
  value: string;
  selectCheckbox?: boolean;
}

export default class SMID {
  private readonly modalComponent: Modal;

  constructor(private readonly page: Page, private readonly tissueIndex: number) {
    this.modalComponent = new Modal(this.page);
  }

  public async getValueAt(index: number): Promise<string> {
    const input = await this.getInputAt(index);
    return input.currentValue();
  }

  public async fillInputs(inputData: (InputData | string)[]): Promise<void> {
    for (let i = 0; i < inputData.length; i++) {
      const field = inputData[i];
      const value = typeof field === 'object' ? field.value : field;
      const selectCheckbox = typeof field === 'object' ? field.selectCheckbox : false;

      const isInputVisible = await this.isInputVisible(i);
      if (!isInputVisible) {
        await this.addField();
      }
      await this.fillField(value, i);
      selectCheckbox && await this.selectCheckbox(i);
    }
  }

  public async deleteInputAt(index: number): Promise<void> {
    const deleteBtnLocator = this.fields.nth(index).locator('//td/button');
    await expect(deleteBtnLocator, `Delete button is not visible at index ${index}`).toBeVisible();

    await deleteBtnLocator.click();
  }

  public async close(): Promise<void> {
    await this.clickModalBtn('close');
  }

  public async onlyKeepSelectedSMIDs(): Promise<void> {
    await Promise.all([
      waitForResponse(this.page, { uri: 'patch' }),
      this.clickModalBtn('Only keep selected SM-IDs')
    ]);
  }

  /* Helper Functions */
  private async isInputVisible(index: number): Promise<boolean> {
    return this.fields.nth(index).isVisible();
  }

  private async addField(): Promise<void> {
    await this.addBtn.click();
  }

  private async fillField(value: string, index: number): Promise<void> {
    const fieldInput = await this.getInputAt(index);
    const currentValue = await fieldInput.currentValue();
    if (currentValue.trim() !== value) {
      await Promise.all([
        waitForResponse(this.page, { uri: '/patch' }),
        fieldInput.fillSimple(value)
      ]);
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
    return new Input(this.page, { root: fieldLocator });
  }

  private async clickModalBtn(label: 'Only keep selected SM-IDs' | 'close'): Promise<void> {
    await this.modalComponent.getButton({ label }).click();
  }


  /* Locators */
  private get modalBody(): Locator {
    return this.modalComponent.bodyLocator();
  }

  private get modal(): Locator {
    return this.page.locator(`(//app-tissue)[${this.tissueIndex + 1}]/app-modal`);
  }

  private get fields(): Locator {
    return this.modalBody.locator('//table/tr[td[md-input-container]]');
  }

  private get addBtn(): Locator {
    return this.modalBody.locator(`//div[@class='app-modal-body']/button`);
  }
}
