import { Page } from '@playwright/test';
import { fillInEmailPassword } from 'authentication/auth-base';
import { User } from 'data/user';

export class SingularUser implements User {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
/*
  async login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
    const { email = this.email, password = this.password } = opts;
    await page.locator('.header button[data-ddp-test="signInButton"]:has-text("Log In")').click();
    await fillInEmailPassword(page, {
      email,
      password
    });
  } */
}
