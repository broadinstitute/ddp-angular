import { expect, Locator, Page } from '@playwright/test';
import * as fake from 'data/fake-user.json';
import Input from 'lib/widget/input';
import Question from 'lib/component/Question';
import { SingularPage } from 'pages/singular/singular-page';

export default class PreScreeningPage extends SingularPage {
  constructor(page: Page) {
    super(page);
  }

  async waitForReady(): Promise<void> {
    await expect(this.getSignUpButton()).toBeVisible({ timeout: 30 * 1000 });
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
    await iframe.locator('.recaptcha-checkbox-spinner[style*="animation-play-state: running;"]').waitFor({ state: 'hidden', timeout: 30 * 1000 });
  }

  async enterInformationAboutYourself(
    opts: {
      age?: string;
      country?: string;
      state?: string;
      hasHeartDefect?: boolean;
    } = {}
  ): Promise<void> {
    // Fake data from fake-user.json
    const {
      age = fake.patient.age,
      country = fake.patient.country.abbreviation,
      state = fake.patient.state.abbreviation,
      hasHeartDefect = true
    } = opts;

    await this.age().fill(age);
    await this.fillInCountry(country, { state });
    await this.haveVentricleHeartDefect().check(hasHeartDefect ? 'Yes' : 'No');
    await this.checkReCaptcha();
    await this.signMeUp({ waitForNav: true });
  }
}
