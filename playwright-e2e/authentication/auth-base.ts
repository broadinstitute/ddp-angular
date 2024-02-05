import { Page, expect } from '@playwright/test';
import { generateEmailAlias } from 'utils/faker-utils';
import { logInfo } from 'utils/log-utils';
import { waitForNoSpinner } from 'utils/test-utils';

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

  const timeout = 10000;
  await Promise.race([
    notYourAcctLink.waitFor({ state: 'visible' }),
    emailInput.waitFor({ state: 'visible' }),
    new Promise((_, reject) => setTimeout(() => reject(Error('Timeout Error: Fail to confirm Log in successful.')), timeout)),
  ]);

  try {
    const existLink = await notYourAcctLink.isVisible();
    if (existLink) {
      await notYourAcctLink.click();
    }
  } catch (e) {
    console.error(e);
  }

  const authLoading = page.locator('.auth0-loading').first();

  await Promise.all([
    expect(emailInput).toBeEnabled(),
    expect(passwordInput).toBeEnabled(),
    expect(authLoading).toBeHidden(),
  ]);

  await emailInput.fill(email);
  await passwordInput.fill(password);

  const authPromise = waitForAuth ? authLoading.waitFor({ state: 'visible', timeout: 2000 }).catch() : Promise.resolve();
  const navigationPromise = waitForNavigation ? page.waitForLoadState() : Promise.resolve();
  await Promise.all([
    authPromise,
    navigationPromise,
    page.locator('button[name="submit"]:visible, button[type="submit"]:visible').click(),
  ]);

  await page.waitForTimeout(3000);
  await Promise.all([
    expect(authLoading).toBeHidden(),
    await expect(emailInput).toBeHidden(),
  ]);
  await waitForNoSpinner(page);
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
