import { Page } from '@playwright/test';
import { fillInEmailPassword } from 'authentication/auth-base';
import { NavSelectors } from 'pages/singular/navbar';

const { SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = SINGULAR_USER_EMAIL, password = SINGULAR_USER_PASSWORD } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: Email and Password are undefined or null.');
  }
  await page.locator(NavSelectors.Login).click();
  await fillInEmailPassword(page, { email, password });
}

export { createAccountWithEmailAlias } from 'authentication/auth-base';
