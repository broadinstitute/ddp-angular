import { Page } from '@playwright/test';
import { fillInEmailPassword } from 'authentication/auth-base';

const { LMS_USER_EMAIL, LMS_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = LMS_USER_EMAIL, password = LMS_USER_PASSWORD } = opts;
  if (email == null || password == null) {
    throw Error('Invalid LMS email or password: undefined');
  }
  const loginLocator = '.header button[data-ddp-test="signInButton"]:has-text("Log In")';
  await page.locator(loginLocator).click();
  await fillInEmailPassword(page, { email, password });
}

export { createAccountWithEmailAlias } from 'authentication/auth-base';
