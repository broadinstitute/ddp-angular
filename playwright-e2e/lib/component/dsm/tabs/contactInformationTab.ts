import {Page} from "@playwright/test";
import {ContactInfoEnum} from "lib/component/dsm/tabs/enums/contactInfo-enum";

export default class ContactInformationTab {
  constructor(private readonly page: Page) {
  }

  public async getStreet1(): Promise<string> {
    const street1 = await this.readInfoFor(ContactInfoEnum.STREET_1);
    return this.splitOrString(street1);
  }

  public async getCity(): Promise<string> {
    const city = await this.readInfoFor(ContactInfoEnum.CITY);
    return this.splitOrString(city);
  }

  public async getState(): Promise<string> {
    const state = await this.readInfoFor(ContactInfoEnum.STATE);
    return this.splitOrString(state);
  }

  public async getCountry(): Promise<string> {
    const country = await this.readInfoFor(ContactInfoEnum.COUNTRY);
    return this.splitOrString(country);
  }

  public async getZip(): Promise<string> {
    const zip = await this.readInfoFor(ContactInfoEnum.ZIP);
    return this.splitOrString(zip);
  }

  public async getValid(): Promise<string> {
    const valid = await this.readInfoFor(ContactInfoEnum.VALID);
    return this.splitOrString(valid);
  }

  public async getPhone(): Promise<string> {
    const phone = await this.readInfoFor(ContactInfoEnum.PHONE);
    return this.splitOrString(phone);
  }

  private async readInfoFor(key: ContactInfoEnum): Promise<string | null> {
    return this.page.locator(this.getContactInfoXPath(key)).textContent();
  }

  private splitOrString(value: string | null): string {
    return value ? value.split(':')[1].trim() : '';
  }

  /* XPaths */
  private getContactInfoXPath(infoName: string): string {
    return `//tab[@heading='Contact Information']/legend//table/tr[td[contains(text(),'${infoName}')]]`
  }
}
