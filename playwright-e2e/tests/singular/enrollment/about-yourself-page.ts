import { expect, Locator, Page } from '@playwright/test';
import Question from 'tests/lib/widget/Question';

export default class AboutYourselfPage {
  private readonly page: Page;
  private readonly _signMeUp: Locator;

  constructor(page: Page) {
    this.page = page;
    this._signMeUp = page.locator('button:text("Sign me up!")');
  }

  async waitForReady() {
    // Add additional checks to wait for page is ready
    await this._signMeUp.waitFor({ state: 'visible' });
    await expect(this._signMeUp).toBeVisible();
  }

  get signMeUp(): Locator {
    return this._signMeUp;
  }

  age(): Question {
    return new Question(this.page, 'How old are you?');
  }

  country(): Question {
    return new Question(this.page, 'Where do you currently live?');
  }

  state(): Question {
    return new Question(this.page, 'Select State');
  }

  haveVentricleHeartDefect(): Question {
    return new Question(this.page, 'Do you or your immediate family member have a single ventricle heart defect?');
  }

  async checkReCaptcha(): Promise<void> {
    const iframe = this.page.frameLocator('css=iframe[title="reCAPTCHA"]');
    await iframe.locator('css=span[role="checkbox"]').dispatchEvent('click');
    await iframe
      .locator('.recaptcha-checkbox-spinner[style*="animation-play-state: running;"]')
      .waitFor({ state: 'hidden' });
  }
}
