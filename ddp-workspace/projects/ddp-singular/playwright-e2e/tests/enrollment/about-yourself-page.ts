import { Locator, Page } from '@playwright/test';

export default class AboutYourselfPage {
  private readonly page: Page;
  private readonly age: Locator;
  private readonly country: Locator;
  private readonly state: Locator;
  private readonly hasVentricleHeartDefect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.age = page.locator('.ddp-activity-question').filter({ hasText: 'How old are you?' });
    this.country = page.locator('.ddp-activity-question').filter({ hasText: 'Where do you currently live?' });
    this.state = page.locator('.ddp-activity-question').filter({ hasText: 'Select State' });
    this.hasVentricleHeartDefect = page
      .locator('.ddp-activity-question')
      .filter({ hasText: 'Do you or your immediate family member have a single ventricle heart defect?' });
  }

  get ageLocator(): Locator {
    return this.age;
  }

  get countryLocator(): Locator {
    return this.country;
  }

  get stateLocator(): Locator {
    return this.state;
  }

  get hasVentricleHeartDefectLocator(): Locator {
    return this.hasVentricleHeartDefect;
  }

  async fillAge(value: string): Promise<void> {
    await this.ageLocator.locator('input').fill(value);
  }

  async selectCountry(value: string): Promise<Array<string>> {
    return await this.countryLocator.locator('select').selectOption(value);
  }

  async selectState(value: string): Promise<Array<string>> {
    return await this.stateLocator.locator('select').selectOption(value);
  }

  async getStateValue(): Promise<string | null> {
    return await this.stateLocator.locator('select').evaluate<string, HTMLSelectElement>((node) => node.value);
  }

  async getCountryValue(): Promise<string | null> {
    return await this.countryLocator.locator('select').evaluate<string, HTMLSelectElement>((node) => node.value);
  }

  async setVentricleHeartDefect(bool: boolean): Promise<void> {
    await this.hasVentricleHeartDefectLocator.scrollIntoViewIfNeeded();
    if (bool) {
      const radio = this.hasVentricleHeartDefectLocator.locator('label', { hasText: 'Yes' });
      //.locator('input[type="radio"]');
      // console.log(await radio.getAttribute('class'));
      return await radio.check();
    }
    const radio = this.hasVentricleHeartDefectLocator.locator('label', { hasText: 'No' });
    //.locator('input[type="radio"]');
    //console.log(await radio.getAttribute('class'));
    return await radio.check();
  }
}
