import { expect, Locator, Page } from '@playwright/test';
import { RgpPageBase } from 'pages/rgp/rgp-page-base';
import { generateEmailAlias } from 'utils/faker-utils';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

export default class CreateAccountPage extends RgpPageBase {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.locator('input#signUpEmail');
    this.passwordInput = this.page.locator('input#signUpPassword');
  }

  async waitForReady(): Promise<void> {
    await expect(this.emailInput).toBeVisible({ visible: true });
    await expect(this.passwordInput).toBeVisible({ visible: true });
  }

  async fillInEmailPassword(opts: { email?: string; password?: string }): Promise<void> {
    const { email = RGP_USER_EMAIL, password = RGP_USER_PASSWORD } = opts;
    if (email == null || password == null) {
      throw Error('Invalid parameters: RGP email or password is missing.');
    }

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submit({ waitForNav: false });
  }

  async createAccountWithEmailAlias(opts: { email?: string; password?: string } = {}): Promise<string> {
    const { email = generateEmailAlias(RGP_USER_EMAIL), password = RGP_USER_PASSWORD } = opts;
    if (password == null) {
      throw Error('Invalid parameter: Password is undefined or null.');
    }
    await this.fillInEmailPassword({ email, password });
    return email;
  }
}
