import { Page } from '@playwright/test';
import { clickLogin, NavSelectors } from 'tests/singular/nav';

/**
 * On non-prod env, user must first enter the Site password
 * @param page
 * @param password
 */
export async function fillSitePassword(page: Page, password?: string): Promise<void> {
  const passwd: string = typeof password === 'undefined' ? (process.env.sitePassword as string) : password;

  if (!passwd) {
    throw new Error(`Site password is required.`);
  }
  await page.locator('input[type="password"]').fill(passwd);
  await Promise.all([page.waitForNavigation(), page.locator('button >> text=Submit').click()]);
}

export async function fillEmailPassword(
  page: Page,
  opts: { email: string | undefined; password: string | undefined; waitForNavigation?: boolean }
): Promise<void> {
  const { email, password, waitForNavigation = false } = opts;
  const emailInput = page.locator('input[type="email"]');
  if (typeof email === 'string') {
    await emailInput.fill(email);
  }
  const passwordInput = page.locator('input[type="password"]');
  if (typeof password === 'string') {
    await passwordInput.fill(password);
  }

  const navPromise = waitForNavigation ? page.waitForNavigation() : Promise.resolve();
  await Promise.all([
    page.locator(NavSelectors.LoadingSpinner).first().waitFor({ state: 'visible' }),
    navPromise,
    page.locator('button[name="submit"]').click()
  ]);
}

export async function login(
  page: Page,
  opts: { email: string | undefined; password: string | undefined; waitForNavigation?: boolean }
): Promise<void> {
  // If parameter expectErr == true, login is expected to fail.
  const { email, password, waitForNavigation } = opts;
  await clickLogin(page);
  await fillEmailPassword(page, { email, password, waitForNavigation });
}
