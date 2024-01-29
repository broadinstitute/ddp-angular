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

  const assertLoggedIn = async (page: Page): Promise<void> => {
    await expect(page).toHaveTitle('Select study');
  };

  const loginHelper = async () => {
    await expect(page.locator('.auth0-lock-header-welcome')).toBeVisible({ timeout: 2 * 1000 });
    await fillInEmailPassword(page, { email, password, waitForNavigation: false });
  }

  await page.goto(DSM_BASE_URL);
  await fillInEmailPassword(page, { email, password, waitForNavigation: false });

  try {
    await assertLoggedIn(page);
  } catch (e) {
    // Retry login if login window is found (POST /auth0 fails intermittenly)
    const isLoginVisible = await page.locator('.auth0-lock-header-welcome').isVisible();
    if (isLoginVisible) {
      await loginHelper();
    }
    await assertLoggedIn(page);
  }
}
