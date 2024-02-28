import {expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {Label, Tab, ResponsePayload} from 'dsm/enums';
import Tabs from 'dsm/component/tabs/tabs';
import Input from 'dss/component/input';
import Modal from 'dss/component/modal';

export default class ParticipantPage {
  private readonly PAGE_TITLE: string = 'Participant Page';
  private readonly UPDATE_PROFILE_SUCCESS_MESSAGES = [ResponsePayload.TASK_TYPE_UPDATE_PROFILE, ResponsePayload.RESULT_TYPE_SUCCESS];
  private readonly tabs = new Tabs(this.page);

  constructor(protected readonly page: Page) {}

  public async waitForReady(): Promise<void> {
    await this.assertPageTitle();
    await waitForNoSpinner(this.page);
    await expect(this.page.locator(this.getMainTextInfoXPath(Label.STATUS))).toBeVisible();
  }

  public async backToList(): Promise<void> {
    await this.page.locator('//div/a[.//*[contains(text(), "<< back to \'List\' ")]]').click();
  }

  /* Actions */
  public async fillParticipantNotes(value?: string): Promise<void> {
    const textArea = this.participantNotes;
    const respPromise = waitForResponse(this.page, {uri: '/ui/patch'});
    if (value) {
      await textArea.fill(value);
    } else {
      await textArea.clear();
    }
    await textArea.blur();
    await respPromise;
  }
  /* --- */

  /* Participant Information */
  public async getStatus(): Promise<string> {
    return await this.readMainTextInfoFor(Label.STATUS) || '';
  }

  public async getRegistrationDate(): Promise<string> {
    return await this.readMainTextInfoFor(Label.REGISTRATION_DATE) || '';
  }

  public async getShortId(): Promise<string> {
    return await this.readMainTextInfoFor(Label.SHORT_ID) || '';
  }

  public async getGuid(): Promise<string> {
    return await this.readMainTextInfoFor(Label.GUID) || '';
  }

  public async getFirstName(): Promise<string> {
    return await this.readMainInputValueFor(Label.FIRST_NAME) || '';
  }

  public async getLastName(): Promise<string> {
    return await this.readMainInputValueFor(Label.LAST_NAME) || '';
  }

  public async getEmail(): Promise<string> {
    return await this.readMainInputValueFor(Label.EMAIL) || '';
  }

  public async getDoNotContact(): Promise<boolean> {
    return await this.readMainCheckboxValueFor(Label.DO_NOT_CONTACT);
  }

  public async getDateOfBirth(): Promise<string> {
    return await this.readMainTextInfoFor(Label.DATE_OF_BIRTH) || '';
  }

  public async getDateOfMajority(): Promise<string> {
    return await this.readMainTextInfoFor(Label.DATE_OF_MAJORITY) || '';
  }

  public async getDateOfDiagnosis(): Promise<string> {
    return await this.readMainTextInfoFor(Label.DATE_OF_DIAGNOSIS) || '';
  }

  public async getGender(): Promise<string> {
    return await this.readMainTextInfoFor(Label.GENDER) || '';
  }

  public async getPreferredLanguage(): Promise<string> {
    return await this.readMainTextInfoFor(Label.PREFERRED_LANGUAGE) || '';
  }

  public async getConsentBlood(): Promise<string> {
    return await this.readMainTextInfoFor(Label.CONSENT_BLOOD) || '';
  }

  public async getConsentTissue(): Promise<string> {
    return await this.readMainTextInfoFor(Label.CONSENT_TISSUE) || '';
  }

  public async isTabVisible(tabName: Tab): Promise<boolean> {
    return await this.tabs.isTabVisible(tabName);
  }

  public async clickTab<T extends object>(tabName: Tab): Promise<T> {
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
    return this.page.locator(this.getMainInputValueInfoXPath(Label.FIRST_NAME));
  }

  public get getLastNameLocator(): Locator {
    return this.page.locator(this.getMainInputValueInfoXPath(Label.LAST_NAME));
  }

  public async updateInput(inputEnum: Label, newValue: string): Promise<void> {
    const input = this.page.locator(this.getMainInputValueInfoXPath(inputEnum));
    await input.fill('');
    await input.fill(newValue);

    const updateButton = this.page.locator(this.getMainInputUpdateButtonXPath(inputEnum));
    // editParticipantMessageStatus seems to occur twice but usually only the second instance has UPDATE_PROFILE => SUCCESS message
    await Promise.all([
      waitForResponse(this.page, { uri: '/editParticipant'}),
      waitForResponse(this.page, { uri: '/editParticipantMessageStatus', messageBody: this.UPDATE_PROFILE_SUCCESS_MESSAGES}),
      updateButton.click()
    ]);
    await waitForNoSpinner(this.page);

    const modal = new Modal(this.page);
    const content = await modal.getContent().innerText();
    const msg1 = 'Participant successfully updated';
    const msg2 = 'Your update has been saved, but the system is unable to display it at the moment.';
    const regex = `(${msg1}|${msg2})`;
    await expect(modal.getContent()).toHaveText(new RegExp(regex), { timeout: 5000 });
    await this.page.keyboard.press('Escape'); // close modal

    await this.page.waitForTimeout(15000); // Don't remove: sleep 15 seconds
  }

  /* Helper functions */

  private async readMainTextInfoFor(key: Label) {
   return await this.page.locator(this.getMainTextInfoXPath(key)).textContent();
  }

  private async readMainInputValueFor(key: Label) {
    return await this.page.locator(this.getMainInputValueInfoXPath(key)).inputValue();
  }

  private async readMainCheckboxValueFor(key: Label) {
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
  public getMainTextInfoXPath(info: Label) {
    return this.getMainInfoXPath(info);
  }

  private getMainInputValueInfoXPath(info: Label) {
    return `${this.getMainInfoXPath(info)}/input`;
  }

  private getMainInputUpdateButtonXPath(info: Label) {
    return `${this.getMainInfoXPath(info)}/button[contains(.,"Update")]`;
  }

  private getMainCheckboxValueInfoXPath(info: Label) {
    return `${this.getMainInfoXPath(info)}/mat-checkbox//input[@type='checkbox']`;
  }

  private getMainInfoXPath(info: Label): string {
    return `//table[@class='table table-condensed']/tbody/tr[td[1][text()[normalize-space()='${info}']]]/td[2]`;
  }

  /* assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.locator('h1'), "Participant page - page title doesn't match the expected one")
      .toHaveText(this.PAGE_TITLE, { timeout: 50 * 1000 });
  }

  public async assertNotesToBe(value: string): Promise<void> {
    expect(await this.participantNotes.inputValue(),
      "Participant page - participant's value doesn't match the provided one")
      .toBe(value);
  }
}
