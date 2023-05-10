import {expect, Locator, Page} from '@playwright/test';
import {waitForResponse} from 'utils/test-utils';
import {MainInfoEnum} from './enums/main-info-enum';
import Tabs from 'lib/component/dsm/tabs/tabs';
import {TabEnum} from 'lib/component/dsm/tabs/enums/tab-enum';

export default class ParticipantPage {
  private readonly PAGE_TITLE: string = 'Participant Page';
  private readonly tabs = new Tabs(this.page);

  constructor(private readonly page: Page) {}

  public async backToList(): Promise<void> {
    await this.page.locator('//div/a[.//*[contains(text(), "<< back to \'List\' ")]]').click();
  }

  /* Actions */
  public async fillNotes(value: string): Promise<void> {
    const textArea = await this.notes;
    await textArea.fill(value);
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

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    return await this.tabs.clickTab(tabName) as T;
  }

  private async readMainTextInfoFor(key: MainInfoEnum): Promise<string | null> {
   return this.page.locator(this.getMainTextInfoXPath(key)).textContent();
  }

  private async readMainInputValueFor(key: MainInfoEnum): Promise<string | null> {
    return this.page.locator(this.getMainInputValueInfoXPath(key)).inputValue();
  }

  private async readMainCheckboxValueFor(key: MainInfoEnum): Promise<boolean> {
    return this.page.locator(this.getMainCheckboxValueInfoXPath(key)).isChecked();
  }
  /* ---- */

  /* Locators */
  private get notes(): Locator {
    return this.page.locator('//table[.//td[contains(normalize-space(),"Participant Notes")]]//td/textarea');
  }

  /* XPaths */
  private getMainTextInfoXPath(info: MainInfoEnum) {
    return this.getMainInfoXPath(info);
  }

  private getMainInputValueInfoXPath(info: MainInfoEnum) {
    return `${this.getMainInfoXPath(info)}/input`
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
    await expect(await this.notes.inputValue(),
      "Participant page - participant's value doesn't match the provided one")
      .toBe(value);
  }
}
