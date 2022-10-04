import { Locator, Page } from '@playwright/test';
import Question from 'tests/lib/widget/Question';
import Card from 'tests/lib/widget/card';
import Input from 'tests/lib/widget/input';

export default class AboutMePage {
  private readonly page: Page;
  readonly next: Locator;

  constructor(page: Page) {
    this.page = page;
    this.next = page.locator('button', { hasText: 'Next' });
  }

  async waitForReady() {
    // Add additional checks to wait for page is ready
    await this.fullName().locator.waitFor({ state: 'visible', timeout: 60 * 1000 });
  }

  firstName(): Question {
    return new Question(this.page, 'Your Last Name');
  }

  lastName(): Question {
    return new Question(this.page, 'Your Last Name');
  }

  fullName(): Input {
    return new Input(this.page, 'Full Name');
  }

  private countrySelect(): Locator {
    return this.page.locator('mat-form-field mat-select', { hasText: `Country` });
  }

  async country(country = 'UNITED STATES'): Promise<void> {
    await this.countrySelect().click();
    await this.page.locator(`.mat-option-text >> text=${country}`).first().click();
  }

  private stateSelect(): Locator {
    return this.page.locator('mat-form-field mat-select', { hasText: new RegExp('^State') });
  }

  async state(state = 'MASSACHUSETTS'): Promise<void> {
    await this.stateSelect().click();
    await this.page.locator(`.mat-option-text >> text=${state}`).click();
  }

  street(): Input {
    return new Input(this.page, 'Street Address');
  }

  city(): Input {
    return new Input(this.page, 'City');
  }

  zipCode(): Input {
    return new Input(this.page, 'Zip Code');
  }

  telephone(): Input {
    return new Input(this.page, 'Telephone');
  }

  pickSuggestedAddressEntry(label: string): Locator {
    return new Card(
      this.page,
      'We have checked your address entry and have suggested changes that could help ensure delivery'
    ).radioButton(label);
  }
}
