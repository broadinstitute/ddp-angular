import { Page, expect } from '@playwright/test';
import { waitForNoSpinner } from 'utils/test-utils';
import { fillInEmailPassword } from './auth-base';

const { DSM_USER_EMAIL, DSM_USER_PASSWORD, DSM_BASE_URL } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = DSM_USER_EMAIL, password = DSM_USER_PASSWORD } = opts;

  const assertLoggedIn = async (page: Page): Promise<void> => {
    await expect(page.locator('.auth0-loading')).toBeHidden();
    await expect(page.locator('.auth0-lock-header-welcome')).toBeHidden();
    await waitForNoSpinner(page);
    await expect(page).toHaveTitle('Select study');
  };

  if (email == null) {
    throw Error('Invalid parameter: DSM user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: DSM user password is undefined or null.');
  }
  if (DSM_BASE_URL == null) {
    throw Error('Invalid parameter: DSM base URL is undefined or null.');
  }

  await page.goto(DSM_BASE_URL, { waitUntil: 'networkidle' });
  await fillInEmailPassword(page, { email, password, waitForNavigation: false });
  try {
    await assertLoggedIn(page);
  } catch (err) {
    // Try log in again if login window re-appears (POST /auth0 fails intermittenly)
    await page.waitForTimeout(2000);
    const visible = await page.locator('.auth0-lock-header-welcome').isVisible();
    if (visible) {
      await fillInEmailPassword(page, { email, password, waitForNavigation: false });
      await assertLoggedIn(page);
      return;
    }
    throw err;
  }
}
