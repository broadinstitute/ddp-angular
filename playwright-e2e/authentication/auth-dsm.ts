import { Page, expect } from '@playwright/test';
import { fillInEmailPassword } from './auth-base';

const { DSM_USER1_EMAIL, DSM_USER1_PASSWORD, DSM_BASE_URL } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = DSM_USER1_EMAIL, password = DSM_USER1_PASSWORD } = opts; // Hunter Stormreaver
  if (email == null) {
    throw Error('Invalid parameter: DSM user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: DSM user password is undefined or null.');
  }
  if (DSM_BASE_URL == null) {
    throw Error('Invalid parameter: DSM base URL is undefined or null.');
  }

  const authWindow = page.locator('.auth0-lock-header-welcome');

  const assertLogIn = async (page: Page): Promise<boolean> => {
    const timeout = 30 * 1000;
    const status = await Promise.race([
      expect(authWindow).toBeVisible().then(() => 'Fail'),
      expect(page).toHaveTitle('Select study').then(() => 'Pass'),
      // Throw error when neither is resolved
      new Promise((_, reject) => setTimeout(() => reject(Error('Timeout Error: Fail to confirm Log in successful.')), timeout)),
    ]);
    if (status === 'Pass') {
      return true;
    }
    return false;
  };

  const doLogIn = async () => {
    // Before fill out email and password, ensure LogIn window completed loading.
    await expect(authWindow).toBeVisible({ timeout: 5 * 1000 });
    await expect(page.locator('.auth0-loading').first()).toBeHidden();
    await fillInEmailPassword(page, { email, password, waitForNavigation: false });
  }

  await page.goto(DSM_BASE_URL, { waitUntil: 'load' });
  await doLogIn();
  const status = await assertLogIn(page);
  if (status) {
    return;
  }
  // Retry login if login window is still present (POST /auth0 fails intermittenly)
  console.log(`       Retry log in...`);
  await doLogIn();
  await assertLogIn(page);
  await expect(page).toHaveTitle('Select study');
}
