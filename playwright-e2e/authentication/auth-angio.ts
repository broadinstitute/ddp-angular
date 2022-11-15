import { Page } from '@playwright/test';
import { generateEmailAlias } from 'utils/faker-utils';
import { fillInEmailPassword } from 'authentication/auth-base';

const { ANGIO_USER_EMAIL, ANGIO_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = ANGIO_USER_EMAIL, password = ANGIO_USER_PASSWORD } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: Angio user email or/and password is undefined or null.');
  }
  await page.locator('nav button[data-ddp-test="signInButton"]').click();
  await fillInEmailPassword(page, { email, password });
}

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<string> {
  const { email = generateEmailAlias(ANGIO_USER_EMAIL), password = ANGIO_USER_PASSWORD, waitForNavigation } = opts;
  if (password == null) {
    throw Error('Invalid parameter: Password is undefined or null.');
  }
  await fillInEmailPassword(page, { email, password, waitForNavigation });
  return email;
}
