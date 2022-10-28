import { Page } from '@playwright/test';
import { clickLogin, NavSelectors } from 'pages/singular/navbar';
import { getEnv, makeEmailAlias } from 'utils/string-utils';

// SINGULAR_USER_EMAIL and SINGULAR_USER_PASSWORD are set in circleci config.yml
const { singularUserEmail, singularUserPassword, SINGULAR_USER_EMAIL, SINGULAR_USER_PASSWORD } = process.env;

export async function createAccountWithEmailAlias(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<string> {
  const {
    email = makeEmailAlias(getEnv(singularUserEmail, SINGULAR_USER_EMAIL)),
    password = getEnv(process.env.singularUserPassword, process.env.SINGULAR_USER_PASSWORD),
    waitForNavigation
  } = opts;
  await fillEmailPassword(page, { email, password, waitForNavigation });
  return email;
}

export async function fillEmailPassword(
  page: Page,
  opts: { email: string; password: string; waitForNavigation?: boolean }
): Promise<void> {
  const { email, password, waitForNavigation = true } = opts;
  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill(password);

  const navPromise = waitForNavigation ? page.waitForNavigation() : Promise.resolve();
  await Promise.all([
    page.locator(NavSelectors.LoadingSpinner).first().waitFor({ state: 'visible' }),
    navPromise,
    page.locator('button[name="submit"]').click()
  ]);
}

export async function login(
  page: Page,
  opts: { email?: string; password?: string; waitForNavigation?: boolean } = {}
): Promise<void> {
  const {
    email = getEnv(singularUserEmail, SINGULAR_USER_EMAIL),
    password = getEnv(singularUserPassword, SINGULAR_USER_PASSWORD),
    waitForNavigation
  } = opts;
  await clickLogin(page);
  await fillEmailPassword(page, { email, password, waitForNavigation });
}
