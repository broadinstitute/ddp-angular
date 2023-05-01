import { Page } from '@playwright/test';
import { fillInEmailPassword } from 'authentication/auth-base';
import { NavSelectors } from 'pages/pancan/navbar';

const { BRAIN_USER_EMAIL, BRAIN_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = BRAIN_USER_EMAIL, password = BRAIN_USER_PASSWORD } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: Brain user email and password are undefined or null.');
  }
  await page.locator(NavSelectors.Join).click();
  await fillInEmailPassword(page, { email, password });
}

export { createAccountWithEmailAlias } from 'authentication/auth-base';
