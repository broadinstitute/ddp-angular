import {Page} from '@playwright/test';
import { Contact } from 'dsm/enums';

export default class ContactInformationTab {
  constructor(private readonly page: Page) {
  }

  public async getStreet1(): Promise<string> {
    const street1 = await this.readInfoFor(Contact.STREET_1);
    return this.split(street1);
  }

  public async getCity(): Promise<string> {
    const city = await this.readInfoFor(Contact.CITY);
    return this.split(city);
  }

  public async getState(): Promise<string> {
    const state = await this.readInfoFor(Contact.STATE);
    return this.split(state);
  }

  public async getCountry(): Promise<string> {
    const country = await this.readInfoFor(Contact.COUNTRY);
    return this.split(country);
  }

  public async getZip(): Promise<string> {
    const zip = await this.readInfoFor(Contact.ZIP);
    return this.split(zip);
  }

  public async getValid(): Promise<string> {
    const valid = await this.readInfoFor(Contact.VALID);
    return this.split(valid);
  }

  public async getPhone(): Promise<string> {
    const phone = await this.readInfoFor(Contact.PHONE);
    return this.split(phone);
  }

  public async isNotEnteredVisible(): Promise<boolean> {
    return await this.page.locator(this.notEnteredInfoXPath).isVisible();
  }

  private async readInfoFor(key: Contact): Promise<string | null> {
    const info = this.page.locator(this.getContactInfoXPath(key));
    return await info.isVisible() ? await info.textContent() : null;
  }

  private split(value: string | null): string {
    return value ? value.split(':')[1].trim() : '';
  }

  /* XPaths */
  private getContactInfoXPath(infoName: string): string {
    return `//tab[@heading='Contact Information']/legend//table/tr[td[contains(text(),'${infoName}')]]`
  }

  private get notEnteredInfoXPath(): string {
    return `//tab[@heading='Contact Information']/legend//p[text()='Not Entered']`;
  }
}
