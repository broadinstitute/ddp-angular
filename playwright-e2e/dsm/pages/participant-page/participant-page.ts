import {expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {MainInfoEnum} from 'dsm/pages/participant-page/enums/main-info-enum';
import Tabs from 'dsm/component/tabs/tabs';
import {TabEnum} from 'dsm/component/tabs/enums/tab-enum';
import Input from 'dss/component/input';
import Modal from 'dss/component/modal';

export default class ParticipantPage {
  private readonly PAGE_TITLE: string = 'Participant Page';
  private readonly tabs = new Tabs(this.page);

  constructor(protected readonly page: Page) {}

  public async backToList(): Promise<void> {
    await this.page.locator('//div/a[.//*[contains(text(), "<< back to \'List\' ")]]').click();
  }

  /* Actions */
  public async fillParticipantNotes(value?: string): Promise<void> {
    const textArea = this.participantNotes;
    if (value) {
      await textArea.fill(value);
    } else {
      await textArea.clear();
    }
    await textArea.blur();
    await waitForResponse(this.page, {uri: '/ui/patch'});
  }
  /* --- */

  /* Participant Information */
  public async getStatus(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.STATUS) || '';
  }

  public async getRegistrationDate(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.REGISTRATION_DATE) || '';
  }

  public async getShortId(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.SHORT_ID) || '';
  }

  public async getGuid(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.GUID) || '';
  }

  public async getFirstName(): Promise<string> {
    return await this.readMainInputValueFor(MainInfoEnum.FIRST_NAME) || '';
  }

  public async getLastName(): Promise<string> {
    return await this.readMainInputValueFor(MainInfoEnum.LAST_NAME) || '';
  }

  public async getEmail(): Promise<string> {
    return await this.readMainInputValueFor(MainInfoEnum.EMAIL) || '';
  }

  public async getDoNotContact(): Promise<boolean> {
    return await this.readMainCheckboxValueFor(MainInfoEnum.DO_NOT_CONTACT);
  }

  public async getDateOfBirth(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.DATE_OF_BIRTH) || '';
  }

  public async getGender(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.GENDER) || '';
  }

  public async getPreferredLanguage(): Promise<string> {
    return await this.readMainTextInfoFor(MainInfoEnum.PREFERRED_LANGUAGE) || '';
  }

  public async isTabVisible(tabName: TabEnum): Promise<boolean> {
    return await this.tabs.isTabVisible(tabName);
  }

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    await expect(this.tabs.tabLocator(tabName), `The tab '${tabName}' is not visible`)
      .toBeVisible();
    return await this.tabs.clickTab<T>(tabName) as T;
  }

  public async oncHistoryCreatedDate(): Promise<string> {
    const oncHistoryCreatedLocator = this.oncHistoryCreated;
    await expect(oncHistoryCreatedLocator, 'Onc History Created is not visible').toBeVisible();
    const inputField = new Input(this.page, { root: oncHistoryCreatedLocator });

    return inputField.currentValue();
  }

  public get getFirstNameLocator(): Locator {
    return this.page.locator(this.getMainInputValueInfoXPath(MainInfoEnum.FIRST_NAME))
  }

  public get getLastNameLocator(): Locator {
    return this.page.locator(this.getMainInputValueInfoXPath(MainInfoEnum.LAST_NAME))
  }

  public async updateInput(inputEnum: MainInfoEnum, newValue: string): Promise<void> {
    const input = this.page.locator(this.getMainInputValueInfoXPath(inputEnum))
    await input.fill('');
    await input.fill(newValue);

    const updateButton = this.page.locator(this.getMainInputUpdateButtonXPath(inputEnum));
    await updateButton.click();
    await waitForNoSpinner(this.page);

    const modal = new Modal(this.page);
    const content = await modal.getContent().innerText();
    expect(content).toStrictEqual('Participant successfully updated');
    await this.page.keyboard.press('Escape'); // close modal
  }

  /* Helper functions */

  private async readMainTextInfoFor(key: MainInfoEnum) {
   return await this.page.locator(this.getMainTextInfoXPath(key)).textContent();
  }

  private async readMainInputValueFor(key: MainInfoEnum) {
    return await this.page.locator(this.getMainInputValueInfoXPath(key)).inputValue();
  }

  private async readMainCheckboxValueFor(key: MainInfoEnum) {
    return await this.page.locator(this.getMainCheckboxValueInfoXPath(key)).isChecked();
  }
  /* ---- */

  /* Locators */
  public get participantNotes(): Locator {
    return this.page.locator('//table[.//td[contains(normalize-space(),"Participant Notes")]]//td/textarea');
  }

  private get oncHistoryCreated(): Locator {
    return this.page.locator('//table//td[contains(text(),"Onc History Created")]/following-sibling::td');
  }

  /* XPaths */
  private getMainTextInfoXPath(info: MainInfoEnum) {
    return this.getMainInfoXPath(info);
  }

  private getMainInputValueInfoXPath(info: MainInfoEnum) {
    return `${this.getMainInfoXPath(info)}/input`
  }

  private getMainInputUpdateButtonXPath(info: MainInfoEnum) {
    return `${this.getMainInfoXPath(info)}/button[contains(.,"Update")]`
  }

  private getMainCheckboxValueInfoXPath(info: MainInfoEnum) {
    return `${this.getMainInfoXPath(info)}/mat-checkbox//input[@type='checkbox']`
  }

  private getMainInfoXPath(info: MainInfoEnum): string {
    return `//table[@class='table table-condensed']/tbody/tr[td[1][text()[normalize-space()='${info}']]]/td[2]`
  }

  /* assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.locator('h1'), "Participant page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE, { timeout: 5 * 1000 });
  }

  public async assertNotesToBe(value: string): Promise<void> {
    expect(await this.participantNotes.inputValue(),
      "Participant page - participant's value doesn't match the provided one")
      .toBe(value);
  }
}
