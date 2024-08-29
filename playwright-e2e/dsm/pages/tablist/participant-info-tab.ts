import { Locator, Page } from '@playwright/test';
import { Label } from 'dsm/enums';
import { logInfo } from 'utils/log-utils';

export default class ParticipantInfoTab {
  constructor(private readonly page: Page) {
  }

  public async getFieldInput(opts: { fieldName: Label }): Promise<string> {
    const { fieldName } = opts;
    const inputField = this.getField(fieldName);
    const input = await inputField.inputValue();
    logInfo(`ATCP -> Participant Info tab -> ${fieldName} info: ${input}`);
    return input;
  }

  private getField(fieldName: Label): Locator {
    return this.page.locator(
      `//tabset//tab[contains(@class, 'active')]//app-form-data//table//tr//td[normalize-space(text())='${fieldName}']/following-sibling::td//input`
    );
  }
}
