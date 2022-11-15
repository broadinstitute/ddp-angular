import { Page } from '@playwright/test';
import { clickLogin } from 'pages/singular/navbar';

const { RGP_USER_EMAIL, RGP_USER_PASSWORD } = process.env;

export async function login(page: Page, opts: { email?: string; password?: string } = {}): Promise<void> {
  const { email = RGP_USER_EMAIL, password = RGP_USER_PASSWORD } = opts;
  if (email == null || password == null) {
    throw Error('Invalid parameters: RGP user email or/and password is undefined or null.');
  }
  await clickLogin(page);
  await page.locator('#signInEmail').fill(email);
  await page.locator('#signInPassword').fill(password);
  await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click('[type="submit"]')]);
}
