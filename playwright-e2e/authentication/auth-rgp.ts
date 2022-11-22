import { Page } from '@playwright/test';
import { NavSelectors } from 'pages/singular/navbar';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = RGP_USER_EMAIL, password = RGP_USER_PASSWORD } = opts;
  if (email == null) {
    throw Error('Invalid parameters: RGP user email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: RGP user password is undefined or null.');
  }
  await page.locator(NavSelectors.Login).click();
  await page.locator('#signInEmail').fill(email);
  await page.locator('#signInPassword').fill(password);
  await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('[type="submit"]')]);
}

export { createAccountWithEmailAlias } from 'authentication/auth-base';
