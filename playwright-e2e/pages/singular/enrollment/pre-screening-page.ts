import { Locator, Page } from '@playwright/test';

import * as fake from 'data/fake-user.json';
import Input from 'lib/widget/Input';
import Question from 'lib/component/Question';

export default class PreScreeningPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getSignUpButton(): Locator {
    return this.page.locator('button:text("Sign me up!")');
  }

  async signMeUp(opts: { waitForNav?: boolean } = {}): Promise<void> {
    const { waitForNav = false } = opts;
    const navigationPromise = waitForNav ? this.page.waitForNavigation() : Promise.resolve();
    await Promise.all([navigationPromise, await this.getSignUpButton().click()]);
  }

  /**
   * <br> Question: How old are you?
   * <br> Type: Input
   */
  age(): Input {
    return new Input(this.page, { ddpTestID: 'answer:PREQUAL_AGE' });
  }

  /**
   * <br> Question: Where do you currently live?
   * <br> Select Country
   * <br> Type: Select
   */
  country(): Question {
    return new Question(this.page, { prompt: 'Select Country' });
  }

  /**
   * <br> Question: Select State (US and Canada)
   * <br> Select State
   * <br> Type: Select
   */
  state(): Question {
    return new Question(this.page, { prompt: 'Select State' });
  }

  /**
   * <br> Question: Do you or your immediate family member have a single ventricle heart defect?
   * <br> Type: RadioButton
   */
  haveVentricleHeartDefect(): Question {
    return new Question(this.page, {
      prompt: 'Do you or your immediate family member have a single ventricle heart defect?'
    });
  }

  async checkReCaptcha(): Promise<void> {
    const iframe = this.page.frameLocator('css=iframe[title="reCAPTCHA"]');
    await iframe.locator('css=span[role="checkbox"]').waitFor({ state: 'visible' });
    await iframe.locator('css=span[role="checkbox"]').dispatchEvent('click');
    await iframe
      .locator('.recaptcha-checkbox-spinner[style*="animation-play-state: running;"]')
      .waitFor({ state: 'hidden', timeout: 30 * 1000 }); // Accommodate for slower response
  }

  async enterInformationAboutYourself(
    opts: {
      age?: string;
      country?: string;
      state?: string;
      hasHeartDefect?: boolean;
    } = {}
  ): Promise<string> {
    // Fake data from fake-user.json
    const {
      age = fake.patient.age,
      country = fake.patient.country.abbreviation,
      state = fake.patient.state.abbreviation,
      hasHeartDefect = true
    } = opts;

    await this.age().fill(age, { waitRequestAfter: false });
    await this.country().select().selectOption(country);
    await this.state().toLocator().waitFor({ state: 'visible' });
    const selectedValues = await this.state().select().selectOption(state);
    await this.page.waitForTimeout(200); // Slow down to sync up with UI. Selected value is slower to become visible
    await this.haveVentricleHeartDefect().check(hasHeartDefect ? 'Yes' : 'No');
    await this.checkReCaptcha();
    await this.signMeUp({ waitForNav: true });
    return selectedValues[0];
  }
}
