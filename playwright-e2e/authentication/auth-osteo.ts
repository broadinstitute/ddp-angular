import { Page } from '@playwright/test';
import { fillInEmailPassword } from 'authentication/auth-base';
import { Nav } from 'dss/pages/nav-selectors';

const { OSTEO_USER_EMAIL, OSTEO_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = OSTEO_USER_EMAIL, password = OSTEO_USER_PASSWORD } = opts;
  if (email == null || password == null) {
    throw Error('Invalid Osteo email or password: undefined');
  }
  await page.locator(Nav.Login).click();
  await fillInEmailPassword(page, { email, password });
}

export { createAccountWithEmailAlias } from 'authentication/auth-base';
