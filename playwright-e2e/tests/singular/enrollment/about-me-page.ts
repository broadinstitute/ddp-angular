import { Locator, Page } from '@playwright/test';

export default class AboutMePage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly fullName: Locator;
  private readonly streetAddress: Locator;
  private readonly city: Locator;
  private readonly state: Locator;
  private readonly country: Locator;
  private readonly zipCode: Locator;
  private readonly telephone: Locator;
  private readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[data-placeholder="First Name"]');
    this.lastNameInput = page.locator('input[data-placeholder="Last Name"]');
    this.fullName = page.locator('input[data-placeholder="Full Name"]');
    this.streetAddress = page.locator('input[data-placeholder="Street Address"]');
    this.city = page.locator('input[data-placeholder="City"]');
    this.state = page.locator('mat-select[role="combobox"][formcontrolname="state"]');
    this.country = page.locator('mat-select[role="combobox"][formcontrolname="country"]');
    this.zipCode = page.locator('input[data-placeholder="Zip Code or Postal Code"]');
    this.telephone = page.locator('input[data-placeholder="Telephone Contact Number"]');
    this.nextButton = page.locator('button', { hasText: 'Next' });
  }

  async selectCountry(country = 'UNITED STATES'): Promise<void> {
    await this.country.click();
    await this.page.locator(`.mat-option-text >> text=${country}`).first().click();
  }

  async selectState(state = 'MASSACHUSETTS'): Promise<void> {
    await this.state.click();
    await this.page.locator(`.mat-option-text >> text=${state}`).click();
  }

  async fillFullName(name: string): Promise<void> {
    await this.fullName.fill(name);
  }

  async fillStreetAddress(address = '415 Main Street'): Promise<void> {
    await this.streetAddress.fill(address);
  }

  async fillCity(city = 'Cambridge'): Promise<void> {
    await this.city.fill(city);
  }

  async fillZipCode(zip = '02142'): Promise<void> {
    await this.zipCode.fill(zip);
  }

  async fillTelephoneNumber(tele = '1112223333'): Promise<void> {
    await this.telephone.fill(tele);
  }

  async clickNextButton(): Promise<void> {
    await this.nextButton.click();
  }
}
