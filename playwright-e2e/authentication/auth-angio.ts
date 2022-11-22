import { Page } from '@playwright/test';
import { fillInEmailPassword } from 'authentication/auth-base';

const { ANGIO_USER_EMAIL, ANGIO_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = ANGIO_USER_EMAIL, password = ANGIO_USER_PASSWORD } = opts;
  if (email == null) {
    throw Error('Invalid parameters: Angio user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: Angio user password is undefined or null.');
  }
  await page.locator('nav button[data-ddp-test="signInButton"]').click();
  await fillInEmailPassword(page, { email, password });
}

export { createAccountWithEmailAlias } from 'authentication/auth-base';
