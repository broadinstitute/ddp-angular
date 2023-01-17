import { Page } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { fillInEmailPassword } from './auth-base';

const { DSM_USER_EMAIL, DSM_USER_PASSWORD, DSM_BASE_URL } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = DSM_USER_EMAIL, password = DSM_USER_PASSWORD } = opts;
  if (email == null) {
    throw Error('Invalid parameter: DSM user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: DSM user password is undefined or null.');
  }
  if (DSM_BASE_URL == null) {
    throw Error('Invalid parameter: DSM base URL is undefined or null.');
  }
  await page.goto(DSM_BASE_URL, { waitUntil: 'load' });
  await fillInEmailPassword(page, { email, password, waitForNavigation: false });
  await waitForNoSpinner(page);
}
