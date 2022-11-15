import { Page } from '@playwright/test';

export async function fillInEmailPassword(
  page: Page,
  opts: { email: string; password: string; waitForNavigation?: boolean }
): Promise<void> {
  const { email, password, waitForNavigation = true } = opts;

  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill(password);

  const navPromise = waitForNavigation ? page.waitForNavigation({ waitUntil: 'load' }) : Promise.resolve();
  await Promise.all([
    page.locator('.auth0-loading').first().waitFor({ state: 'visible' }),
    navPromise,
    page.locator('button[name="submit"], button[type="submit"]').click()
  ]);
}
