import { Page } from '@playwright/test';
import { clickLogin, NavSelectors } from 'pages/singular/navbar';

// SINGULAR_USER_EMAIL and SINGULAR_USER_PASSWORD are set in circleci config.yml
const { singularUserEmail, singularUserPassword, SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

export async function fillEmailPassword(
  page: Page,
  opts: { email?: string | undefined; password?: string | undefined; waitForNavigation?: boolean }
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
  opts: { email?: string | undefined; password?: string | undefined; waitForNavigation?: boolean } = {}
): Promise<void> {
  const {
    email = singularUserEmail ? singularUserEmail : SINGULAR_USER_EMAIL,
    password = singularUserPassword ? singularUserPassword : SINGULAR_USER_PASSWORD,
    waitForNavigation
  } = opts;
  await clickLogin(page);
  await fillEmailPassword(page, { email, password, waitForNavigation });
}
