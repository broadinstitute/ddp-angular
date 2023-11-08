import { expect, Locator, Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import TextArea from 'dss/component/textarea';
import Input from 'dss/component/input';

export default class MedicalRecordsRequestPage {
  private readonly PAGE_TITLE = 'Medical Records - Request Page';

  constructor(private readonly page: Page) { }

  public async waitForReady(): Promise<void> {
    await this.assertPageTitle();
    await waitForNoSpinner(this.page);
  }

  public async backToParticipantPage(): Promise<void> {
    await this.page.getByText('<< back to previous page').click();
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
  }

  public async backToParticipantList(): Promise<void> {
    await this.page.getByText("<< back to 'Participant List'").click();
    await this.page.waitForLoadState('load');
    await waitForNoSpinner(this.page);
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
  private get participantInformationTableXPath(): string {
    return `${this.pageXPath}//table[contains(@class, 'table-condensed')]/tbody`;
  }

  private get participantDynamicInformationTableXPath(): string {
    return `${this.pageXPath}//div[last()]/table[not(contains(@class, 'table'))]`;
  }

  private get pageXPath(): string {
    return '//app-medical-record';
  }
}
