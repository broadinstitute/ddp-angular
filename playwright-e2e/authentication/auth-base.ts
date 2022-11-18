import { Page } from '@playwright/test';
import { generateEmailAlias } from 'utils/faker-utils';

/**
 *
 * @param {Page} page
 * @param {{email: string, password: string, waitForNavigation?: boolean}} opts
 * @returns {Promise<void>}
 */
export async function fillInEmailPassword(
  page: Page,
  opts: { email: string; password: string; waitForNavigation?: boolean }
): Promise<void> {
  const { email, password, waitForNavigation = true } = opts;

  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');

  await emailInput.fill(email);
  await passwordInput.fill(password);

  const navigationPromise = waitForNavigation ? page.waitForNavigation({ waitUntil: 'load' }) : Promise.resolve();
  await Promise.all([
    page.locator('.auth0-loading').first().waitFor({ state: 'visible' }),
    navigationPromise,
    page.locator('button[name="submit"], button[type="submit"]').click()
  ]);
}

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email: string | undefined; password: string | undefined }
): Promise<string> {
  const { email, password } = opts;
  if (email == null) {
    throw Error('Invalid parameters: User email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: User password is undefined or null.');
  }
  const emailAlias = generateEmailAlias(email);
  await fillInEmailPassword(page, { email: emailAlias, password });
  return email;
}
