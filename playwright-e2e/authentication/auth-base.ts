import { Page, expect } from '@playwright/test';
import { generateEmailAlias } from 'utils/faker-utils';
import { logInfo } from 'utils/log-utils';

/**
 *
 * @param {Page} page
 * @param {{email: string, password: string, waitForNavigation?: boolean}} opts
 * @returns {Promise<void>}
 */
export async function fillInEmailPassword(
  page: Page,
  opts: { email: string; password: string; waitForNavigation?: boolean; waitForAuth?: boolean }
): Promise<void> {
  const { email, password, waitForNavigation = true, waitForAuth = true } = opts;

  const emailInput = page.locator('input[type="email"]').locator('visible=true');
  const passwordInput = page.locator('input[type="password"]').locator('visible=true');
  const notYourAcctLink = page.locator('.auth0-lock-alternative-link:has-text("Not your account")');

  await Promise.race([
    notYourAcctLink.waitFor({ state: 'visible', timeout: 10000 }),
    emailInput.waitFor({ state: 'visible', timeout: 10000 }),
  ]);

  try {
    const existLink = await notYourAcctLink.isVisible();
    if (existLink) {
      await notYourAcctLink.click();
    }
  } catch (e) {
    console.error(e);
  }

  await Promise.all([
    expect(emailInput).toBeVisible(),
    expect(passwordInput).toBeVisible(),
  ]);

  await emailInput.fill(email);
  await passwordInput.fill(password);

  const authPromise = waitForAuth ? page.locator('.auth0-loading').first().waitFor({ state: 'visible', timeout: 2000 }).catch() : Promise.resolve();
  const navigationPromise = waitForNavigation ? page.waitForLoadState('load') : Promise.resolve();
  await Promise.all([authPromise, navigationPromise, page.locator('button[name="submit"]:visible, button[type="submit"]:visible').click()]);
}

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email: string | undefined; password: string | undefined; waitForNavigation?: boolean; waitForAuth?: boolean }
): Promise<string> {
  const { email, password, waitForNavigation, waitForAuth } = opts;
  if (email == null) {
    throw Error('Invalid parameters: User email is undefined or null.');
  }
  if (password == null) {
    throw Error('Invalid parameters: User password is undefined or null.');
  }
  const emailAlias = generateEmailAlias(email);
  await fillInEmailPassword(page, { email: emailAlias, password, waitForNavigation, waitForAuth });
  logInfo(`Created account with email alias: ${emailAlias}`);
  return emailAlias;
}
