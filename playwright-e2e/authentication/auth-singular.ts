import { Page } from '@playwright/test';
import { clickLogin } from 'pages/singular/navbar';
import { generateEmailAlias } from 'utils/faker-utils';
import { fillInEmailPassword } from 'authentication/auth-base';

const { SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

export async function login(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<void> {
  const { email = SINGULAR_USER_EMAIL, password = SINGULAR_USER_PASSWORD, waitForNavigation } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: Email and Password are undefined or null.');
  }
  await clickLogin(page);
  await fillInEmailPassword(page, { email, password, waitForNavigation });
}

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<string> {
  const { email = generateEmailAlias(SINGULAR_USER_EMAIL), password = SINGULAR_USER_PASSWORD, waitForNavigation } = opts;
  if (password == null) {
    throw Error('Invalid parameter: Password is undefined or null.');
  }
  await fillInEmailPassword(page, { email, password, waitForNavigation });
  return email;
}
