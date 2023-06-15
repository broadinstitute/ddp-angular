import { expect, Locator, Page } from '@playwright/test';
import Select from 'dss/component/select';
import { waitForResponse } from 'utils/test-utils';
import { MainInfoEnum } from 'dsm/pages/participant-page/enums/main-info-enum';
import Tab from 'dsm/component/tabs/tab';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';

export default class ParticipantPage {
  private readonly PAGE_TITLE: string = 'Participant Page';
  private readonly tabs = new Tab(this.page);

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

  public isTabVisible(tabName: TabEnum): Promise<boolean> {
    return this.tabs.isTabVisible(tabName);
  }

  public async clickTab<T extends object>(tabName: TabEnum): Promise<T> {
    await expect(this.tabs.tabLocator(tabName), `The tab '${tabName}' is not visible`)
      .toBeVisible();
    return await this.tabs.clickTab<T>(tabName) as T;
  }

  private readMainTextInfoFor(key: MainInfoEnum) {
   return this.page.locator(this.getMainTextInfoXPath(key)).textContent();
  }

  private readMainInputValueFor(key: MainInfoEnum) {
    return this.page.locator(this.getMainInputValueInfoXPath(key)).inputValue();
  }

  private readMainCheckboxValueFor(key: MainInfoEnum) {
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

  public get addFamilyMemberDialog() {
    const page = this.page;
    const modal = '[role="dialog"]';

    return new class {
      async _open(): Promise<void> {
        await page.locator('.family-member-button button').click();
        await expect(page.locator(modal)).toBeVisible();
      }

      get _rootLocator(): Locator {
        return page.locator(modal).locator('table.family-member-form');
      }

      get firstName(): Locator {
        return this._rootLocator.locator('input[name="first-name"]');
      }

      get lastName(): Locator {
        return this._rootLocator.locator('input[name="last-name"]');
      }

      get subjectId(): Locator {
        return this._rootLocator.locator('input[name="subjectId"]');
      }

      get relation(): Select {
        return new Select(page, { root: this._rootLocator.locator('//tr[.//text()[normalize-space()="Relation"]]') });
      }

      get copyProbandInfo(): Locator {
        return this._rootLocator.locator('tr', { hasText: 'Copy Proband Info' }).locator('mat-checkbox');
      }

      get submit(): Locator {
        return this._rootLocator.locator('text="Submit"');
      }

      async fillInfo(opts: {
        firstName: string,
        lastName: string,
        relationshipId: number,
        relation?: string,
        copyProbandInfo?: boolean }): Promise<string> {
          const { firstName, lastName, relationshipId, relation, copyProbandInfo = true } = opts;

          await this._open();
          await this.firstName.fill(firstName);
          await this.lastName.fill(lastName);
          await this.subjectId.fill(relationshipId.toString());
          relation ? await this.relation.selectOption(relation) : await this.relation.selectOption(relation);
          copyProbandInfo && await this.copyProbandInfo.click();

          const selectedRelation = await this.relation.toLocator().locator('.mat-select-value-text').innerText();
          await this.submit.click();

          await expect(page.locator(modal)).toHaveText('Successfully added family member');
          await page.locator('h1').click(); // close popup with a click outside

          return selectedRelation;
      }
    }
  }
}
