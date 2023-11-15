import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import Input from 'dss/component/input';

export default class MedicalRecordsRequestPage {
  private readonly PAGE_TITLE = 'Medical Records - Request Page';

  constructor(private readonly page: Page) { }

  public async waitForReady(): Promise<void> {
    await this.assertPageTitle();
    await waitForNoSpinner(this.page);
  }

  public async backToPreviousPage(): Promise<void> {
    await this.page.getByText('<< back to previous page').click();
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
  }

  public async backToParticipantList(): Promise<void> {
    await this.page.getByText("<< back to 'Participant List'").click();
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
  }

  public async getStaticText(infoFieldName: MainInfoEnum): Promise<string> {
    const fieldLocator = this.staticInformationXpath(infoFieldName);
    await expect(fieldLocator, `Field: ${infoFieldName} not found.`).toBeVisible();
    const data = await fieldLocator.textContent();
    return data?.trim() as string;
  }

  public async fillText(infoFieldName: MainInfoEnum, value: string): Promise<void> {
    const fieldLocator = this.dynamicInformationXpath(infoFieldName);
    await expect(fieldLocator, `Field: ${infoFieldName} not found.`).toBeVisible();

    const input = new Input(this.page, { root: fieldLocator, });
    const isDisabled = await input.isDisabled();
    expect(isDisabled).toBeFalsy();
    const existingValue = await input.currentValue();

    if (existingValue !== value) {
      await Promise.all([
        waitForResponse(this.page, { uri: 'patch' }),
        input.fill(value),
        input.blur()
      ]);
    }
  }

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    const pageTitle = await this.pageTitle.textContent();
    expect(pageTitle?.trim()).toEqual(this.PAGE_TITLE);
  }

  /* Locators */
  private get pageTitle(): Locator {
    return this.page.locator(`${this.pageXPath}/h1`);
  }

  /* XPaths */
  private staticInformationXpath(infoFieldName: MainInfoEnum): Locator {
    return this.page.locator(`${this.staticInformationTableXPath}/tr[td[text()[normalize-space()='${infoFieldName}']]]/td[2]`);
  }

  private get staticInformationTableXPath(): string {
    return `${this.pageXPath}//table[contains(@class, 'table-condensed')]/tbody`;
  }

  private dynamicInformationXpath(infoFieldName: MainInfoEnum, index = 2): Locator {
    return this.page.locator(`${this.dynamicInformationTableXPath}/tr[td[1][text()[normalize-space()='${infoFieldName}']]]/td[${index}]`);
  }

  private get dynamicInformationTableXPath(): string {
    return `${this.pageXPath}//div[last()]/table[not(contains(@class, 'table'))]`;
  }

  private get pageXPath(): string {
    return '//app-medical-record';
  }
}
